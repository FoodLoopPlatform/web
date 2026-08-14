import { getMany, updateOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  Consumer,
  Store,
  Charity,
  ActivityLog,
} from "../types/admin.types";
import {
  normalizeStore,
  normalizeCharity,
  normalizeConsumer,
  RawEntity,
} from "./admin-normalizers";

/** GET /admin/stores */
export function getAdminStores() {
  return withAuth<Store[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.stores,
        { token },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeStore) };
    }
    return { status: res.status, data: [] };
  });
}

/** GET /admin/stores/pending */
export function getPendingStores() {
  return withAuth<Store[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[]>(
      getMany<FoodLoopEnvelope<RawEntity[]>>(Endpoints.admin.storesPending, {
        token,
      }),
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeStore) };
    }
    return res as unknown as ApiResponse<Store[]>;
  });
}

/** PATCH /admin/stores/{id}/verify */
export function verifyStore(
  id: string,
  action: "Approved" | "Rejected" = "Approved",
  note?: string,
) {
  return withAuth(async (token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, { action: string; note?: string }>(
        Endpoints.admin.verifyStore(id),
        { action, note },
        { token },
      ),
    ),
  );
}

/** PATCH /admin/charities/{id}/verify */
export function verifyCharity(
  id: string,
  action: "Approved" | "Rejected" = "Approved",
  note?: string,
) {
  return withAuth(async (token) =>
    unwrapEnvelope<Charity>(
      updateOne<FoodLoopEnvelope<Charity>, { action: string; note?: string }>(
        Endpoints.admin.verifyCharity(id),
        { action, note },
        { token },
      ),
    ),
  );
}

/** PATCH /admin/users/{id}/status or /users/{id} */
export function updateUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING",
  reason?: string,
) {
  const backendStatus = status === "SUSPENDED" ? "Suspended" : "Active";
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<{ id: string; status: string }>(
      updateOne<
        FoodLoopEnvelope<{ id: string; status: string }>,
        { status: string; reason?: string; note?: string }
      >(
        Endpoints.admin.userStatus(id),
        { status: backendStatus, reason, note: reason },
        { token },
      ),
    );
    if (res.error) {
      return unwrapEnvelope<{ id: string; status: string }>(
        updateOne<
          FoodLoopEnvelope<{ id: string; status: string }>,
          { status: string; reason?: string; note?: string }
        >(
          Endpoints.admin.userById(id),
          { status: backendStatus, reason, note: reason },
          { token },
        ),
      );
    }
    return res;
  });
}

/** GET /admin/users/{id}/activity-log */
export function getUserActivityLog(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.userActivityLog(id),
        { token },
      ),
    );
    if (!res.error && res.data && res.data.length > 0) return res;

    const storeRes = await unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.storeActivityLog(id),
        { token },
      ),
    );
    if (!storeRes.error && storeRes.data && storeRes.data.length > 0)
      return storeRes;

    return unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.charityActivityLog(id),
        { token },
      ),
    );
  });
}

/** GET /admin/stores/{id}/activity-log */
export function getStoreActivityLog(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.storeActivityLog(id),
        { token },
      ),
    ),
  );
}

/** GET /admin/charities/{id}/activity-log */
export function getCharityActivityLog(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.charityActivityLog(id),
        { token },
      ),
    ),
  );
}

/** GET /admin/charities */
export function getAdminCharities() {
  return withAuth<Charity[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.charities,
        {
          token,
        },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeCharity) };
    }
    return { status: res.status, data: [] };
  });
}

/** GET /users?role=Customer */
export function getAdminConsumers() {
  return withAuth<Consumer[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.consumers,
        {
          token,
        },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeConsumer) };
    }
    return { status: res.status, data: [] };
  });
}
