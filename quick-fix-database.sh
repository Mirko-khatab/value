#!/bin/bash

# One-Command Database Upload and Import
# This will upload and import your database in one go

set -e

echo "🚀 QUICK DATABASE FIX FOR VALUEARCH"
echo "===================================="
echo ""

# Check if SSH is accessible
echo "1️⃣  Testing SSH connection..."
if ! ssh -o ConnectTimeout=5 root@46.224.48.179 "echo '✅ SSH connected'" 2>/dev/null; then
    echo "❌ SSH connection failed!"
    echo ""
    echo "⚠️  POSSIBLE REASONS:"
    echo "   1. Server is down or restarting"
    echo "   2. IP blocked by Hetzner (too many connections)"
    echo "   3. Firewall blocking SSH"
    echo ""
    echo "🔧 TRY THIS:"
    echo "   1. Wait 5-10 minutes and try again"
    echo "   2. Use Hetzner Console (web interface) to access server"
    echo "   3. Check if you can access: https://valuearch.com"
    echo ""
    exit 1
fi

echo ""
echo "2️⃣  Uploading database (value-grng-fixed.sql)..."
scp value-grng-fixed.sql root@46.224.48.179:/tmp/dashboard.sql

if [ $? -ne 0 ]; then
    echo "❌ Upload failed!"
    exit 1
fi

echo "✅ Database uploaded!"
echo ""

echo "3️⃣  Importing database to server..."
ssh root@46.224.48.179 << 'ENDSSH'

echo "📊 Importing database..."
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql

echo ""
echo "🔍 Verifying tables..."
mysql -u root -p'gM7-3$F<1&4^!' -e "
SELECT 
    COUNT(*) as 'Total Tables',
    SUM(table_rows) as 'Total Rows'
FROM information_schema.tables 
WHERE table_schema = 'dashboard';
"

echo ""
echo "📋 Sample tables:"
mysql -u root -p'gM7-3$F<1&4^!' -e "SHOW TABLES FROM dashboard;" | head -15

echo ""
echo "⚡ Optimizing database performance..."
mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
SET GLOBAL innodb_buffer_pool_size = 512M;
SET GLOBAL max_connections = 300;
SET GLOBAL query_cache_size = 67108864;
SET GLOBAL query_cache_type = 1;
FLUSH PRIVILEGES;
EOSQL

echo ""
echo "🔄 Restarting ValueArch application..."
pm2 restart valuearch-app

echo ""
echo "⏳ Waiting for app to start..."
sleep 3

echo ""
echo "🧪 Testing application..."
pm2 status
curl -I http://localhost:3000 2>&1 | grep -E "HTTP|Content-Type" || echo "⚠️ App not responding yet"

echo ""
echo "✅ ALL DONE!"
echo ""
echo "🌐 Your site should now work:"
echo "   https://valuearch.com"
echo ""
echo "📊 Check logs if there are issues:"
echo "   pm2 logs valuearch-app"

ENDSSH

echo ""
echo "🎉 SUCCESS! Database imported and app restarted!"
echo ""
echo "🔗 Test your site: https://valuearch.com"




