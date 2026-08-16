import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { extractProductImages } from "@/utils/image-utils";
import type {
  ProductPricingItem,
  PricingStatsData,
  PriceHistoryEntry,
  ProductPriceHistoryData,
} from "./types";
import type { AutomationMode } from "../lib/mock-data";

/**
 * Calculates a friendly Arabic countdown label from an expiration date string.
 */
export function getCycleCountdown(expirationDate?: string): {
  label: string;
  urgent: boolean;
} {
  if (!expirationDate) {
    return { label: "غير محدد", urgent: false };
  }

  const expiry = new Date(expirationDate).getTime();
  const now = Date.now();
  const diffMs = expiry - now;

  if (diffMs <= 0) {
    return { label: "منتهي الصلاحية", urgent: true };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;

  if (diffDays <= 0) {
    if (diffHours <= 2) {
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { label: `خلال ${diffMins}د`, urgent: true };
    }
    return { label: `خلال ${diffHours}س`, urgent: true };
  }

  if (diffDays === 1) {
    return {
      label: `خلال 1 يوم و ${remainingHours}س`,
      urgent: true,
    };
  }

  return {
    label: `خلال ${diffDays} أيام`,
    urgent: diffDays <= 2,
  };
}

/**
 * Normalizes an arbitrary product item from the backend into a ProductPricingItem.
 */
export function normalizePricingItem(
  raw: Record<string, unknown>,
  index: number = 0,
  imageLookup?: Record<string, string>,
): ProductPricingItem {
  const id = String(
    raw.id || raw.productId || raw._id || `pricing-${index + 1}`,
  );
  const title = String(
    raw.title ||
      raw.titleAr ||
      raw.name ||
      raw.nameAr ||
      raw.productName ||
      `منتج ${index + 1}`,
  );
  const name = title;
  const code = String(
    raw.code ||
      raw.sku ||
      raw.productCode ||
      `PRD-${id.slice(-5).toUpperCase()}`,
  );

  const images = extractProductImages(raw);
  const image =
    images[0] || imageLookup?.[id] || String(raw.image || raw.imageUrl || "");

  const originalPrice = Number(
    raw.originalPrice ?? raw.price ?? raw.basePrice ?? 0,
  );
  const currentPrice = Number(
    raw.discountedPrice ??
      raw.currentPrice ??
      raw.priceAfterDiscount ??
      originalPrice,
  );

  let discountPercent = Number(
    raw.discountPercentage ??
      raw.discountPercent ??
      (originalPrice > 0 && currentPrice < originalPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0),
  );
  if (isNaN(discountPercent) || discountPercent < 0) discountPercent = 0;

  const rawMode = String(raw.automationMode || "Assisted");
  let automationMode: AutomationMode = "Assisted";
  if (
    rawMode.toLowerCase() === "autonomous" ||
    rawMode.toLowerCase() === "auto"
  ) {
    automationMode = "Autonomous";
  } else if (rawMode.toLowerCase() === "manual") {
    automationMode = "Manual";
  } else {
    automationMode = "Assisted";
  }

  const expirationDate = raw.expirationDate
    ? String(raw.expirationDate)
    : undefined;
  const countdown = getCycleCountdown(expirationDate);

  return {
    id,
    code,
    name,
    nameAr: raw.titleAr ? String(raw.titleAr) : undefined,
    image,
    originalPrice,
    currentPrice,
    discountPercent,
    cycleCountdownLabel: (raw.cycleCountdownLabel as string) || countdown.label,
    cycleUrgent:
      typeof raw.cycleUrgent === "boolean" ? raw.cycleUrgent : countdown.urgent,
    automationMode,
    expirationDate,
    categoryId: raw.categoryId ? String(raw.categoryId) : undefined,
    categoryName: (raw.categoryName || raw.categoryNameAr) as
      string | undefined,
    status: raw.status ? String(raw.status) : "active",
    quantityAvailable:
      raw.quantityAvailable != null ? Number(raw.quantityAvailable) : undefined,
  };
}

/**
 * Calculates pricing stats dynamically from the backend summary or list of products.
 */
export function calculatePricingStats(
  items: ProductPricingItem[],
  summary?: Record<string, unknown>,
): PricingStatsData {
  const activeListingsCount =
    Number(summary?.totalActiveProducts) || items.length;
  const averageDiscountPercent =
    summary?.averageDiscountPercentage != null
      ? Math.round(Number(summary.averageDiscountPercentage))
      : items.filter((it) => it.discountPercent > 0).length > 0
        ? Math.round(
            items.reduce((acc, it) => acc + it.discountPercent, 0) /
              items.filter((it) => it.discountPercent > 0).length,
          )
        : 0;

  const urgentCount = items.filter((it) => it.cycleUrgent).length;
  const nextCycleLabel = urgentCount > 0 ? "00:45:10" : "01:24:10";

  return {
    activeListingsCount,
    activeListingsDelta: Math.max(0, Math.round(activeListingsCount * 0.1)),
    averageDiscountPercent,
    nextCycleCountdownLabel: nextCycleLabel,
    nextCycleProgressPercent: Math.min(
      100,
      Math.max(20, urgentCount * 25 || 65),
    ),
  };
}

/**
 * Fetch actual store pricing products directly from GET /stores/me/products/pricing
 */
export async function getProductsPricing(): Promise<{
  data: ProductPricingItem[];
  stats: PricingStatsData;
  error?: string;
}> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<
        | Record<string, unknown>[]
        | {
            summary?: Record<string, unknown>;
            products?: Record<string, unknown>[];
            items?: Record<string, unknown>[];
            data?: Record<string, unknown>[];
          }
      >(
        getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
          Endpoints.stores.productsPricing,
          { token },
        ),
      ),
    );

    if (res.error) {
      return {
        data: [],
        stats: calculatePricingStats([]),
        error: res.error,
      };
    }

    let rawList: Record<string, unknown>[] = [];
    let summaryObj: Record<string, unknown> | undefined = undefined;

    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && typeof res.data === "object") {
      const obj = res.data as {
        summary?: Record<string, unknown>;
        products?: Record<string, unknown>[];
        items?: Record<string, unknown>[];
        data?: Record<string, unknown>[];
      };
      summaryObj = obj.summary;
      if (Array.isArray(obj.products)) {
        rawList = obj.products;
      } else if (Array.isArray(obj.items)) {
        rawList = obj.items;
      } else if (Array.isArray(obj.data)) {
        rawList = obj.data;
      }
    }

    const items = rawList.map((item, idx) => normalizePricingItem(item, idx));
    const stats = calculatePricingStats(items, summaryObj);

    return {
      data: items,
      stats,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر الاتصال بالخادم لجلب بيانات التسعير";
    return {
      data: [],
      stats: calculatePricingStats([]),
      error: message,
    };
  }
}

