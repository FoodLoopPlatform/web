import { Endpoints } from "./endpoints";

/**
 * Resolves an image URL or path to a full URL pointing to the backend base URL
 * if it is a relative path.
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // If already an absolute URL, data URL, or blob URL, return as is
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("blob:") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }

  // Ensure leading slash for relative backend paths
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const baseUrl = (Endpoints.baseUrl || "https://foodloop.runasp.net").replace(
    /\/+$/,
    "",
  );

  return `${baseUrl}${path}`;
}

/**
 * Helper utility to safely extract image URLs from product response objects.
 * Handles various backend response formats:
 * - images: string[]
 * - images: { url?: string; path?: string; imageUrl?: string }[]
 * - productImages: string[] or object[]
 * - imageUrls: string[]
 * - image: string
 * - imageUrl: string
 */
export function extractProductImages(product: unknown): string[] {
  if (!product || typeof product !== "object") return [];
  const obj = product as Record<string, unknown>;

  const rawUrls: string[] = [];

  const rawList =
    obj.images || obj.productImages || obj.imageUrls || obj.imagesList;

  if (Array.isArray(rawList)) {
    for (const item of rawList) {
      if (typeof item === "string") {
        rawUrls.push(item);
      } else if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        const itemUrl =
          itemObj.url ||
          itemObj.path ||
          itemObj.imageUrl ||
          itemObj.src ||
          itemObj.image;
        if (typeof itemUrl === "string") {
          rawUrls.push(itemUrl);
        }
      }
    }
  }

  if (rawUrls.length === 0) {
    const single =
      obj.image || obj.imageUrl || obj.thumbnail || obj.thumbnailUrl;
    if (typeof single === "string") {
      rawUrls.push(single);
    }
  }

  const resolvedUrls: string[] = [];
  for (const raw of rawUrls) {
    const resolved = resolveImageUrl(raw);
    if (resolved) {
      resolvedUrls.push(resolved);
    }
  }

  return resolvedUrls;
}
