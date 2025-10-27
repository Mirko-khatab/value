# 🚀 Production Deployment Checklist

## Issue: Images Not Loading in Production

**Error:** `GET https://valuearch.com/_next/image?url=%2Fapi%2Fcloud%2Ffiles%2F... 400 (Bad Request)`

**Root Cause:** Database contains proxy URLs (`/api/cloud/files/{id}`), but the proxy requires environment variables that aren't set in production.

**Solution:** Migrate to direct cloud storage URLs for better performance and reliability.

---

## Step 1: Run Database Migration (Local)

Convert all proxy URLs to direct cloud URLs:

```bash
# Install mysql2 if not already installed
npm install mysql2

# Run migration script
node scripts/migrate-to-direct-cloud-urls.js
```

Expected output:

```
🚀 Starting database migration to direct cloud URLs...
📊 Migrating galleries.image_url...
  Found 45 rows with proxy URLs
  ✓ Updated 45/45 rows...
  ✅ Complete: 45 updated, 0 skipped, 0 errors
...
🎉 Migration completed successfully!
```

---

## Step 2: Update Production Environment Variables

Add these to your production server's `.env.local` or PM2 ecosystem config:

```bash
# Cloud Storage Configuration
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d

# Public environment variables (for client-side access)
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
NEXT_PUBLIC_CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

### For PM2 (ecosystem.config.js):

```javascript
module.exports = {
  apps: [
    {
      name: "valuearch-app",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // ... your existing env vars ...
        CLOUD_API_BASE_URL: "https://cloud.mirkokawa.dev/api",
        CLOUD_API_KEY_FULL:
          "18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13",
        CLOUD_API_KEY_READ:
          "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d",
        NEXT_PUBLIC_CLOUD_API_BASE_URL: "https://cloud.mirkokawa.dev/api",
        NEXT_PUBLIC_CLOUD_API_KEY_READ:
          "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d",
      },
    },
  ],
};
```

---

## Step 3: Deploy Updated Code

```bash
# Commit changes
git add next.config.ts scripts/migrate-to-direct-cloud-urls.js
git commit -m "Fix: Migrate to direct cloud storage URLs for image loading"
git push origin main

# On production server:
ssh your-server
cd /path/to/your/app

# Pull latest changes
git pull origin main

# Install dependencies (if needed)
npm install

# Rebuild the app
npm run build

# Restart the app
pm2 restart valuearch-app

# Or if using systemd/other:
# systemctl restart your-app
```

---

## Step 4: Verify Everything Works

### Test 1: Check Environment Variables

```bash
# On production server
pm2 env valuearch-app | grep CLOUD
```

Expected output:

```
CLOUD_API_BASE_URL: https://cloud.mirkokawa.dev/api
CLOUD_API_KEY_READ: 9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
...
```

### Test 2: Check Database URLs

```sql
-- Connect to production database
mysql -u your_user -p your_database

-- Check galleries table
SELECT id, image_url FROM galleries LIMIT 5;

-- Should see URLs like:
-- https://cloud.mirkokawa.dev/api/public/9728b284.../b80fb8c1-...
```

### Test 3: Test Image Loading

```bash
# Test a direct cloud URL
curl -I "https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/b80fb8c1-32b9-491f-8534-19de3abbd715"

# Expected: HTTP/2 200
```

### Test 4: Check Browser

1. Open https://valuearch.com/projects
2. Open DevTools → Network tab
3. Filter by "images"
4. Look for URLs like:
   - ✅ `https://valuearch.com/_next/image?url=https%3A%2F%2Fcloud.mirkokawa.dev%2Fapi%2Fpublic%2F...`
   - ❌ `https://valuearch.com/_next/image?url=%2Fapi%2Fcloud%2Ffiles%2F...`

---

## Step 5: Run Migration on Production Database (if needed)

If you didn't run the migration locally and push to production DB:

```bash
# On production server
cd /path/to/your/app
node scripts/migrate-to-direct-cloud-urls.js
```

---

## Troubleshooting

### Issue: "Module not found: Can't resolve 'mysql2'"

```bash
npm install mysql2
```

### Issue: Images still not loading

1. Check browser console for errors
2. Verify next.config.ts was rebuilt:
   ```bash
   pm2 restart valuearch-app --update-env
   ```
3. Clear browser cache (Cmd+Shift+R or Ctrl+Shift+F5)
4. Check PM2 logs:
   ```bash
   pm2 logs valuearch-app --lines 50
   ```

### Issue: "Error verifying API key"

Your cloud storage server might be down or the API key is incorrect:

```bash
# Check cloud storage server status
pm2 list | grep cloud
pm2 logs cloud-app --lines 20

# If down, restart:
pm2 restart cloud-app
```

### Issue: Database connection error in migration script

Update your `.env.local` with correct database credentials:

```bash
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=dashboard
```

---

## Benefits of Direct Cloud URLs

✅ **Faster**: No proxy overhead, direct from cloud  
✅ **More Reliable**: Not dependent on Next.js server  
✅ **CORS Enabled**: Works from any domain  
✅ **Better Caching**: Browser can cache directly  
✅ **Video Streaming**: Proper seek support for videos  
✅ **Bandwidth Savings**: Served from cloud, not your server

---

## Rollback Plan (if something goes wrong)

If you need to rollback:

```sql
-- Revert galleries URLs to proxy format
UPDATE galleries
SET image_url = CONCAT('/api/cloud/files/',
  SUBSTRING_INDEX(image_url, '/', -1))
WHERE image_url LIKE '%cloud.mirkokawa.dev/api/public/%';

-- Repeat for other tables:
-- graphics, audios, teams, properties, social_media
```

Then ensure your production env vars include `CLOUD_API_KEY_READ`.

---

## Summary

1. ✅ Run migration script locally
2. ✅ Update next.config.ts (already done)
3. ✅ Add env vars to production
4. ✅ Deploy and rebuild
5. ✅ Verify images load correctly

**That's it! Your images should now load perfectly in production.** 🎉
