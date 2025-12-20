# ✅ New Server Setup Complete - Valuearch Website

**Date:** December 15, 2025  
**New Server:** 46.224.48.179  
**Old Server:** 167.235.28.79 (Cloud Storage Only)  
**Status:** ✅ READY TO GO!

---

## 🎯 **SERVER SEPARATION COMPLETE!**

```
OLD SERVER (167.235.28.79):
└── Cloud Storage (cloud.mirkokawa.dev)
    - 486 files (3.7 GB)
    - File API
    - Cloud database

NEW SERVER (46.224.48.179):
└── Valuearch Website (valuearch.com)
    - Next.js application
    - Dashboard database
    - Connects to cloud API on old server
```

---

## ✅ **WHAT'S INSTALLED ON NEW SERVER:**

### **System:**
- ✅ Ubuntu 22.04.5 LTS
- ✅ 75 GB disk space (71 GB free!)
- ✅ 3.7 GB RAM (3.3 GB free)
- ✅ Node.js 20.19.6
- ✅ MySQL 8.0
- ✅ Nginx 1.18.0
- ✅ PM2 6.0.14

### **Valuearch Application:**
- ✅ Project files deployed
- ✅ Dependencies installed (475 packages)
- ✅ Built successfully
- ✅ Running on PM2 (port 3000)
- ✅ Nginx configured and running
- ✅ Auto-start enabled

### **Database:**
- ✅ MySQL database: `dashboard`
- ✅ User: `admin` / Password: `admin123@#!123`
- ✅ Schema ready

### **Configuration:**
- ✅ Environment variables configured
- ✅ Connects to cloud storage on old server
- ✅ PM2 ecosystem config
- ✅ Nginx reverse proxy

---

## 📊 **CURRENT STATUS:**

```
┌────┬────────────────┬─────────┬──────────┬────────┐
│ id │ name           │ status  │ cpu      │ mem    │
├────┼────────────────┼─────────┼──────────┼────────┤
│ 0  │ valuearch-app  │ online  │ 0%       │ 84.6mb │
└────┴────────────────┴─────────┴──────────┴────────┘

✅ Next.js 15.5.0 - Ready in 158ms
✅ Listening on http://0.0.0.0:3000
✅ Nginx proxying on port 80
✅ No errors in logs
```

---

## 🌐 **TO ACCESS YOUR WEBSITE:**

### **Current Access:**
```
http://46.224.48.179  ← Works now!
```

### **To Use Domain (valuearch.com):**

You need to **update your DNS settings** to point to the new server:

#### **Option 1: Direct (Fastest)**
1. Go to your domain registrar (where you bought valuearch.com)
2. Update DNS A records:
   ```
   Type: A
   Name: @
   Value: 46.224.48.179
   TTL: 3600

   Type: A
   Name: www
   Value: 46.224.48.179
   TTL: 3600
   ```

#### **Option 2: Through Cloudflare**
1. Go to Cloudflare DNS dashboard
2. Update existing A records for valuearch.com:
   - Change IP from `167.235.28.79` to `46.224.48.179`
   - For both `@` and `www` records
3. Save changes (will take 1-5 minutes)

---

## 🔒 **SSL CERTIFICATES (TODO):**

After DNS is pointed to new server, run these commands to get SSL:

```bash
ssh root@46.224.48.179

# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d valuearch.com -d www.valuearch.com

# Follow prompts (will ask for email)

# Certbot will auto-renew
```

---

## 📁 **FILE LOCATIONS ON NEW SERVER:**

```
Project Files:
/root/Documents/value/               ← Source code
/root/Documents/value/.next/         ← Built files
/root/Documents/value/.next/standalone/value/  ← Running app

Configuration:
/root/Documents/value/.env.local     ← Environment variables
/root/Documents/value/ecosystem.config.js  ← PM2 config

Nginx:
/etc/nginx/sites-available/valuearch.conf  ← Nginx config
/etc/nginx/sites-enabled/valuearch.conf    ← Enabled config

Database Backup:
/root/backups/dashboard_backup.sql   ← Your data backup
```

---

## ⚙️ **ENVIRONMENT VARIABLES:**

```env
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=admin123@#!123
MYSQL_DATABASE=dashboard
AUTH_SECRET=asdjfskjdfljspfasldjkfleeygc

CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

**Note:** The website connects to cloud storage on the OLD server (167.235.28.79)!

---

## 🔧 **USEFUL COMMANDS:**

### **Check Website Status:**
```bash
ssh root@46.224.48.179 "pm2 list"
```

### **View Logs:**
```bash
ssh root@46.224.48.179 "pm2 logs valuearch-app"
```

### **Restart Website:**
```bash
ssh root@46.224.48.179 "pm2 restart valuearch-app"
```

### **Stop Website:**
```bash
ssh root@46.224.48.179 "pm2 stop valuearch-app"
```

### **Check Nginx:**
```bash
ssh root@46.224.48.179 "systemctl status nginx"
```

### **Reload Nginx:**
```bash
ssh root@46.224.48.179 "nginx -t && systemctl reload nginx"
```

### **Check Database:**
```bash
ssh root@46.224.48.179 "mysql -u admin -p'admin123@#!123' -e 'SHOW DATABASES;'"
```

---

## 📊 **ARCHITECTURE:**

```
                    INTERNET
                       |
                       |
        ┌──────────────┴──────────────┐
        |                             |
        v                             v
