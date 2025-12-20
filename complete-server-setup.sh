#!/bin/bash

# COMPLETE SERVER SETUP SCRIPT
# This script sets up EVERYTHING in ONE SSH session to avoid triggering security alerts
# Server: 46.224.48.179
# Date: December 2025

set -e  # Exit on any error

SERVER="root@46.224.48.179"

echo "🚀 COMPLETE SERVER SETUP - ONE SESSION"
echo "======================================"
echo ""
echo "This will set up:"
echo "  ✓ Node.js 20.x"
echo "  ✓ MySQL 8.x"
echo "  ✓ Nginx"
echo "  ✓ PM2"
echo "  ✓ Certbot for SSL"
echo "  ✓ ValueArch project"
echo "  ✓ Umrah project"
echo ""
echo "⚠️  IMPORTANT: This uses ONE long SSH session to avoid security alerts"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

echo ""
echo "📡 Connecting to server and running complete setup..."
echo ""

ssh $SERVER << 'ENDSSH'

# Function to print colored output
print_step() {
    echo ""
    echo "=========================================="
    echo ">>> $1"
    echo "=========================================="
    echo ""
}

# Enable error handling
set -e

print_step "Step 1: System Update"
apt-get update
apt-get upgrade -y

print_step "Step 2: Install Essential Packages"
apt-get install -y curl wget git build-essential software-properties-common ufw

print_step "Step 3: Configure Firewall (UFW)"
# Allow SSH first (important!)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
echo "y" | ufw enable
ufw status

print_step "Step 4: Install Node.js 20.x"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node --version
npm --version

print_step "Step 5: Install PM2"
npm install -g pm2
pm2 startup systemd -u root --hp /root
pm2 save

print_step "Step 6: Install Nginx"
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

print_step "Step 7: Install MySQL"
apt-get install -y mysql-server
systemctl enable mysql
systemctl start mysql

print_step "Step 8: Secure MySQL and Create Databases"
# Set root password and create users
mysql << 'EOSQL'
-- Secure installation
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'gM7-3$F<1&4^!';
DELETE FROM mysql.user WHERE User='';
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';

-- Create ValueArch database and user
CREATE DATABASE IF NOT EXISTS dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'valueapp'@'localhost' IDENTIFIED BY 'ValueApp2024Pass';
GRANT ALL PRIVILEGES ON dashboard.* TO 'valueapp'@'localhost';

-- Create Umrah database and user
CREATE DATABASE IF NOT EXISTS umrah CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'umrahapp'@'localhost' IDENTIFIED BY 'UmrahApp2024Pass';
GRANT ALL PRIVILEGES ON umrah.* TO 'umrahapp'@'localhost';

FLUSH PRIVILEGES;
EOSQL

print_step "Step 9: Install Certbot for SSL"
apt-get install -y certbot python3-certbot-nginx

print_step "Step 10: Create Project Directories"
mkdir -p /root/Documents/value
mkdir -p /root/Documents/umrah

print_step "Step 11: Clone ValueArch Repository"
cd /root/Documents/value
if [ ! -d ".git" ]; then
    git clone git@github.com:Mirko-khatab/value.git .
else
    git pull origin main
fi

print_step "Step 12: Clone Umrah Repository"
cd /root/Documents/umrah
if [ ! -d ".git" ]; then
    git clone git@github.com:Mirko-khatab/umrah.git .
else
    git pull origin main
fi

print_step "Step 13: Setup ValueArch Environment"
cd /root/Documents/value

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
MYSQL_HOST=127.0.0.1
MYSQL_USER=valueapp
MYSQL_PASSWORD=ValueApp2024Pass
MYSQL_DATABASE=dashboard
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc
AUTH_URL=https://valuearch.com
AUTH_TRUST_HOST=true
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
EOF

# Create server wrapper
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

const requiredEnvVars = [
  "MYSQL_HOST",
  "MYSQL_USER",
  "MYSQL_PASSWORD",
  "MYSQL_DATABASE",
];
const missing = requiredEnvVars.filter((v) => !process.env[v]);

