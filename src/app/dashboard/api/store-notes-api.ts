import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";

export interface StoreAdminNote {
  id: string;
  sentByAdminId?: string;
  sentByAdminName?: string;
  recipientUserId?: string;
  recipientName?: string;
  category?: "Warning" | "Notice" | "Alert" | string;
  template?: string | null;
  title: string;
  body: string;
  isInternal?: boolean;
  sentAt: string;
}

function normalizeStoreNote(raw: Record<string, unknown>): StoreAdminNote {
  return {
    id: String(
      raw.id || raw._id || `note-${Math.random().toString(36).substring(2, 7)}`,
    ),
    sentByAdminId: raw.sentByAdminId ? String(raw.sentByAdminId) : undefined,
    sentByAdminName: raw.sentByAdminName
      ? String(raw.sentByAdminName)
      : "إدارة المنصة",
    recipientUserId: raw.recipientUserId
      ? String(raw.recipientUserId)
      : undefined,
    recipientName: raw.recipientName ? String(raw.recipientName) : undefined,
    category: (raw.category as string) || "Notice",
    template: raw.template ? String(raw.template) : null,
    title: String(raw.title || "ملاحظة إدارية"),
    body: String(raw.body || raw.content || raw.message || ""),
    isInternal: Boolean(raw.isInternal),
    sentAt: String(raw.sentAt || raw.createdAt || new Date().toISOString()),
  };
}

/**
 * Fetch notes sent by admin to current authenticated store via GET /stores/me/notes
 */
export async function getStoreNotes(params?: {
  pageNumber?: number;
  pageSize?: number;
  lang?: string;
}): Promise<ApiResponse<StoreAdminNote[]>> {
  return withAuth<StoreAdminNote[]>(async (token) => {
    let url = Endpoints.stores.notes;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));

    const qs = query.toString();
    if (qs) {
      url += `?${qs}`;
    }

    const res = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, {
        token,
        lang: params?.lang || "ar",
      }),
    );

    if (res.error || !res.data) {
      return {
        error: res.error || "تعذر تحميل ملاحظات الإدارة",
        status: res.status,
      };
    }

    const dataObj = (res.data || {}) as Record<string, unknown>;
    const rawList = Array.isArray(res.data)
      ? res.data
      : Array.isArray(dataObj.items)
        ? dataObj.items
        : Array.isArray(dataObj.data)
          ? dataObj.data
          : Array.isArray(dataObj.notes)
            ? dataObj.notes
            : [];

    const notes = rawList.map((item) =>
      normalizeStoreNote(item as Record<string, unknown>),
    );

    return { data: notes, status: res.status };
  });
}
