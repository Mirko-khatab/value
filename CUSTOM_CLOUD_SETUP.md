# Custom Cloud Storage Setup Guide

This guide explains how to set up and use your custom cloud storage (https://cloud.mirkokawa.dev) with the Value application.

---

## 🔑 Environment Variables Setup

### Step 1: Update Your `.env.local` File

Your `.env.local` file should have these **exact variable names**:

```bash
# Cloud Storage API Configuration
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api

# Admin Key (value-bord) - Full Access: Create, Read, Delete
# ⚠️ KEEP SECRET - Only used on server-side
CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb

# Public Key (value-site) - Read Only Access
# ✅ Safe to expose in public URLs
CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0

# Bucket ID (Optional - for reference)
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
```

### Important Notes:

1. **Variable Names Matter**: The code looks for `CLOUD_API_KEY_FULL` and `CLOUD_API_KEY_READ`, not `value-bord` or `value-site`
2. **Admin Key Security**: `CLOUD_API_KEY_FULL` should NEVER be exposed in client-side code
3. **Public Key Safety**: `CLOUD_API_KEY_READ` is safe to use in public URLs (it's read-only)

---

## 🏗️ System Architecture

### How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
│  (Server-side operations using CLOUD_API_KEY_FULL)          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 1. Upload File
                  ↓
┌─────────────────────────────────────────────────────────────┐
│              app/api/cloud/upload/route.ts                   │
│  - Receives file from admin                                  │
│  - Converts to buffer                                        │
│  - Uploads using CLOUD_API_KEY_FULL                         │
│  - Returns fileId + public URL                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 2. POST to cloud storage
                  ↓
┌─────────────────────────────────────────────────────────────┐
│         https://cloud.mirkokawa.dev/api/file/upload         │
│  - Stores file in cloud                                      │
│  - Returns file ID (UUID)                                    │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ 3. Generate public URL
                  ↓
┌─────────────────────────────────────────────────────────────┐
│     https://cloud.mirkokawa.dev/api/public/                 │
│                 {CLOUD_API_KEY_READ}/{FILE_ID}              │
│  - Public URL with read-only key embedded                   │
│  - Safe to store in database                                │
│  - Safe to display on public website                        │
└─────────────────────────────────────────────────────────────┘
                  │
                  │ 4. Display on website
                  ↓
┌─────────────────────────────────────────────────────────────┐
│                      Public Website                          │
│  <video src="https://cloud.mirkokawa.dev/api/public/...">  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 API Endpoints Used

### 1. Upload File (Admin Only)

**Endpoint**: `POST https://cloud.mirkokawa.dev/api/file/upload`

**Headers**:
```
X-API-Key: {CLOUD_API_KEY_FULL}
Content-Type: multipart/form-data
```

**Body**:
```
file: (binary file data)
metadata: (optional JSON)
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "abc-123-file-id",
    "fileName": "video.mp4",
    "size": 13708179,
    "mimeType": "video/mp4",
    "uploadedAt": "2025-10-17T18:00:00.000Z"
  }
}
```

---

### 2. Access File (Public)

**URL Format**:
```
https://cloud.mirkokawa.dev/api/public/{CLOUD_API_KEY_READ}/{FILE_ID}
```

**Example**:
```
https://cloud.mirkokawa.dev/api/public/2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0/abc-123-file-id
```

**No headers required** - The API key is in the URL (read-only, safe)

---

### 3. Delete File (Admin Only)

**Endpoint**: `DELETE https://cloud.mirkokawa.dev/api/file/{FILE_ID}`

**Headers**:
```
X-API-Key: {CLOUD_API_KEY_FULL}
```

---

### 4. List Files (Admin or Public)

**Endpoint**: `GET https://cloud.mirkokawa.dev/api/file/list`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `search`: Search term (optional)

**Headers**:
```
X-API-Key: {CLOUD_API_KEY_FULL or CLOUD_API_KEY_READ}
```

---

## 💻 Implementation Details

### Server-Side Upload (app/lib/cloud-storage.ts)

The `uploadFileToCloud()` function:

```typescript
export async function uploadFileToCloud(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string,
  metadata?: Record<string, any>
): Promise<UploadResult>
```

**Usage**:
```typescript
const result = await uploadFileToCloud(
  fileBuffer,
  'video.mp4',
  'video/mp4',
  { uploadedBy: 'admin' }
);

console.log(result.id); // File ID to save in database
```

---

### Generate Public URL (app/lib/cloud-storage.ts)

The `getPublicFileUrl()` function:

```typescript
export function getPublicFileUrl(fileId: string): string
```

**Returns**:
```
https://cloud.mirkokawa.dev/api/public/{CLOUD_API_KEY_READ}/{FILE_ID}
```

**Usage**:
```typescript
const publicUrl = getPublicFileUrl(fileId);
// Save this URL in your database
```

---

### Client-Side Upload (app/lib/cloud-upload-client.ts)

The `uploadToCloud()` function for browser uploads:

```typescript
export async function uploadToCloud(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse>
```

**Usage**:
```typescript
const result = await uploadToCloud(file, (progress) => {
  console.log(`Upload: ${progress}%`);
});

console.log(result.publicUrl); // Ready to use public URL
```

---

## 🎯 Database Storage

### What to Store

When a file is uploaded, save these fields in your database:

```typescript
{
  id: number,              // Your database ID
  title: string,           // File/product title
  file_id: string,         // Cloud storage file ID (UUID)
  public_url: string,      // Full public URL for display
  file_type: string,       // MIME type (video/mp4, image/jpeg, etc.)
  file_size: number,       // File size in bytes
  uploaded_at: Date        // Upload timestamp
}
```

### Example Database Record

```json
{
  "id": 123,
  "title": "Product Demo Video",
  "file_id": "abc-123-file-id",
  "public_url": "https://cloud.mirkokawa.dev/api/public/2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0/abc-123-file-id",
  "file_type": "video/mp4",
  "file_size": 13708179,
  "uploaded_at": "2025-10-17T18:00:00.000Z"
}
```

---

## 🖼️ Display Files on Website

### Video

```tsx
<video controls width="640">
  <source 
    src={publicUrl} 
    type="video/mp4" 
  />
  Your browser doesn't support video playback.
</video>
```

### Image

```tsx
<img 
  src={publicUrl} 
  alt={title}
  width={640}
  height={480}
/>
```

### Audio

```tsx
<audio controls>
  <source 
    src={publicUrl} 
    type="audio/mpeg" 
  />
  Your browser doesn't support audio playback.
</audio>
```

---

## 🔄 Complete Upload Flow Example

### Admin Dashboard Upload

```typescript
// 1. User selects file in admin dashboard
const file = fileInput.files[0];

// 2. Upload using client-side function
const result = await uploadToCloud(file, (progress) => {
  console.log(`Uploading: ${progress}%`);
});

// 3. Save to database
await fetch('/api/products', {
  method: 'POST',
  body: JSON.stringify({
    title: 'New Product',
    video_url: result.publicUrl,     // Full public URL
    file_id: result.id,               // Cloud storage UUID
    file_type: result.mimeType,
    file_size: result.size,
  })
});

// 4. Done! File is now accessible on public website
```

### Display on Public Website

```typescript
// 1. Fetch product from database
const product = await db.query('SELECT * FROM products WHERE id = ?', [123]);

// 2. Display video using public URL
return (
  <div>
    <h1>{product.title}</h1>
    <video controls>
      <source src={product.video_url} type={product.file_type} />
    </video>
  </div>
);
```

---

## 🗑️ Delete Files

### From Admin Dashboard

```typescript
import { deleteCloudFile } from '@/app/lib/cloud-storage';

// Delete from cloud storage
const success = await deleteCloudFile(fileId);

if (success) {
  // Also delete from database
  await db.query('DELETE FROM products WHERE file_id = ?', [fileId]);
}
```

---

## 🛡️ Security Best Practices

### ✅ DO:

1. **Use `CLOUD_API_KEY_FULL` only on server-side**
   - Server actions (`"use server"`)
   - API routes (`app/api/**/route.ts`)
   - Never in client components

2. **Use `CLOUD_API_KEY_READ` for public URLs**
   - It's read-only, safe to expose
   - Embed in public URLs
   - Display on website

3. **Store `.env.local` securely**
   - Add to `.gitignore`
   - Never commit to Git
   - Keep backups encrypted

4. **Validate uploads**
   - Check file types
   - Limit file sizes
   - Sanitize filenames

### ❌ DON'T:

1. **Never expose `CLOUD_API_KEY_FULL` in client code**
   ```tsx
   // ❌ WRONG - Client component
   "use client"
   const API_KEY = process.env.CLOUD_API_KEY_FULL; // Exposed!
   ```

2. **Don't commit API keys to Git**
   ```bash
   # ❌ WRONG
   git add .env.local
   ```

3. **Don't use admin key in public URLs**
   ```tsx
   // ❌ WRONG
   <video src={`https://cloud.../public/${ADMIN_KEY}/${fileId}`} />
   ```

---

## 🧪 Testing Your Setup

### Test Upload

```bash
# Create test file
echo "Test content" > test.txt

# Upload via your API
curl -X POST http://localhost:3000/api/cloud/upload \
  -F "file=@test.txt"

# Should return:
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "publicUrl": "https://cloud.mirkokawa.dev/api/public/..."
#   }
# }
```

### Test Public Access

```bash
# Try accessing the public URL
curl -I {PUBLIC_URL}

# Should return:
# HTTP/1.1 200 OK
# Content-Type: text/plain
```

---

## 🆘 Troubleshooting

### Issue: "Upload failed with status 401"

**Solution**: Check that `CLOUD_API_KEY_FULL` is correctly set in `.env.local`

```bash
# Verify environment variable
echo $CLOUD_API_KEY_FULL
```

---

### Issue: "File not found (404)"

**Possible causes**:
1. Wrong file ID
2. File was deleted
3. Wrong public key

**Solution**: Verify the file ID and ensure it exists:
```bash
curl -H "X-API-Key: {CLOUD_API_KEY_READ}" \
  https://cloud.mirkokawa.dev/api/file/{FILE_ID}
```

---

### Issue: "Permission denied"

**Cause**: Using read-only key for upload/delete operations

**Solution**: Make sure server-side operations use `CLOUD_API_KEY_FULL`

---

### Issue: Environment variables not loading

**Solutions**:
1. Restart Next.js development server
2. Check file is named `.env.local` (not `.env`)
3. Verify no syntax errors in `.env.local`
4. Ensure file is in project root directory

---

## 📊 Migration from AWS S3

If you're migrating from AWS S3:

1. **Update all references**:
   ```bash
   # Old pattern
   s3://bucket/file.jpg
   
   # New pattern
   https://cloud.mirkokawa.dev/api/public/{KEY}/{ID}
   ```

2. **Update database records**:
   ```sql
   -- Add new column for cloud file IDs
   ALTER TABLE products ADD COLUMN cloud_file_id VARCHAR(255);
   
   -- Migrate URLs (if needed)
   UPDATE products 
   SET cloud_file_id = extract_id_from_url(video_url);
   ```

3. **Keep both systems running during migration**:
   - Upload new files to cloud storage
   - Keep S3 files accessible during transition
   - Gradually migrate old files

---

## 📚 Related Files

- `app/lib/cloud-storage.ts` - Server-side cloud storage functions
- `app/lib/cloud-upload-client.ts` - Client-side upload utilities
- `app/api/cloud/upload/route.ts` - Upload API endpoint
- `app/api/cloud/files/[fileId]/route.ts` - File access proxy
- `CLOUD_STORAGE_SETUP.md` - This file
- `MIGRATION_COMPLETE.md` - Migration notes

---

## ✅ Quick Checklist

Before going to production:

- [ ] `.env.local` has correct variable names
- [ ] `CLOUD_API_KEY_FULL` is kept secret
- [ ] `CLOUD_API_KEY_READ` is correctly configured
- [ ] Test file upload works
- [ ] Test file display works
- [ ] Test file deletion works
- [ ] Database stores correct URLs
- [ ] Public website can access files
- [ ] Admin dashboard can manage files
- [ ] No API keys exposed in client code
- [ ] Backup of `.env.local` stored securely

---

## 🚀 Your Setup Is Ready!

Your custom cloud storage integration is configured and ready to use!

**Admin Key**: Full access for uploads, deletes, management
**Public Key**: Read-only for displaying content safely

The system will automatically:
- Generate public URLs with embedded read-only keys
- Handle uploads from admin dashboard
- Display files on public website
- Manage file lifecycle

Need help? Check the cloud storage API documentation or contact support.

