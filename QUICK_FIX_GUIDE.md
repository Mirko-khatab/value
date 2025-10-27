# 🚨 QUICK FIX: Images Not Loading in Production

**Problem:** Images showing 400 errors in production
**Status:** ✅ Local database migrated (59 URLs updated)
**Next:** Deploy to production

---

## 🚀 Deploy to Production (3 Steps)

### Step 1: Push Code Changes

```bash
git add next.config.ts scripts/
git commit -m "Fix: Enable direct cloud storage URLs for images"
git push origin main
```

### Step 2: Update Production Server

```bash
# SSH to your production server
ssh your-server

# Navigate to your app
cd /path/to/valuearch

# Pull changes
git pull origin main

# Rebuild
npm run build

# Restart
pm2 restart valuearch-app
```

### Step 3: Migrate Production Database

**Option A: Run from production server**

```bash
# On production server
node scripts/migrate-to-direct-cloud-urls.js
```

**Option B: Run from local with SSH tunnel**

```bash
# On your local machine
# Create SSH tunnel to production database
ssh -L 3307:localhost:3306 your-server

# In another terminal, edit and run:
# 1. Edit scripts/migrate-production-db.js with prod credentials
# 2. Run: node scripts/migrate-production-db.js
```

**Option C: Run SQL directly**

```sql
-- Connect to production MySQL
mysql -u your_user -p your_database

-- Migrate galleries
UPDATE galleries
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)
)
WHERE image_url LIKE '/api/cloud/files/%';

-- Migrate graphics
UPDATE graphics
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)
)
WHERE image_url LIKE '/api/cloud/files/%';

-- Migrate audios
UPDATE audios
SET audio_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(audio_url, 18)
)
WHERE audio_url LIKE '/api/cloud/files/%';

-- Migrate teams
UPDATE teams
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)
)
WHERE image_url LIKE '/api/cloud/files/%';

-- Verify
SELECT COUNT(*) FROM galleries WHERE image_url LIKE '%cloud.mirkokawa.dev%';
```

---

## ✅ Verify It Works

1. **Clear browser cache**: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows)

2. **Visit your site**: https://valuearch.com/projects

3. **Check DevTools → Network**:

   - ✅ Should see: `https://cloud.mirkokawa.dev/api/public/...`
   - ❌ NOT: `/api/cloud/files/...`

4. **Test image loading**:
   ```bash
   curl -I "https://valuearch.com/_next/image?url=https%3A%2F%2Fcloud.mirkokawa.dev%2Fapi%2Fpublic%2F9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d%2Fb80fb8c1-32b9-491f-8534-19de3abbd715&w=1080&q=75"
   ```
   Should return `HTTP/2 200`

---

## 📊 What Was Changed

### Local (Already Done ✅)

- ✅ `next.config.ts` - Added `cloud.mirkokawa.dev` to allowed domains
- ✅ Local database - Migrated 59 URLs to direct cloud format
- ✅ Created migration scripts

### Production (To Do)

- [ ] Deploy code changes
- [ ] Migrate production database
- [ ] Test image loading

---

## 🐛 Troubleshooting

### Images still 400 after migration:

```bash
# Check if migration ran on production DB
ssh your-server
mysql -u user -p database -e "SELECT image_url FROM galleries LIMIT 5;"

# Should show: https://cloud.mirkokawa.dev/api/public/...
# Not: /api/cloud/files/...
```

### "Cloud storage unavailable" in logs:

```bash
# Check if cloud storage server is running
ssh your-cloud-server
pm2 list | grep cloud
pm2 restart cloud-app
```

### Next.js not finding images:

```bash
# Rebuild Next.js (config changed)
cd /path/to/valuearch
npm run build
pm2 restart valuearch-app
```

---

## 🎯 Quick Reference

**Direct Cloud URL format:**

```
https://cloud.mirkokawa.dev/api/public/{READ_KEY}/{FILE_ID}
```

**Old proxy URL format (deprecated):**

```
/api/cloud/files/{FILE_ID}
```

**Read Key:**

```
9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

---

## 💡 Why This Fix Works

1. **Before**: Images used `/api/cloud/files/` proxy → Required server to fetch → Slow, can fail
2. **After**: Images use direct cloud URLs → Browser loads directly → Fast, reliable
3. **Next.js Config**: Now allows `cloud.mirkokawa.dev` domain for image optimization
4. **Database**: All 59 image/audio URLs now point directly to cloud storage

---

## ⏱️ Estimated Time

- Code deployment: 2 minutes
- Database migration: 1 minute
- Testing: 2 minutes

**Total: ~5 minutes** to fix completely! 🚀

---

## 📞 Need Help?

- Check logs: `pm2 logs valuearch-app`
- Check database: `mysql -u user -p -e "USE dashboard; SELECT * FROM galleries LIMIT 5;"`
- Test cloud: `curl -I https://cloud.mirkokawa.dev/api`

Good luck! 🍀
