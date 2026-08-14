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

export interface ExtractedProductImage {
  id: string | null;
  url: string;
}

/**
 * Helper utility to safely extract image records (id + resolved URL) from
 * product response objects. Handles various backend response formats:
 * - images: string[]
 * - images: { id?: string; url?: string; path?: string; imageUrl?: string }[]
 * - productImages: string[] or object[]
 * - imageUrls: string[]
 * - image: string
 * - imageUrl: string
 */
export function extractProductImageRecords(
  product: unknown,
): ExtractedProductImage[] {
  if (!product || typeof product !== "object") return [];
  const obj = product as Record<string, unknown>;

  const raw: { id: string | null; url: string }[] = [];

  const rawList =
    obj.images || obj.productImages || obj.imageUrls || obj.imagesList;

  if (Array.isArray(rawList)) {
    for (const item of rawList) {
      if (typeof item === "string") {
        raw.push({ id: null, url: item });
      } else if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        const itemUrl =
          itemObj.url ||
          itemObj.path ||
          itemObj.imageUrl ||
          itemObj.src ||
          itemObj.image;
        const itemId = itemObj.id;
        if (typeof itemUrl === "string") {
          raw.push({
            id: typeof itemId === "string" ? itemId : null,
            url: itemUrl,
          });
        }
      }
    }
  }

  if (raw.length === 0) {
    const single =
      obj.image || obj.imageUrl || obj.thumbnail || obj.thumbnailUrl;
    if (typeof single === "string") {
      raw.push({ id: null, url: single });
    }
  }

  const resolved: ExtractedProductImage[] = [];
  for (const item of raw) {
    const resolvedUrl = resolveImageUrl(item.url);
    if (resolvedUrl) {
      resolved.push({ id: item.id, url: resolvedUrl });
    }
  }

  return resolved;
}

/**
 * Helper utility to safely extract image URLs from product response objects.
 * See {@link extractProductImageRecords} for the full record (id + url).
 */
export function extractProductImages(product: unknown): string[] {
  return extractProductImageRecords(product).map((item) => item.url);
}
