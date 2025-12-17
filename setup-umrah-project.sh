#!/bin/bash

echo "🚀 Setting up Umrah Project on umrah.mirkokawa.dev"
echo "=================================================="
echo ""

SERVER="root@46.224.48.179"

ssh $SERVER << 'ENDSSH'
cd /root/Documents/umrah

echo "📋 Step 1: Creating MySQL user for existing database..."
mysql << 'EOF'
-- Create user for existing umrah database
CREATE USER IF NOT EXISTS 'umrahapp'@'localhost' IDENTIFIED BY 'UmrahApp2024Pass';
GRANT ALL PRIVILEGES ON umrah.* TO 'umrahapp'@'localhost';
FLUSH PRIVILEGES;

-- Show database tables
USE umrah;
SHOW TABLES;
EOF

echo ""
echo "📝 Step 2: Creating .env file..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001

# Database Configuration
MYSQL_HOST=127.0.0.1
MYSQL_USER=umrahapp
MYSQL_PASSWORD=UmrahApp2024Pass
MYSQL_DATABASE=umrah

# Auth Configuration
AUTH_SECRET=umrah_secret_key_2024_secure
AUTH_URL=https://umrah.mirkokawa.dev
AUTH_TRUST_HOST=true

# Cloud Storage (if needed - copy from value project)
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
EOF

echo ""
echo "📝 Step 3: Creating server wrapper..."
cat > server-wrapper.js << 'EOFWRAPPER'
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
require("./.next/standalone/server.js");
EOFWRAPPER

chmod +x server-wrapper.js

echo ""
echo "📝 Step 4: Creating PM2 ecosystem config..."
cat > ecosystem.config.js << 'EOF'
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
        AUTH_SECRET: "umrah_secret_key_2024_secure",
        AUTH_URL: "https://umrah.mirkokawa.dev",
        AUTH_TRUST_HOST: "true",
      },
    },
  ],
};
EOF

echo ""
echo "📦 Step 5: Installing dependencies..."
npm install

echo ""
echo "🏗️  Step 6: Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo ""
echo "📁 Step 7: Copying static files..."
cp -r public .next/standalone/ 2>/dev/null || echo "No public folder found"
cp -r .next/static .next/standalone/.next/

echo ""
echo "🌐 Step 8: Configuring Nginx..."
cat > /etc/nginx/sites-available/umrah.mirkokawa.dev << 'EOFNGINX'
server {
    listen 80;
    listen [::]:80;
    server_name umrah.mirkokawa.dev;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name umrah.mirkokawa.dev;

    # SSL will be configured by Certbot

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

    location /_next/static {
        proxy_pass http://localhost:3001;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    access_log /var/log/nginx/umrah.mirkokawa.dev.access.log;
    error_log /var/log/nginx/umrah.mirkokawa.dev.error.log;
}
EOFNGINX

# Enable site
ln -sf /etc/nginx/sites-available/umrah.mirkokawa.dev /etc/nginx/sites-enabled/

# Test and reload Nginx
nginx -t && systemctl reload nginx

echo ""
echo "🔒 Step 9: Setting up SSL certificate..."
certbot --nginx -d umrah.mirkokawa.dev --non-interactive --agree-tos --email admin@mirkokawa.dev --redirect || echo "⚠️  SSL setup needs manual intervention"

echo ""
echo "▶️  Step 10: Starting with PM2..."
pm2 delete umrah-app 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "🧪 Testing local connection..."
sleep 3
curl -s http://localhost:3001 | head -100

echo ""
echo "📝 View logs with: pm2 logs umrah-app"
echo "🌐 Access at: https://umrah.mirkokawa.dev"
echo ""

ENDSSH

echo ""
echo "🎉 Umrah project setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure DNS is configured: umrah.mirkokawa.dev -> 46.224.48.179"
echo "2. Wait 5-15 minutes for DNS propagation"
echo "3. Visit https://umrah.mirkokawa.dev"
echo ""
echo "Useful commands:"
echo "  ssh root@46.224.48.179 'pm2 logs umrah-app'"
echo "  ssh root@46.224.48.179 'pm2 status'"
echo "  ssh root@46.224.48.179 'pm2 restart umrah-app'"
echo ""
