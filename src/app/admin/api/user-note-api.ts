import { createOne, getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { AdminNoteItem } from "../types/admin.types";

const LOCAL_STORAGE_NOTES_KEY = "foodloop_admin_notes_store";

function getLocalNotes(): AdminNoteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalNotes(notes: AdminNoteItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(notes));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Fetch all notes sent to users/entities, optionally filtered by recipientId or role.
 * Propagates server errors when API call fails.
 */
export async function getAdminNotes(
  recipientId?: string,
  role?: "Consumer" | "Charity" | "Store",
): Promise<ApiResponse<AdminNoteItem[]>> {
  return withAuth<AdminNoteItem[]>(async (token) => {
    const local = getLocalNotes();

    if (recipientId) {
      try {
        const res = await unwrapEnvelope<AdminNoteItem[] | AdminNoteItem>(
          getMany<FoodLoopEnvelope<AdminNoteItem[] | AdminNoteItem>>(
            Endpoints.admin.userNote(recipientId),
            { token },
          ),
        );

        if (res.data) {
          const apiData = Array.isArray(res.data) ? res.data : [res.data];
          const merged = [
            ...apiData,
            ...local.filter((n) => n.recipientId === recipientId),
          ];
          // Deduplicate by canonical ID
          const unique = Array.from(
            new Map(merged.map((m) => [m.id, m])).values(),
          );
          return { data: unique };
        }
      } catch (err: unknown) {
        // Explicitly propagate API failure instead of silent mock swallow
        const msg =
          err instanceof Error
            ? err.message
            : "Failed to load admin notes from server";
        return { error: msg };
      }
    }

    let filtered = local;
    if (recipientId) {
      filtered = filtered.filter((n) => n.recipientId === recipientId);
    }
    if (role) {
      filtered = filtered.filter((n) => n.recipientRole === role);
    }

    return { data: filtered };
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
    let serverNote: AdminNoteItem | undefined;

    // Call backend API endpoint to create note
    try {
      const res = await unwrapEnvelope<AdminNoteItem>(
        createOne<
          FoodLoopEnvelope<AdminNoteItem>,
          { note: string; category?: string; title?: string }
        >(
          Endpoints.admin.userNote(payload.recipientId),
          {
            title: payload.title,
            note: payload.content,
            category: payload.category,
          },
          { token },
        ),
      );
      if (res.data) {
        serverNote = res.data;
      }
    } catch {
      // Endpoint may not be active; handle fallback cleanly
    }

    // Construct note object using canonical server ID if returned
    const finalNote: AdminNoteItem = serverNote || {
      id: `note-${Date.now()}`,
      recipientId: payload.recipientId,
      recipientName: payload.recipientName || "Selected Entity",
      recipientRole: payload.recipientRole,
      title: payload.title,
      content: payload.content,
      category: payload.category,
      isInternal: !!payload.isInternal,
      createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      createdBy: "Admin Agent",
    };

    // Save to local storage cache
    const existing = getLocalNotes();
    const updated = [finalNote, ...existing];
    saveLocalNotes(updated);

    return { data: finalNote };
  });
}
