# 📁 File Upload System - Complete Guide

This guide explains how the file upload system works in the Value Architecture application, from frontend to cloud storage to database.

---

## 🏗️ Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐      ┌──────────┐
│   Frontend  │ ───> │  Next.js API │ ───> │ Cloud API   │ ───> │  Files   │
│  (Browser)  │      │    Route     │      │   Server    │      │  Storage │
└─────────────┘      └──────────────┘      └─────────────┘      └──────────┘
       │                     │                      │
       │                     ▼                      │
       │              ┌──────────────┐              │
       │              │    MySQL     │ <────────────┘
       └─────────────>│   Database   │
                      └──────────────┘
```

### Components:

1. **Frontend Form** - User selects and submits file
2. **Next.js API Route** - Receives file, forwards to cloud
3. **Cloud Storage API** - Stores file, returns metadata
4. **MySQL Database** - Stores file URL and metadata
5. **File Retrieval** - Serves files to users

---

## 📋 Step-by-Step Process

### **Step 1: Frontend - File Selection**

The user selects a file using an HTML form:

```tsx
// Example: File Upload Form Component
"use client";

import { useState } from "react";

export default function FileUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send to Next.js API route
      const response = await fetch("/api/cloud/upload", {
        method: "POST",
        body: formData, // Send as multipart/form-data
      });

      const result = await response.json();

      if (result.success) {
        console.log("File uploaded!", result.data);
        setUploadedUrl(result.data.publicUrl);

        // Now save to database with the URL
        await saveToDatabase(result.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const saveToDatabase = async (fileData: any) => {
    // Save file URL to database via server action
    const response = await fetch("/api/documents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: file?.name,
        fileUrl: fileData.publicUrl,
        fileId: fileData.id,
        fileSize: fileData.size,
        mimeType: fileData.mimeType,
      }),
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </button>
      {uploadedUrl && <p>File URL: {uploadedUrl}</p>}
    </div>
  );
}
```

**Key Points:**

- Use `FormData` to send files
- Files are sent as `multipart/form-data`
- Get file URL from response
- Save URL to database

---

### **Step 2: Next.js API Route - Receive & Forward**

Location: `app/api/cloud/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { uploadFileToCloud } from "@/app/lib/cloud-storage";

