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
 * - productImageUrl: string
 * - productImage: string or object
 * - image: string
 * - imageUrl: string
 * - nested in product, productInfo, item, data
 */
export function extractProductImageRecords(
  product: unknown,
): ExtractedProductImage[] {
  if (!product) return [];

  // If a string URL is passed directly
  if (typeof product === "string") {
    const resolvedUrl = resolveImageUrl(product);
    return resolvedUrl ? [{ id: null, url: resolvedUrl }] : [];
  }

  if (typeof product !== "object") return [];
  const obj = product as Record<string, unknown>;

  const raw: { id: string | null; url: string }[] = [];

  const extractFromList = (list: unknown) => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (typeof item === "string" && item.trim()) {
        raw.push({ id: null, url: item.trim() });
      } else if (item && typeof item === "object") {
        const itemObj = item as Record<string, unknown>;
        const itemUrl =
          itemObj.imageUrl ||
          itemObj.url ||
          itemObj.path ||
          itemObj.src ||
          itemObj.image ||
          itemObj.fileUrl;
        const itemId = itemObj.id || itemObj.imageId;
        if (typeof itemUrl === "string" && itemUrl.trim()) {
          raw.push({
            id: typeof itemId === "string" ? itemId : null,
            url: itemUrl.trim(),
          });
        }
      }
    }
  };

  // Direct lists
  extractFromList(obj.images);
  extractFromList(obj.productImages);
  extractFromList(obj.imageUrls);
  extractFromList(obj.imagesList);

  // Nested lists in product / productInfo
  if (obj.product && typeof obj.product === "object") {
    const nested = obj.product as Record<string, unknown>;
    extractFromList(nested.images);
    extractFromList(nested.productImages);
    extractFromList(nested.imageUrls);
  }
  if (obj.productInfo && typeof obj.productInfo === "object") {
    const nested = obj.productInfo as Record<string, unknown>;
    extractFromList(nested.images);
    extractFromList(nested.productImages);
    extractFromList(nested.imageUrls);
  }

  // Single string / object properties
  if (raw.length === 0) {
    const single =
      obj.productImageUrl ||
      obj.productImage ||
      obj.imageUrl ||
      obj.image ||
      obj.thumbnail ||
      obj.thumbnailUrl ||
      obj.pictureUrl ||
      obj.picture ||
      obj.photoUrl ||
      obj.photo;

    if (typeof single === "string" && single.trim()) {
      raw.push({ id: null, url: single.trim() });
    } else if (single && typeof single === "object") {
      const singleObj = single as Record<string, unknown>;
      const url =
        singleObj.imageUrl ||
        singleObj.url ||
        singleObj.path ||
        singleObj.src ||
        singleObj.image;
      if (typeof url === "string" && url.trim()) {
        raw.push({ id: (singleObj.id as string) || null, url: url.trim() });
      }
    }
  }

  // Nested single properties
  if (raw.length === 0) {
    for (const nestedKey of ["product", "productInfo", "item", "data"]) {
      if (obj[nestedKey] && typeof obj[nestedKey] === "object") {
        const nested = obj[nestedKey] as Record<string, unknown>;
        const single =
          nested.productImageUrl ||
          nested.productImage ||
          nested.imageUrl ||
          nested.image ||
          nested.thumbnail ||
          nested.thumbnailUrl ||
          nested.pictureUrl ||
          nested.picture;
        if (typeof single === "string" && single.trim()) {
          raw.push({ id: null, url: single.trim() });
          break;
        } else if (single && typeof single === "object") {
          const singleObj = single as Record<string, unknown>;
          const url =
            singleObj.imageUrl ||
            singleObj.url ||
            singleObj.path ||
            singleObj.src ||
            singleObj.image;
          if (typeof url === "string" && url.trim()) {
            raw.push({ id: (singleObj.id as string) || null, url: url.trim() });
            break;
          }
        }
      }
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
