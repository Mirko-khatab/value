# 📚 Cloud Storage & Database Integration Guide

This guide explains how to use the cloud storage environment variables and how to properly save image URLs to your database after uploading files to the cloud.

---

## 🔑 Environment Variables Overview

Your application uses three main cloud storage environment variables:

### 1. `CLOUD_API_BASE_URL`

- **Purpose**: The base URL of your cloud storage API server
- **Value**: `https://cloud.mirkokawa.dev/api`
- **Used for**: Making all API requests to the cloud storage server
- **Access level**: Server-side only (secure)

### 2. `CLOUD_API_KEY_FULL`

- **Purpose**: Admin API key with full permissions (upload, read, delete)
- **Value**: `18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13`
- **Used for**:
  - Uploading files
  - Deleting files
  - Administrative operations
- **Access level**: Server-side only (secure - never expose to client)

### 3. `CLOUD_API_KEY_READ`

- **Purpose**: Public read-only API key for accessing files
- **Value**: `9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d`
- **Used for**:
  - Generating public URLs for images
  - Read-only file access
  - Can be exposed to client-side
- **Access level**: Public (safe to use in browser)

### 4. `CLOUD_BUCKET_ID` (Optional)

- **Purpose**: The specific bucket ID if you have multiple buckets
- **Value**: `b843b188-87d6-4c8e-b2aa-eb2ebc65c362`
- **Used for**: Multi-bucket configurations
- **Access level**: Server-side only

---

## ⚙️ Setup: Add to `.env.local`

Create or edit your `.env.local` file in the project root:

