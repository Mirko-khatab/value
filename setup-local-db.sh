#!/bin/bash

echo "🚀 ValueArch - Local Database Setup"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}❌ MySQL is not installed!${NC}"
    echo "Install with: brew install mysql"
    exit 1
fi

echo -e "${GREEN}✅ MySQL is installed${NC}"

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "${YELLOW}⚠️  MySQL is not running, starting it...${NC}"
    brew services start mysql
    sleep 3
    
    if ! pgrep -x "mysqld" > /dev/null; then
        echo -e "${RED}❌ Failed to start MySQL${NC}"
        echo "Try manually: brew services start mysql"
        exit 1
    fi
fi

echo -e "${GREEN}✅ MySQL is running${NC}"

# Check if database file exists
DB_FILE="/Users/miko/Desktop/value-grng.sql"
if [ ! -f "$DB_FILE" ]; then
    echo -e "${RED}❌ Database file not found: $DB_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Database file found${NC}"

# Prompt for MySQL password
echo ""
echo "Please enter your MySQL root password (press Enter if no password):"
read -s MYSQL_PASSWORD

# Test MySQL connection
if [ -z "$MYSQL_PASSWORD" ]; then
    mysql -u root -e "SELECT 1;" 2>/dev/null
    MYSQL_CMD="mysql -u root"
else
    mysql -u root -p"$MYSQL_PASSWORD" -e "SELECT 1;" 2>/dev/null
    MYSQL_CMD="mysql -u root -p$MYSQL_PASSWORD"
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ MySQL authentication failed!${NC}"
    echo "Please check your password"
    exit 1
fi

echo -e "${GREEN}✅ MySQL connection successful${NC}"

# Create database
echo ""
echo "📊 Creating database 'dashboard'..."
$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS dashboard;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database 'dashboard' created/verified${NC}"
else
    echo -e "${RED}❌ Failed to create database${NC}"
    exit 1
fi

# Import data
echo ""
echo "📥 Importing data (this may take a moment)..."
$MYSQL_CMD dashboard < "$DB_FILE" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database imported successfully!${NC}"
else
    echo -e "${RED}❌ Failed to import database${NC}"
    exit 1
fi

# Verify import
echo ""
echo "🔍 Verifying import..."
RESULT=$($MYSQL_CMD dashboard -e "
    SELECT 
        (SELECT COUNT(*) FROM projects) as projects,
        (SELECT COUNT(*) FROM galleries) as galleries,
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM audios) as audios;
" 2>/dev/null | tail -n 1)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Verification complete:${NC}"
    echo "$RESULT" | awk '{print "   Projects: " $1 "\n   Galleries: " $2 "\n   Products: " $3 "\n   Audios: " $4}'
else
    echo -e "${YELLOW}⚠️  Could not verify tables${NC}"
fi

# Show sample data
echo ""
echo "📋 Sample projects:"
$MYSQL_CMD dashboard -e "SELECT id, title_en, date FROM projects ORDER BY date DESC LIMIT 5;" 2>/dev/null

echo ""
echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Update your .env.local file with database credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
