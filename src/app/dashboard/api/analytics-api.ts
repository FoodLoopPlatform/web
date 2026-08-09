import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { AnalyticsPeriod, StoreAnalytics } from "./types";

/** Fetch store performance analytics via GET /stores/me/analytics */
export function getStoreAnalytics(period: AnalyticsPeriod = "all") {
  const url = `${Endpoints.stores.analytics}?period=${encodeURIComponent(period)}`;

  return withAuth((token) =>
    unwrapEnvelope<StoreAnalytics>(
      getMany<FoodLoopEnvelope<StoreAnalytics>>(url, { token }),
    ),
  );
}
