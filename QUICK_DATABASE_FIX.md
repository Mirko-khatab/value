# Quick Database Import Guide

## 🚨 PROBLEM: ValueArch site not working because database is empty

## ✅ SOLUTION: Import your database backup

### Step 1: Upload Database File to Server

From your **local computer**, run:

```bash
scp /path/to/your/database-backup.sql root@46.224.48.179:/tmp/dashboard.sql
```

**Replace `/path/to/your/database-backup.sql`** with the actual path to your SQL backup file.

Common locations:

- `~/Downloads/dashboard.sql`
- `~/Desktop/value-grng.sql`
- `~/Documents/database-backup.sql`

### Step 2: Import Database on Server

**Option A: Using the Script (Recommended)**

SSH to your server and run:

```bash
cd /root/Documents/valuearch
bash import-database.sh
```

Then enter: `/tmp/dashboard.sql` when prompted.

---

**Option B: Manual Import**

SSH to your server and run:

```bash
# Import database
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql

# Verify tables exist
mysql -u root -p'gM7-3$F<1&4^!' -e "SHOW TABLES FROM dashboard;"

# Restart app
pm2 restart valuearch-app

# Test site
curl -I https://valuearch.com
```

---

## 🐌 SLOW DATABASE FIX

If the database is slow, optimize it:

```bash
mysql -u root -p'gM7-3$F<1&4^!' << 'EOF'
# Increase buffer pool
SET GLOBAL innodb_buffer_pool_size = 512M;

# Increase connections
SET GLOBAL max_connections = 300;

# Enable query cache
SET GLOBAL query_cache_size = 67108864;
SET GLOBAL query_cache_type = 1;

# Flush privileges
FLUSH PRIVILEGES;

# Show current settings
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'max_connections';
EOF
```

---

## 🔍 VERIFY DATABASE IS WORKING

```bash
# Run diagnostic script
cd /root/Documents/valuearch
bash fix-valuearch.sh
```

This will:

- ✅ Check database tables
- ✅ Test database connection
- ✅ Show recent errors
- ✅ Restart services
- ✅ Test the site

---

## 📋 CHECKLIST

- [ ] Upload database SQL file to server (`/tmp/dashboard.sql`)
- [ ] Import database using script or manual command
- [ ] Verify tables exist (`SHOW TABLES`)
- [ ] Optimize database settings
- [ ] Restart ValueArch app (`pm2 restart valuearch-app`)
- [ ] Test site: https://valuearch.com

---

## ⚠️ COMMON ISSUES

### "Can't connect to MySQL server"

```bash
systemctl restart mysql
systemctl status mysql
```

### "Access denied for user"

Check your `.env` file has correct `DATABASE_URL`:

```bash
cat /root/Documents/valuearch/.env | grep DATABASE_URL
```

### "Table doesn't exist"

Database import failed or SQL file is wrong. Re-import:

```bash
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql
```

---

## 🆘 NEED HELP?

1. **Check logs**: `pm2 logs valuearch-app --lines 100`
2. **Run diagnostic**: `bash fix-valuearch.sh`
3. **Check database**: `mysql -u root -p'gM7-3$F<1&4^!' -e "SHOW TABLES FROM dashboard;"`

---

## 📁 I See You Have These SQL Files Locally

Based on your project files:

- `value-grng.sql`
- `value-grng-fixed.sql`

**Upload one of these to the server:**

```bash
# From your local machine (in /Users/miko/Documents/web/value/)
scp value-grng-fixed.sql root@46.224.48.179:/tmp/dashboard.sql
```

Then on the server:

```bash
mysql -u root -p'gM7-3$F<1&4^!' dashboard < /tmp/dashboard.sql
pm2 restart valuearch-app
```

🎯 **This should fix everything!**




