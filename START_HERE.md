# 🎯 SERVER RESET - QUICK START GUIDE

## What You Need to Do

Your server has been reset. Follow these 3 simple steps to get everything running again.

---

## ⚡ STEP 1: Run the Setup Script

**This is the main command - it does EVERYTHING:**

```bash
cd /Users/miko/Documents/web/value
./complete-server-setup.sh
```

**What it does (automatically):**
- ✅ Installs Node.js 20.x
- ✅ Installs MySQL 8.x
- ✅ Installs Nginx web server
- ✅ Installs PM2 process manager
- ✅ Configures firewall (UFW)
- ✅ Clones your GitHub repos
- ✅ Creates databases (dashboard, umrah)
- ✅ Builds both applications
- ✅ Starts everything with PM2
- ✅ Configures Nginx reverse proxy

**Time:** ~15-20 minutes  
**Important:** Uses ONLY ONE SSH connection = Safe, won't trigger alerts!

---

## ⚡ STEP 2: Import Your Databases

### Do you have database backups?

**If YES** - Skip to Option A  
**If NO** - We need to export them first (Option B)

### Option A: You have backups

```bash
# Upload your backup files
scp /path/to/dashboard-backup.sql root@46.224.48.179:/root/
scp /path/to/umrah-backup.sql root@46.224.48.179:/root/

# Import them (one SSH session - safe!)
ssh root@46.224.48.179 << 'EOF'
mysql -u valueapp -p'ValueApp2024Pass' dashboard < /root/dashboard-backup.sql
mysql -u umrahapp -p'UmrahApp2024Pass' umrah < /root/umrah-backup.sql
echo "✅ Databases imported!"
EOF
```

### Option B: Need to create backups first

If you need to export from the OLD server before it was reset, let me know and I'll help you.

---

## ⚡ STEP 3: Setup SSL Certificates

**After DNS is confirmed working:**

```bash
ssh root@46.224.48.179 << 'EOF'
certbot --nginx -d valuearch.com -d www.valuearch.com --email admin@valuearch.com --agree-tos --redirect --non-interactive
certbot --nginx -d umrah.mirkokawa.dev --email admin@mirkokawa.dev --agree-tos --redirect --non-interactive
pm2 restart all
echo "✅ SSL certificates installed!"
EOF
```

---

## ✅ Verification

Check everything is working:

```bash
ssh root@46.224.48.179 << 'EOF'
pm2 status
ufw status
curl -I http://localhost:3000
curl -I http://localhost:3001
EOF
```

**Visit your websites:**
- http://valuearch.com
- http://umrah.mirkokawa.dev

After SSL:
- https://valuearch.com
- https://umrah.mirkokawa.dev

---

## 🔒 Why This Is Safe Now

### The Problem Before:
Multiple deployment scripts = Multiple rapid SSH connections = Hetzner thinks it's a DDoS attack

```
./deploy-umrah.sh    → SSH connection #1
./deploy-value.sh    → SSH connection #2
./some-script.sh     → SSH connection #3
... (many more)
```

### The Solution Now:
ONE script = ONE SSH connection = Safe!

```
./complete-server-setup.sh  → ONE long SSH session
  ├─ Installs everything
  ├─ Configures everything
  ├─ Starts everything
  └─ Done! ✅
```

---

## 🚀 Future Updates (Safe Method)

**To update your projects after setup:**

```bash
# ONE SSH session with all commands
ssh root@46.224.48.179 << 'EOF'
# Update ValueArch
cd /root/Documents/value
git pull origin main
npm install
npm run build
pm2 restart valuearch-app

# Update Umrah
cd /root/Documents/umrah
git pull origin main
npm install
npm run build
pm2 restart umrah-app

# Show status
pm2 status
EOF
```

**Safe:** ✅ One SSH connection with multiple commands  
**Fast:** ✅ Updates both projects  
**No Alerts:** ✅ Won't trigger Hetzner security

---

## 📋 Pre-Setup Checklist

Before running `./complete-server-setup.sh`:

- [ ] Can you SSH to the server? `ssh root@46.224.48.179`
- [ ] Is the server fresh/reset?
- [ ] Do you have GitHub access configured on the server?
- [ ] Do you know where your database backups are?

If all YES → Run the setup script!

---

## 🆘 If Something Fails

### Setup script errors

1. Read the error message
2. See which step failed
3. SSH to server and run that step manually:

```bash
ssh root@46.224.48.179
# Fix the issue
# Continue from where it failed
```

### Applications won't start

```bash
ssh root@46.224.48.179 << 'EOF'
pm2 logs valuearch-app --lines 50
pm2 logs umrah-app --lines 50
EOF
```

### Can't access websites

```bash
ssh root@46.224.48.179 << 'EOF'
pm2 status
systemctl status nginx
ufw status
curl http://localhost:3000
curl http://localhost:3001
EOF
```

---

## 📞 Quick Reference Commands

### Check status
```bash
ssh root@46.224.48.179 'pm2 status && ufw status'
```

### Restart applications
```bash
ssh root@46.224.48.179 'pm2 restart all'
```

### View logs
```bash
ssh root@46.224.48.179 'pm2 logs --lines 50'
```

### Backup databases
```bash
./backup-databases.sh
```

---

## 🎯 TL;DR (Too Long, Didn't Read)

**Just run these commands:**

```bash
# 1. Setup everything
cd /Users/miko/Documents/web/value
./complete-server-setup.sh

# 2. Import your databases (if you have backups)
# ... (see Step 2 above)

# 3. Setup SSL
# ... (see Step 3 above)

# Done! 🎉
```

---

## 💾 Database Backups

### Create backups now:
```bash
./backup-databases.sh
```

Saves to: `./database-backups/`

### Restore backups:
See Step 2 above

---

## ✅ Success Criteria

After setup, you should have:

- ✅ 2 PM2 apps running (valuearch-app, umrah-app)
- ✅ Nginx serving both sites
- ✅ MySQL with 2 databases
- ✅ Firewall (UFW) enabled and configured
- ✅ Both websites accessible
- ✅ No security alerts from Hetzner

---

## 🎊 Ready?

Run this now:

```bash
cd /Users/miko/Documents/web/value && ./complete-server-setup.sh
```

That's it! The script does everything else automatically.

**Time to complete:** ~20 minutes  
**Difficulty:** Easy (fully automated)  
**Safety:** ✅ Uses only ONE SSH connection

Good luck! 🚀
