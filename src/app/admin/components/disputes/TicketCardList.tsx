"use client";

import React from "react";
import { SupportTicket } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import {
  getPriorityBadgeClasses,
  statusBadgeTokens,
} from "../../constants/status-tokens";
import { CheckIcon } from "@/components/icons";

interface TicketCardListProps {
  tickets: SupportTicket[];
  t: AdminDictionary;
  isRtl?: boolean;
  onOpenTicket: (id: string) => void;
  onCloseTicket: (id: string) => void;
}

export const TicketCardList: React.FC<TicketCardListProps> = ({
  tickets,
  t,
  isRtl = false,
  onOpenTicket,
  onCloseTicket,
}) => {
  if (tickets.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-outline">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-surface-container">
      {tickets.map((ticket) => {
        const priorityColor = getPriorityBadgeClasses(ticket.priority);
        const isClosed = ticket.status === "Closed";
        const badge =
          statusBadgeTokens[ticket.status] || statusBadgeTokens.Closed;
        const statusText = t[badge.textKey] || ticket.status;

        return (
          <div
            key={ticket.id}
            className={`p-4 flex flex-col gap-3 transition-colors ${
              isClosed ? "opacity-60" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-on-surface">
                  {ticket.subject}
                </span>
                <span className="text-[10px] text-outline mt-0.5 font-mono">
                  {ticket.id}
                </span>
              </div>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${badge.classes}`}
              >
                {statusText}
              </span>
            </div>

            {/* Metadata fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1 text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.senderCol}
                </span>
                <span className="font-bold text-on-surface">
                  {ticket.userName}
                </span>
                <span className="text-[9px] text-primary-container font-bold uppercase tracking-wider block mt-0.5">
                  {ticket.userType === "Store"
                    ? isRtl
                      ? "متجر شريك"
                      : "Store Partner"
                    : ticket.userType === "Charity"
                      ? isRtl
                        ? "جمعية خيرية"
                        : "Charity"
                      : isRtl
                        ? "مستهلك"
                        : "Consumer"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.priorityCol}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 border rounded-full text-[9px] font-bold ${priorityColor} mt-0.5`}
                >
                  {ticket.priority === "High"
                    ? t.high
                    : ticket.priority === "Medium"
                      ? t.medium
                      : t.low}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.dateCol}
                </span>
                <span className="text-outline font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-US",
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container/50">
              <button
                onClick={() => onOpenTicket(ticket.id)}
                className="px-3 py-1.5 text-xs font-bold bg-surface-container text-primary-container hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                {isRtl ? "مراجعة والرد" : "Review & Reply"}
              </button>
              {!isClosed && (
                <button
                  onClick={() => onCloseTicket(ticket.id)}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>{isRtl ? "حل التذكرة" : "Resolve"}</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