```bash
# Database Configuration
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=dashboard

# Authentication
AUTH_SECRET=your_auth_secret_here

# Cloud Storage Configuration
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

**Important Notes:**

- ✅ DO NOT use quotes around values
- ✅ DO NOT add spaces around the `=` sign
- ✅ Keep API keys secret - never commit to git
- ✅ Add `.env.local` to your `.gitignore` file

---

## 🔄 Complete Flow: Upload → Cloud → Database

Here's the complete flow of how images are uploaded and saved:

### **Step 1: User Selects Image (Client-Side)**

```typescript
// app/ui/teams/image-upload.tsx
const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Compress the image
  const compressedFile = await compressImage(file);

  // Upload to cloud storage
  const response = await uploadToCloud(compressedFile);

  // Get the public URL
  const publicUrl = response.publicUrl;
  // Example: "https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-..."

  // Notify parent component
  onUploadComplete(publicUrl);
};
```

### **Step 2: Upload to Cloud API (Client → Server)**

```typescript
// app/lib/cloud-upload-client.ts
export async function uploadToCloud(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  // Upload to your Next.js proxy endpoint
  const response = await fetch("/api/cloud/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return {
    id: data.data.id, // "550e8400-e29b-41d4-a716-446655440000"
    fileName: data.data.fileName, // "1734356789-abc123-photo.jpg"
    publicUrl: data.data.publicUrl, // "https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-..."
  };
}
```

### **Step 3: Proxy Uploads to Cloud Storage (Server-Side)**

```typescript
// app/api/cloud/upload/route.ts
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // Convert to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to cloud storage using CLOUD_API_KEY_FULL
  const result = await uploadFileToCloud(buffer, file.name, file.type);

  // Generate public URL using CLOUD_API_KEY_READ
  const publicUrl = getPublicFileUrl(result.id);

  // Return to client
  return NextResponse.json({
    success: true,
    data: {
      id: result.id,
      fileName: result.fileName,
      publicUrl: publicUrl, // ← This is what you save to database!
    },
  });
}
```

### **Step 4: Cloud Storage Upload (Server-Side)**

```typescript
// app/lib/cloud-storage.ts
export async function uploadFileToCloud(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string
): Promise<UploadResult> {
  // Uses CLOUD_API_KEY_FULL for admin access
  const CLOUD_API_BASE = process.env.CLOUD_API_BASE_URL;
  const CLOUD_API_KEY_FULL = process.env.CLOUD_API_KEY_FULL;

  const formData = new FormDataNode();
  formData.append("file", fileBuffer, {
    filename: fileName,
    contentType: fileType,
  });

  // Upload to cloud storage
  const response = await fetchNode(
    `${CLOUD_API_BASE}/file/upload?allowDuplicates=true`,
    {
      method: "POST",
      headers: {
        "X-API-Key": CLOUD_API_KEY_FULL, // ← Admin key for upload
        ...formData.getHeaders(),
      },
      body: formData,
    }
  );

  const result = await response.json();
  return result.data; // { id: "550e8400-...", fileName: "...", ... }
}
```

### **Step 5: Generate Public URL**

```typescript
// app/lib/cloud-storage-utils.ts
export function getPublicFileUrl(fileId: string): string {
  const CLOUD_API_BASE =
    process.env.NEXT_PUBLIC_CLOUD_API_BASE_URL ||
    process.env.CLOUD_API_BASE_URL ||
    "https://cloud.mirkokawa.dev/api";

  const CLOUD_API_KEY_READ =
    process.env.NEXT_PUBLIC_CLOUD_API_KEY_READ ||
    process.env.CLOUD_API_KEY_READ ||
    "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d";

  // Construct public URL with read-only key
  return `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`;
}
```

### **Step 6: Save URL to Database (Server-Side)**

This is where you insert the image URL into your database:

```typescript
// app/lib/actions.ts
export async function createTeam(prevState: TeamState, formData: FormData) {
  // Get the image URL from the form data
  // This URL was already uploaded to cloud and returned to the client
  const image_url = formData.get("image_url") as string;
  // Example: "https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-..."

  const name_ku = formData.get("name_ku");
  const position_ku = formData.get("position_ku");
  // ... other fields

  try {
    const connection = await getConnection();

    // INSERT the image URL into the database
    await connection.execute(
      `INSERT INTO teams 
       (name_ku, name_ar, name_en, position_ku, position_ar, position_en, image_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name_ku,
        name_ar,
        name_en,
        position_ku,
        position_ar,
        position_en,
        image_url, // ← Save the full public URL
      ]
    );

    await connection.commit();
    await connection.end();
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create team");
  }

  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}
```

---

## 📝 Example: Creating a New Record with Image

Here's a complete example for creating a quote with an image:

### 1. Frontend Form Component

```tsx
// app/dashboard/quote/create/page.tsx
"use client";

import { useState } from "react";
import ImageUpload from "@/app/ui/teams/image-upload";
import { createQuote } from "@/app/lib/actions";

export default function CreateQuotePage() {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <form action={createQuote}>
      {/* Text fields */}
      <input name="title_ku" placeholder="Title (Kurdish)" required />
      <input name="title_en" placeholder="Title (English)" required />
      <input name="title_ar" placeholder="Title (Arabic)" required />

      {/* Image upload component */}
      <ImageUpload
        onUploadComplete={(url) => {
          setImageUrl(url);
          console.log("Uploaded to:", url);
        }}
        onUploadError={(error) => {
          console.error("Upload failed:", error);
        }}
      />

      {/* Hidden field to store the image URL */}
      <input type="hidden" name="image_url" value={imageUrl} required />

      <button type="submit">Create Quote</button>
    </form>
  );
}
```

### 2. Server Action to Save to Database

```typescript
// app/lib/actions.ts
export async function createQuote(prevState: QuoteState, formData: FormData) {
  // Get the image URL that was uploaded to cloud
  const imageUrl = formData.get("image_url") as string;

  // Validate input
  const validatedFields = CreateQuote.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    image_url: imageUrl || "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Quote.",
    };
  }

  const { title_ku, title_en, title_ar, image_url } = validatedFields.data;

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Insert into database with the cloud storage URL
    await connection.execute(
      `INSERT INTO quotes (title_ku, title_en, title_ar, image_url) 
       VALUES (?, ?, ?, ?)`,
      [title_ku, title_en, title_ar, image_url]
    );

    await connection.commit();
    await connection.end();
  } catch (error) {
    await connection.end();
    console.error("Database Error:", error);
    return {
      errors: {},
      message: "Database Error: Failed to create quote.",
    };
  }

  revalidatePath("/dashboard/quote");
  redirect("/dashboard/quote");
}
```

### 3. Display the Image

```typescript
// app/dashboard/quote/page.tsx
export default async function QuotesPage() {
  const quotes = await fetchQuotes();

  return (
    <div>
      {quotes.map((quote) => (
        <div key={quote.id}>
          <h2>{quote.title_en}</h2>

          {/* Use the image URL directly from database */}
          <img
            src={quote.image_url}
            alt={quote.title_en}
            className="w-full h-64 object-cover"
          />
        </div>
      ))}
    </div>
  );
}
```

---

## 🗂️ Database Schema Examples

Your database tables should have an `image_url` column to store the full cloud URL:

```sql
-- Teams table
CREATE TABLE teams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name_ku VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  position_ku VARCHAR(255) NOT NULL,
  position_en VARCHAR(255) NOT NULL,
  position_ar VARCHAR(255) NOT NULL,
  image_url TEXT,  -- Stores full URL: https://cloud.mirkokawa.dev/api/public/...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table
CREATE TABLE quotes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title_ku VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  image_url TEXT,  -- Stores full URL: https://cloud.mirkokawa.dev/api/public/...
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Galleries table (for multiple images)
CREATE TABLE galleries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  parent_type ENUM('0', '1', '2') NOT NULL,  -- 0=project, 1=event, 2=product
  image_url TEXT,  -- Stores full URL: https://cloud.mirkokawa.dev/api/public/...
  alt_text VARCHAR(255),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📋 URL Format Reference

### After Upload, You Get:

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  fileName: "1734356789-abc123-photo.jpg",
  publicUrl: "https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/550e8400-e29b-41d4-a716-446655440000"
}
```

### What to Save to Database:

**✅ CORRECT** - Save the full `publicUrl`:

```
https://cloud.mirkokawa.dev/api/public/9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d/550e8400-e29b-41d4-a716-446655440000
```

**❌ WRONG** - Don't save just the file ID:

```
550e8400-e29b-41d4-a716-446655440000
```

**❌ WRONG** - Don't use old proxy format:

```
/api/cloud/files/550e8400-e29b-41d4-a716-446655440000
```

---

## 🔄 Gallery/Multiple Images Example

For tables with multiple images (like galleries), here's the complete flow:

```typescript
export async function createProject(formData: FormData) {
  const title_en = formData.get("title_en");
  const description_en = formData.get("description_en");
  // ... other fields

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert the main project record
    const [result] = (await connection.execute(
      `INSERT INTO projects (title_en, description_en) VALUES (?, ?)`,
      [title_en, description_en]
    )) as any;

    const projectId = result.insertId;

    // 2. Insert multiple gallery images
    const galleryImages: Array<{ url: string; alt: string; order: number }> =
      [];

    // Collect all gallery image URLs from form data
    let index = 0;
    while (true) {
      const image_url = formData.get(`image_url_${index}`);
      const alt_text = formData.get(`alt_text_${index}`);
      const order_index = formData.get(`order_index_${index}`);

      if (!image_url) break; // No more images

      galleryImages.push({
        url: image_url.toString(),
        alt: alt_text?.toString() || "",
        order: parseInt(order_index?.toString() || "0"),
      });

      index++;
    }

    // 3. Insert each gallery image into the database
    for (const image of galleryImages) {
      await connection.execute(
        `INSERT INTO galleries 
         (parent_id, parent_type, image_url, alt_text, order_index) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          projectId,
          0, // ParentType.Project
          image.url, // Full public URL from cloud storage
          image.alt,
          image.order,
        ]
      );
    }

    await connection.commit();
    await connection.end();
  } catch (error) {
    await connection.rollback();
    await connection.end();
    throw error;
  }

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
```

---

## 🧪 Testing Your Setup

### 1. Verify Environment Variables

```bash
node scripts/test-env-vars.js
```

Expected output:

```
✅ CLOUD_API_BASE_URL: Loaded
✅ CLOUD_API_KEY_FULL: Loaded (64 characters)
✅ CLOUD_API_KEY_READ: Loaded (64 characters)
✅ CLOUD_BUCKET_ID: Loaded
```

### 2. Test Cloud API Connection

```bash
node scripts/test-cloud-api.js
```

Expected output:

```
✅ Admin key works!
✅ Public key works!
```

### 3. Test Upload Flow

1. Start your dev server: `npm run dev`
2. Go to a form with image upload (e.g., `/dashboard/teams/create`)
3. Upload an image
4. Open browser DevTools → Network tab
5. Check the response from `/api/cloud/upload`
6. Verify it returns a `publicUrl` like:
   ```
   https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-...
   ```

### 4. Verify Database Entry

```sql
-- Check that URLs are saved correctly
SELECT id, image_url FROM teams ORDER BY id DESC LIMIT 5;
```

You should see:

```
+----+---------------------------------------------------------------------------------+
| id | image_url                                                                       |
+----+---------------------------------------------------------------------------------+
|  1 | https://cloud.mirkokawa.dev/api/public/9728b284.../550e8400-...                |
+----+---------------------------------------------------------------------------------+
```

---

## ❓ Common Issues & Solutions

### Issue 1: "CLOUD_API_KEY_FULL is not configured"

**Cause**: Environment variable not loaded

**Solution**:

```bash
# Check your .env.local file
cat .env.local | grep CLOUD_API_KEY_FULL

