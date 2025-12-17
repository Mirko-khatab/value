# Umrah Project Setup Guide

## Subdomain: umrah.mirkokawa.dev

### Prerequisites Checklist

- [x] Project code at `/root/Documents/umrah`
- [x] Database uploaded
- [ ] Subdomain DNS configured
- [ ] Nginx/Apache virtual host configured
- [ ] SSL certificate for subdomain

## Step 1: Verify Project Files

First, let's check what's in the umrah project:

```bash
ssh root@46.224.48.179
cd /root/Documents/umrah
ls -la
```

Look for:

- `package.json` - Node.js dependencies
- `next.config.js` or `next.config.ts` - Next.js config
- Database connection files
- `.env` or environment configuration

## Step 2: Configure DNS

You need to add a DNS A record for the subdomain:

**DNS Settings (in your domain registrar/DNS provider):**

```
Type: A
Name: umrah.mirkokawa
Value: 46.224.48.179
TTL: 3600
```

Wait 5-15 minutes for DNS propagation, then test:

```bash
ping umrah.mirkokawa.dev
```

## Step 3: Database Setup

### Option A: If database is in SQL file

```bash
ssh root@46.224.48.179

# Check if database file exists
ls -la /root/Documents/umrah/*.sql

# Import database
mysql -u root -p'gM7-3$F<1&4^!' < /root/Documents/umrah/database.sql

# Or if it needs a specific database name
mysql -u root -p'gM7-3$F<1&4^!'
CREATE DATABASE umrah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit

mysql -u root -p'gM7-3$F<1&4^!' umrah_db < /root/Documents/umrah/database.sql
```

### Option B: Create MySQL user for umrah project

```bash
mysql -u root -p'gM7-3$F<1&4^!' << 'EOF'
-- Create user for umrah project
CREATE USER IF NOT EXISTS 'umrahapp'@'localhost' IDENTIFIED BY 'UmrahApp2024Pass';
GRANT ALL PRIVILEGES ON umrah_db.* TO 'umrahapp'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SELECT user, host FROM mysql.user WHERE user='umrahapp';
EOF
```

## Step 4: Install Dependencies

```bash
cd /root/Documents/umrah

# Check if it's a Node.js project
cat package.json

# Install dependencies
npm install

# Check for environment variables needed
grep -r "process.env" . | head -20
```

## Step 5: Create Environment Configuration

Create `.env` file in `/root/Documents/umrah/`:

```bash
cat > /root/Documents/umrah/.env << 'EOF'
NODE_ENV=production
PORT=3001

# Database Configuration
MYSQL_HOST=127.0.0.1
MYSQL_USER=umrahapp
MYSQL_PASSWORD=UmrahApp2024Pass
MYSQL_DATABASE=umrah_db

# Auth Configuration (if needed)
AUTH_SECRET=your_umrah_auth_secret_here
AUTH_URL=https://umrah.mirkokawa.dev
AUTH_TRUST_HOST=true

# Any other environment variables your project needs
EOF
```

## Step 6: Build the Application

```bash
cd /root/Documents/umrah

# Build the Next.js application
npm run build

# If standalone mode is enabled, copy files
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true
```

## Step 7: Create Server Wrapper

Create the same server wrapper for umrah project:

```bash
cat > /root/Documents/umrah/server-wrapper.js << 'EOF'
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
  console.log("📝 Loading environment variables from .env file...");
  const envFile = fs.readFileSync(envPath, "utf8");

  envFile.split("\n").forEach((line) => {
    line = line.trim();
    if (line && !line.startsWith("#")) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
        console.log(`  ✓ Set ${key}`);
      }
    }
  });

  console.log("✅ Environment variables loaded\n");
}

console.log("🚀 Starting Umrah Next.js server...\n");

// Start the actual Next.js server
require("./.next/standalone/server.js");
EOF

chmod +x /root/Documents/umrah/server-wrapper.js
```

## Step 8: Create PM2 Ecosystem Config

