import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { SITE_URL } from "@/lib/seo"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Turns a Firebase Storage path from the CMS into a public URL on our own domain,
 * served by app/media/[...path]/route.ts. Keeping images on foursix46.com is what
 * lets Google Images attribute them to this site and lets the CDN cache them — the
 * raw firebasestorage.googleapis.com URL does neither. Returns an absolute URL
 * because the same value feeds JSON-LD and Open Graph tags, which need one.
 */
export const getFirebaseImageUrl = (path: string | undefined) => {
  if (!path) return "/placeholder.jpg"; // Make sure you have a simple placeholder.jpg in your public folder!

  // A full Storage download URL (e.g. pasted into a text field) is rewritten to the
  // same on-domain form. A tokened URL is left alone: its object may not be publicly
  // readable, and the proxy deliberately sends no credentials.
  const storageUrl = path.match(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?]+)(\?(.*))?$/);
  if (storageUrl) {
    if (/(^|&)token=/.test(storageUrl[3] || "")) return path;
    path = decodeURIComponent(storageUrl[1]);
  } else if (/^https?:\/\//.test(path) || path.startsWith("/")) {
    return path;
  }

  // Encode each segment but keep the slashes, so the URL reads as a real path:
  // /media/gallery/y40v6_reg%20trademark%20logo%202.png
  const encoded = path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `${SITE_URL}/media/${encoded}`;
};