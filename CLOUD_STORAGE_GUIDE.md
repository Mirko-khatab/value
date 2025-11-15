# 🎉 Cloud Storage Migration Complete!

## What Changed

Your application now uses **direct public URLs** from your cloud storage instead of proxying through `/api/cloud/files/`. This fixes the 521 errors and makes images load much faster!

---

## 🔑 Key Changes

### 1. Updated `cloud-storage-utils.ts`

**Before:**

```javascript
// Returned proxy URL
return `/api/cloud/files/${fileId}`;
```

**After:**

```javascript
// Returns direct cloud URL with CORS enabled
return `https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/${fileId}`;
```

### 2. Updated `cloud-storage.ts`

- Upload now returns `publicUrl` in the result
- Public URL is automatically generated after upload

### 3. Environment Variables Needed

Add these to your `.env.local` file:

```bash
# Cloud Storage Public URLs (Client-side accessible)
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
NEXT_PUBLIC_CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

---

## 🚀 How It Works Now

### Upload Flow

1. **User uploads image** → Goes to `/api/cloud/upload`
2. **Server uploads to cloud** → Gets file ID back
3. **Server generates public URL**:
   ```
   https://cloud.mirkokawa.dev/api/public/{READ_KEY}/{FILE_ID}
   ```
4. **Public URL saved to database** → Used directly in `<img>` tags

### Display Flow

```javascript
// Database stores:
image_url = "https://cloud.mirkokawa.dev/api/public/9728b284b.../43b18f35-..."

// Frontend uses directly:
<Image src={image_url} alt="..." />

// Or with helper function:
<Image src={getPublicFileUrl(fileId)} alt="..." />
```

---

## 📋 Testing

### 1. Test Cloud Storage Access

```bash
node test-cloud-storage.js
```

### 2. Test Upload API

```bash
curl -X POST "http://localhost:3000/api/cloud/upload" \
  -F "file=@test-image.jpg"
```

Expected response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fileName": "test-image.jpg",
    "publicUrl": "https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-..."
  }
}
```

### 3. Test in Browser

Open Dev Tools → Network tab → Load a project page → Check image URLs

✅ **Good**: `https://cloud.mirkokawa.dev/api/public/...`  
❌ **Old**: `/api/cloud/files/...`

---

## 🔧 Database Migration (If Needed)

If your database has old proxy URLs, you need to convert them:

```sql
-- Check current URLs
SELECT id, image_url FROM galleries LIMIT 5;

-- If they look like: /api/cloud/files/43b18f35-...
-- Convert to: https://cloud.mirkokawa.dev/api/public/9728b284.../43b18f35-...

UPDATE galleries
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)  -- Extracts UUID from /api/cloud/files/UUID
)
WHERE image_url LIKE '/api/cloud/files/%';

-- Do the same for products, graphics, audios, teams:
UPDATE graphics
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)
)
WHERE image_url LIKE '/api/cloud/files/%';

UPDATE audios
SET audio_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(audio_url, 18)
)
WHERE audio_url LIKE '/api/cloud/files/%';

UPDATE teams
SET image_url = CONCAT(
  'https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/',
  SUBSTRING(image_url, 18)
)
WHERE image_url LIKE '/api/cloud/files/%';
```

---

## 🐛 Troubleshooting

### Error: 521 - Web Server Is Down

**Problem**: Your cloud storage server is not accessible.

**Solutions**:

1. Check if cloud server is running:

   ```bash
   curl -I https://cloud.mirkokawa.dev/api
   ```

2. If using PM2, check cloud-app status:

   ```bash
   pm2 list
   pm2 logs cloud-app --lines 20
   ```

3. Restart if needed:
   ```bash
   pm2 restart cloud-app
   ```

### Images Not Loading

**Problem**: Old proxy URLs in database.

**Solution**: Run the database migration SQL above.

### CORS Errors

**Problem**: Old browser cache or proxy URLs still being used.

**Solution**:

1. Clear browser cache
2. Hard refresh (Cmd+Shift+R or Ctrl+Shift+F5)
3. Verify URLs are direct cloud URLs (not `/api/cloud/files/...`)

---

## ✅ Benefits of Direct Cloud URLs

1. **Faster Loading**: No proxy overhead, direct from cloud
2. **No 521 Errors**: Not dependent on your Next.js server
3. **CORS Enabled**: Works from any domain
4. **Cached by Browser**: Faster subsequent loads
5. **Video Streaming**: Seek support for videos
6. **Bandwidth**: Served from cloud, not your server

---

## 📦 Deploy to Production

1. **Add environment variables to ecosystem.config.js**:

   ```javascript
   env: {
     // ... existing vars ...
     NEXT_PUBLIC_CLOUD_API_BASE_URL: 'https://cloud.mirkokawa.dev/api',
     NEXT_PUBLIC_CLOUD_API_KEY_READ: '9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d'
   }
   ```

2. **Run database migration** (if needed)

3. **Test locally first**:

   ```bash
   npm run dev
   # Upload a new image
   # Verify it uses direct cloud URL
   ```

4. **Push to production**:

   ```bash
   git add .
   git commit -m "Migrate to direct cloud storage URLs"
   git push

   # On server:
   cd /root/Documents/value
   git pull
   npm run build
   pm2 restart valuearch-app
   ```

---

## 🎯 Summary

Your app now:

- ✅ Uploads files to cloud storage
- ✅ Gets back a direct public URL
- ✅ Saves that URL to database
- ✅ Uses it directly in `<img>`, `<video>`, `<audio>` tags
- ✅ No proxy needed
- ✅ Fast and reliable!

**No more 521 errors!** 🎉
