#!/bin/bash

# Import Database Script for ValueArch
# This will import your database backup to the server

set -e

echo "🗄️ DATABASE IMPORT SCRIPT"
echo "========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Database credentials
DB_HOST="localhost"
DB_USER="root"
DB_PASS="gM7-3$F<1&4^!"
DB_NAME="dashboard"

echo -e "${YELLOW}📋 Please provide your database SQL file:${NC}"
echo "   Options:"
echo "   1. Upload via scp: scp /path/to/database.sql root@46.224.48.179:/tmp/"
echo "   2. If file is already on server, enter the path below"
echo ""

read -p "Enter full path to SQL file on server (e.g., /tmp/dashboard.sql): " SQL_FILE

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ File not found: $SQL_FILE${NC}"
    echo ""
    echo "📤 Upload your database file first:"
    echo "   scp /path/to/your/database.sql root@46.224.48.179:/tmp/dashboard.sql"
    exit 1
fi

echo ""
echo "🔍 Checking database..."
mysql -u $DB_USER -p"$DB_PASS" -e "USE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Creating database '$DB_NAME'...${NC}"
    mysql -u $DB_USER -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
fi

echo ""
echo "📊 Importing database..."
echo "   File: $SQL_FILE"
echo "   Database: $DB_NAME"
echo ""

# Import the database
mysql -u $DB_USER -p"$DB_PASS" $DB_NAME < "$SQL_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database imported successfully!${NC}"
else
    echo -e "${RED}❌ Database import failed!${NC}"
    exit 1
fi

echo ""
echo "🔍 Verifying import..."
TABLE_COUNT=$(mysql -u $DB_USER -p"$DB_PASS" -e "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = '$DB_NAME';" | tail -n 1)
echo "   Tables found: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo ""
    echo "📋 Tables in database:"
    mysql -u $DB_USER -p"$DB_PASS" -e "SHOW TABLES FROM $DB_NAME;"
    
    echo ""
    echo "🔧 Optimizing database..."
    mysql -u $DB_USER -p"$DB_PASS" << 'EOSQL'
SET GLOBAL query_cache_size = 67108864;
SET GLOBAL max_connections = 200;
SET GLOBAL innodb_buffer_pool_size = 256M;
SET GLOBAL innodb_log_file_size = 64M;
FLUSH PRIVILEGES;
EOSQL
    
    echo -e "${GREEN}✅ Database optimized!${NC}"
    
    echo ""
    echo "🔄 Restarting ValueArch app..."
    pm2 restart valuearch-app
    
    echo ""
    echo -e "${GREEN}✅ ALL DONE!${NC}"
    echo ""
    echo "🌐 Test your site:"
    echo "   https://valuearch.com"
    
else
    echo -e "${RED}❌ No tables found after import!${NC}"
    echo "   Please check your SQL file."
fi




