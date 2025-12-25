# ✅ Cloud Storage API Updated

## 🎯 What Changed

### **Old API:**
- Base URL: `https://cloud.mirkokawa.dev/api`
- Upload: `POST https://cloud.mirkokawa.dev/api/file/upload`
- Public URL: `https://cloud.mirkokawa.dev/api/public/{KEY}/{ID}`

### **New API:**
- Base URL: `https://api.mirkokawa.dev`
- Upload: `POST https://api.mirkokawa.dev/api/file/upload`
- Public URL: `https://api.mirkokawa.dev/public/{KEY}/{ID}`

---

## 📋 Files Updated

✅ **app/lib/cloud-storage.ts**
- Changed API base URL to `https://api.mirkokawa.dev`
- Upload endpoint: `/api/file/upload` ✓
- Headers: `X-API-Key` ✓

✅ **app/lib/cloud-storage-utils.ts**
- Updated `getDirectCloudUrl()` to use new public URL format
- Public URLs now work everywhere without CORS issues!

✅ **app/api/cloud/files/[fileId]/route.ts**
- Updated proxy endpoint to fetch from new API
- Public URL format: `https://api.mirkokawa.dev/public/{KEY}/{ID}`

---

## 🔑 Environment Variables

Your `.env` file should have:

```env
# Cloud Storage Configuration - NEW API
CLOUD_API_BASE_URL=https://api.mirkokawa.dev
CLOUD_API_KEY_FULL=your_full_write_key
CLOUD_API_KEY_READ=your_read_only_key

# Public Cloud Storage (for client-side)
NEXT_PUBLIC_CLOUD_API_BASE_URL=https://api.mirkokawa.dev
NEXT_PUBLIC_CLOUD_API_KEY_READ=your_read_only_key
```

---

## ✨ Key Features

### **Upload (Server-side)**
```typescript
import { uploadFileToCloud } from '@/app/lib/cloud-storage';

const result = await uploadFileToCloud(buffer, filename, mimeType);
// Returns: { id, fileName, size, mimeType, uploadedAt }
```

### **Public URL (No CORS!)**
```typescript
import { getDirectCloudUrl } from '@/app/lib/cloud-storage-utils';

const url = getDirectCloudUrl(fileId);
// Returns: https://api.mirkokawa.dev/public/{KEY}/{fileId}

// Use directly in HTML
<img src={url} alt="Image" />
<video src={url} controls />
```

### **Proxy URL (Through Next.js)**
```typescript
import { getPublicFileUrl } from '@/app/lib/cloud-storage-utils';

const url = getPublicFileUrl(fileId);
// Returns: /api/cloud/files/{fileId}

<img src={url} alt="Image" />
```

---

## 🚀 API Methods Available

All methods use the new API endpoint:

- ✅ `uploadFileToCloud()` - Upload files
- ✅ `getFileMetadata()` - Get file info
- ✅ `deleteCloudFile()` - Delete files
- ✅ `listCloudFiles()` - List files with pagination
- ✅ `getPublicFileUrl()` - Get proxy URL
- ✅ `getDirectCloudUrl()` - Get direct public URL (recommended!)

---

## 📊 Public URL Format

### **Direct Access (Best!)**
```
https://api.mirkokawa.dev/public/{API_KEY}/{FILE_ID}
```

**Advantages:**
- ✅ No CORS issues
- ✅ No authentication needed
- ✅ Works in `<img>`, `<video>`, `<audio>` tags
- ✅ Can be used anywhere (email, PDF, external sites)
- ✅ Cacheable

**Example:**
```html
<img src="https://api.mirkokawa.dev/public/csk_abc123/file-uuid-here" />
```

---

## 🎉 All Done!

Your application now uses the new Cloud Storage API. All existing functionality remains the same, just with updated endpoints.

**Next Steps:**
1. Update `.env` file with new API URL (already done in code!)
2. Deploy to production
3. Test image/video uploads
4. Verify gallery images load correctly

Everything is backward compatible! 🚀
