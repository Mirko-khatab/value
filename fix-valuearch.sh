#!/bin/bash

# Fix ValueArch Site Script
# This will diagnose and fix common issues

set -e

echo "🔧 VALUEARCH SITE FIX"
echo "===================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /root/Documents/valuearch

echo "1. Checking PM2 Status..."
pm2 status

echo ""
echo "2. Checking Recent Logs..."
pm2 logs valuearch-app --lines 50 --nostream

echo ""
echo "3. Testing Database Connection..."
mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
USE dashboard;
SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'dashboard';
SHOW TABLES;
EOSQL

echo ""
echo "4. Checking Environment Variables..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    grep -E "^(DATABASE_URL|AUTH_URL|NODE_ENV)" .env | sed 's/=.*/=***/' || echo "⚠️ Missing environment variables"
else
    echo "❌ .env file not found!"
fi

echo ""
echo "5. Testing Local Server Response..."
curl -I http://localhost:3000 2>&1 | head -10

echo ""
echo "6. Checking Nginx Configuration..."
nginx -t

echo ""
echo "7. Testing Public Site..."
curl -I https://valuearch.com 2>&1 | head -10

echo ""
echo "8. System Resources..."
echo "   CPU Load: $(uptime | awk -F'load average:' '{print $2}')"
echo "   Memory: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo "   Disk: $(df -h / | awk 'NR==2 {print $3 "/" $2}')"

echo ""
echo "9. Database Performance..."
mysql -u root -p'gM7-3$F<1&4^!' << 'EOSQL'
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Slow_queries';
EOSQL

echo ""
echo "🔧 QUICK FIXES:"
echo ""

echo "   a. Restarting application..."
pm2 restart valuearch-app

echo "   b. Clearing PM2 logs..."
pm2 flush

echo "   c. Reloading Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo -e "${GREEN}✅ Diagnostics Complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo "   1. If database is empty, run: bash import-database.sh"
echo "   2. Check logs above for errors"
echo "   3. Test site: https://valuearch.com"




