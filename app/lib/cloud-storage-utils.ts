/**
 * Cloud Storage Utility Functions
 * Pure utility functions for URL manipulation and file ID extraction
 * These are NOT server actions, just helper functions
 */

// New API: https://api.mirkokawa.dev
const CLOUD_API_BASE =
  process.env.CLOUD_API_BASE_URL || "https://api.mirkokawa.dev";
const CLOUD_API_KEY_READ = process.env.CLOUD_API_KEY_READ || "";

/**
 * Generate a public URL for accessing a file through Next.js proxy
 * This avoids CORS issues by proxying requests through our own domain
 */
export function getPublicFileUrl(fileId: string): string {
  // Extract just the UUID if a full URL is provided
  if (fileId.includes("/public/") || fileId.includes("/files/")) {
    const matches = fileId.match(
      /\/(?:public|files)\/(?:[^/]+\/)?([a-f0-9-]+)/i
    );
    if (matches && matches[1]) {
      fileId = matches[1];
    }
  }

  // Return proxy URL through our API (avoids CORS issues)
  // This goes through /api/cloud/files/[fileId] which proxies to cloud storage
  return `/api/cloud/files/${fileId}`;
}

/**
 * Generate a direct cloud storage URL (for server-side use or downloads)
 * No CORS issues - works everywhere without headers!
 */
export function getDirectCloudUrl(fileId: string): string {
  // Extract just the UUID if a full URL is provided
  if (fileId.includes("/public/") || fileId.includes("/files/")) {
    const matches = fileId.match(
      /\/(?:public|files)\/(?:[^/]+\/)?([a-f0-9-]+)/i
    );
    if (matches && matches[1]) {
      fileId = matches[1];
    }
  }

  // Return direct public URL from cloud storage
  // New format: https://api.mirkokawa.dev/public/{API_KEY}/{FILE_ID}
  return `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`;
}

/**
 * Extract file ID from various URL formats
 */
export function extractFileId(url: string): string | null {
  if (!url) return null;

  // If it's already just a UUID
  const uuidMatch = url.match(
    /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i
  );
  if (uuidMatch) {
    return uuidMatch[1];
  }

  // Extract from URL patterns
  const urlMatch = url.match(
    /\/files\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
  );
  if (urlMatch) {
    return urlMatch[1];
  }

  return null;
}
