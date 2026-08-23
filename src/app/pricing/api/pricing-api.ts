import { getMany, createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { extractProductImages, resolveImageUrl } from "@/utils/image-utils";
import type {
  ProductPricingItem,
  PricingStatsData,
  PriceHistoryEntry,
  ProductPriceHistoryData,
  AiRecommendation,
  AiRecommendationsSchedule,
  RejectRecommendationPayload,
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
 * Calculates human-readable countdown and progress from schedule nextPricingBatchAt timestamp.
 */
export function formatScheduleCountdown(nextBatchAt?: string): {
  label: string;
  progressPercent: number;
} {
  if (!nextBatchAt) {
    return { label: "--:--:--", progressPercent: 50 };
  }
  const target = new Date(nextBatchAt).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) {
    return { label: "جارٍ التنفيذ", progressPercent: 100 };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");
  const label = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  // Default duration interval of 60m
  const totalDurationMs = 60 * 60 * 1000;
  const elapsedMs = Math.max(0, totalDurationMs - diffMs);
  const progressPercent = Math.min(
    100,
    Math.max(10, Math.round((elapsedMs / totalDurationMs) * 100)),
  );

  return { label, progressPercent };
}

/**
 * Calculates pricing stats dynamically from the backend summary or list of products.
 */
export function calculatePricingStats(
  items: ProductPricingItem[],
  summary?: Record<string, unknown>,
  schedule?: AiRecommendationsSchedule | null,
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
  let nextCycleLabel = urgentCount > 0 ? "00:45:10" : "01:24:10";
  let nextCycleProgress = Math.min(100, Math.max(20, urgentCount * 25 || 65));

  if (schedule?.isPricingBatchRunning) {
    nextCycleLabel = "جارٍ التشغيل";
    nextCycleProgress = 100;
  } else if (schedule?.nextPricingBatchAt) {
    const formatted = formatScheduleCountdown(schedule.nextPricingBatchAt);
    nextCycleLabel = formatted.label;
    nextCycleProgress = formatted.progressPercent;
  }

  return {
    activeListingsCount,
    activeListingsDelta: Math.max(0, Math.round(activeListingsCount * 0.1)),
    averageDiscountPercent,
    nextCycleCountdownLabel: nextCycleLabel,
    nextCycleProgressPercent: nextCycleProgress,
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
 * Normalizes an arbitrary AI recommendation from the backend into an AiRecommendation object.
 */
export function normalizeAiRecommendation(
  raw: Record<string, unknown>,
  index: number = 0,
  imageLookup?: Record<string, string>,
): AiRecommendation {
  const id = String(
    raw.id || raw.recommendationId || raw._id || `rec-${index + 1}`,
  );
  const productId = String(
    raw.productId ||
      raw.product_id ||
      (raw.product && typeof raw.product === "object"
        ? (raw.product as Record<string, unknown>).id ||
          (raw.product as Record<string, unknown>).productId
        : "") ||
      "",
  );

  const productName = String(
    raw.productName ||
      raw.productTitle ||
      raw.title ||
      raw.titleAr ||
      raw.name ||
      raw.nameAr ||
      (raw.product && typeof raw.product === "object"
        ? (raw.product as Record<string, unknown>).title ||
          (raw.product as Record<string, unknown>).titleAr ||
          (raw.product as Record<string, unknown>).name ||
          (raw.product as Record<string, unknown>).nameAr
        : "") ||
      `منتج ${index + 1}`,
  );

  const productCode = String(
    raw.productCode ||
      raw.code ||
      raw.sku ||
      (raw.product && typeof raw.product === "object"
        ? (raw.product as Record<string, unknown>).code ||
          (raw.product as Record<string, unknown>).sku
        : "") ||
      (productId ? `PRD-${productId.slice(-5).toUpperCase()}` : ""),
  );

  // Extract images from raw, raw.product, raw.productInfo, etc.
  const rawImages = extractProductImages(raw);
  const nestedImages =
    raw.product && typeof raw.product === "object"
      ? extractProductImages(raw.product)
      : [];
  const allImages = [...rawImages, ...nestedImages];

  const productImageUrl =
    allImages[0] ||
    (productId ? imageLookup?.[productId] : undefined) ||
    (raw.productImageUrl ? resolveImageUrl(String(raw.productImageUrl)) : "") ||
    (raw.imageUrl ? resolveImageUrl(String(raw.imageUrl)) : "") ||
    (raw.image ? resolveImageUrl(String(raw.image)) : "") ||
    "";

  const originalPrice = Number(
    raw.originalPrice ??
      raw.basePrice ??
      raw.price ??
      (raw.product && typeof raw.product === "object"
        ? ((raw.product as Record<string, unknown>).originalPrice ??
          (raw.product as Record<string, unknown>).price)
        : 0) ??
      0,
  );

  const currentPrice = Number(
    raw.currentPrice ??
      raw.discountedPrice ??
      raw.priceAfterDiscount ??
      (raw.product && typeof raw.product === "object"
        ? ((raw.product as Record<string, unknown>).discountedPrice ??
          (raw.product as Record<string, unknown>).currentPrice)
        : originalPrice) ??
      originalPrice,
  );

  const recommendedPrice = Number(
    raw.recommendedPrice ??
      raw.suggestedPrice ??
      raw.newPrice ??
      raw.targetPrice ??
      raw.priceRecommendation ??
      Math.round(currentPrice * 0.8),
  );

  let discountPercentage = Number(
    raw.discountPercentage ??
      raw.discountPercent ??
      (originalPrice > 0 && recommendedPrice < originalPrice
        ? Math.round(((originalPrice - recommendedPrice) / originalPrice) * 100)
        : currentPrice > 0 && recommendedPrice < currentPrice
          ? Math.round(((currentPrice - recommendedPrice) / currentPrice) * 100)
          : 0),
  );
  if (isNaN(discountPercentage) || discountPercentage < 0)
    discountPercentage = 0;

  const discountAmount = Number(
    raw.discountAmount ??
      raw.savingsAmount ??
      Math.max(
        0,
        originalPrice - recommendedPrice || currentPrice - recommendedPrice,
      ),
  );

  const quantityAvailable = Number(
    raw.quantityAvailable ??
      raw.quantity ??
      raw.stockAvailable ??
      (raw.product && typeof raw.product === "object"
        ? ((raw.product as Record<string, unknown>).quantityAvailable ??
          (raw.product as Record<string, unknown>).quantity)
        : 0) ??
      0,
  );

  const expirationDate = String(
    raw.expirationDate ||
      raw.expiryDate ||
      (raw.product && typeof raw.product === "object"
        ? (raw.product as Record<string, unknown>).expirationDate ||
          (raw.product as Record<string, unknown>).expiryDate
        : "") ||
      "",
  );

  let daysRemaining = Number(raw.daysRemaining ?? raw.daysToExpiry ?? 0);
  if (!daysRemaining && expirationDate) {
    const diffMs = new Date(expirationDate).getTime() - Date.now();
    daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }

  const riskLevel = String(
    raw.riskLevel ||
      raw.risk ||
      (daysRemaining <= 2
        ? "Critical"
        : daysRemaining <= 5
          ? "High"
          : "Medium"),
  );
  const reason = String(
    raw.reason ||
      raw.rationale ||
      raw.explanation ||
      raw.aiReason ||
      "اقتراح تسعير ديناميكي مدعوم بالذكاء الاصطناعي لتحسين تصريف المخزون.",
  );
  const confidence = Number(raw.confidence ?? raw.confidenceScore ?? 0.92);
  const actionRequirement = raw.actionRequirement
    ? String(raw.actionRequirement)
    : undefined;
  const actionReason = raw.actionReason ? String(raw.actionReason) : undefined;
  const status = String(raw.status || "Pending");
  const correlationId = raw.correlationId
    ? String(raw.correlationId)
    : undefined;
  const createdAt = String(
    raw.createdAt || raw.date || new Date().toISOString(),
  );

  return {
    id,
    productId,
    productName,
    productCode,
    originalPrice,
    currentPrice,
    recommendedPrice,
    discountPercentage,
    discountAmount,
    quantityAvailable,
    expirationDate,
    daysRemaining,
    productImageUrl: productImageUrl || undefined,
    productImages: allImages.length > 0 ? allImages : undefined,
    riskLevel,
    reason,
    confidence,
    actionRequirement,
    actionReason,
    status,
    correlationId,
    createdAt,
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
            product?: Record<string, unknown>;
            [key: string]: unknown;
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
    let historyProductImage: string | undefined = undefined;
    let historyProductTitle: string | undefined = undefined;
    let historyProductCode: string | undefined = undefined;

    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && typeof res.data === "object") {
      const obj = res.data as Record<string, unknown>;
      if (Array.isArray(obj.history)) {
        rawList = obj.history as Record<string, unknown>[];
      } else if (Array.isArray(obj.priceHistory)) {
        rawList = obj.priceHistory as Record<string, unknown>[];
      } else if (Array.isArray(obj.items)) {
        rawList = obj.items as Record<string, unknown>[];
      } else if (Array.isArray(obj.data)) {
        rawList = obj.data as Record<string, unknown>[];
      }

      const extractedImages = extractProductImages(obj.product || obj);
      if (extractedImages.length > 0) {
        historyProductImage = extractedImages[0];
      }

      if (obj.product && typeof obj.product === "object") {
        const prod = obj.product as Record<string, unknown>;
        historyProductTitle = String(
          prod.title || prod.name || prod.productName || "",
        );
        historyProductCode = String(prod.code || prod.sku || "");
      } else {
        if (obj.productTitle || obj.title || obj.name) {
          historyProductTitle = String(
            obj.productTitle || obj.title || obj.name,
          );
        }
        if (obj.productCode || obj.code || obj.sku) {
          historyProductCode = String(obj.productCode || obj.code || obj.sku);
        }
      }
    }

    const origPrice = productInfo?.originalPrice || 0;
    const history = rawList.map((entry, idx) =>
      normalizeHistoryEntry(entry, idx, origPrice),
    );

    return {
      data: {
        productId,
        productTitle: historyProductTitle || productInfo?.name,
        productCode: historyProductCode || productInfo?.code,
        originalPrice: productInfo?.originalPrice,
        currentPrice: productInfo?.currentPrice,
        productImage: historyProductImage || productInfo?.image,
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

/**
 * Fetch pending AI price recommendations for the store via GET /stores/me/ai-recommendations
 */
export async function getAiRecommendations(
  imageLookup?: Record<string, string>,
): Promise<{
  data: AiRecommendation[];
  error?: string;
}> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<
        | Record<string, unknown>[]
        | {
            recommendations?: Record<string, unknown>[];
            items?: Record<string, unknown>[];
            data?: Record<string, unknown>[];
          }
      >(
        getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
          Endpoints.stores.aiRecommendations,
          { token },
        ),
      ),
    );

    if (res.error) {
      return {
        data: [],
        error: res.error,
      };
    }

    let rawList: Record<string, unknown>[] = [];
    if (Array.isArray(res.data)) {
      rawList = res.data;
    } else if (res.data && typeof res.data === "object") {
      const obj = res.data as {
        recommendations?: Record<string, unknown>[];
        items?: Record<string, unknown>[];
        data?: Record<string, unknown>[];
      };
      if (Array.isArray(obj.recommendations)) {
        rawList = obj.recommendations;
      } else if (Array.isArray(obj.items)) {
        rawList = obj.items;
      } else if (Array.isArray(obj.data)) {
        rawList = obj.data;
      }
    }

    const recommendations = rawList.map((item, idx) =>
      normalizeAiRecommendation(item, idx, imageLookup),
    );

    return {
      data: recommendations,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر الاتصال بالخادم لجلب توصيات الذكاء الاصطناعي";
    return {
      data: [],
      error: message,
    };
  }
}

/**
 * Fetch store AI recommendations schedule via GET /stores/me/ai-recommendations/schedule
 */
export async function getAiRecommendationsSchedule(): Promise<{
  data: AiRecommendationsSchedule | null;
  error?: string;
}> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<AiRecommendationsSchedule>(
        getMany<FoodLoopEnvelope<AiRecommendationsSchedule>>(
          Endpoints.stores.aiRecommendationsSchedule,
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

    return {
      data: res.data ?? null,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر الاتصال بالخادم لجلب جدول دورات الذكاء الاصطناعي";
    return {
      data: null,
      error: message,
    };
  }
}

/**
 * Approve and apply an AI recommendation via POST /stores/me/ai-recommendations/{id}/approve
 */
export async function approveAiRecommendation(
  id: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<unknown>(
        createOne<FoodLoopEnvelope<unknown>>(
          Endpoints.stores.approveAiRecommendation(id),
          {},
          { token },
        ),
      ),
    );

    if (res.error) {
      return {
        success: false,
        error: res.error,
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "فشل في اعتماد توصية التسعير";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Reject an AI recommendation with optional reason via POST /stores/me/ai-recommendations/{id}/reject
 */
export async function rejectAiRecommendation(
  id: string,
  reason?: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<unknown>(
        createOne<FoodLoopEnvelope<unknown>, RejectRecommendationPayload>(
          Endpoints.stores.rejectAiRecommendation(id),
          { reason },
          { token },
        ),
      ),
    );

    if (res.error) {
      return {
        success: false,
        error: res.error,
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "فشل في رفض توصية التسعير";
    return {
      success: false,
      error: message,
    };
  }
}