┌───────────────┐             ┌───────────────┐
│  NEW SERVER   │             │  OLD SERVER   │
│ 46.224.48.179 │             │ 167.235.28.79 │
└───────────────┘             └───────────────┘
        |                             |
        |                             |
┌───────┴────────┐           ┌────────┴────────┐
│ Valuearch App  │   ────>   │  Cloud Storage  │
│                │  API Call │                 │
│ - Next.js      │           │ - File API      │
│ - Dashboard    │           │ - 486 files     │
│ - Port 3000    │           │ - Port 1200     │
│ - Nginx:80     │           │ - Nginx:80      │
└────────────────┘           └─────────────────┘
        |                             |
        |                             |
┌───────┴────────┐           ┌────────┴────────┐
│ Dashboard DB   │           │   Cloud DB      │
│ (MySQL)        │           │   (MySQL)       │
└────────────────┘           └─────────────────┘
```

**Flow:**
1. User visits `valuearch.com` → NEW SERVER
2. Website loads from NEW SERVER
3. Website needs image → API call to OLD SERVER
4. OLD SERVER returns file
5. Website displays image to user

---

## ✅ **WHAT'S WORKING:**

- ✅ Website running on new server
- ✅ Next.js application built and deployed
- ✅ Database configured
- ✅ PM2 process manager
- ✅ Nginx web server
- ✅ Auto-start on reboot enabled
- ✅ Connects to cloud storage on old server
- ✅ Environment variables configured
- ✅ No errors in logs

---

## ⚠️ **WHAT YOU NEED TO DO:**

### **1. Update DNS (REQUIRED)**
Point valuearch.com to new server IP: `46.224.48.179`

**How:**
- Go to Cloudflare or domain registrar
- Update A records to `46.224.48.179`
- Wait 1-5 minutes for DNS propagation

### **2. Get SSL Certificate (AFTER DNS)**
```bash
ssh root@46.224.48.179
apt install -y certbot python3-certbot-nginx
certbot --nginx -d valuearch.com -d www.valuearch.com
```

### **3. Test Everything**
- Visit valuearch.com
- Test file uploads
- Check images load from cloud
- Test dashboard login

---

## 🎉 **BENEFITS OF THIS SETUP:**

### **Performance:**
- 🚀 Website on dedicated server (faster)
- 🚀 Cloud storage on separate server (isolated)
- 🚀 No resource competition
- 🚀 Can scale independently

### **Security:**
- 🔒 Website isolated from file storage
- 🔒 Separate databases
- 🔒 API key authentication between servers
- 🔒 Better fault isolation

### **Maintenance:**
- ⚙️ Update website without affecting files
- ⚙️ Update cloud storage without affecting website
- ⚙️ Easier debugging
- ⚙️ Clear separation of concerns

---

## 📈 **RESOURCE USAGE:**

### **New Server (Valuearch):**
```
Disk:   1.0 GB used / 75 GB total (1.3%)
Memory: 400 MB used / 3.7 GB total (10.8%)
CPU:    Idle
Status: ✅ Excellent
```

### **Old Server (Cloud Storage):**
```
Disk:   14 GB used / 38 GB total (38%)
Memory: 69 MB (cloud-app only)
CPU:    0%
Status: ✅ Excellent
```

---

## 🔍 **TROUBLESHOOTING:**

### **Website Not Loading:**
```bash
# Check PM2 status
ssh root@46.224.48.179 "pm2 status"

# Check logs
ssh root@46.224.48.179 "pm2 logs valuearch-app --lines 50"

# Restart app
ssh root@46.224.48.179 "pm2 restart valuearch-app"
```

### **Images Not Loading:**
```bash
# Check cloud server is running
ssh root@167.235.28.79 "pm2 status"

# Check cloud logs
ssh root@167.235.28.79 "pm2 logs cloud-app --lines 50"

# Test cloud API from new server
ssh root@46.224.48.179 "curl -I https://cloud.mirkokawa.dev"
```

### **Database Issues:**
```bash
# Check MySQL is running
ssh root@46.224.48.179 "systemctl status mysql"

# Test database connection
ssh root@46.224.48.179 "mysql -u admin -p'admin123@#!123' dashboard -e 'SHOW TABLES;'"
```

---

## 📝 **NEXT STEPS:**

1. ✅ **Server setup** - COMPLETE!
2. ⏳ **Update DNS** - Point valuearch.com to 46.224.48.179
3. ⏳ **Install SSL** - After DNS propagation
4. ⏳ **Test website** - All features working
5. ⏳ **Monitor performance** - Check for 24-48 hours

---

## 🎯 **SUMMARY:**

```
✅ NEW SERVER READY!
✅ Valuearch website deployed
✅ Database configured
✅ PM2 running and auto-start enabled
✅ Nginx configured
✅ Connects to cloud storage on old server
⏳ Update DNS to go live
⏳ Install SSL after DNS update

Your architecture is now properly separated:
- Website Server: Fast and dedicated
- Cloud Storage Server: Isolated and efficient

Smart setup! 🚀
```

---

**Setup completed by:** AI Assistant  
**Date:** December 15, 2025  
**Status:** ✅ **READY FOR DNS UPDATE!**











