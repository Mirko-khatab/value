# Duplicate File Upload Solutions

If you're still getting "File already exists" errors, here are the solutions:

## 🎯 Solution 1: Check Cloud Storage Settings (Recommended)

Go to your cloud storage dashboard and check if there's a setting to:

- **Allow duplicate files**
- **Disable deduplication**
- **Allow same content with different filenames**

This is the cleanest solution.

---

## 🎯 Solution 2: Add Random Bytes to File Content

If the cloud storage checks file content hash, we can add invisible metadata to make each file unique:

```typescript
// In uploadFileToCloud function, before creating the Blob:

// Add a unique identifier as a tiny piece of data to make content unique
const uniqueId = `unique-${Date.now()}-${Math.random()}`;
const metadataBytes = new TextEncoder().encode(uniqueId);

// Create a new buffer with metadata appended
const uniqueBuffer = Buffer.concat([fileBuffer, Buffer.from(metadataBytes)]);

// Use uniqueBuffer instead of fileBuffer
const blob = new Blob([uniqueBuffer], { type: fileType });
```

⚠️ **Warning**: This modifies the file content slightly, which might affect images/videos.

---

## 🎯 Solution 3: Check Before Upload

Check if the file exists before uploading and skip if it does:

```typescript
// Before upload, check if file exists
const checkUrl = `${CLOUD_API_BASE}/file/list?search=${fileName}`;
const checkResponse = await fetch(checkUrl, {
  headers: { "X-API-Key": CLOUD_API_KEY_FULL },
});

const existingFiles = await checkResponse.json();

if (existingFiles.data?.files?.length > 0) {
  // File exists, return the existing file's info
  return {
    id: existingFiles.data.files[0].id,
    fileName: existingFiles.data.files[0].fileName,
    // ... return existing file data
  };
}

// Otherwise, upload new file
```

---

## 🎯 Solution 4: Use Current Timestamp in Milliseconds + Microseconds

Make the timestamp even more unique:

```typescript
const timestamp = Date.now();
const microseconds = performance.now().toString().replace(".", "");
const randomString = Math.random().toString(36).substring(2, 15);
const uniqueFileName = `${timestamp}-${microseconds}-${randomString}-${baseName}${fileExtension}`;
```

This makes collisions nearly impossible.

---

## 🔍 Current Implementation

The code now:

1. ✅ Generates unique filename with timestamp + random string
2. ✅ Adds `allowDuplicates=true` query parameter
3. ✅ Includes `allowDuplicates: true` in metadata

If none of these work, the cloud storage API might require configuration changes on the server side.