/**
 * Normalizes price history entries from GET /stores/me/products/{id}/price-history
 */
export function normalizeHistoryEntry(
  raw: Record<string, unknown>,
  idx: number,
  originalPrice: number,
): PriceHistoryEntry {
  const newPrice = Number(
    raw.newDiscountedPrice ??
      raw.newPrice ??
      raw.discountedPrice ??
      raw.price ??
      0,
  );
  const oldPrice = Number(
    raw.oldDiscountedPrice ??
      raw.oldPrice ??
      raw.oldOriginalPrice ??
      raw.previousPrice ??
      newPrice,
  );

  const baseOriginalPrice = Number(
    raw.newOriginalPrice ?? raw.oldOriginalPrice ?? originalPrice,
  );

  const discountPercent = Number(
    raw.discountPercentage ??
      raw.discountPercent ??
      (baseOriginalPrice > 0 && newPrice < baseOriginalPrice
        ? Math.round(((baseOriginalPrice - newPrice) / baseOriginalPrice) * 100)
        : 0),
  );

  const rawReason = String(
    raw.changeReason ||
      raw.reason ||
      raw.note ||
      raw.description ||
      "تعديل السعر",
  );

  let changeReason = rawReason;
  if (
    rawReason.toLowerCase().includes("near expiry") ||
    rawReason.toLowerCase().includes("automatic")
  ) {
    changeReason = "تعديل تلقائي للسعر لاقتراب موعد انتهاء الصلاحية";
  } else if (rawReason.toLowerCase().includes("manual")) {
    changeReason = "تعديل يدوي للسعر";
  }

  const rawBy = String(raw.changedBy || raw.appliedBy || raw.actor || "");
  const appliedBy =
    rawReason.toLowerCase().includes("automatic") ||
    rawReason.toLowerCase().includes("near expiry")
      ? "محرك الذكاء الاصطناعي"
      : rawBy
        ? "مدير المتجر"
        : "النظام";

  return {
    id: String(raw.id || raw.historyId || raw._id || `hist-${idx + 1}`),
    productId: raw.productId ? String(raw.productId) : undefined,
    oldPrice,
    newPrice,
    discountPercent,
    changeReason,
    changedAt: String(
      raw.createdAt ||
        raw.changedAt ||
        raw.updatedAt ||
        raw.effectiveDate ||
        raw.date ||
        new Date().toISOString(),
    ),
    automationMode:
      rawReason.toLowerCase().includes("automatic") ||
      rawReason.toLowerCase().includes("near expiry")
        ? "Autonomous"
        : "Manual",
    appliedBy,
  };
}

/**
 * Fetch actual price history for a specific product via GET /stores/me/products/{id}/price-history
 */
export async function getProductPriceHistory(
  productId: string,
  productInfo?: ProductPricingItem,
): Promise<{
  data: ProductPriceHistoryData | null;
  error?: string;
}> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<
        | Record<string, unknown>[]
        | {
            history?: Record<string, unknown>[];
            items?: Record<string, unknown>[];
            priceHistory?: Record<string, unknown>[];
          }
      >(
        getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
          Endpoints.stores.productPriceHistory(productId),
          { token },
        ),
      ),
    );

    if (res.error) {
      return {
        data: null,
        error: res.error,
      };
    }

    let rawList: Record<string, unknown>[] = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && typeof res.data === "object") {
      const obj = res.data as {
        history?: unknown[];
        items?: unknown[];
        priceHistory?: unknown[];
      };
      if (Array.isArray(obj.history)) {
        rawList = obj.history as Record<string, unknown>[];
      } else if (Array.isArray(obj.priceHistory)) {
        rawList = obj.priceHistory as Record<string, unknown>[];
      } else if (Array.isArray(obj.items)) {
        rawList = obj.items as Record<string, unknown>[];
      }
    }

    const origPrice = productInfo?.originalPrice || 0;
    const history = rawList.map((entry, idx) =>
      normalizeHistoryEntry(entry, idx, origPrice),
    );

    return {
      data: {
        productId,
        productTitle: productInfo?.name,
        productCode: productInfo?.code,
        originalPrice: productInfo?.originalPrice,
        currentPrice: productInfo?.currentPrice,
        history,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر الاتصال بالخادم لجلب سجل الأسعار";
    return {
      data: null,
      error: message,
    };
  }
}
