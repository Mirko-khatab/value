#!/bin/bash

# RUN THIS IN YOUR TERMINAL THAT HAS SSH ACCESS
# This will upload and import the database automatically

set -e

echo "🚀 QUICK DATABASE FIX - RUN IN YOUR TERMINAL"
echo "=============================================="
echo ""

# Check if we're on the Mac
if [ ! -f "/Users/miko/Desktop/value-grng.sql" ]; then
    echo "❌ Database file not found at /Users/miko/Desktop/value-grng.sql"
    echo "   Please make sure you're running this on your Mac!"
    exit 1
fi

echo "1️⃣  Found database file: value-grng.sql"
ls -lh /Users/miko/Desktop/value-grng.sql

echo ""
echo "2️⃣  Testing SSH connection..."
if ssh -o ConnectTimeout=5 root@46.224.48.179 "echo 'SSH OK'" 2>/dev/null; then
    echo "   ✅ SSH connection works!"
else
    echo "   ❌ SSH connection failed!"
    echo ""
    echo "   Please make sure you can SSH to the server:"
    echo "   ssh root@46.224.48.179"
    exit 1
fi

echo ""
echo "3️⃣  Uploading database to server..."
scp /Users/miko/Desktop/value-grng.sql root@46.224.48.179:/tmp/dashboard.sql

if [ $? -eq 0 ]; then
    echo "   ✅ Upload successful!"
else
    echo "   ❌ Upload failed!"
    exit 1
fi

echo ""
echo "4️⃣  Importing database and restarting app..."
ssh root@46.224.48.179 << 'ENDSSH'

echo "📊 Importing database..."
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql

echo ""
echo "🔍 Verifying import..."
TABLE_COUNT=$(mysql -u root -p'gM7-3$F<1&4^!' -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='dashboard';" 2>/dev/null | tail -1)
echo "   Tables imported: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "   ✅ Success!"
    
    echo ""
    echo "📋 Sample tables:"
    mysql -u root -p'gM7-3$F<1&4^!' -e "SHOW TABLES FROM dashboard;" 2>/dev/null | head -15
    
    echo ""
    echo "⚡ Optimizing database..."
    mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
SET GLOBAL innodb_buffer_pool_size = 512M;
SET GLOBAL max_connections = 300;
SET GLOBAL query_cache_size = 67108864;
FLUSH PRIVILEGES;
EOSQL
    echo "   ✅ Optimization complete!"
    
    echo ""
    echo "🔄 Restarting ValueArch application..."
    cd /root/Documents/valuearch
    pm2 restart valuearch-app
    
    echo ""
    echo "⏳ Waiting 3 seconds..."
    sleep 3
    
    echo ""
    echo "🧪 Testing application..."
    pm2 status
    echo ""
    curl -I http://localhost:3000 2>&1 | head -5
    echo ""
    echo "Recent logs:"
    pm2 logs valuearch-app --lines 15 --nostream
    
    echo ""
    echo "🧹 Cleaning up..."
    rm -f /tmp/dashboard.sql
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ ALL DONE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Your site should now work:"
    echo "   👉 https://valuearch.com"
    echo ""
    echo "📊 Check logs if needed:"
    echo "   pm2 logs valuearch-app"
    
else
    echo "   ❌ No tables found! Import may have failed."
fi

ENDSSH

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Test your site: https://valuearch.com"
echo ""




