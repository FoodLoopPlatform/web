import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import type { StoreCommission, RawStoreCommission } from "../types/admin.types";
import { normalizeStoreCommission } from "./admin-normalizers";

/**
 * Server-side fetcher for GET /admin/stores/commissions
 */
export function getAdminCommissionsServer(): Promise<
  ApiResponse<StoreCommission[]>
> {
  return withServerAuth<StoreCommission[]>(async (token) => {
    const res = await unwrapEnvelope<
      RawStoreCommission[] | { items: RawStoreCommission[] }
    >(
      getMany<
        FoodLoopEnvelope<RawStoreCommission[] | { items: RawStoreCommission[] }>
      >(Endpoints.admin.commissions, { token }),
    );

    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawStoreCommission[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeStoreCommission) };
    }

    if (res.error) {
      return { status: res.status, error: res.error };
    }

    return { status: res.status ?? 200, data: [] };
  });
}
