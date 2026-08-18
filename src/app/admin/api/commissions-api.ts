import { getMany, createOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  StoreCommission,
  RawStoreCommission,
  WithdrawCommissionRequest,
} from "../types/admin.types";
import { normalizeStoreCommission } from "./admin-normalizers";

/**
 * GET /admin/stores/commissions
 * Retrieves commission metrics, revenue, and balances across all stores.
 */
export function getAdminCommissions(): Promise<ApiResponse<StoreCommission[]>> {
  return withAuth<StoreCommission[]>(async (token) => {
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
      return {
        status: res.status,
        data: list.map(normalizeStoreCommission),
      };
    }

    if (res.error) {
      return {
        status: res.status,
        error: res.error,
      };
    }

    return { status: res.status ?? 200, data: [] };
  });
}

/**
 * POST /admin/stores/{id}/withdraw-commission
 * Executes an administrative withdrawal of accumulated commission for a given store.
 */
export function withdrawStoreCommission(
  storeId: string,
  amount: number,
): Promise<
  ApiResponse<{ success: boolean; message?: string; amount?: number }>
> {
  return withAuth<{ success: boolean; message?: string; amount?: number }>(
    async (token) => {
      const res = await unwrapEnvelope<{ success?: boolean; message?: string }>(
        createOne<
          FoodLoopEnvelope<{ success?: boolean; message?: string }>,
          WithdrawCommissionRequest
        >(Endpoints.admin.withdrawCommission(storeId), { amount }, { token }),
      );

      if (res.error) {
        return {
          status: res.status,
          error: res.error,
        };
      }

      return {
        status: res.status ?? 200,
        data: {
          success: true,
          message: res.data?.message ?? "Commission successfully withdrawn",
          amount,
        },
      };
    },
  );
}
