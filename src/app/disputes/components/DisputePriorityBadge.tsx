import { PRIORITY_BADGE_CLASSES, PRIORITY_LABELS } from "../lib/dispute-format";
import type { SupportTicket } from "../api/types";

export function DisputePriorityBadge({
  priority,
}: {
  priority: SupportTicket["priority"];
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${PRIORITY_BADGE_CLASSES[priority]}`}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
