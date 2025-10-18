// Utility functions for handling image URLs

/**
 * Extracts file ID from cloud storage URL
 * @param url - Cloud storage URL like "/api/cloud/files/{uuid}"
 * @returns File UUID
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
    /\/(?:cloud\/)?files\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
  );
  if (urlMatch) {
    return urlMatch[1];
  }

  // Legacy URL support for migration
  if (url.includes("cloudfront.net") || url.includes("customers/")) {
    // This is a legacy URL, return as-is for now
    // These should be migrated to cloud storage
    return url;
  }

  return null;
}

/**
 * Converts a file ID to the proxy URL
 * @param fileId - File UUID
 * @returns Proxy URL like "/api/cloud/files/{uuid}"
 */
export function getProxyUrl(fileId: string): string {
  // If it's already a full URL, return as-is
  if (fileId.startsWith("http") || fileId.startsWith("/")) {
    return fileId;
  }

  // Convert UUID to proxy URL
  return `/api/cloud/files/${fileId}`;
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use getProxyUrl instead
 */
export function getFullS3Url(url: string): string {
  // Note: Despite the name, this now uses cloud storage, not S3
  // Kept for backwards compatibility with existing code
  return getProxyUrl(url);
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use extractFileId instead
 */
export function getShortUrl(fullUrl: string): string {
  const fileId = extractFileId(fullUrl);
  return fileId ? getProxyUrl(fileId) : fullUrl;
}

/**
 * Legacy function for backwards compatibility
 * @deprecated Use extractFileId instead
 */
export function getFilenameFromUrl(url: string): string {
  return extractFileId(url) || url.split("/").pop() || "";
}
