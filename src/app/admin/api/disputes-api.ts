import { getMany, createOne, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  SupportTicket,
  RawBackendTicket,
  RawBackendDispute,
  Dispute,
  RawDispute,
} from "../types/admin.types";
import {
  normalizeSupportTicket,
  normalizeDisputeToTicket,
  normalizeDispute,
} from "./admin-normalizers";

/** GET /admin/disputes?pageNumber=1&pageSize=10&isResolved=... */
export function getAdminDisputes(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.disputes;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.isResolved !== undefined)
      query.set("isResolved", String(params.isResolved));

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<RawBackendDispute[]>(
      getMany<FoodLoopEnvelope<RawBackendDispute[]>>(url, { token }),
    );
    if (result.data && Array.isArray(result.data)) {
      return { data: result.data.map(normalizeDisputeToTicket) };
    }
    return { data: [] as SupportTicket[] };
  });
}

/** GET /admin/support-tickets?pageNumber=1&pageSize=10&status=...&priority=... */
export function getSupportTickets(params?: {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.supportTickets;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params?.priority && params.priority !== "ALL")
      query.set("priority", params.priority);

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
        (result.data as Record<string, unknown>)?.tickets;

    if (Array.isArray(rawList)) {
      return {
        data: rawList.map((t) => normalizeSupportTicket(t as RawBackendTicket)),
      };
    }

    return { data: [] as SupportTicket[] };
  });
}

/** GET /admin/support-tickets/{id} */
export function getSupportTicketById(id: string) {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<RawBackendTicket>(
      getMany<FoodLoopEnvelope<RawBackendTicket>>(
        Endpoints.admin.supportTicketById(id),
        { token },
      ),
    );
    if (result.data) {
      return { data: normalizeSupportTicket(result.data) };
    }
    return { data: null as SupportTicket | null };
  });
}

/** POST /admin/support-tickets/{id}/reply */
export function replyToSupportTicket(id: string, message: string) {
  return withAuth(async (token) => {
    let res = await unwrapEnvelope<RawBackendTicket>(
      createOne<FoodLoopEnvelope<RawBackendTicket>, string>(
        Endpoints.admin.replySupportTicket(id),
        message,
        { token },
      ),
    );
    if (res.error) {
      res = await unwrapEnvelope<RawBackendTicket>(
        createOne<FoodLoopEnvelope<RawBackendTicket>, { message: string }>(
          Endpoints.admin.replySupportTicket(id),
          { message },
          { token },
        ),
      );
    }
    if (res.data) {
      return { data: normalizeSupportTicket(res.data) };
    }
    return { error: res.error || "Failed to post reply" };
  });
}

/** PATCH /admin/support-tickets/{id}/close */
export function closeSupportTicket(id: string, adminNote?: string) {
  return withAuth(async (token) => {
    return unwrapEnvelope<SupportTicket>(
      updateOne<
        FoodLoopEnvelope<SupportTicket>,
        { note?: string; adminNote?: string }
      >(
        Endpoints.admin.closeSupportTicket(id),
        adminNote ? { note: adminNote, adminNote } : {},
        { token },
      ),
    );
  });
}

/** GET /admin/disputes?pageNumber=&pageSize=&isResolved= */
export function getDisputes(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.disputes;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.isResolved !== undefined) {
      query.set("isResolved", String(params.isResolved));
    }

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, { token }),
    );

    const dataObj = (result.data || {}) as Record<string, unknown>;
    const rawList = Array.isArray(result.data)
      ? result.data
      : Array.isArray(dataObj.items)
        ? dataObj.items
        : Array.isArray(dataObj.data)
          ? dataObj.data
          : Array.isArray(dataObj.disputes)
            ? dataObj.disputes
            : Array.isArray(dataObj.results)
              ? dataObj.results
              : null;

    if (Array.isArray(rawList)) {
      return {
        data: rawList.map((item) =>
          normalizeDispute(item as Record<string, unknown>),
        ),
      };
    }

    return { data: [] as Dispute[] };
  });
}

/** PATCH /admin/disputes/{id}/resolve */
export function resolveDispute(id: string, adminNote: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<RawDispute>(
      updateOne<FoodLoopEnvelope<RawDispute>, { adminNote: string }>(
        Endpoints.admin.resolveDispute(id),
        { adminNote },
        { token },
      ),
    ),
  );
}
