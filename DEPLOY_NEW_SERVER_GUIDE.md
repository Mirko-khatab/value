# 🚀 Complete Deployment Guide - New Server (46.224.48.179)

This guide will help you deploy your Valuearch project to the new server with proper firewall configuration and GitHub connection.

---

## 📋 Prerequisites (What You're Doing Now)

✅ You're currently doing these steps:

1. ✅ Clone the project from GitHub
2. ✅ Install Node.js dependencies (`npm install`)

**After you complete these, come back here for the rest!**

---

## 🔒 Step 1: Configure Firewall (IMPORTANT!)

First, let's make sure the firewall is properly configured to avoid port blocking:

```bash
# SSH into your server
ssh root@46.224.48.179

# Check current firewall status
ufw status

# If UFW is not installed or inactive, let's set it up properly
# IMPORTANT: Do these in order to avoid locking yourself out!

# 1. Allow SSH (Port 22) - DO THIS FIRST!
ufw allow 22/tcp
ufw allow ssh

# 2. Allow HTTP (Port 80)
ufw allow 80/tcp
ufw allow http

# 3. Allow HTTPS (Port 443)
ufw allow 443/tcp
ufw allow https

# 4. Allow MySQL from localhost only (security)
ufw allow from 127.0.0.1 to any port 3306

# 5. Check the rules before enabling
ufw show added

# 6. Enable firewall (confirm 'yes' when asked)
ufw enable

# 7. Verify firewall is active and rules are correct
ufw status verbose
```

**Expected Output:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
3306                       ALLOW       127.0.0.1
22/tcp (v6)                ALLOW       Anywhere (v6)
80/tcp (v6)                ALLOW       Anywhere (v6)
443/tcp (v6)                ALLOW       Anywhere (v6)
```

---

## 🗄️ Step 2: Set Up MySQL Database

```bash
# Still on server (ssh root@46.224.48.179)

# 1. Check if MySQL is installed
mysql --version

# If not installed, install it:
apt update
apt install -y mysql-server

# 2. Secure MySQL installation
mysql_secure_installation

# Answer the prompts:
# - Set root password: Yes (choose a strong password)
# - Remove anonymous users: Yes
# - Disallow root login remotely: Yes
# - Remove test database: Yes
# - Reload privilege tables: Yes

# 3. Log into MySQL as root
mysql -u root -p
# Enter the root password you just set
```

**Inside MySQL console:**

```sql
-- Create the database
CREATE DATABASE dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create admin user with password
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123@#!123';

-- Grant all privileges on dashboard database
GRANT ALL PRIVILEGES ON dashboard.* TO 'admin'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Verify the user was created
SELECT User, Host FROM mysql.user WHERE User = 'admin';

-- Exit MySQL
EXIT;
```

**Test the new user:**

```bash
# Test connection with admin user
mysql -u admin -p'admin123@#!123' -e "SHOW DATABASES;"

# You should see the 'dashboard' database listed
```

---

## 📊 Step 3: Import Database Schema and Data

Now let's set up your database tables and data:

```bash
# Navigate to your project directory
cd /root/Documents/value

# Check if you have any .sql files
ls -la *.sql

# You should see files like:
# - database-migrations.sql
# - value-grng.sql or value-grng-fixed.sql
```

**Import the database:**

```bash
# Option 1: If you have value-grng-fixed.sql (use this one)
mysql -u admin -p'admin123@#!123' dashboard < value-grng-fixed.sql

# Option 2: If you only have value-grng.sql
mysql -u admin -p'admin123@#!123' dashboard < value-grng.sql

# Option 3: If you have database-migrations.sql (for schema only)
mysql -u admin -p'admin123@#!123' dashboard < database-migrations.sql

