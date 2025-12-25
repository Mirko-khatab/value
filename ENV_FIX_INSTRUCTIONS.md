# 🔧 Fix .env.local Cloud Storage URL

## ⚠️ IMPORTANT: Wrong URL in your .env.local!

Your current `.env.local` has:
```env
CLOUD_API_BASE_URL=https://api.mirkokawa.dev/api  ❌ WRONG!
```

**This should be:**
```env
CLOUD_API_BASE_URL=https://api.mirkokawa.dev  ✅ CORRECT!
```

**Remove the `/api` at the end!** The code already adds it.

---

## 📋 How to Fix

### **Option 1: Edit Manually**

1. Open `.env.local` in your editor
2. Find the lines with `CLOUD_API_BASE_URL`
3. Remove `/api` from the end

**Change FROM:**
```env
CLOUD_API_BASE_URL=https://api.mirkokawa.dev/api
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://api.mirkokawa.dev/api
```

**Change TO:**
```env
CLOUD_API_BASE_URL=https://api.mirkokawa.dev
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://api.mirkokawa.dev
```

4. Save the file
5. Restart dev server (Ctrl+C, then `npm run dev`)

---

### **Option 2: Run This Command**

```bash
cd /Users/miko/Documents/web/value

# Backup current .env.local
cp .env.local .env.local.backup

# Fix the URLs
sed -i '' 's|https://api.mirkokawa.dev/api|https://api.mirkokawa.dev|g' .env.local

echo "✅ Fixed! Now restart: npm run dev"
```

---

## ✅ What's Fixed

After this fix:
- ✅ File uploads will work
- ✅ Images will upload to correct API endpoint
- ✅ Preview images will show correctly
- ✅ No more "405 Method Not Allowed" errors

---

## 🧪 Test After Fix

1. Restart dev server
2. Go to http://localhost:3000/dashboard/projects/create
3. Try uploading images
4. You should see:
   - ✅ Upload progress
   - ✅ Image previews
   - ✅ Success messages

---

## 📚 Why This Happened

The code does this:
```typescript
const CLOUD_API_BASE = process.env.CLOUD_API_BASE_URL || "https://api.mirkokawa.dev";
// Then later adds: `${CLOUD_API_BASE}/file/upload`
// Results in: https://api.mirkokawa.dev/file/upload ✅
```

But your .env had `/api` at the end, so it became:
```
https://api.mirkokawa.dev/api/file/upload ❌ WRONG!
```

The correct endpoint is:
```
https://api.mirkokawa.dev/api/file/upload ✅ CORRECT!
```

---

**Fix this now and restart your dev server!** 🚀
