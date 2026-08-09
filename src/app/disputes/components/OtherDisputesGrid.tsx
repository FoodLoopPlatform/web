"use client";

import { use } from "react";
import type { ApiResponse } from "@/utils/server";
import { OtherDisputeCard } from "./OtherDisputeCard";
import type { SupportTicket } from "../api/types";

interface OtherDisputesGridProps {
  ticketsPromise: Promise<ApiResponse<SupportTicket[]>>;
  currentTicketId: string;
}

export function OtherDisputesGrid({
  ticketsPromise,
  currentTicketId,
}: OtherDisputesGridProps) {
  const res = use(ticketsPromise);
  const others = (res.data ?? [])
    .filter((t) => t.id !== currentTicketId)
    .slice(0, 4);

  if (others.length === 0) return null;

  return (
    <div className="flex flex-col gap-md w-full">
      <h2 className="text-lg font-bold text-primary">نزاعات أخرى</h2>
      <div className="flex flex-wrap gap-md w-full">
        {others.map((ticket) => (
          <OtherDisputeCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}