# Verify tables were created
mysql -u admin -p'admin123@#!123' dashboard -e "SHOW TABLES;"
```

**Expected Output (you should see these tables):**

```
+---------------------+
| Tables_in_dashboard |
+---------------------+
| audios             |
| banners            |
| countries          |
| customers          |
| event              |
| galleries          |
| graphics           |
| invoices           |
| locations          |
| products           |
| project_categories |
| projects           |
| properties         |
| quotes             |
| revenue            |
| social_media       |
| sub_categorys      |
| teams              |
| users              |
+---------------------+
```

**Check if you have data:**

```bash
# Check teams table
mysql -u admin -p'admin123@#!123' dashboard -e "SELECT COUNT(*) FROM teams;"

# Check projects table
mysql -u admin -p'admin123@#!123' dashboard -e "SELECT COUNT(*) FROM projects;"

# Check products table
mysql -u admin -p'admin123@#!123' dashboard -e "SELECT COUNT(*) FROM products;"
```

---

## ⚙️ Step 4: Configure Environment Variables

Create the `.env.local` file with your configuration:

```bash
# Still in /root/Documents/value
nano .env.local
```

**Copy and paste this configuration:**

```bash
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=admin123@#!123
MYSQL_DATABASE=dashboard

# Authentication Secret (generate a random string)
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc

# Cloud Storage Configuration (connects to old server)
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

**Save and exit:**

- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

**Verify the file:**

```bash
cat .env.local
```

---

## 🏗️ Step 5: Build the Next.js Application

```bash
# Make sure you're in the project directory
cd /root/Documents/value

# Install dependencies (if you haven't already)
npm install

# Build the production version
npm run build

# This will take 2-5 minutes
# You should see: "✓ Compiled successfully"
```

**After build completes, copy public files:**

```bash
# Copy public folder to standalone
cp -r public .next/standalone/public

# Copy static files to standalone
cp -r .next/static .next/standalone/.next/static

# Verify files were copied
ls -la .next/standalone/
```

---

## 🔧 Step 6: Create PM2 Ecosystem Configuration

Create a PM2 configuration file to manage your application:

```bash
# Create ecosystem.config.js file
nano ecosystem.config.js
```

**Copy and paste this configuration:**

```javascript
module.exports = {
  apps: [
    {
      name: "valuearch-app",
      cwd: "/root/Documents/value/.next/standalone",
      script: "node",
      args: "server.js",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
        // Database
        MYSQL_HOST: "localhost",
        MYSQL_USER: "admin",
        MYSQL_PASSWORD: "admin123@#!123",
        MYSQL_DATABASE: "dashboard",
        // Auth
        AUTH_SECRET: "asdjfskjdfljspfasldjkfleeygc",
        // Cloud Storage
        CLOUD_API_BASE_URL: "https://cloud.mirkokawa.dev/api",
        CLOUD_BUCKET_ID: "b843b188-87d6-4c8e-b2aa-eb2ebc65c362",
        CLOUD_API_KEY_FULL:
          "18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13",
        CLOUD_API_KEY_READ:
          "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d",
      },
      error_file: "/root/.pm2/logs/valuearch-app-error.log",
      out_file: "/root/.pm2/logs/valuearch-app-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
    },
  ],
};
```

**Save and exit:**

- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## 🚀 Step 7: Start Application with PM2

```bash
# Stop any existing PM2 processes
pm2 stop all
pm2 delete all

# Start the application using ecosystem config
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs valuearch-app --lines 50

# Save PM2 process list (for auto-restart on reboot)
pm2 save

# Enable PM2 to start on system boot
pm2 startup systemd
# Copy and run the command it shows you

# Verify it will start on reboot
systemctl status pm2-root
```

**Expected Output:**

```
┌────┬────────────────┬─────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┐
│ id │ name           │ status  │ restart │ uptime  │ cpu      │ mem    │ user │ watching │ mode     │ pid      │
├────┼────────────────┼─────────┼─────────┼─────────┼──────────┼────────┼──────┼──────────┼──────────┼──────────┤
│ 0  │ valuearch-app  │ online  │ 0       │ 5s      │ 0%       │ 85mb   │ root │ disabled │ cluster  │ 12345    │
└────┴────────────────┴─────────┴─────────┴─────────┴──────────┴────────┴──────┴──────────┴──────────┴──────────┘
```

**Test the application:**

