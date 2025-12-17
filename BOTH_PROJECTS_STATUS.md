# Both Projects - Quick Reference

**Last Updated:** December 17, 2025 03:15 AM UTC

## 🌐 Live Projects on Server 46.224.48.179

### Project 1: Value Architecture ✅ LIVE
```
Name:     valuearch-app
URL:      https://valuearch.com
Port:     3000
Status:   ✅ Fully Operational
Database: dashboard (24 projects, valueapp user)
PM2 ID:   0
```

**Commands:**
```bash
pm2 restart valuearch-app     # Restart
pm2 logs valuearch-app         # View logs
pm2 flush valuearch-app        # Clear old logs
```

---

### Project 2: Umrah ✅ RUNNING (Needs DNS)
```
Name:     umrah-app
URL:      umrah.mirkokawa.dev (DNS not configured yet)
Port:     3001
Status:   ✅ Running, ready for traffic
Database: umrah (18 tables, umrahapp user)
PM2 ID:   2
```

**Commands:**
```bash
pm2 restart umrah-app          # Restart
pm2 logs umrah-app             # View logs
pm2 flush umrah-app            # Clear old logs
```

---

## 📝 TODO: Configure DNS for Umrah Project

**Action:** Add this DNS record in your domain registrar for `mirkokawa.dev`:

```
Type:  A
Host:  umrah
Value: 46.224.48.179
TTL:   3600
```

**Verification:**
```bash
# Wait 5-15 minutes, then test:
ping umrah.mirkokawa.dev
# Should return: 46.224.48.179

# Test HTTP (will work immediately after DNS)
curl http://umrah.mirkokawa.dev
```

**Then Install SSL:**
```bash
ssh root@46.224.48.179
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d umrah.mirkokawa.dev --email admin@mirkokawa.dev --agree-tos --redirect
pm2 restart umrah-app
```

---

## 🎮 Quick Commands

### View All Apps
```bash
ssh root@46.224.48.179 'pm2 list'
```

### Restart Both Apps
```bash
ssh root@46.224.48.179 'pm2 restart all'
```

### View All Logs
```bash
ssh root@46.224.48.179 'pm2 logs'
```

### Clear All Logs
```bash
ssh root@46.224.48.179 'pm2 flush all'
```

### Server Status
```bash
ssh root@46.224.48.179 'pm2 status && df -h && free -h'
```

---

## 🔐 Database Credentials

### Value Architecture Database
```
Host:     127.0.0.1
Database: dashboard
User:     valueapp
Password: ValueApp2024Pass
```

### Umrah Database
```
Host:     127.0.0.1
Database: umrah
User:     umrahapp
Password: UmrahApp2024Pass
```

**Connect:**
```bash
# ValueArch database
mysql -u valueapp -p'ValueApp2024Pass' dashboard

# Umrah database
mysql -u umrahapp -p'UmrahApp2024Pass' umrah
```

---

## 📁 File Locations

### ValueArch Project
```
Code:         /root/Documents/value
Config:       /root/Documents/value/ecosystem.config.js
Wrapper:      /root/Documents/value/server-wrapper.js
Env:          /root/Documents/value/.env
Nginx:        /etc/nginx/sites-available/valuearch.com
SSL:          /etc/letsencrypt/live/valuearch.com/
PM2 Logs:     /root/.pm2/logs/valuearch-app-*.log
```

### Umrah Project
```
Code:         /root/Documents/umrah
Config:       /root/Documents/umrah/ecosystem.config.js
Env:          /root/Documents/umrah/.env
Nginx:        /etc/nginx/sites-available/umrah.mirkokawa.dev
SSL:          (pending DNS configuration)
PM2 Logs:     /root/.pm2/logs/umrah-app-*.log
```

---

## 🔧 Maintenance

### Update ValueArch
```bash
# From local machine
cd /Users/miko/Documents/web/value
git pull
./deploy-standalone.sh
```

### Update Umrah
```bash
# Similar process - build locally and deploy
cd /Users/miko/Documents/web/umrah  # (if you have it locally)
# Or build on server:
ssh root@46.224.48.179 'cd /root/Documents/umrah && npm run build && pm2 restart umrah-app'
```

### Backup Databases
```bash
ssh root@46.224.48.179 << 'EOF'
# Backup ValueArch database
mysqldump -u valueapp -p'ValueApp2024Pass' dashboard > /root/backups/dashboard-$(date +%Y%m%d).sql

# Backup Umrah database
mysqldump -u umrahapp -p'UmrahApp2024Pass' umrah > /root/backups/umrah-$(date +%Y%m%d).sql
EOF
```

---

## 🎯 Summary

✅ **VALUE ARCHITECTURE**
- https://valuearch.com - LIVE and working perfectly
- All production errors fixed
- Super fast performance
- Database queries optimized

✅ **UMRAH PROJECT**
- Built and running on port 3001
- Database connected (18 tables with data)
- API endpoints working
- **Just needs DNS configuration to be publicly accessible**

---

## 📞 Next Steps

1. **Now:** Configure DNS A record for `umrah.mirkokawa.dev` → `46.224.48.179`

2. **After DNS (15 mins):** Install SSL certificate:
   ```bash
   ssh root@46.224.48.179
   apt-get install -y certbot python3-certbot-nginx
   certbot --nginx -d umrah.mirkokawa.dev
   ```

3. **Then:** Visit https://umrah.mirkokawa.dev 🎉

---

**All Done!** Both projects are operational. Just configure DNS and you're set! 🚀
