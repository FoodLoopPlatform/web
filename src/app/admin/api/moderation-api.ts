import { getMany, createOne, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { ModerationItem } from "../types/admin.types";
import { normalizeProductToModerationItem } from "./admin-normalizers";

export function getModerationQueue(params?: {
  search?: string;
  flagType?: string;
  minConfidence?: number;
  maxConfidence?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withAuth(async (token) => {
    const pendingQuery = new URLSearchParams();
    pendingQuery.set("pageNumber", String(params?.pageNumber ?? 1));
    pendingQuery.set("pageSize", String(params?.pageSize ?? 50));
    if (params?.minConfidence !== undefined) {
      pendingQuery.set(
        "confidenceThreshold",
        String(params.minConfidence / 100),
      );
    }

    const aiRes = await unwrapEnvelope<Record<string, unknown>[]>(
      getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
        `${Endpoints.admin.productsPendingAi}?${pendingQuery.toString()}`,
        { token },
      ),
    );

    if (aiRes.data && Array.isArray(aiRes.data)) {
      let items = aiRes.data.map(normalizeProductToModerationItem);
      if (params?.flagType && params.flagType !== "ALL") {
        items = items.filter((item) =>
          item.flags.includes(
            params.flagType as ModerationItem["flags"][number],
          ),
        );
      }
      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.productNameAr.toLowerCase().includes(q) ||
            item.productNameEn.toLowerCase().includes(q) ||
            item.storeNameAr.toLowerCase().includes(q) ||
            item.storeNameEn.toLowerCase().includes(q),
        );
      }
      return { data: items };
    }

    return {
      error: aiRes.error || "Failed to fetch moderation queue",
      status: aiRes.status,
    };
  });
}

/** POST /admin/products/{id}/approve */
export function approveModerationItem(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>, Record<string, never>>(
        Endpoints.admin.approveProduct(id),
        {},
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

/** PATCH /admin/products/{id}/reject */
export function rejectModerationItem(id: string, reason?: string) {
  return withAuth(async (token) => {
    const noteText = reason || "Rejected by admin";
    const res = await unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>, { note: string }>(
        Endpoints.admin.rejectProduct(id),
        { note: noteText },
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

/** PATCH /admin/products/{id}/request-changes */
export function requestChangesModerationItem(id: string, notes?: string) {
  return withAuth(async (token) => {
    const noteText = notes || "Requested changes by admin";
    const res = await unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>, { note: string }>(
        Endpoints.admin.requestChangesProduct(id),
        { note: noteText },
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

export function resetModerationQueue() {
  return getModerationQueue();
}
