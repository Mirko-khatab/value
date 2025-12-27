/**
 * Image URL Utilities
 *
 * Helper functions to convert cloud storage file IDs to full URLs
 * and handle different image URL formats consistently across the app
 */

const DEFAULT_FALLBACK_IMAGE = "/image/2.jpg";

/**
 * Convert a file ID or partial URL to a full, valid image URL
 *
 * Handles:
 * - Proxy URLs: "/api/cloud/files/abc123" → "/api/cloud/files/abc123" (unchanged - best!)
 * - File IDs from cloud storage: "abc123" → "/api/cloud/files/abc123" (uses proxy)
 * - Full URLs: "https://..." → "https://..." (unchanged)
 * - Local paths: "/image/..." → "/image/..." (unchanged)
 * - Empty/null values: "" → "/image/2.jpg" (fallback)
 *
 * Note: Proxy URLs (/api/cloud/files/*) avoid rate limiting and enable caching
 *
 * @param imageUrl - The image URL, file ID, or path from database
 * @param fallback - Optional fallback image (default: /image/2.jpg)
 * @returns Full, valid image URL
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): string {
  // Handle null, undefined, or empty strings
  if (!imageUrl || imageUrl.trim() === "") {
    return fallback;
  }

  const trimmedUrl = imageUrl.trim();

  // If it's already a full URL (http or https), use it directly
  if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
    return trimmedUrl;
  }

  // If it's a local path (starts with /), use it directly
  if (trimmedUrl.startsWith("/")) {
    return trimmedUrl;
  }

  // Otherwise, it's a file ID from cloud storage - convert to proxy URL
  // This avoids rate limiting and enables caching
  return `/api/cloud/files/${trimmedUrl}`;
}

/**
 * Get the first image URL from a gallery array
 *
 * @param galleries - Array of gallery objects with image_url property
 * @param fallback - Optional fallback image
 * @returns Full image URL of first gallery image or fallback
 */
export function getFirstGalleryImage(
  galleries: Array<{ image_url: string }> | null | undefined,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): string {
  if (!galleries || galleries.length === 0) {
    return fallback;
  }

  const firstImage = galleries[0]?.image_url;
  return getImageUrl(firstImage, fallback);
}

/**
 * Get all gallery image URLs
 *
 * @param galleries - Array of gallery objects with image_url property
 * @returns Array of full image URLs
 */
export function getAllGalleryImages(
  galleries: Array<{ image_url: string }> | null | undefined
): string[] {
  if (!galleries || galleries.length === 0) {
    return [];
  }

  return galleries
    .map((gallery) => getImageUrl(gallery.image_url))
    .filter((url) => url !== DEFAULT_FALLBACK_IMAGE); // Exclude fallback images
}

/**
 * Check if a string is a cloud storage file ID (UUID format)
 *
 * @param str - String to check
 * @returns true if string looks like a UUID
 */
export function isFileId(str: string | null | undefined): boolean {
  if (!str) return false;

  // UUID format: 8-4-4-4-12 hex characters
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str.trim());
}

/**
 * Batch convert multiple image URLs/IDs
 *
 * @param imageUrls - Array of image URLs or file IDs
 * @param fallback - Optional fallback image
 * @returns Array of full image URLs
 */
export function batchConvertImageUrls(
  imageUrls: (string | null | undefined)[],
  fallback: string = DEFAULT_FALLBACK_IMAGE
): string[] {
  return imageUrls.map((url) => getImageUrl(url, fallback));
}
