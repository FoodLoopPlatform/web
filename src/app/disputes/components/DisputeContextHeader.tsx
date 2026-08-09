import { DisputeStatusBadge } from "./DisputeStatusBadge";
import { DisputePriorityBadge } from "./DisputePriorityBadge";
import { formatDisputeDate } from "../lib/dispute-format";
import type { SupportTicket } from "../api/types";

export function DisputeContextHeader({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-md w-full">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-sm text-link">
          تذكرة رقم #{ticket.id.slice(0, 8).toUpperCase()}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          نزاع بخصوص: {ticket.category}
        </h1>
        <span className="text-sm text-on-surface-variant">
          تم الفتح بتاريخ {formatDisputeDate(ticket.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <DisputePriorityBadge priority={ticket.priority} />
        <DisputeStatusBadge status={ticket.status} />
      </div>
    </div>
  );
}
