# Umrah Project Deployment - COMPLETE! ✅

**Date:** December 17, 2025  
**Subdomain:** umrah.mirkokawa.dev  
**Status:** ✅ **RUNNING** (HTTP only, SSL pending DNS)

## 🎉 What's Running

### Both Applications Active on Server

```
┌────┬──────────────────┬────────┬────────┬────────────────────────────┐
│ ID │ Name             │ Port   │ Status │ URL                        │
├────┼──────────────────┼────────┼────────┼────────────────────────────┤
│ 0  │ valuearch-app    │ 3000   │ ✅     │ https://valuearch.com      │
│ 2  │ umrah-app        │ 3001   │ ✅     │ http://umrah.mirkokawa.dev │
└────┴──────────────────┴────────┴────────┴────────────────────────────┘
```

## ✅ Completed Setup Steps

1. **MySQL Database** ✅
   - Database: `umrah` (already existed with data)
   - User: `umrahapp`
   - Password: `UmrahApp2024Pass`
   - Tables: 18 tables (products, banners, branches, blog_posts, etc.)

2. **Application Build** ✅
   - Dependencies installed
   - Next.js build completed
   - Running on port 3001

3. **PM2 Configuration** ✅
   - Process name: `umrah-app`
   - Auto-restart enabled
   - Environment variables configured

4. **Nginx Reverse Proxy** ✅
   - Configured to proxy port 3001
   - HTTP working
   - Logs: `/var/log/nginx/umrah.mirkokawa.dev.{access,error}.log`

5. **API Testing** ✅
   - `/api/products/public` - Returns Umrah products ✅
   - Database connection working ✅

## ⚠️ Pending: DNS & SSL Configuration

### Step 1: Configure DNS

**Action Required:** Add DNS A record in your domain registrar (mirkokawa.dev):

```
Type:  A
Name:  umrah
Value: 46.224.48.179
TTL:   3600
```

### Step 2: Verify DNS Propagation

Wait 5-15 minutes, then test:

```bash
# Test from your local machine
ping umrah.mirkokawa.dev

# Should return 46.224.48.179
```

### Step 3: Install SSL Certificate

Once DNS is working, run this command to get SSL certificate:

```bash
ssh root@46.224.48.179

# Install certbot if not already installed
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d umrah.mirkokawa.dev --email admin@mirkokawa.dev --agree-tos --redirect --non-interactive

# Certbot will automatically:
# - Get Let's Encrypt certificate
# - Update Nginx configuration
# - Enable HTTPS
# - Redirect HTTP to HTTPS
```

### Step 4: Update Auth URL

After SSL is enabled, update the auth URL:

```bash
ssh root@46.224.48.179
cd /root/Documents/umrah

# Update .env
sed -i 's|AUTH_URL=.*|AUTH_URL=https://umrah.mirkokawa.dev|' .env

# Restart app
pm2 restart umrah-app
```

## 📋 Configuration Files

### Environment Variables
**Location:** `/root/Documents/umrah/.env`

```env
NODE_ENV=production
PORT=3001
MYSQL_HOST=127.0.0.1
MYSQL_USER=umrahapp
MYSQL_PASSWORD=UmrahApp2024Pass
MYSQL_DATABASE=umrah
AUTH_SECRET=umrah_secret_key_2024_secure
AUTH_URL=https://umrah.mirkokawa.dev
AUTH_TRUST_HOST=true
```

### PM2 Configuration
**Location:** `/root/Documents/umrah/ecosystem.config.js`

Configured to:
- Run `npm start`
- Port 3001
- Auto-restart on failure
- Load environment variables

### Nginx Configuration
**Location:** `/etc/nginx/sites-available/umrah.mirkokawa.dev`

Configured to:
- Listen on port 80 (443 after SSL)
- Proxy to localhost:3001
- Cache static assets
- Forward headers properly

## 🧪 Testing Checklist

### Current Tests (Working)
- [x] Application builds successfully
- [x] PM2 process is running
- [x] Port 3001 is accessible locally
- [x] Database connection working
- [x] API returns data
- [x] Nginx proxy configured

### After DNS Configuration
- [ ] `ping umrah.mirkokawa.dev` resolves to 46.224.48.179
- [ ] `curl http://umrah.mirkokawa.dev` returns website
- [ ] SSL certificate installed
- [ ] `https://umrah.mirkokawa.dev` accessible
- [ ] No browser security warnings

## 🔧 Useful Commands

### Application Management
```bash
# Restart umrah app
ssh root@46.224.48.179 'pm2 restart umrah-app'

# View logs
ssh root@46.224.48.179 'pm2 logs umrah-app'

# Stop/Start
ssh root@46.224.48.179 'pm2 stop umrah-app'
ssh root@46.224.48.179 'pm2 start umrah-app'

# View both apps
ssh root@46.224.48.179 'pm2 list'
```

### Debugging
```bash
# Check if port 3001 is listening
ssh root@46.224.48.179 'netstat -tulpn | grep 3001'

# Test API locally
ssh root@46.224.48.179 'curl http://localhost:3001/api/products/public'

# Check Nginx logs
ssh root@46.224.48.179 'tail -f /var/log/nginx/umrah.mirkokawa.dev.access.log'
ssh root@46.224.48.179 'tail -f /var/log/nginx/umrah.mirkokawa.dev.error.log'

# Test database connection
ssh root@46.224.48.179 'mysql -u umrahapp -pUmrahApp2024Pass umrah -e "SELECT COUNT(*) FROM products;"'
```

## 🚀 Current Status

**Local Server (46.224.48.179):**
- ✅ Application running on port 3001
- ✅ Database connected and working
- ✅ Nginx reverse proxy configured
- ✅ Ready for traffic once DNS is configured

**DNS Configuration:**
- ⏳ Pending - Needs A record: umrah.mirkokawa.dev → 46.224.48.179

**SSL Certificate:**
- ⏳ Pending - Will install after DNS propagates

## 📊 Summary

### Value Architecture Project (valuearch.com)
- Status: ✅ **FULLY OPERATIONAL**
- Port: 3000
- Database: `dashboard` (24 projects)
- User: `valueapp`
- URL: https://valuearch.com

### Umrah Project (umrah.mirkokawa.dev)
- Status: ✅ **RUNNING** (HTTP ready, waiting for DNS)
- Port: 3001
- Database: `umrah` (18 tables, products, branches, blog posts)
- User: `umrahapp`
- URL: http://umrah.mirkokawa.dev (will be HTTPS after SSL)

---

**Next Action:** Configure DNS A record for `umrah.mirkokawa.dev` pointing to `46.224.48.179`
