#!/bin/bash

# ==================================================================
# COMPLETE HETZNER CONSOLE IMPORT SCRIPT
# ==================================================================
# Instructions:
# 1. Copy this ENTIRE file
# 2. Go to Hetzner Console (https://console.hetzner.cloud/)
# 3. Click your server → Console button
# 4. Paste this entire script
# 5. Press Enter
# ==================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VALUEARCH DATABASE IMPORT - AUTOMATED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# The base64 encoded database will be inserted here
echo "📦 Creating database file from base64..."

# Read the base64 from the external file
BASE64_FILE="/tmp/database-base64.txt"

if [ ! -f "$BASE64_FILE" ]; then
    echo "❌ Error: Base64 file not found!"
    echo ""
    echo "Please run this on your Mac first:"
    echo "  cd /Users/miko/Desktop"
    echo "  base64 -i value-grng.sql -o /tmp/database-base64.txt"
    echo "  cat /tmp/database-base64.txt"
    echo ""
    echo "Then paste the base64 content into Hetzner Console using:"
    echo "  cat > /tmp/dashboard.sql.b64 << 'EOF'"
    echo "  [PASTE BASE64 HERE]"
    echo "  EOF"
    exit 1
fi

echo "🔓 Decoding database..."
base64 -d "$BASE64_FILE" > /tmp/dashboard.sql

FILE_SIZE=$(ls -lh /tmp/dashboard.sql 2>/dev/null | awk '{print $5}')
if [ -n "$FILE_SIZE" ]; then
    echo "   ✅ Database file created: $FILE_SIZE"
else
    echo "   ❌ Failed to create database file"
    exit 1
fi

echo ""
echo "📊 Importing to MySQL..."
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql

if [ $? -eq 0 ]; then
    echo "   ✅ Import successful!"
else
    echo "   ❌ Import failed!"
    exit 1
fi

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
    mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL' 2>/dev/null
SET GLOBAL innodb_buffer_pool_size = 512M;
SET GLOBAL max_connections = 300;
SET GLOBAL query_cache_size = 67108864;
FLUSH PRIVILEGES;
EOSQL
    echo "   ✅ Optimization complete!"
    
    echo ""
    echo "🔄 Restarting ValueArch..."
    cd /root/Documents/valuearch
    pm2 restart valuearch-app
    
    echo ""
    echo "⏳ Waiting for app to start..."
    sleep 3
    
    echo ""
    echo "🧪 Testing application..."
    pm2 status
    echo ""
    curl -I http://localhost:3000 2>&1 | head -5
    echo ""
    echo "Recent logs:"
    pm2 logs valuearch-app --lines 10 --nostream
    
    echo ""
    echo "🧹 Cleaning up..."
    rm -f /tmp/dashboard.sql.b64 /tmp/dashboard.sql
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ ALL DONE!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Visit: https://valuearch.com"
    echo ""
else
    echo "   ❌ No tables found!"
fi