```bash
cat > /root/Documents/umrah/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: "umrah-app",
      script: "server-wrapper.js",
      cwd: "/root/Documents/umrah",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        MYSQL_HOST: "127.0.0.1",
        MYSQL_USER: "umrahapp",
        MYSQL_PASSWORD: "UmrahApp2024Pass",
        MYSQL_DATABASE: "umrah_db",
        AUTH_SECRET: "your_umrah_auth_secret_here",
        AUTH_URL: "https://umrah.mirkokawa.dev",
        AUTH_TRUST_HOST: "true",
      },
    },
  ],
};
EOF
```

## Step 9: Configure Nginx Reverse Proxy

Create Nginx configuration for the subdomain:

```bash
cat > /etc/nginx/sites-available/umrah.mirkokawa.dev << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name umrah.mirkokawa.dev;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name umrah.mirkokawa.dev;

    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/umrah.mirkokawa.dev/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/umrah.mirkokawa.dev/privkey.pem;

    # Proxy to Next.js application on port 3001
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files optimization
    location /_next/static {
        proxy_pass http://localhost:3001;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logs
    access_log /var/log/nginx/umrah.mirkokawa.dev.access.log;
    error_log /var/log/nginx/umrah.mirkokawa.dev.error.log;
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/umrah.mirkokawa.dev /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Step 10: Setup SSL Certificate

```bash
# Install Certbot if not already installed
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate for the subdomain
certbot --nginx -d umrah.mirkokawa.dev

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

## Step 11: Start the Application with PM2

```bash
cd /root/Documents/umrah

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status

# View logs
pm2 logs umrah-app --lines 50
```

## Step 12: Verify Deployment

```bash
# Test local connection
curl http://localhost:3001

# Test subdomain (after DNS propagates and SSL is setup)
curl https://umrah.mirkokawa.dev

# Check PM2 status
pm2 status

# View both applications
pm2 list
```

Expected output:

```
┌────┬──────────────────┬─────────┬─────────┬──────┬──────────┐
│ id │ name             │ status  │ cpu     │ mem  │ port     │
├────┼──────────────────┼─────────┼─────────┼──────┼──────────┤
│ 0  │ valuearch-app    │ online  │ 0%      │ 65mb │ 3000     │
│ 1  │ umrah-app        │ online  │ 0%      │ 65mb │ 3001     │
└────┴──────────────────┴─────────┴─────────┴──────┴──────────┘
```

## Troubleshooting

### If build fails:

```bash
cd /root/Documents/umrah
rm -rf .next node_modules
npm install
npm run build
```

### If database connection fails:

```bash
# Test MySQL connection
mysql -u umrahapp -p'UmrahApp2024Pass' umrah_db -e 'SHOW TABLES;'

# Check environment variables
pm2 env 1  # 1 is the process id
```

### If port 3001 is already in use:

```bash
# Check what's using port 3001
lsof -i :3001

# Change to different port (e.g., 3002) in:
# - /root/Documents/umrah/.env
# - /root/Documents/umrah/ecosystem.config.js
# - /etc/nginx/sites-available/umrah.mirkokawa.dev
```

### View application logs:

```bash
# PM2 logs
pm2 logs umrah-app

# Nginx logs
tail -f /var/log/nginx/umrah.mirkokawa.dev.error.log
tail -f /var/log/nginx/umrah.mirkokawa.dev.access.log
```

## Quick Setup Script

Want to automate this? Here's a helper script:

```bash
#!/bin/bash
# Save as setup-umrah.sh

echo "🚀 Setting up Umrah project..."

cd /root/Documents/umrah

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build application
echo "🏗️  Building application..."
npm run build

# Copy files
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

# Start with PM2
echo "▶️  Starting with PM2..."
pm2 start ecosystem.config.js
pm2 save

echo "✅ Setup complete!"
echo "Check status: pm2 status"
echo "View logs: pm2 logs umrah-app"
```

## Summary

After completing these steps:

1. ✅ Umrah project running on port 3001
2. ✅ Database configured and connected
3. ✅ Nginx reverse proxy configured
4. ✅ SSL certificate installed
5. ✅ PM2 managing the application
6. ✅ Accessible at https://umrah.mirkokawa.dev

## Need Help?

If you encounter issues, check:

- PM2 logs: `pm2 logs umrah-app`
- Nginx logs: `tail -f /var/log/nginx/umrah.mirkokawa.dev.error.log`
- DNS: `dig umrah.mirkokawa.dev`
- Port availability: `lsof -i :3001`
