import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { StoreReview, ReviewsStats, RatingDistribution } from "./types";

/**
 * Normalizes a raw review object from the API.
 */
export function normalizeStoreReview(
  raw: Record<string, unknown>,
): StoreReview {
  const rawName = String(
    raw.userFullName ||
      raw.userName ||
      raw.customerName ||
      raw.authorName ||
      "",
  ).trim();

  const customerName =
    !rawName || rawName === "string" || rawName.toLowerCase() === "user"
      ? "عميل المتجر"
      : rawName;

  return {
    id: String(raw.id || raw.reviewId || `rev-${Math.random()}`),
    orderId: raw.orderId ? String(raw.orderId) : undefined,
    userId: raw.userId ? String(raw.userId) : undefined,
    userFullName: customerName,
    customerName,
    organizationId: raw.organizationId ? String(raw.organizationId) : undefined,
    organizationName: raw.organizationName
      ? String(raw.organizationName)
      : undefined,
    rating: Math.max(1, Math.min(5, Math.round(Number(raw.rating) || 5))),
    comment:
      typeof raw.comment === "string" && raw.comment.trim() !== "string"
        ? raw.comment.trim()
        : "",
    createdAt: String(
      raw.createdAt || raw.date || raw.createdDate || new Date().toISOString(),
    ),
  };
}

/**
 * Calculates review distribution and summary statistics.
 */
export function calculateReviewsStats(reviews: StoreReview[]): ReviewsStats {
  const totalReviews = reviews.length;
  const distribution: RatingDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  let totalStars = 0;
  let positiveCount = 0;
  let withCommentsCount = 0;

  for (const rev of reviews) {
    const r = Math.max(1, Math.min(5, Math.round(rev.rating))) as
      1 | 2 | 3 | 4 | 5;
    distribution[r] = (distribution[r] || 0) + 1;
    totalStars += r;
    if (r >= 4) positiveCount++;
    if (rev.comment && rev.comment.length > 0) withCommentsCount++;
  }

  const averageRating =
    totalReviews > 0 ? Number((totalStars / totalReviews).toFixed(1)) : 0;
  const positivePercentage =
    totalReviews > 0 ? Math.round((positiveCount / totalReviews) * 100) : 0;

  return {
    averageRating,
    totalReviews,
    distribution,
    positivePercentage,
    withCommentsCount,
  };
}

/**
 * Fetch reviews for the current merchant store via GET /stores/{id}/reviews
 */
export async function getMyStoreReviews(storeIdParam?: string): Promise<{
  data: StoreReview[];
  stats: ReviewsStats;
  storeName?: string;
  error?: string;
}> {
  try {
    let targetStoreId = storeIdParam;
    let storeName: string | undefined = undefined;

    // If storeId is not provided, fetch from /stores/me
    if (!targetStoreId) {
      const storeProfileRes = await withAuth((token) =>
        unwrapEnvelope<{ id: string; name?: string }>(
          getMany<FoodLoopEnvelope<{ id: string; name?: string }>>(
            Endpoints.stores.me,
            { token },
          ),
        ),
      );

      if (storeProfileRes.data?.id) {
        targetStoreId = storeProfileRes.data.id;
        storeName = storeProfileRes.data.name;
      }
    }

    if (!targetStoreId) {
      return {
        data: [],
        stats: calculateReviewsStats([]),
        error: "لم يتم العثور على معرّف المتجر",
      };
    }

    const reviewsRes = await withAuth((token) =>
      unwrapEnvelope<Record<string, unknown>[]>(
        getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
          Endpoints.stores.reviews(targetStoreId as string),
          { token },
        ),
      ),
    );

    if (reviewsRes.error) {
      return {
        data: [],
        stats: calculateReviewsStats([]),
        error: reviewsRes.error,
      };
    }

    let rawList: Record<string, unknown>[] = [];
    if (Array.isArray(reviewsRes.data)) {
      rawList = reviewsRes.data;
    } else if (reviewsRes.data && typeof reviewsRes.data === "object") {
      const obj = reviewsRes.data as { items?: Record<string, unknown>[] };
      if (Array.isArray(obj.items)) {
        rawList = obj.items;
      }
    }

    const reviews = rawList.map(normalizeStoreReview);
    const stats = calculateReviewsStats(reviews);

    return {
      data: reviews,
      stats,
      storeName,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر الاتصال بالخادم لجلب تقييمات المتجر";
    return {
      data: [],
      stats: calculateReviewsStats([]),
      error: message,
    };
  }
}