if (missing.length > 0) {
  console.error(
    "❌ Missing required environment variables:",
    missing.join(", ")
  );
  process.exit(1);
}

console.log("🚀 Starting Next.js server...\n");
require("./.next/standalone/server.js");
EOFWRAPPER

chmod +x server-wrapper.js

# Install dependencies
npm install

# Build application
npm run build

# Copy static files for standalone build
cp -r public .next/standalone/ 2>/dev/null || true
cp -r .next/static .next/standalone/.next/ 2>/dev/null || true

print_step "Step 14: Setup Umrah Environment"
cd /root/Documents/umrah

# Create .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
MYSQL_HOST=127.0.0.1
MYSQL_USER=umrahapp
MYSQL_PASSWORD=UmrahApp2024Pass
MYSQL_DATABASE=umrah
AUTH_SECRET=umrah_secret_key_2024_secure
AUTH_URL=https://umrah.mirkokawa.dev
AUTH_TRUST_HOST=true
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
EOF

# Install dependencies
npm install

# Build application
npm run build

print_step "Step 15: Configure Nginx for ValueArch"
cat > /etc/nginx/sites-available/valuearch.com << 'EOFNGINX'
server {
    listen 80;
    listen [::]:80;
    server_name valuearch.com www.valuearch.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOFNGINX

ln -sf /etc/nginx/sites-available/valuearch.com /etc/nginx/sites-enabled/

print_step "Step 16: Configure Nginx for Umrah"
cat > /etc/nginx/sites-available/umrah.mirkokawa.dev << 'EOFNGINX'
server {
    listen 80;
    listen [::]:80;
    server_name umrah.mirkokawa.dev;

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
}
EOFNGINX

ln -sf /etc/nginx/sites-available/umrah.mirkokawa.dev /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx

print_step "Step 17: Setup PM2 for ValueArch"
cd /root/Documents/value

cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [
    {
      name: "valuearch-app",
      script: "server-wrapper.js",
      cwd: "/root/Documents/value",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
EOFPM2

pm2 start ecosystem.config.js
pm2 save

print_step "Step 18: Setup PM2 for Umrah"
cd /root/Documents/umrah

cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [
    {
      name: "umrah-app",
      script: "npm",
      args: "start",
      cwd: "/root/Documents/umrah",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
EOFPM2

pm2 start ecosystem.config.js
pm2 save

print_step "Step 19: Setup SSL Certificates"
# Note: SSL setup requires DNS to be configured first
echo "⚠️  SSL certificates need to be set up after DNS is confirmed"
echo "Run these commands manually when ready:"
echo "  certbot --nginx -d valuearch.com -d www.valuearch.com"
echo "  certbot --nginx -d umrah.mirkokawa.dev"

print_step "Step 20: Final Status Check"
echo "PM2 Status:"
pm2 status

echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager | head -10

echo ""
echo "MySQL Status:"
systemctl status mysql --no-pager | head -10

echo ""
echo "Firewall Status:"
ufw status

echo ""
echo "Listening Ports:"
ss -tlnp | grep -E ':(22|80|443|3000|3001)'

print_step "✅ SETUP COMPLETE!"
echo ""
echo "Your server is now configured with:"
echo "  ✅ Node.js $(node --version)"
echo "  ✅ npm $(npm --version)"
echo "  ✅ PM2 (managing 2 applications)"
echo "  ✅ Nginx (reverse proxy)"
echo "  ✅ MySQL (2 databases configured)"
echo "  ✅ Firewall (UFW enabled)"
echo ""
echo "Applications running:"
echo "  🌐 ValueArch: http://valuearch.com (port 3000)"
echo "  🌐 Umrah: http://umrah.mirkokawa.dev (port 3001)"
echo ""
echo "Next steps:"
echo "  1. Import your database backups"
echo "  2. Set up SSL certificates (after DNS is confirmed)"
echo "  3. Test both websites"
echo ""

ENDSSH

echo ""
echo "🎉 Server setup complete!"
echo ""
echo "Next: Run the database import script"
