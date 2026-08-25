/**
 * Whether `src` can be passed to next/image for capability/blog images.
 * Accepts site-relative paths under public/ and remote HTTPS Storage URLs.
 * Blob object URLs are for admin file-preview only (use <img>, not next/image).
 */
export function canDisplayImageUrl(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  if (!src.startsWith("https://")) return false;

  try {
    const { hostname } = new URL(src);
    return (
      hostname === "firebasestorage.googleapis.com" ||
      hostname === "storage.googleapis.com" ||
      hostname.endsWith(".appspot.com") ||
      hostname.endsWith(".firebasestorage.app")
    );
  } catch {
    return false;
  }
}

export function isBlobImageUrl(src: string): boolean {
  return Boolean(src) && src.startsWith("blob:");
}