# Make sure it's set correctly (no quotes, no spaces)
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13

# Restart your dev server
# Press Ctrl+C then run:
npm run dev
```

### Issue 2: Upload Works but URL Not Saved to Database

**Cause**: Hidden input field not being populated

**Solution**:

```tsx
// Make sure you have a hidden input in your form:
const [imageUrl, setImageUrl] = useState("");

<ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
<input type="hidden" name="image_url" value={imageUrl} required />
```

### Issue 3: Images Not Displaying

**Cause**: Wrong URL format in database

**Solution**:

```typescript
// Always use the full publicUrl from the upload response
const response = await uploadToCloud(file);
const urlToSave = response.publicUrl; // ✅ Use this

// NOT just the ID:
const wrong = response.id; // ❌ Don't use this alone
```

### Issue 4: 401 Unauthorized Error

**Cause**: Wrong API key or API key expired

**Solution**:

```bash
# Test your API keys
node scripts/test-cloud-api.js

# If they don't work, get new keys from your cloud storage dashboard
# Update .env.local with the new keys
# Restart your dev server
```

---

## 🎯 Quick Reference

### Environment Variables

```bash
CLOUD_API_BASE_URL=https://cloud.mirkokawa.dev/api
CLOUD_BUCKET_ID=b843b188-87d6-4c8e-b2aa-eb2ebc65c362
CLOUD_API_KEY_FULL=18d6e7cce19d7c8ceadf7443db140ccb632f912f793ba9d69073d9d96ef86f13
CLOUD_API_KEY_READ=9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d
```

### Upload Flow

1. User selects file → **Client**
2. Upload to `/api/cloud/upload` → **Client**
3. Proxy to cloud storage API → **Server** (uses `CLOUD_API_KEY_FULL`)
4. Get back `publicUrl` → **Server**
5. Return `publicUrl` to client → **Client**
6. Save `publicUrl` to database → **Server Action**

### Database Insert Pattern

```typescript
const image_url = formData.get("image_url");  // Get from form
await connection.execute(
  "INSERT INTO table_name (..., image_url) VALUES (..., ?)",
  [..., image_url]  // Save to database
);
```

### Display Pattern

```tsx
<img src={record.image_url} alt="Image" />
```

---

## 📚 Related Documentation

- **Setup Guide**: `CUSTOM_CLOUD_SETUP.md`
- **Environment Variables**: `ENV_SETUP_REFERENCE.md`
- **Cloud Storage Guide**: `CLOUD_STORAGE_GUIDE.md`
- **File Upload Guide**: `FILE_UPLOAD_GUIDE.md`
- **Verification Script**: `scripts/verify-cloud-setup.js`

---

## 💡 Key Takeaways

1. ✅ **Upload happens BEFORE database insert**

   - First upload to cloud storage
   - Then save the returned URL to database

2. ✅ **Save the full public URL**

   - Not just the file ID
   - Not a proxy URL
   - The complete `publicUrl` from the response

3. ✅ **Use hidden input fields**

   - Store the uploaded URL in state
   - Pass it through a hidden input to the form action

4. ✅ **Always use HTTPS URLs**

   - Cloud URLs should start with `https://`
   - Never use relative paths like `/api/...`

5. ✅ **Test each step**
   - Run verification scripts
   - Check API responses
   - Verify database entries

---

**Need help?** Run the verification script:

```bash
node scripts/verify-cloud-setup.js
```

This will check your configuration and help diagnose any issues. 🚀








