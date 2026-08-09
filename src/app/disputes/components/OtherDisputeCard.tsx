import Link from "next/link";
import { DisputeStatusBadge } from "./DisputeStatusBadge";
import { getInitials } from "../lib/dispute-format";
import type { SupportTicket } from "../api/types";

export function OtherDisputeCard({ ticket }: { ticket: SupportTicket }) {
  const lastMessage =
    ticket.replies.length > 0
      ? ticket.replies[ticket.replies.length - 1].message
      : ticket.message;

  return (
    <Link
      href={`/disputes/${ticket.id}`}
      className="bg-surface-container-low border border-outline-variant/50 hover:border-outline-variant rounded-2xl p-6 flex flex-col gap-4 flex-1 min-w-0 transition-all hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-10 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant shrink-0">
            {getInitials(ticket.userName)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-on-surface truncate">
              {ticket.userName}
            </span>
            <span className="font-mono text-xs text-on-surface-variant opacity-70">
              #{ticket.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
        </div>
        <DisputeStatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-on-surface-variant bg-surface-container-high/60 rounded-lg p-3 line-clamp-2">
        {lastMessage}
      </p>
    </Link>
  );
}
