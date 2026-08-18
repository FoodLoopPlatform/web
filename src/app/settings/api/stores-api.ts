import { getMany, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  Store,
  StoreCommissionDetails,
  UpdateStoreLocationPayload,
  UpdateStoreProfilePayload,
} from "./types";

export function getMyStore() {
  return withAuth((token) =>
    unwrapEnvelope<Store>(
      getMany<FoodLoopEnvelope<Store>>(Endpoints.stores.me, { token }),
    ),
  );
}

function normalizeStoreCommissionDetails(
  raw: Record<string, unknown> | null | undefined,
): StoreCommissionDetails {
  if (!raw) {
    return {
      commissionRate: 10,
      totalSales: 0,
      totalCommissionDue: 0,
      withdrawnAmount: 0,
      pendingAmount: 0,
    };
  }

  const rawRate = Number(
    raw.commissionRate ??
      raw.commissionPercent ??
      raw.platformCommissionPercent ??
      raw.rate ??
      10,
  );
  const commissionRate =
    rawRate <= 1 && rawRate > 0 ? Math.round(rawRate * 100) : rawRate;

  const totalSales = Number(
    raw.totalSales ?? raw.totalRevenue ?? raw.grossSales ?? 0,
  );
  const totalCommissionDue = Number(
    raw.totalCommissionDue ??
      raw.totalCommission ??
      raw.commissionAmount ??
      Math.round(totalSales * (commissionRate / 100) * 100) / 100,
  );
  const withdrawnAmount = Number(
    raw.withdrawnAmount ??
      raw.withdrawnCommission ??
      raw.collectedCommission ??
      0,
  );
  const pendingAmount = Number(
    raw.pendingAmount ??
      raw.withdrawableAmount ??
      raw.currentBalance ??
      Math.max(0, totalCommissionDue - withdrawnAmount),
  );

  return {
    storeId: (raw.storeId as string) || (raw.id as string) || undefined,
    storeName: (raw.storeName as string) || (raw.name as string) || undefined,
    commissionRate,
    totalSales,
    totalCommissionDue,
    withdrawnAmount,
    pendingAmount,
    effectiveDate: (raw.effectiveDate as string) || undefined,
    updatedAt: (raw.updatedAt as string) || undefined,
    settlementTerms:
      (raw.settlementTerms as string) || (raw.notes as string) || undefined,
    autoDeductionEnabled: raw.autoDeductionEnabled !== false,
  };
}

/**
 * GET /stores/me/commission
 * Retrieves the platform commission applied to the logged-in store.
 */
export function getMyStoreCommission() {
  return withAuth<StoreCommissionDetails>(async (token) => {
    const res = await unwrapEnvelope<Record<string, unknown>>(
      getMany<FoodLoopEnvelope<Record<string, unknown>>>(
        Endpoints.stores.commission,
        { token },
      ),
    );

    if (res.data) {
      return {
        status: res.status,
        data: normalizeStoreCommissionDetails(res.data),
      };
    }

    if (res.error) {
      return {
        status: res.status,
        error: res.error,
      };
    }

    return {
      status: res.status ?? 200,
      data: normalizeStoreCommissionDetails(null),
    };
  });
}

export function updateMyStoreLocation(payload: UpdateStoreLocationPayload) {
  return withAuth((token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, UpdateStoreLocationPayload>(
        Endpoints.stores.location,
        payload,
        { token },
      ),
    ),
  );
}

export function updateMyStoreProfile(payload: UpdateStoreProfilePayload) {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("Name", payload.name);
  if (payload.description !== undefined) {
    formData.append("Description", payload.description);
  }
  if (payload.businessCategory !== undefined) {
    formData.append("BusinessCategory", payload.businessCategory);
  }
  if (payload.phone !== undefined) formData.append("Phone", payload.phone);
  if (payload.email !== undefined) formData.append("Email", payload.email);
  if (payload.openingHours != null) {
    formData.append("OpeningHours", payload.openingHours);
  }
  if (payload.logoFile) formData.append("Logo", payload.logoFile);
  if (payload.coverFile) formData.append("CoverPhoto", payload.coverFile);

  return withAuth((token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, FormData>(
        Endpoints.stores.me,
        formData,
        { token },
      ),
    ),
  );
}
