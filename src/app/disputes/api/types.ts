// Shapes here follow the live Swagger spec's "SupportTickets" tag
// (GET/POST /support-tickets, GET /support-tickets/{id}, POST
// /support-tickets/{id}/reply) — distinct from the admin-only
// /admin/support-tickets moderation endpoints.

/** Matches the `TicketPriority` enum in the Swagger spec. */
export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";

/** UI-normalized status — the backend's raw values get folded into this. */
export type TicketStatus = "Open" | "Pending" | "Closed";

export interface TicketReply {
  id: string;
  sender: "Admin" | "User" | "System" | "Store";
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userType: "Consumer" | "Store" | "Charity";
  userName: string;
  userEmail?: string;
  category: string;
  message: string;
  status: TicketStatus;
  priority: "High" | "Medium" | "Low";
  createdAt: string;
  updatedAt?: string;
  replies: TicketReply[];
}

/**
 * The Swagger spec documents `200: OK` with no response schema for every
 * SupportTickets read endpoint, so the raw shape is inferred defensively
 * (mirroring the same hedge already used for /admin/support-tickets).
 */
export interface RawSupportTicket {
  id: string;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
  userName?: string;
  userType?: string;
  category?: string;
  message?: string;
  description?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  replies?: TicketReply[];
}

/** Matches `CreateSupportTicketRequest` / `CustomerCreateTicketRequest`. */
export interface CreateSupportTicketRequest {
  category: string;
  message: string;
  priority?: TicketPriority;
}

/** Matches `CustomerReplyTicketRequest`. */
export interface ReplyToSupportTicketRequest {
  message: string;
}
