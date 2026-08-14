import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { Dispute } from "../types";

function normalizeDispute(raw: Record<string, unknown>): Dispute {
  const getStr = (val: unknown) =>
    typeof val === "string" || typeof val === "number"
      ? String(val)
      : undefined;
  const id =
    getStr(raw.id) ||
    getStr(raw._id) ||
    `disp-${Math.random().toString(36).substring(2, 7)}`;
  const orderId = getStr(raw.orderId) || getStr(raw.productId);
  const raisedByName =
    getStr(raw.raisedByName) ||
    getStr(raw.reporterName) ||
    getStr(raw.userFullName) ||
    getStr(raw.userName) ||
    getStr(raw.reportedBy) ||
    getStr(raw.userEmail) ||
    "عميل";
  const raisedByType =
    (raw.userType as Dispute["raisedByType"]) ||
    (raw.raisedByType as Dispute["raisedByType"]) ||
    "Consumer";
  const reason =
    getStr(raw.reason) ||
    getStr(raw.details) ||
    getStr(raw.description) ||
    getStr(raw.message) ||
    getStr(raw.productTitle) ||
    "طلب مراجعة أو تظلم بشأن طلب";
  const isResolved = Boolean(
    raw.isResolved ?? (raw.status === "Resolved" || raw.status === "Closed"),
  );
  const adminNote = getStr(raw.adminNote) || getStr(raw.note);
  const createdAt = getStr(raw.createdAt) || new Date().toISOString();
  const resolvedAt = getStr(raw.resolvedAt);

  return {
    id,
    orderId,
    raisedByName,
    raisedByType,
    reason,
    isResolved,
    adminNote,
    createdAt,
    resolvedAt,
  };
}

/** GET /stores/me/disputes?pageNumber=&pageSize=&isResolved= */
export function getStoreDisputes(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.stores.disputes;
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
