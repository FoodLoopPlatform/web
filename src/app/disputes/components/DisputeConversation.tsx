import { ReplyBubble } from "./ReplyBubble";
import type { TicketReply } from "../api/types";

export function DisputeConversation({ replies }: { replies: TicketReply[] }) {
  if (replies.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-xs font-bold text-on-surface-variant tracking-wide">
        سجل المحادثة
      </span>
      <div className="flex flex-col gap-3 w-full">
        {replies.map((reply) => (
          <ReplyBubble key={reply.id} reply={reply} />
        ))}
      </div>
    </div>
  );
}
