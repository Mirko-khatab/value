"use client";

/**
 * Client-side cloud storage upload utility
 * Uploads files to the cloud storage through the proxy endpoint
 */

export interface UploadResponse {
  id: string;
  fileName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  publicUrl: string;
}

/**
 * Upload a file to cloud storage via the proxy endpoint
 * Returns the file ID and public URL for accessing the file
 */
export async function uploadToCloud(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total) * 100;
        onProgress(percentComplete);
      }
    });

    // Handle successful upload
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response.error || "Upload failed"));
          }
        } catch (error) {
          reject(new Error("Invalid response from server"));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(
            new Error(
              errorResponse.message ||
                `Upload failed with status: ${xhr.status}`
            )
          );
        } catch {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      }
    });

    // Handle network errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    // Handle aborted uploads
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload cancelled"));
    });

    // Send the request
    xhr.open("POST", "/api/cloud/upload");
    xhr.send(formData);
  });
}

/**
 * Configuration for image uploads
 */
export const IMAGE_CONFIG = {
  maxSizeMB: 5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.8,
  fileType: "image/jpeg" as const,
};