```bash
# Test if it's responding
curl http://localhost:3000

# You should see HTML output from your Next.js app
```

---

## 🌐 Step 8: Configure Nginx

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx (if not already installed)
apt update
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/valuearch.conf
```

**Copy and paste this Nginx configuration:**

```nginx
# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=upload:10m rate=2r/s;

# Upstream configuration
upstream valuearch_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP server - Redirect to HTTPS (after SSL is installed)
server {
    listen 80;
    listen [::]:80;
    server_name valuearch.com www.valuearch.com 46.224.48.179;

    # For now, serve directly (will change to redirect after SSL)

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Client body size limit (for file uploads)
    client_max_body_size 50M;
    client_body_timeout 120s;

    # Proxy timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 120s;
    proxy_read_timeout 120s;

    # Location blocks
    location / {
        limit_req zone=general burst=20 nodelay;

        proxy_pass http://valuearch_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Disable buffering for better performance
        proxy_buffering off;
    }

    # Upload endpoint with higher limits
    location /api/cloud/upload {
        limit_req zone=upload burst=5 nodelay;

        client_max_body_size 100M;
        client_body_timeout 300s;

        proxy_pass http://valuearch_backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 120s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://valuearch_backend;
        proxy_cache_valid 200 60m;
        proxy_cache_bypass 0;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

**Save and exit** (`Ctrl + X`, `Y`, `Enter`)

**Enable the site and test:**

```bash
# Remove default Nginx site
rm -f /etc/nginx/sites-enabled/default

# Enable your site
ln -sf /etc/nginx/sites-available/valuearch.conf /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# Should show: "syntax is ok" and "test is successful"

# Reload Nginx
systemctl reload nginx

# Check Nginx status
systemctl status nginx

# Enable Nginx to start on boot
systemctl enable nginx
```

---

## 🧪 Step 9: Test Everything

```bash
# 1. Test locally
curl http://localhost:3000

# 2. Test through Nginx
curl http://localhost

# 3. Test from outside (from your local machine)
curl http://46.224.48.179

# 4. Test PM2 status
pm2 status

# 5. Test database connection
mysql -u admin -p'admin123@#!123' dashboard -e "SELECT COUNT(*) FROM teams;"

# 6. View application logs
pm2 logs valuearch-app --lines 50

# 7. View Nginx access log
tail -f /var/log/nginx/access.log

# 8. View Nginx error log
tail -f /var/log/nginx/error.log
```

**Test in Browser:**

Open your browser and visit:

- `http://46.224.48.179` - Should show your website
- `http://46.224.48.179/dashboard` - Should show login page

---

## 🔐 Step 10: Connect with GitHub

Set up Git and SSH keys for easy deployment:

```bash
# 1. Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Press Enter to accept default location
# Press Enter twice to skip passphrase (or set one if you want)

# 3. Display your public key
cat ~/.ssh/id_ed25519.pub

# Copy this entire output
```

**Add SSH Key to GitHub:**

1. Copy the SSH key output
2. Go to GitHub.com
3. Click your profile → Settings
4. Click "SSH and GPG keys"
5. Click "New SSH key"
6. Paste your key and save

**Test GitHub Connection:**

```bash
# Test SSH connection to GitHub
ssh -T git@github.com

# You should see: "Hi username! You've successfully authenticated..."

# Check your remote URL
cd /root/Documents/value
git remote -v

# If it shows HTTPS URL, change to SSH:
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO.git

# Replace YOUR_USERNAME and YOUR_REPO with your actual GitHub username and repo name
```

**Set Up Deployment Script:**

```bash
# Create a deployment script
nano /root/deploy.sh
```

**Copy this script:**

```bash
#!/bin/bash

echo "🚀 Deploying Valuearch Website..."
echo ""

cd /root/Documents/value

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install --production

echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check errors above."
    exit 1
fi

echo "📁 Copying public files..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "♻️  Restarting application..."
pm2 restart valuearch-app

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Application status:"
pm2 status valuearch-app

echo ""
echo "📝 Recent logs:"
pm2 logs valuearch-app --lines 10 --nostream

echo ""
echo "🎉 Done! Visit http://46.224.48.179"
```

**Make it executable:**

```bash
chmod +x /root/deploy.sh

# Test the script
/root/deploy.sh
```

---

## 🔒 Step 11: Install SSL Certificate (After DNS Update)

**WAIT!** Only do this AFTER you update your DNS to point to the new server.

Once DNS is updated (valuearch.com → 46.224.48.179):

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d valuearch.com -d www.valuearch.com

# Follow the prompts:
# - Enter your email
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (choose Yes)

# Certbot will automatically:
# - Get the certificate
# - Modify Nginx config
# - Set up auto-renewal

# Test auto-renewal
certbot renew --dry-run

# Check certificate status
certbot certificates
```

---

## 📊 Step 12: Monitor and Verify

```bash
# Check all services are running
systemctl status nginx
systemctl status mysql
pm2 status

# Check firewall rules
ufw status verbose

# Check disk space
df -h

# Check memory usage
free -h

# Check logs for errors
pm2 logs valuearch-app --lines 100 | grep -i error

# Check Nginx logs
tail -100 /var/log/nginx/error.log
```

---

## 🆘 Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs valuearch-app --lines 100

# Check if port 3000 is in use
netstat -tulpn | grep 3000

# Restart PM2
pm2 restart valuearch-app

# Or delete and start fresh
pm2 delete valuearch-app
pm2 start ecosystem.config.js
```

### Database Connection Errors

```bash
# Test MySQL
mysql -u admin -p'admin123@#!123' dashboard -e "SHOW TABLES;"

# Check MySQL is running
systemctl status mysql

# Restart MySQL
systemctl restart mysql

# Check .env.local file
cat .env.local
```

### Nginx Errors

```bash
# Test Nginx config
nginx -t

# Check Nginx logs
tail -50 /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

### Firewall Blocking Connections

```bash
# Check firewall status
ufw status verbose

# If SSH is blocked, you'll need console access!
# From your hosting provider's console:

# Disable firewall temporarily
ufw disable

# Re-add rules correctly
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

---

## 📝 Quick Reference Commands

```bash
# Deploy updates from GitHub
/root/deploy.sh

# Restart application
pm2 restart valuearch-app

# View logs
pm2 logs valuearch-app

# Check status
pm2 status

# Restart Nginx
systemctl restart nginx

# Restart MySQL
systemctl restart mysql

# Check firewall
ufw status

# Monitor resources
htop
```

---

## 🎯 Checklist

After completing all steps, verify:

- [ ] Firewall configured (ports 22, 80, 443 open)
- [ ] MySQL installed and database created
- [ ] Database schema imported
- [ ] `.env.local` file configured
- [ ] Application built successfully
- [ ] PM2 running application
- [ ] Nginx configured and running
- [ ] Can access via http://46.224.48.179
- [ ] GitHub SSH key added
- [ ] Can pull/push from GitHub
- [ ] Deployment script created
- [ ] Auto-start on reboot enabled
- [ ] SSL certificate installed (after DNS update)

---

## 🚀 Next Steps After Setup

1. **Update DNS** (if using domain):

   ```
   A Record: @ → 46.224.48.179
   A Record: www → 46.224.48.179
   ```

2. **Install SSL** (after DNS propagates):

   ```bash
   certbot --nginx -d valuearch.com -d www.valuearch.com
   ```

3. **Test Everything**:

   - Visit website
   - Test file uploads
   - Test dashboard login
   - Check all pages load correctly

4. **Set Up Monitoring** (optional):
   - Set up uptime monitoring
   - Configure log rotation
   - Set up automatic backups

---

## 💡 Tips

1. **Always test locally first** before deploying to production
2. **Keep backups** of database and files
3. **Monitor logs** regularly for errors
4. **Update regularly** with `apt update && apt upgrade`
5. **Use the deployment script** for consistent deployments
6. **Never commit** `.env.local` to git

---

**Status:** Ready for deployment! 🎉

Follow these steps in order, and your application will be running smoothly on the new server.







