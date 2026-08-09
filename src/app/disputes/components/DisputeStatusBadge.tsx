import { STATUS_BADGE_CLASSES, STATUS_LABELS } from "../lib/dispute-format";
import type { TicketStatus } from "../api/types";

export function DisputeStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
