import {
  REPLY_SENDER_LABELS,
  formatDisputeDateTime,
} from "../lib/dispute-format";
import type { TicketReply } from "../api/types";

// The merchant (viewer) is "Store" — their own replies sit on the reading
// start side; everyone else's replies sit on the end side.
const IS_OWN_MESSAGE: Record<TicketReply["sender"], boolean> = {
  Store: true,
  Admin: false,
  User: false,
  System: false,
};

const BUBBLE_CLASSES: Record<TicketReply["sender"], string> = {
  Store: "bg-primary-fixed text-primary",
  Admin: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  User: "bg-surface-container-low text-on-surface",
  System: "bg-surface-container-high text-on-surface-variant",
};

export function ReplyBubble({ reply }: { reply: TicketReply }) {
  const isOwn = IS_OWN_MESSAGE[reply.sender];

  return (
    <div
      className={`flex flex-col gap-1 max-w-[85%] ${isOwn ? "items-start self-start" : "items-end self-end"}`}
    >
      <div
        className={`rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${BUBBLE_CLASSES[reply.sender]}`}
      >
        {reply.message}
      </div>
      <span className="text-[11px] text-on-surface-variant opacity-70 px-1">
        {REPLY_SENDER_LABELS[reply.sender]} ·{" "}
        {formatDisputeDateTime(reply.createdAt)}
      </span>
    </div>
  );
}
