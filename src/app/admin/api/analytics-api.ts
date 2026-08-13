import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { AnalyticsSummary } from "../types/admin.types";
import { normalizeAnalytics } from "./admin-normalizers";

/** GET /admin/analytics/summary */
export function getAnalyticsSummary() {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<AnalyticsSummary>(
      getMany<FoodLoopEnvelope<AnalyticsSummary>>(
        Endpoints.admin.analyticsSummary,
        { token },
      ),
    );
    if (result.data) {
      return { data: normalizeAnalytics(result.data) };
    }
    return result;
  });
}
