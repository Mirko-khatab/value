# 🚀 Local Development Setup Guide

Complete guide to running ValueArch locally on your Mac.

---

## ✅ Prerequisites

You already have:
- ✅ Node.js installed
- ✅ MySQL installed (`/opt/homebrew/bin/mysql`)
- ✅ Next.js dev server running on `http://localhost:3000`

---

## 📋 Step-by-Step Setup

### **1. Check MySQL Service**

```bash
# Check if MySQL is running
brew services list | grep mysql

# If not running, start it:
brew services start mysql

# Or start temporarily (without auto-start):
mysql.server start
```

### **2. Create Local Database**

```bash
# Login to MySQL (try without password first)
mysql -u root

# If password is required:
mysql -u root -p
```

**Inside MySQL:**
```sql
-- Create database
CREATE DATABASE IF NOT EXISTS dashboard;

-- Create a user for local development (optional but recommended)
CREATE USER IF NOT EXISTS 'valuedev'@'localhost' IDENTIFIED BY 'dev123';

-- Grant privileges
GRANT ALL PRIVILEGES ON dashboard.* TO 'valuedev'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### **3. Import Database**

```bash
# Import your database backup
mysql -u root dashboard < /Users/miko/Desktop/value-grng.sql

# Or with the dev user:
mysql -u valuedev -pdev123 dashboard < /Users/miko/Desktop/value-grng.sql

# Verify import
mysql -u root -e "USE dashboard; SHOW TABLES; SELECT COUNT(*) as projects FROM projects; SELECT COUNT(*) as galleries FROM galleries;"
```

### **4. Configure Environment Variables**

Your `.env.local` file should contain:

```bash
# Database Configuration (LOCAL)
MYSQL_HOST=localhost
MYSQL_USER=root
# If you set a password, add it here:
# MYSQL_PASSWORD=your_local_password
# Or use the dev user:
# MYSQL_USER=valuedev
# MYSQL_PASSWORD=dev123
MYSQL_DATABASE=dashboard

# Auth.js Configuration (LOCAL)
AUTH_SECRET=ImNUCn0j+wg3bMZLb0Vdssdr/w/enyMZsoVQKzt68F0=
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Node Environment
NODE_ENV=development

# Cloud Storage Configuration - NEW API
CLOUD_API_BASE_URL=https://api.mirkokawa.dev
CLOUD_API_KEY_FULL=your_full_write_api_key
CLOUD_API_KEY_READ=your_read_only_api_key

# Public Cloud Storage (for client-side)
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://api.mirkokawa.dev
NEXT_PUBLIC_CLOUD_API_KEY_READ=your_read_only_api_key
```

**To edit:**
```bash
nano .env.local
# Or use your IDE to edit it
```

### **5. Start Development Server**

```bash
# You already have this running!
npm run dev
```

Your app is now running at: **http://localhost:3000** ✅

---

## 🧪 Testing Checklist

### **Test 1: Homepage**
```
✅ Open: http://localhost:3000
Should show: Landing page with hero section
```

### **Test 2: Projects Page**
```
✅ Open: http://localhost:3000/projects
Should show: List of projects with images
Check: Images load from cloud storage
```

### **Test 3: Single Project**
```
✅ Open: http://localhost:3000/project/13
Should show: Project details with image gallery
Check: Multiple images in slider
```

### **Test 4: Products Page**
```
✅ Open: http://localhost:3000/products
Should show: Product categories and items
```

### **Test 5: Dashboard (Admin)**
```
✅ Open: http://localhost:3000/dashboard
Should show: Login page or admin dashboard
```

---

## 🐛 Troubleshooting

### **Problem: "Database configuration not available"**

**Fix:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify MySQL credentials
mysql -u root -e "SELECT 1;"

# If password is needed:
mysql -u root -p -e "SELECT 1;"
```

### **Problem: "Connection refused" or "ECONNREFUSED"**

**Fix:**
```bash
# Start MySQL
brew services start mysql

# Or temporarily:
mysql.server start

# Check if running:
brew services list | grep mysql
```

### **Problem: "Table doesn't exist"**

**Fix:**
```bash
# Re-import database
mysql -u root dashboard < /Users/miko/Desktop/value-grng.sql

# Verify tables exist:
mysql -u root -e "USE dashboard; SHOW TABLES;"
```

### **Problem: Images not loading**

**Fix:**
- Check Cloud Storage API keys in `.env.local`
- Verify images exist in database:
```bash
mysql -u root -e "USE dashboard; SELECT id, image_url FROM projects LIMIT 5;"
```
- Check browser console for errors

### **Problem: "Application error: a client-side exception has occurred"**

**Fix:**
1. Check browser console for specific error
2. Check terminal for server logs
3. Restart dev server:
```bash
# Press Ctrl+C to stop
npm run dev
```

---

## 📊 Useful Commands

### **Database Queries**
```bash
# Count all data
mysql -u root dashboard -e "
  SELECT 
    (SELECT COUNT(*) FROM projects) as projects,
    (SELECT COUNT(*) FROM galleries) as galleries,
    (SELECT COUNT(*) FROM products) as products,
    (SELECT COUNT(*) FROM audios) as audios;
"

# View recent projects
mysql -u root dashboard -e "SELECT id, title_en, date FROM projects ORDER BY date DESC LIMIT 5;"

# View galleries for a project
mysql -u root dashboard -e "SELECT * FROM galleries WHERE parent_id = 13 AND parent_type = '0';"
```

### **Clear Cache and Restart**
```bash
# Stop server (Ctrl+C)
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies (if needed)
npm install

# Start fresh
npm run dev
```

---

## 🎯 Quick Start Script

Save this as `start-local.sh`:

```bash
#!/bin/bash

echo "🚀 Starting ValueArch Local Development..."

# 1. Check MySQL
echo "📊 Checking MySQL..."
if ! brew services list | grep -q "mysql.*started"; then
  echo "⚠️  MySQL not running, starting..."
  brew services start mysql
  sleep 3
fi

# 2. Check database exists
echo "🗄️  Checking database..."
mysql -u root -e "USE dashboard;" 2>/dev/null || {
  echo "❌ Database 'dashboard' not found!"
  echo "Creating database and importing..."
  mysql -u root -e "CREATE DATABASE IF NOT EXISTS dashboard;"
  mysql -u root dashboard < /Users/miko/Desktop/value-grng.sql
  echo "✅ Database imported!"
}

# 3. Check .env.local
echo "⚙️  Checking environment..."
if [ ! -f .env.local ]; then
  echo "❌ .env.local not found!"
  echo "Please create .env.local file with database credentials"
  exit 1
fi

# 4. Start dev server
echo "🎨 Starting Next.js..."
npm run dev
```

**Make it executable:**
```bash
chmod +x start-local.sh
./start-local.sh
```

---

## 🔑 Get Your Cloud Storage API Keys

If you don't have your API keys yet:

1. Go to your cloud storage dashboard
2. Generate/copy your API keys:
   - **Full Access Key** (for uploads): `csk_...`
   - **Read-Only Key** (for public access): `csk_...`
3. Add them to `.env.local`

---

## ✨ Tips

1. **Hot Reload**: Changes to code will auto-reload
2. **Database Changes**: Need to restart server after `.env.local` changes
3. **Port in Use**: If 3000 is busy, Next.js will use 3001, 3002, etc.
4. **Debug Mode**: Check terminal for detailed error logs

---

## 🎉 You're Ready!

Your local development environment should now be working:
- ✅ MySQL database running
- ✅ Next.js dev server on http://localhost:3000
- ✅ Cloud storage connected
- ✅ All pages accessible

**Happy coding!** 🚀
