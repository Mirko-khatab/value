#!/bin/bash

# DIRECT SERVER FIX - Run this in Hetzner Console
# Copy and paste this entire script into the Hetzner web console terminal

set -e

echo "🔧 FIXING VALUEARCH - DIRECT SERVER EXECUTION"
echo "=============================================="
echo ""

cd /root/Documents/valuearch

echo "1️⃣  Checking current database status..."
DB_TABLES=$(mysql -u root -p'gM7-3$F<1&4^!' -e "SELECT COUNT(*) as cnt FROM information_schema.tables WHERE table_schema='dashboard';" | tail -1)
echo "   Current tables in database: $DB_TABLES"

if [ "$DB_TABLES" -eq "0" ]; then
    echo "   ❌ Database is EMPTY - This is why the site shows errors!"
else
    echo "   ✅ Database has tables"
fi

echo ""
echo "2️⃣  Checking PM2 status..."
pm2 status

echo ""
echo "3️⃣  Checking recent application errors..."
pm2 logs valuearch-app --lines 30 --nostream

echo ""
echo "4️⃣  Testing local server response..."
curl -I http://localhost:3000 2>&1 | head -10

echo ""
echo "5️⃣  Checking environment variables..."
if [ -f .env ]; then
    echo "   ✅ .env file exists"
    echo "   DATABASE_URL: $(grep DATABASE_URL .env | cut -d'=' -f2 | sed 's/:[^@]*@/:***@/')"
    echo "   AUTH_URL: $(grep AUTH_URL .env | cut -d'=' -f2)"
    echo "   NODE_ENV: $(grep NODE_ENV .env | cut -d'=' -f2)"
else
    echo "   ❌ .env file missing!"
fi

echo ""
echo "6️⃣  System resources..."
echo "   CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "   Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "   Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"

echo ""
echo "7️⃣  MySQL performance check..."
mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
SELECT 
    @@max_connections as max_conn,
    @@innodb_buffer_pool_size as buffer_pool,
    (SELECT COUNT(*) FROM information_schema.processlist) as current_conn;
EOSQL

echo ""
echo "=========================================="
echo "🚨 DIAGNOSIS:"
echo "=========================================="
echo ""

if [ "$DB_TABLES" -eq "0" ]; then
    echo "❌ MAIN PROBLEM: Database is empty!"
    echo ""
    echo "📤 YOU NEED TO UPLOAD THE DATABASE FILE:"
    echo ""
    echo "Option A - Using SCP (if SSH works from your computer):"
    echo "   scp /Users/miko/Desktop/value-grng.sql root@46.224.48.179:/tmp/dashboard.sql"
    echo ""
    echo "Option B - Using Hetzner Console Upload:"
    echo "   1. In Hetzner Console, go to 'Rescue' tab"
    echo "   2. Or use wget if you can upload the file somewhere accessible"
    echo ""
    echo "Option C - Manual database creation (if you have the schema):"
    echo "   1. Create tables manually"
    echo "   2. Or wait for SSH access to restore"
    echo ""
    echo "🔄 AFTER UPLOADING, RUN THIS:"
    echo "   mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql"
    echo "   pm2 restart valuearch-app"
else
    echo "✅ Database has tables - checking other issues..."
    echo ""
    echo "🔧 QUICK FIXES:"
    echo ""
    echo "   a. Restart app:"
    echo "      pm2 restart valuearch-app"
    echo ""
    echo "   b. Clear cache:"
    echo "      pm2 flush"
    echo "      rm -rf /root/Documents/valuearch/.next/cache"
    echo ""
    echo "   c. Rebuild app:"
    echo "      npm run build"
    echo "      pm2 restart valuearch-app"
fi

echo ""
echo "=========================================="
echo "📋 RECOMMENDED ACTIONS:"
echo "=========================================="
echo ""
echo "1. Upload database file to /tmp/dashboard.sql"
echo "2. Import: mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql"
echo "3. Optimize: mysql -u root -p'gM7-3$F<1&4^!' << 'EOF'"
echo "   SET GLOBAL innodb_buffer_pool_size = 512M;"
echo "   SET GLOBAL max_connections = 300;"
echo "   FLUSH PRIVILEGES;"
echo "   EOF"
echo "4. Restart: pm2 restart valuearch-app"
echo "5. Test: curl -I https://valuearch.com"