export async function POST(request: NextRequest) {
  try {
    // Get FormData from request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Convert File to Buffer for server-side processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to cloud storage
    const uploadResult = await uploadFileToCloud(buffer, file.name, file.type, {
      uploadedBy: "user-id", // Add user context
      description: "Document upload",
    });

    // Return success with file URL
    return NextResponse.json(
      {
        success: true,
        data: {
          id: uploadResult.id,
          fileName: uploadResult.fileName,
          size: uploadResult.size,
          mimeType: uploadResult.mimeType,
          uploadedAt: uploadResult.uploadedAt,
          publicUrl: `/api/cloud/files/${uploadResult.id}`,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Upload failed" },
      { status: 500 }
    );
  }
}
```

**Key Points:**

- Receives `FormData` from frontend
- Extracts file and converts to `Buffer`
- Calls cloud storage function
- Returns file metadata including URL

---

### **Step 3: Cloud Storage Integration**

Location: `app/lib/cloud-storage.ts`

```typescript
"use server";

import FormDataNode from "form-data";
import fetchNode from "node-fetch";

const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "http://localhost:1200/api";
const CLOUD_API_KEY_FULL = process.env.CLOUD_API_KEY_FULL || "";

export interface UploadResult {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export async function uploadFileToCloud(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string,
  metadata?: Record<string, any>
): Promise<UploadResult> {
  try {
    // Validate API key
    if (!CLOUD_API_KEY_FULL) {
      throw new Error("Cloud API key not configured");
    }

    // Create FormData (Node.js compatible)
    const formData = new FormDataNode();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.includes(".")
      ? fileName.substring(fileName.lastIndexOf("."))
      : "";
    const baseName = fileName.includes(".")
      ? fileName.substring(0, fileName.lastIndexOf("."))
      : fileName;
    const uniqueFileName = `${timestamp}-${randomString}-${baseName}${fileExtension}`;

    // Append file to FormData
    formData.append("file", fileBuffer, {
      filename: uniqueFileName,
      contentType: fileType,
    });

    // Append metadata if provided
    if (metadata) {
      formData.append(
        "metadata",
        JSON.stringify({
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          allowDuplicates: true,
          ...metadata,
        })
      );
    }

    // Upload to cloud API
    const uploadUrl = `${CLOUD_API_BASE}/file/upload?allowDuplicates=true`;

    const response = await fetchNode(uploadUrl, {
      method: "POST",
      headers: {
        "X-API-Key": CLOUD_API_KEY_FULL,
        ...formData.getHeaders(), // Important: sets Content-Type with boundary
      },
      body: formData,
    });

    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloud upload failed:", {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Invalid response from cloud storage");
    }

    return result.data;
  } catch (error) {
    console.error("Error uploading to cloud:", error);
    throw error;
  }
}
```

**Key Points:**

- Uses `form-data` package for Node.js
- Generates unique filename with timestamp
- Sends to cloud API with authentication
- Returns file metadata with ID

---

### **Step 4: Database Storage**

After getting the file URL, save it to MySQL:

```typescript
// app/lib/actions.ts
"use server";

import { executeQuery } from "@/app/lib/db";

export async function createDocument(formData: {
  title: string;
  fileUrl: string;
  fileId: string;
  fileSize: number;
  mimeType: string;
  userId: string;
}) {
  try {
    const query = `
      INSERT INTO documents (
        title, 
        file_url, 
        file_id, 
        file_size, 
        mime_type, 
        user_id,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;

    const result = await executeQuery(query, [
      formData.title,
      formData.fileUrl,
      formData.fileId,
      formData.fileSize,
      formData.mimeType,
      formData.userId,
    ]);

    return {
      success: true,
      documentId: result.insertId,
    };
  } catch (error) {
    console.error("Database error:", error);
    return {
      success: false,
      error: "Failed to save document",
    };
  }
}
```

**Database Schema Example:**

```sql
CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_id VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100),
  user_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### **Step 5: File Retrieval**

Serve files back to users:

```typescript
// app/api/cloud/files/[fileId]/route.ts
import { NextRequest, NextResponse } from "next/server";

const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "http://localhost:1200/api";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId;

    // Fetch file from cloud storage
    const response = await fetch(
      `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`,
      {
        headers: {
          Referer: request.headers.get("referer") || "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Stream file back to client
    const blob = await response.blob();

    return new NextResponse(blob, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/octet-stream",
        "Content-Disposition":
          response.headers.get("content-disposition") || "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 }
    );
  }
}
```

---

## 🔐 Environment Variables

Create `.env.local` file:

```bash
# Cloud Storage Configuration
CLOUD_API_BASE_URL=http://localhost:1200/api
CLOUD_API_KEY_FULL=csk_your_full_access_key_here
CLOUD_API_KEY_READ=csk_your_read_only_key_here

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=admin
MYSQL_PASSWORD="admin123@#!123"
MYSQL_DATABASE=valuearch_db
```

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "form-data": "^4.0.0",
    "node-fetch": "^2.7.0",
    "mysql2": "^3.6.0"
  },
  "devDependencies": {
    "@types/node-fetch": "^2.6.11"
  }
}
```

Install with:

```bash
npm install form-data node-fetch mysql2
npm install --save-dev @types/node-fetch
```

---

## 🎯 Complete Example: Upload Image

```tsx
// app/components/ImageUploader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    try {
      // 1. Upload to cloud
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/cloud/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error("Upload failed");
      }

      // 2. Save to database
      const dbResponse = await fetch("/api/images/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: uploadResult.data.publicUrl,
          fileId: uploadResult.data.id,
          fileSize: uploadResult.data.size,
          mimeType: uploadResult.data.mimeType,
        }),
      });

      const dbResult = await dbResponse.json();

      if (dbResult.success) {
        setImageUrl(uploadResult.data.publicUrl);
        alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="mb-4"
      />

      {preview && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Uploaded Image:</p>
          <Image
            src={imageUrl}
            alt="Uploaded"
            width={400}
            height={300}
            className="rounded"
          />
          <p className="text-xs text-gray-500 mt-2">URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Upload Limits

Current configuration supports:

- **Max file size**: 2GB (2048MB)
- **Supported file types**: All types
- **Concurrent uploads**: Multiple files

Configured in:

1. **Nginx**: `client_max_body_size 2G;`
2. **Cloud API**: No specific limit (uses Nginx limit)
3. **Next.js**: No specific limit (uses Nginx limit)

---

## 🔍 Troubleshooting

### Upload fails with 413 error

- Check Nginx `client_max_body_size`
- Increase in `/etc/nginx/sites-available/your-site.conf`

### Upload fails with "No file provided"

- Ensure FormData is correctly formatted
- Check file is appended with key "file"

### File not accessible after upload

- Check cloud storage database connection
- Verify API keys are correct
- Check file exists in storage directory

### Slow uploads

- Check server bandwidth
- Consider compression for large files
- Check if Cloudflare proxy is enabled (100MB limit)

---

## 📚 Additional Resources

- [Next.js File Upload](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#formdata)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [Node.js form-data](https://www.npmjs.com/package/form-data)
- [MySQL Connection Pooling](https://www.npmjs.com/package/mysql2#using-connection-pools)

---

## ✅ Checklist

Before deploying:

- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Nginx limits increased
- [ ] API keys secured
- [ ] Error handling implemented
- [ ] File type validation added
- [ ] User authentication implemented
- [ ] File size limits tested

---

**Created by**: Your Development Team  
**Last Updated**: December 2024  
**Version**: 1.0














