import { getMany, deleteOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { Review } from "../types/admin.types";

export function getAdminReviews(params?: {
  storeId?: string;
  rating?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.reviews;
    const query = new URLSearchParams();
    if (params?.storeId) query.set("storeId", params.storeId);
    if (params?.rating) query.set("rating", String(params.rating));
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, { token }),
    );

    const rawList = Array.isArray(result.data)
      ? result.data
      : (result.data as Record<string, unknown>)?.items ||
        (result.data as Record<string, unknown>)?.data ||
        (result.data as Record<string, unknown>)?.reviews;

    if (Array.isArray(rawList)) {
      return { data: rawList as Review[] };
    }

    return { data: [] as Review[] };
  });
}

/** DELETE /admin/reviews/{id} */
export function deleteReview(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(
        Endpoints.admin.reviewById(id),
        undefined,
        { token },
      ),
    ),
  );
}
