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
export function getAdminStores(params?: { page?: number; pageSize?: number; search?: string; status?: string; signal?: AbortSignal }) {
  return withAuth<Store[]>(async (token) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    
    if (params?.search) {
      query.append("search", params.search);
      query.set("pageSize", "1000"); // Fetch all for client-side filtering
    } else if (params?.pageSize) {
      query.append("pageSize", params.pageSize.toString());
    }
    if (params?.status && params.status !== "ALL") query.append("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        `${Endpoints.admin.stores}${qs}`,
        { token, signal: params?.signal },
      ),
    );
    if (!res.data) return { status: res.status, data: [] as Store[] };

    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      let data = list.map(normalizeStore);
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        data = data.filter(i => 
          i.email.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
        );
      }
      return { 
        status: res.status, 
        data: data.slice(0, params?.pageSize || 5),
        totalCount: params?.search ? data.length : res.totalCount,
        totalPages: params?.search ? Math.ceil(data.length / (params?.pageSize || 5)) : res.totalPages,
        page: res.page,
        pageSize: res.pageSize,
        hasNextPage: res.hasNextPage,
        hasPreviousPage: res.hasPreviousPage
      };
    }
    return { status: res.status, data: [] as Store[] };
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
export function getAdminCharities(params?: { page?: number; pageSize?: number; search?: string; status?: string; signal?: AbortSignal }) {
  return withAuth<Charity[]>(async (token) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    
    if (params?.search) {
      query.append("search", params.search);
      query.set("pageSize", "1000");
    } else if (params?.pageSize) {
      query.append("pageSize", params.pageSize.toString());
    }
    if (params?.status && params.status !== "ALL") query.append("status", params.status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        `${Endpoints.admin.charities}${qs}`,
        {
          token,
          signal: params?.signal
        },
      ),
    );
    if (!res.data) return { status: res.status, data: [] as Charity[] };

    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      let data = list.map(normalizeCharity);
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        data = data.filter(i => 
          i.email.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
        );
      }
      return { 
        status: res.status, 
        data: data.slice(0, params?.pageSize || 5),
        totalCount: params?.search ? data.length : res.totalCount,
        totalPages: params?.search ? Math.ceil(data.length / (params?.pageSize || 5)) : res.totalPages,
        page: res.page,
        pageSize: res.pageSize,
        hasNextPage: res.hasNextPage,
        hasPreviousPage: res.hasPreviousPage
      };
    }
    return { status: res.status, data: [] as Charity[] };
  });
}

/** GET /users?role=Customer */
export function getAdminConsumers(params?: { page?: number; pageSize?: number; search?: string; status?: string; signal?: AbortSignal }) {
  return withAuth<Consumer[]>(async (token) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    
    if (params?.search) {
      query.append("search", params.search);
      query.set("pageSize", "1000"); // Fetch all for client-side filtering
    } else if (params?.pageSize) {
      query.append("pageSize", params.pageSize.toString());
    }
    if (params?.status && params.status !== "ALL") query.append("status", params.status);
    const qs = query.toString() ? `&${query.toString()}` : ""; // already has ?role=Customer

    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        `${Endpoints.admin.consumers}${qs}`,
        {
          token,
          signal: params?.signal
        },
      ),
    );
    if (!res.data) return { status: res.status, data: [] as Consumer[] };

    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      let data = list.map(normalizeConsumer);
      if (params?.search) {
        const q = params.search.toLowerCase().trim();
        data = data.filter(i => 
          i.email.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
        );
      }
      return { 
        status: res.status, 
        data: data.slice(0, params?.pageSize || 5),
        totalCount: params?.search ? data.length : res.totalCount,
        totalPages: params?.search ? Math.ceil(data.length / (params?.pageSize || 5)) : res.totalPages,
        page: res.page,
        pageSize: res.pageSize,
        hasNextPage: res.hasNextPage,
        hasPreviousPage: res.hasPreviousPage
      };
    }
    return { status: res.status, data: [] as Consumer[] };
  });
}
