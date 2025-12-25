# 🚀 Quick Start - Local Development

## ✅ Setup Complete!

Your local development environment is ready:

- ✅ MySQL running
- ✅ Database `dashboard` created and imported
- ✅ Next.js dev server running on http://localhost:3000

---

## 📋 Your .env.local Configuration

Copy this into your `.env.local` file:

```env
# Database Configuration (LOCAL)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=admin123
MYSQL_DATABASE=dashboard

# Auth.js Configuration (LOCAL)
AUTH_SECRET=ImNUCn0j+wg3bMZLb0Vdssdr/w/enyMZsoVQKzt68F0=
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Node Environment
NODE_ENV=development

# Cloud Storage Configuration - NEW API
CLOUD_API_BASE_URL=https://api.mirkokawa.dev
CLOUD_API_KEY_FULL=your_full_write_api_key_here
CLOUD_API_KEY_READ=your_read_only_api_key_here

# Public Cloud Storage (for client-side)
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://api.mirkokawa.dev
NEXT_PUBLIC_CLOUD_API_KEY_READ=your_read_only_api_key_here
```

**Important:** Replace the API keys with your actual keys from https://api.mirkokawa.dev

---

## 🎯 Current Database Status

```
✅ Projects: 1
✅ Galleries: 278
✅ Products: 1
✅ Categories: 6
```

---

## 🧪 Test Your Setup

### 1. **Open Homepage**

```
http://localhost:3000
```

Should show: Landing page

### 2. **Open Projects**

```
http://localhost:3000/projects
```

Should show: List of projects

### 3. **Open Single Project**

```
http://localhost:3000/project/1
```

Should show: Project details with gallery (278 images!)

### 4. **Open Products**

```
http://localhost:3000/products
```

Should show: Product listings

### 5. **Dashboard (Admin)**

```
http://localhost:3000/dashboard
```

Should show: Login page

---

## 🔧 Useful Commands

### Restart Dev Server

```bash
# Stop: Press Ctrl+C
npm run dev
```

### Check Database

```bash
mysql -u root -padmin123 dashboard -e "SHOW TABLES;"
```

### View Projects

```bash
mysql -u root -padmin123 dashboard -e "SELECT id, title_en FROM projects;"
```

### View Galleries for Project

```bash
mysql -u root -padmin123 dashboard -e "SELECT id, parent_id, image_url FROM galleries WHERE parent_id = 1 AND parent_type = '0' LIMIT 10;"
```

### Reset Database (if needed)

```bash
mysql -u root -padmin123 -e "DROP DATABASE dashboard; CREATE DATABASE dashboard;"
mysql -u root -padmin123 dashboard < /Users/miko/Documents/web/value/dashboard.sql
```

---

## 🐛 Troubleshooting

### Problem: "Database configuration not available"

**Fix:** Check your `.env.local` file has the correct MySQL credentials

### Problem: Images not loading

**Fix:**

1. Check Cloud Storage API keys in `.env.local`
2. Make sure you have `NEXT_PUBLIC_CLOUD_API_KEY_READ` set
3. Check browser console for errors

### Problem: "ECONNREFUSED" or connection errors

**Fix:**

```bash
# Check MySQL is running
brew services list | grep mysql

# Restart if needed
brew services restart mysql
```

### Problem: Need fresh start

```bash
# Stop dev server (Ctrl+C)
rm -rf .next
npm run dev
```

---

## 📊 Database Info

**Current Data:**

- 1 Test Project (ID: 1)
- 278 Gallery Images
- 1 Product
- 6 Project Categories
- 14 Sub-categories

**To add more projects:**
Use the dashboard at http://localhost:3000/dashboard (after login)

---

## 🎉 You're Ready!

Your local development is set up and running:

- URL: **http://localhost:3000**
- Database: **dashboard** (MySQL)
- Environment: **development**

**Happy coding!** 🚀

---

## 💡 Next Steps

1. **Get your Cloud Storage API keys** from https://api.mirkokawa.dev
2. **Add them to `.env.local`**
3. **Test file uploads** in the dashboard
4. **View projects with images**

If you need more sample data, import a different SQL file or add projects through the admin dashboard!
