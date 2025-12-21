#!/bin/bash

# PASTE THIS ENTIRE SCRIPT INTO HETZNER CONSOLE
# Copy everything from START to END

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 VALUEARCH DATABASE IMPORT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Create the base64 file
echo "📦 Step 1: Creating database file..."
cat > /tmp/db.b64 << 'ENDBASE64'
[PASTE BASE64 CONTENT HERE - FROM /tmp/database-base64.txt]
ENDBASE64

# Step 2: Decode to SQL
echo "🔓 Step 2: Decoding database..."
base64 -d /tmp/db.b64 > /tmp/dashboard.sql

# Check file size
FILE_SIZE=$(ls -lh /tmp/dashboard.sql | awk '{print $5}')
echo "   ✅ Database file created: $FILE_SIZE"

# Step 3: Import to MySQL
echo ""
echo "📊 Step 3: Importing to MySQL..."
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql

if [ $? -eq 0 ]; then
    echo "   ✅ Import successful!"
else
    echo "   ❌ Import failed!"
    exit 1
fi

# Step 4: Verify
echo ""
echo "🔍 Step 4: Verifying import..."
TABLE_COUNT=$(mysql -u root -p'gM7-3$F<1&4^!' -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='dashboard';" | tail -1)
echo "   Tables imported: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "   ✅ Success! Tables found."
    
    # Show some tables
    echo ""
    echo "📋 Sample tables:"
    mysql -u root -p'gM7-3$F<1&4^!' -e "SHOW TABLES FROM dashboard;" | head -15
    
    # Step 5: Optimize database
    echo ""
    echo "⚡ Step 5: Optimizing database..."
    mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
SET GLOBAL innodb_buffer_pool_size = 512M;
SET GLOBAL max_connections = 300;
SET GLOBAL query_cache_size = 67108864;
FLUSH PRIVILEGES;
EOSQL
    echo "   ✅ Optimization complete!"
    
    # Step 6: Restart app
    echo ""
    echo "🔄 Step 6: Restarting ValueArch..."
    cd /root/Documents/valuearch
    pm2 restart valuearch-app
    
    echo ""
    echo "⏳ Waiting for app to start..."
    sleep 3
    
    # Step 7: Test
    echo ""
    echo "🧪 Step 7: Testing application..."
    pm2 status
    echo ""
    curl -I http://localhost:3000 2>&1 | head -5
    echo ""
    pm2 logs valuearch-app --lines 10
    
    # Cleanup
    echo ""
    echo "🧹 Cleaning up temporary files..."
    rm -f /tmp/db.b64 /tmp/dashboard.sql
    
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
    echo ""
else
    echo "   ❌ No tables found! Import may have failed."
    echo "   Check the SQL file and try again."
fi




