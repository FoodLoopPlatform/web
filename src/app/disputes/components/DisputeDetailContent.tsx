"use client";

import { use, useState } from "react";
import { AlertCircleIcon } from "@/components/icons";
import type { ApiResponse } from "@/utils/server";
import { DisputeContextHeader } from "./DisputeContextHeader";
import { ConsumerInfoPanel } from "./ConsumerInfoPanel";
import { DisputeConcernCard } from "./DisputeConcernCard";
import { DisputeConversation } from "./DisputeConversation";
import { DisputeResponseForm } from "./DisputeResponseForm";
import { OtherDisputesGrid } from "./OtherDisputesGrid";
import type { SupportTicket, TicketReply } from "../api/types";

interface DisputeDetailContentProps {
  ticketPromise: Promise<ApiResponse<SupportTicket>>;
  otherTicketsPromise: Promise<ApiResponse<SupportTicket[]>>;
}

export function DisputeDetailContent({
  ticketPromise,
  otherTicketsPromise,
}: DisputeDetailContentProps) {
  const res = use(ticketPromise);
  const ticket = res.data;
  const [extraReplies, setExtraReplies] = useState<TicketReply[]>([]);

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center bg-surface-container-high/20 rounded-2xl border-2 border-dashed border-outline-variant p-xl flex flex-col items-center">
        <AlertCircleIcon className="h-12 w-12 mb-3 text-on-surface-variant/40" />
        <p className="font-bold text-lg text-on-surface">
          تعذر العثور على هذا النزاع
        </p>
        <p className="text-sm text-on-surface-variant mt-1.5">
          {res.error ?? "قد يكون الرابط غير صحيح أو تم حذف التذكرة."}
        </p>
      </div>
    );
  }

  const replies = [...ticket.replies, ...extraReplies];

  return (
    <div className="flex flex-col gap-lg w-full">
      <DisputeContextHeader ticket={ticket} />

      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xs p-6 sm:p-10 w-full">
        <div className="flex flex-col lg:flex-row gap-lg w-full">
          <ConsumerInfoPanel ticket={ticket} />

          <div className="flex flex-col gap-lg flex-1 min-w-0">
            <DisputeConcernCard message={ticket.message} />
            <DisputeConversation replies={replies} />
            <DisputeResponseForm
              ticketId={ticket.id}
              status={ticket.status}
              onReplySent={(reply) =>
                setExtraReplies((prev) => [...prev, reply])
              }
            />
          </div>
        </div>
      </div>

      <OtherDisputesGrid
        ticketsPromise={otherTicketsPromise}
        currentTicketId={ticket.id}
      />
    </div>
  );
}
