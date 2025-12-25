"use server";

// Import form-data for proper multipart/form-data handling in Node.js
import FormDataNode from "form-data";
// Use node-fetch for better form-data compatibility
import fetchNode from "node-fetch";

// Cloud Storage API Configuration
// New API: https://api.mirkokawa.dev/api
const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "https://api.mirkokawa.dev/api";
const CLOUD_API_KEY_FULL = process.env.CLOUD_API_KEY_FULL || "";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

export interface UploadResult {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface FileMetadata {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  downloadCount: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Upload a file to cloud storage from a buffer
 * This is the main upload function used by the application
 */
export async function uploadFileToCloud(
  fileBuffer: Buffer,
  fileName: string,
  fileType: string,
  metadata?: Record<string, any>
): Promise<UploadResult> {
  try {
    // Check if API key is configured
    if (!CLOUD_API_KEY_FULL) {
      throw new Error(
        "Cloud storage API key is not configured. Please set CLOUD_API_KEY_FULL environment variable."
      );
    }

    // Use form-data package for proper multipart/form-data in Node.js
    // This ensures compatibility with multer on the server side
    const formData = new FormDataNode();

    // Generate a unique filename to avoid duplicates
    // Format: timestamp-randomstring-originalname.ext
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.includes(".")
      ? fileName.substring(fileName.lastIndexOf("."))
      : "";
    const baseName = fileName.includes(".")
      ? fileName.substring(0, fileName.lastIndexOf("."))
      : fileName;
    const uniqueFileName = `${timestamp}-${randomString}-${baseName}${fileExtension}`;

    // Append the buffer directly to form-data
    // form-data package accepts Buffer directly with options
    formData.append("file", fileBuffer, {
      filename: uniqueFileName,
      contentType: fileType,
    });

    // Add metadata if provided
    if (metadata) {
      formData.append(
        "metadata",
        JSON.stringify({
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          allowDuplicates: true, // Allow duplicate content
          ...metadata,
        })
      );
    }

    // Upload to cloud storage with allowDuplicates parameter
    const uploadUrl = `${CLOUD_API_BASE}/file/upload?allowDuplicates=true`;

    // form-data package provides getHeaders() method for proper Content-Type with boundary
    const headers = {
      "X-API-Key": CLOUD_API_KEY_FULL,
      ...formData.getHeaders(), // This sets Content-Type with boundary
    };

    // Use node-fetch for better compatibility with form-data package
    const response = await fetchNode(uploadUrl, {
      method: "POST",
      headers,
      body: formData, // form-data works perfectly with node-fetch
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }

      // Log detailed error information
      console.error("❌ Cloud storage upload failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        uploadUrl: uploadUrl,
        hasApiKey: !!CLOUD_API_KEY_FULL,
        apiKeyLength: CLOUD_API_KEY_FULL?.length || 0,
      });

      // Handle rate limiting gracefully
      if (
        response.status === 429 ||
        errorData.message?.includes("Too many requests")
      ) {
        console.warn("⚠️  Cloud storage rate limit reached during upload");
        throw new Error(
          "Too many requests from this IP, please try again later."
        );
      }

      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Authentication failed. Please check your cloud storage API key configuration."
        );
      }

      // Handle duplicate file error gracefully
      if (
        errorData.message?.includes("already exists") ||
        errorData.message?.includes("duplicate")
      ) {
        console.warn(
          "⚠️  Duplicate file detected, will try to find existing file"
        );

        // Don't try to search - the cloud storage is doing content-based detection,
        // and we use unique filenames, so search by filename won't work
      }

      console.warn("⚠️  Cloud storage upload warning:", errorData);
      throw new Error(
        errorData.message ||
          errorData.error ||
          `Upload failed with status ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    if (!result.data) {
      throw new Error(
        "Invalid response from cloud storage: missing data field"
      );
    }
    return result.data;
  } catch (error) {
    console.error("❌ Error uploading to cloud storage:", error);
    if (error instanceof Error) {
      // Re-throw with more context if it's already an Error
      throw error;
    }
    throw new Error(
      `Failed to upload file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get a temporary upload URL for client-side uploads
 * Note: Since the cloud storage API doesn't support pre-signed URLs,
 * we'll use a proxy upload endpoint instead
 */
export async function getUploadEndpoint() {
  // Return the proxy upload endpoint that will handle the actual upload
  return {
    uploadUrl: "/api/cloud/upload",
    method: "POST" as const,
  };
}

/**
 * Get file metadata by ID
 */
export async function getFileMetadata(fileId: string): Promise<FileMetadata> {
  try {
    const response = await fetch(`${CLOUD_API_BASE}/file/${fileId}`, {
      headers: {
        "X-API-Key": CLOUD_API_KEY_READ,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get file metadata: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw new Error("Failed to get file metadata");
  }
}

/**
 * Delete a file from cloud storage
 */
export async function deleteCloudFile(fileId: string): Promise<boolean> {
  try {
    // Extract file ID if a full URL is provided
    let cloudFileId = fileId;

    // Handle various URL formats to extract the file ID
    if (fileId.startsWith("http") || fileId.startsWith("/")) {
      // If it's a URL like /api/cloud/files/{fileId} or full URL
      const matches = fileId.match(/\/files\/([a-f0-9-]+)/i);
      if (matches && matches[1]) {
        cloudFileId = matches[1];
      } else {
        // Try to extract UUID pattern from anywhere in the string
        const uuidMatch = fileId.match(
          /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
        );
        if (uuidMatch && uuidMatch[1]) {
          cloudFileId = uuidMatch[1];
        } else {
          console.error("Could not extract file ID from:", fileId);
          return false;
        }
      }
    }

    const response = await fetch(`${CLOUD_API_BASE}/file/${cloudFileId}`, {
      method: "DELETE",
      headers: {
        "X-API-Key": CLOUD_API_KEY_FULL,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Cloud storage delete error:", errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting from cloud storage:", error);
    return false;
  }
}

/**
 * List files in cloud storage
 */
export async function listCloudFiles(
  page: number = 1,
  limit: number = 20,
  search: string = ""
) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });

    const response = await fetch(`${CLOUD_API_BASE}/file/list?${params}`, {
      headers: {
        "X-API-Key": CLOUD_API_KEY_READ,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error listing cloud files:", error);
    throw new Error("Failed to list files");
  }
}

/**
 * Note: Utility functions getPublicFileUrl() and extractFileId() have been moved to
 * cloud-storage-utils.ts to avoid "use server" restrictions.
 * Import them from "./cloud-storage-utils" instead.
 */
