// Utility functions for handling image URLs

// CloudFront CDN domain
const CLOUDFRONT_DOMAIN = "d27wu6gy6te9ow.cloudfront.net";

/**
 * Converts a short image URL to the full CloudFront CDN URL
 * @param shortUrl - Short URL like "/api/image/filename.jpg"
 * @returns Full CloudFront CDN URL
 */
export function getFullS3Url(shortUrl: string): string {
  if (shortUrl.startsWith("/api/image/")) {
    const filename = shortUrl.replace("/api/image/", "");
    return `https://${CLOUDFRONT_DOMAIN}/customers/${filename}`;
  }
  return shortUrl; // Return as-is if not a short URL
}

/**
 * Converts a full CloudFront CDN URL to a short URL
 * @param fullUrl - Full CloudFront CDN URL
 * @returns Short URL like "/api/image/filename.jpg"
 */
export function getShortUrl(fullUrl: string): string {
  if (fullUrl.includes(`${CLOUDFRONT_DOMAIN}/customers/`)) {
    const filename = fullUrl.split("customers/")[1]?.split("?")[0]; // Remove query params if any
    return `/api/image/${filename}`;
  }
  return fullUrl; // Return as-is if not a CloudFront CDN URL
}

/**
 * Extracts filename from various URL formats
 * @param url - Any image URL format
 * @returns Just the filename
 */
export function getFilenameFromUrl(url: string): string {
  if (url.startsWith("/api/image/")) {
    return url.replace("/api/image/", "");
  }
  if (url.includes("customers/")) {
    return url.split("customers/")[1]?.split("?")[0] || "";
  }
  return url.split("/").pop() || "";
}
