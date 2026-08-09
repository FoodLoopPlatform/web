import {
  USER_TYPE_LABELS,
  formatDisputeDate,
  getInitials,
} from "../lib/dispute-format";
import type { SupportTicket } from "../api/types";

export function ConsumerInfoPanel({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="border-l border-outline-variant/40 lg:pl-md flex flex-col gap-lg w-full lg:w-[260px] shrink-0">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full border-2 border-primary-fixed-dim flex items-center justify-center bg-primary-fixed text-primary font-bold text-lg shrink-0">
          {getInitials(ticket.userName)}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-lg font-bold text-on-surface">
            {ticket.userName}
          </span>
          <span className="text-xs font-bold text-primary-container uppercase tracking-wide">
            {USER_TYPE_LABELS[ticket.userType]}
          </span>
          {ticket.userEmail && (
            <span className="text-xs text-on-surface-variant" dir="ltr">
              {ticket.userEmail}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t border-outline-variant/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-on-surface-variant opacity-70">
            تاريخ الفتح
          </span>
          <span className="font-mono text-sm text-on-surface">
            {formatDisputeDate(ticket.createdAt)}
          </span>
        </div>
        {ticket.updatedAt && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface-variant opacity-70">
              آخر تحديث
            </span>
            <span className="font-mono text-sm text-on-surface">
              {formatDisputeDate(ticket.updatedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
