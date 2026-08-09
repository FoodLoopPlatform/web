import { getMany, createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  RawSupportTicket,
  SupportTicket,
  CreateSupportTicketRequest,
  ReplyToSupportTicketRequest,
} from "./types";

const PRIORITY_MAP: Record<string, SupportTicket["priority"]> = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Normal: "Medium",
  Urgent: "High",
  Critical: "High",
};

const STATUS_MAP: Record<string, SupportTicket["status"]> = {
  Open: "Open",
  Pending: "Pending",
  Closed: "Closed",
  Resolved: "Closed",
  InProgress: "Pending",
  "In Progress": "Pending",
};

function normalizeSupportTicket(raw: RawSupportTicket): SupportTicket {
  return {
    id: raw.id,
    userType: (raw.userType as SupportTicket["userType"]) ?? "Consumer",
    userName: raw.userFullName ?? raw.userName ?? "عميل",
    userEmail: raw.userEmail,
    category: raw.category ?? "طلب دعم",
    message: raw.message ?? raw.description ?? "",
    status: STATUS_MAP[raw.status ?? ""] ?? "Open",
    priority: PRIORITY_MAP[raw.priority ?? ""] ?? "Medium",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt,
    replies: raw.replies ?? [],
  };
}

/** GET /support-tickets — the authenticated account's own support tickets. */
export function getMySupportTickets() {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<RawSupportTicket[]>(
      getMany<FoodLoopEnvelope<RawSupportTicket[]>>(
        Endpoints.supportTickets.base,
        {
          token,
        },
      ),
    );
    return res.data
      ? { data: res.data.map(normalizeSupportTicket), status: res.status }
      : res;
  });
}

/** GET /support-tickets/{id} */
export function getSupportTicketById(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<RawSupportTicket>(
      getMany<FoodLoopEnvelope<RawSupportTicket>>(
        Endpoints.supportTickets.byId(id),
        { token },
      ),
    );
    return res.data
      ? { data: normalizeSupportTicket(res.data), status: res.status }
      : res;
  });
}

/** POST /support-tickets — files a new support ticket for the authenticated account. */
export function createSupportTicket(payload: CreateSupportTicketRequest) {
  return withAuth((token) =>
    unwrapEnvelope<RawSupportTicket>(
      createOne<FoodLoopEnvelope<RawSupportTicket>, CreateSupportTicketRequest>(
        Endpoints.supportTickets.base,
        payload,
        { token },
      ),
    ),
  );
}

/** POST /support-tickets/{id}/reply */
export function replyToSupportTicket(
  id: string,
  payload: ReplyToSupportTicketRequest,
) {
  return withAuth((token) =>
    unwrapEnvelope<RawSupportTicket>(
      createOne<
        FoodLoopEnvelope<RawSupportTicket>,
        ReplyToSupportTicketRequest
      >(Endpoints.supportTickets.reply(id), payload, { token }),
    ),
  );
}
