/**
 * Vercel Blob utilities for image storage
 */

export function isBlobUrl(url: string) {
  return /\.vercel-storage\.com\//.test(url);
}

export function makePublicPath(path: string) {
  // Placeholder for future custom domain mapping if needed
  return path;
}

/**
 * Get image URL - handles both blob URLs and local paths
 */
export function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // If it's a blob URL, return as-is
  if (isBlobUrl(url)) {
    return url;
  }
  
  // If it's an absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, treat as a local path
  return url.startsWith('/') ? url : `/${url}`;
}
