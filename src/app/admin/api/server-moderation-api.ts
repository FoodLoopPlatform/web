import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import type { ModerationItem } from "../types/admin.types";
import { normalizeProductToModerationItem } from "./admin-normalizers";

export function getModerationQueueServer(params?: {
  search?: string;
  flagType?: string;
  minConfidence?: number;
  maxConfidence?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withServerAuth(async (token) => {
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
      error: aiRes.error || "Failed to load moderation queue",
      status: aiRes.status,
    };
  });
}
