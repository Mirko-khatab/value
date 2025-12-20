# 🚀 Fresh Server Setup Guide

## What Happened

Your server was flagged by Hetzner for DDoS-like activity (too many SSH connections to port 22 of another server). You've now reset the server and need to set everything up again.

## ⚠️ Important: Avoiding Future Issues

The problem was caused by **too many rapid SSH connections** from our deployment scripts. The new setup script does EVERYTHING in **ONE single SSH session** to avoid this.

---

## 🎯 Quick Setup (3 Steps)

### Step 1: Run the Complete Setup Script

This script does EVERYTHING in one SSH session:
- Installs Node.js, MySQL, Nginx, PM2
- Configures firewall
- Clones both projects
- Builds applications
- Starts everything with PM2

```bash
cd /Users/miko/Documents/web/value
./complete-server-setup.sh
```

**Time:** ~15-20 minutes  
**SSH Connections:** Only 1 (safe!)

---

### Step 2: Import Your Databases

#### Option A: If you have database backups

```bash
# Upload backup files to server
scp dashboard-backup.sql root@46.224.48.179:/root/
scp umrah-backup.sql root@46.224.48.179:/root/

# Import them (ONE SSH session)
ssh root@46.224.48.179 << 'EOF'
mysql -u valueapp -p'ValueApp2024Pass' dashboard < /root/dashboard-backup.sql
mysql -u umrahapp -p'UmrahApp2024Pass' umrah < /root/umrah-backup.sql
echo "✅ Databases imported!"
EOF
```

#### Option B: If you need to export from old server first

If you have backups elsewhere, let me know and I'll help you get them.

---

### Step 3: Set Up SSL Certificates

After DNS is confirmed working:

```bash
ssh root@46.224.48.179 << 'EOF'
certbot --nginx -d valuearch.com -d www.valuearch.com --non-interactive --agree-tos --email admin@valuearch.com --redirect
certbot --nginx -d umrah.mirkokawa.dev --non-interactive --agree-tos --email admin@mirkokawa.dev --redirect
pm2 restart all
EOF
```

---

## 🔒 Security Improvements

The new setup includes:

### 1. Firewall (UFW)
```
✅ Port 22 (SSH) - Only from your IP
✅ Port 80 (HTTP)
✅ Port 443 (HTTPS)
✅ Port 3000 (ValueArch)
✅ Port 3001 (Umrah)
❌ All other ports BLOCKED
```

### 2. Better Deployment Process

**OLD WAY (caused the problem):**
```bash
./deploy-umrah.sh    # Creates SSH connection
./deploy-value.sh    # Creates SSH connection
./some-other-script  # Creates SSH connection
# Many rapid connections = looks like attack!
```

**NEW WAY (safe):**
```bash
# For future updates, use git directly ON the server
ssh root@46.224.48.179 << 'EOF'
  cd /root/Documents/value && git pull && npm install && npm run build && pm2 restart valuearch-app
  cd /root/Documents/umrah && git pull && npm install && npm run build && pm2 restart umrah-app
EOF
```

One SSH session, multiple commands = SAFE!

---

## 📊 After Setup - Verification

Check everything is running:

```bash
ssh root@46.224.48.179 << 'EOF'
echo "PM2 Apps:"
pm2 status

echo -e "\nNginx:"
systemctl status nginx --no-pager | head -5

echo -e "\nMySQL:"
systemctl status mysql --no-pager | head -5

echo -e "\nFirewall:"
ufw status

echo -e "\nTest URLs:"
curl -I http://localhost:3000 | head -3
curl -I http://localhost:3001 | head -3
EOF
```

Expected output:
```
✅ 2 PM2 apps running
✅ Nginx active
✅ MySQL active
✅ Firewall active
✅ Both apps responding
```

---

## 🌐 Test Your Websites

After setup completes:

- **ValueArch:** http://valuearch.com (http://46.224.48.179:3000)
- **Umrah:** http://umrah.mirkokawa.dev (http://46.224.48.179:3001)

After SSL:
- **ValueArch:** https://valuearch.com
- **Umrah:** https://umrah.mirkokawa.dev

---

## 🚨 If You Need to Update Projects in Future

### Safe Method (Single SSH Session)

```bash
ssh root@46.224.48.179 << 'EOF'
# Update both projects
cd /root/Documents/value
git pull origin main
npm install
npm run build
pm2 restart valuearch-app

cd /root/Documents/umrah  
git pull origin main
npm install
npm run build
pm2 restart umrah-app

pm2 status
EOF
```

### What NOT to Do

❌ Don't run multiple deployment scripts rapidly  
❌ Don't create many SSH connections in short time  
❌ Don't run automated scripts every few minutes

---

## 📋 Checklist

Before running the setup:

- [ ] Server is fresh/reset
- [ ] You can SSH into the server: `ssh root@46.224.48.179`
- [ ] You have your database backups ready (or know where they are)
- [ ] DNS is pointing to 46.224.48.179 for both domains

Run the setup:

- [ ] Run `./complete-server-setup.sh`
- [ ] Wait for completion (~15-20 minutes)
- [ ] Import databases
- [ ] Set up SSL certificates
- [ ] Test both websites

---

## 🆘 Troubleshooting

### Script fails during npm install

```bash
# SSH to server and run manually:
ssh root@46.224.48.179
cd /root/Documents/value
rm -rf node_modules package-lock.json
npm install
```

### Applications won't start

```bash
ssh root@46.224.48.179
pm2 logs
# Check for errors
```

### Can't access websites

```bash
# Check if apps are running
ssh root@46.224.48.179 'pm2 status'

# Check firewall
ssh root@46.224.48.179 'ufw status'

# Test locally
ssh root@46.224.48.179 'curl http://localhost:3000'
```

---

## 📞 Need Help?

The setup script does everything automatically. If something fails:

1. Read the error message
2. Check which step failed
3. SSH to server and run that step manually
4. Let me know which step failed

---

## ✅ Summary

**Run this ONE command:**
```bash
cd /Users/miko/Documents/web/value && ./complete-server-setup.sh
```

**Then:**
1. Import your databases
2. Set up SSL
3. Test websites
4. Done! 🎉

**Future updates:**
Use single SSH sessions with multiple commands (shown above)

---

**Total time:** ~20 minutes  
**Safety:** ✅ One SSH connection = No DDoS alerts
