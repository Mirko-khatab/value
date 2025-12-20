#!/bin/bash

# Database Backup Script
# Creates backups of both databases and downloads them locally

SERVER="root@46.224.48.179"
BACKUP_DIR="./database-backups"
DATE=$(date +%Y%m%d-%H%M%S)

echo "💾 Database Backup Script"
echo "========================"
echo ""

# Create local backup directory
mkdir -p "$BACKUP_DIR"

echo "📥 Creating and downloading database backups..."
echo ""

ssh $SERVER << ENDSSH
# Create backups directory on server
mkdir -p /root/backups

# Backup ValueArch database
echo "Backing up ValueArch database..."
mysqldump -u valueapp -p'ValueApp2024Pass' dashboard > /root/backups/dashboard-${DATE}.sql
echo "✅ ValueArch backup created"

# Backup Umrah database
echo "Backing up Umrah database..."
mysqldump -u umrahapp -p'UmrahApp2024Pass' umrah > /root/backups/umrah-${DATE}.sql
echo "✅ Umrah backup created"

# List backup files
echo ""
echo "Backup files created:"
ls -lh /root/backups/*.sql | tail -2
ENDSSH

# Download backups
echo ""
echo "📥 Downloading backups to local machine..."
scp $SERVER:/root/backups/dashboard-${DATE}.sql "$BACKUP_DIR/"
scp $SERVER:/root/backups/umrah-${DATE}.sql "$BACKUP_DIR/"

echo ""
echo "✅ Backup complete!"
echo ""
echo "Files saved to:"
echo "  📁 $BACKUP_DIR/dashboard-${DATE}.sql"
echo "  📁 $BACKUP_DIR/umrah-${DATE}.sql"
echo ""
echo "To restore:"
echo "  mysql -u valueapp -p'ValueApp2024Pass' dashboard < $BACKUP_DIR/dashboard-${DATE}.sql"
echo "  mysql -u umrahapp -p'UmrahApp2024Pass' umrah < $BACKUP_DIR/umrah-${DATE}.sql"
echo ""
