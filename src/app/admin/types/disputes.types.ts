import { Dispute, SupportTicket, AuditLogItem } from "./admin.types";
import { Review } from "../api/admin-api";

export type DisputeTab = "Disputes" | "Tickets" | "Reviews";

export type DisputeActionType = "RESOLVE" | "REJECT" | "CLOSE";

export interface DisputeActionModalState {
  isOpen: boolean;
  type: DisputeActionType | null;
  targetId: string | null;
  itemType: "dispute" | "ticket" | null;
  targetTitle: string;
}

export interface DisputesShellProps {
  initialDisputes?: Dispute[];
  initialTickets?: SupportTicket[];
  initialReviews?: Review[];
  initialAuditLogs?: AuditLogItem[];
}

export interface DisputeCardListProps {
  disputes: Dispute[];
  isLoading?: boolean;
  isRtl?: boolean;
  onSelectDispute: (d: Dispute) => void;
  onAction: (
    type: DisputeActionType,
    id: string,
    title: string,
    itemType: "dispute" | "ticket",
  ) => void;
}

export interface DisputeTableProps {
  disputes: Dispute[];
  isLoading?: boolean;
  isRtl?: boolean;
  onSelectDispute: (d: Dispute) => void;
  onAction: (
    type: DisputeActionType,
    id: string,
    title: string,
    itemType: "dispute" | "ticket",
  ) => void;
}

export interface TicketCardListProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
  isRtl?: boolean;
  onSelectTicket: (t: SupportTicket) => void;
}

export interface TicketTableProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
  isRtl?: boolean;
  onSelectTicket: (t: SupportTicket) => void;
}

export interface TicketDrawerProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  isRtl?: boolean;
  onClose: () => void;
  onAction: (
    type: DisputeActionType,
    id: string,
    title: string,
    itemType: "dispute" | "ticket",
  ) => void;
  onReply?: (ticketId: string, message: string) => Promise<void>;
}

export interface ReviewCardListProps {
  reviews: Review[];
  isLoading?: boolean;
  isRtl?: boolean;
  onDeleteReview: (reviewId: string) => void;
}

export interface ReviewTableProps {
  reviews: Review[];
  isLoading?: boolean;
  isRtl?: boolean;
  onDeleteReview: (reviewId: string) => void;
}
