import { createOne, getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { AdminNoteItem } from "../types/admin.types";

/**
 * Fetch all notes sent to users/entities, optionally filtered by recipientId or role.
 * Propagates server errors when API call fails.
 */
export async function getAdminNotes(
  recipientId?: string,
  role?: "Consumer" | "Charity" | "Store",
): Promise<ApiResponse<AdminNoteItem[]>> {
  return withAuth<AdminNoteItem[]>(async (token) => {
    if (!recipientId) {
      return { data: [] };
    }

    try {
      const res = await unwrapEnvelope<AdminNoteItem[] | AdminNoteItem>(
        getMany<FoodLoopEnvelope<AdminNoteItem[] | AdminNoteItem>>(
          `${Endpoints.admin.userNotes(recipientId)}?pageSize=50`,
          { token },
        ),
      );

      if (res.data) {
        const apiData = Array.isArray(res.data) ? res.data : [res.data];
        return { data: apiData };
      }
      return { data: [] };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to load admin notes from server";
      return { error: msg };
    }
  });
}

/**
 * Send a message or note to a Consumer, Charity, or Store.
 * Requires explicit recipientId and relies on canonical server-assigned IDs.
 */
export async function sendAdminNote(payload: {
  recipientId: string;
  recipientName: string;
  recipientRole: "Consumer" | "Charity" | "Store";
  title: string;
  content: string;
  category: "INFO" | "WARNING" | "URGENT" | "INTERNAL";
  isInternal?: boolean;
}): Promise<ApiResponse<AdminNoteItem>> {
  if (!payload.recipientId) {
    return { error: "Recipient ID is required to compose note." };
  }

  return withAuth<AdminNoteItem>(async (token) => {
    try {
      const res = await unwrapEnvelope<AdminNoteItem>(
        createOne<
          FoodLoopEnvelope<AdminNoteItem>,
          {
            body: string;
            category?: string;
            title?: string;
            template?: string;
            isInternal?: boolean;
          }
        >(
          Endpoints.admin.userNotes(payload.recipientId),
          {
            title: payload.title,
            body: payload.content,
            category: payload.category,
            isInternal: !!payload.isInternal,
          },
          { token },
        ),
      );

      if (res.data) {
        return { data: res.data };
      }

      return { error: res.error || "Failed to send note" };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send note";
      return { error: msg };
    }
  });
}
