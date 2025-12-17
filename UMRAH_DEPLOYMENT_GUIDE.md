# Umrah Project - Deployment Guide

## 🚀 How to Deploy Updates to Production

After making changes to your Umrah project locally and pushing to GitHub, use this guide to deploy to the production server.

---

## Quick Deployment (Recommended)

### 1. Push Your Changes to GitHub

```bash
cd /path/to/your/umrah-project
git add .
git commit -m "Your commit message"
git push origin main  # or master
```

### 2. Run the Deployment Script

From the Value project directory (where the script is saved):

```bash
cd /Users/miko/Documents/web/value
./deploy-umrah.sh
```

That's it! The script will:
- ✅ Connect to the server
- ✅ Pull latest changes from GitHub
- ✅ Install any new dependencies
- ✅ Build the application
- ✅ Restart PM2
- ✅ Show you the status

---

## Manual Deployment (Alternative Method)

If you prefer to deploy manually, here are the commands:

```bash
# Connect to server
ssh root@46.224.48.179

# Navigate to project
cd /root/Documents/umrah

# Pull latest changes
git pull origin main  # or master

# Install dependencies (if package.json changed)
npm install

# Build application
npm run build

# Restart PM2
pm2 restart umrah-app

# Check status
pm2 status
pm2 logs umrah-app --lines 30
```

---

## Deployment Workflow

### Full Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOCAL DEVELOPMENT                                        │
│    - Make changes to code                                   │
│    - Test locally: npm run dev                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. COMMIT & PUSH                                            │
│    - git add .                                              │
│    - git commit -m "message"                                │
│    - git push origin main                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. DEPLOY TO SERVER                                         │
│    - ./deploy-umrah.sh                                      │
│    OR manually via SSH                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. VERIFY                                                   │
│    - Visit https://umrah.mirkokawa.dev                      │
│    - Check that changes are live                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Common Deployment Scenarios

### Scenario 1: Code Changes Only

If you only changed code files (no new dependencies):

```bash
./deploy-umrah.sh
```

### Scenario 2: Added New npm Packages

If you added new packages to package.json:

```bash
./deploy-umrah.sh
# The script automatically runs npm install
```

### Scenario 3: Database Changes

If you changed database schema:

```bash
# 1. Deploy code first
./deploy-umrah.sh

# 2. Then run database migrations
ssh root@46.224.48.179
mysql -u umrahapp -p'UmrahApp2024Pass' umrah < /path/to/migration.sql
```

### Scenario 4: Environment Variable Changes

If you need to update environment variables:

```bash
ssh root@46.224.48.179

# Edit .env file
nano /root/Documents/umrah/.env

# Update the variable, then restart
pm2 restart umrah-app
```

---

## Troubleshooting

### Build Fails

```bash
# Check the build errors
ssh root@46.224.48.179
cd /root/Documents/umrah
npm run build

# Common fixes:
rm -rf .next node_modules
npm install
npm run build
```

### Git Pull Conflicts

```bash
ssh root@46.224.48.179
cd /root/Documents/umrah

# See what's causing the conflict
git status

# Option 1: Stash local changes and pull
git stash
git pull origin main
git stash pop

# Option 2: Hard reset (⚠️ loses local server changes)
git fetch origin
git reset --hard origin/main
```

### PM2 Won't Restart

```bash
ssh root@46.224.48.179

# Stop and start instead of restart
pm2 stop umrah-app
pm2 start umrah-app

# Or delete and recreate
pm2 delete umrah-app
pm2 start ecosystem.config.js
pm2 save
```

### Application Not Responding

```bash
ssh root@46.224.48.179

# Check PM2 logs for errors
pm2 logs umrah-app

# Check if port is in use
netstat -tulpn | grep 3001

# Restart Nginx
systemctl restart nginx

# Check Nginx logs
tail -f /var/log/nginx/umrah.mirkokawa.dev.error.log
```

---

## Verification Checklist

After deployment, verify these:

- [ ] Homepage loads: https://umrah.mirkokawa.dev
- [ ] No console errors in browser
- [ ] API endpoints working
- [ ] PM2 shows "online" status
- [ ] No errors in PM2 logs
- [ ] Database connection working

### Quick Tests

```bash
# Test homepage
curl -I https://umrah.mirkokawa.dev

# Test API
curl https://umrah.mirkokawa.dev/api/products/public | head

# Check PM2 status
ssh root@46.224.48.179 'pm2 status'

# Check recent logs
ssh root@46.224.48.179 'pm2 logs umrah-app --lines 30 --nostream'
```

---

## Rollback (Emergency)

If deployment breaks something, rollback to previous version:

```bash
ssh root@46.224.48.179
cd /root/Documents/umrah

# See recent commits
git log --oneline -5

# Rollback to previous commit
git reset --hard <commit-hash>

# Rebuild
npm run build
pm2 restart umrah-app
```

---

## Deployment Best Practices

### Before Deploying

1. ✅ Test locally first (`npm run dev`)
2. ✅ Check for TypeScript errors (`npm run build` locally)
3. ✅ Commit with meaningful messages
4. ✅ Push to GitHub successfully
5. ✅ Consider deploying during low-traffic times

### During Deployment

1. ✅ Use the automated script when possible
2. ✅ Watch for build errors
3. ✅ Check PM2 logs after restart
4. ✅ Test the site immediately

### After Deployment

1. ✅ Verify all pages load
2. ✅ Test critical features
3. ✅ Check browser console for errors
4. ✅ Monitor PM2 logs for 5-10 minutes
5. ✅ Clear Cloudflare cache if needed

---

## Cloudflare Cache Clearing

If you don't see your changes immediately (Cloudflare caching):

### Option 1: Wait (Recommended)
Cloudflare will automatically update cache within a few minutes.

### Option 2: Purge Cache (Manual)
1. Go to Cloudflare Dashboard
2. Select your domain: mirkokawa.dev
3. Go to "Caching" → "Configuration"
4. Click "Purge Everything"

### Option 3: Development Mode
Enable Development Mode in Cloudflare (3 hours bypass):
1. Cloudflare Dashboard → Quick Actions
2. Toggle "Development Mode" ON
3. Deploy your changes
4. Test
5. Toggle OFF when done

---

## Quick Reference Commands

### Deploy Changes
```bash
./deploy-umrah.sh
```

### View Logs
```bash
ssh root@46.224.48.179 'pm2 logs umrah-app'
```

### Restart Application
```bash
ssh root@46.224.48.179 'pm2 restart umrah-app'
```

### Check Status
```bash
ssh root@46.224.48.179 'pm2 status'
```

### View Recent Commits
```bash
ssh root@46.224.48.179 'cd /root/Documents/umrah && git log --oneline -10'
```

---

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs umrah-app`
2. Check Nginx logs: `tail -f /var/log/nginx/umrah.mirkokawa.dev.error.log`
3. Verify database connection: `mysql -u umrahapp -p'UmrahApp2024Pass' umrah`
4. Check server resources: `pm2 monit`

---

## Summary

✅ **Simple Deployment:** Just run `./deploy-umrah.sh`  
✅ **Automatic:** Script handles everything  
✅ **Safe:** Checks for errors at each step  
✅ **Fast:** Updates live in ~30 seconds  

**Your workflow:**
1. Make changes locally
2. Push to GitHub
3. Run `./deploy-umrah.sh`
4. Done! 🎉
