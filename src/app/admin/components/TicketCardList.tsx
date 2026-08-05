import React from "react";
import { SupportTicket } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { getPriorityBadgeClasses, statusBadgeTokens } from "../constants/status-tokens";

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
      <div className="px-6 py-12 text-center text-xs font-semibold text-[#707a70]">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-[#eeeee9]">
      {tickets.map((ticket) => {
        const priorityColor = getPriorityBadgeClasses(ticket.priority);
        const isClosed = ticket.status === "Closed";
        const badge = statusBadgeTokens[ticket.status] || statusBadgeTokens.Closed;
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
                <span className="text-xs font-bold text-[#1a1c19]">{ticket.subject}</span>
                <span className="text-[10px] text-[#707a70] mt-0.5 font-mono">{ticket.id}</span>
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
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.senderCol}
                </span>
                <span className="font-bold text-[#1a1c19]">{ticket.userName}</span>
                <span className="text-[9px] text-[#266b40] font-bold uppercase tracking-wider block mt-0.5">
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
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
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
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.dateCol}
                </span>
                <span className="text-[#707a70] font-medium">
                  {new Date(ticket.createdAt).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-US"
                  )}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeee9]/50">
              <button
                onClick={() => onOpenTicket(ticket.id)}
                className="px-3 py-1.5 text-xs font-bold bg-[#eeeee9] text-[#00381a] hover:bg-[#e0e6df] rounded-lg transition-colors cursor-pointer"
              >
                {isRtl ? "مراجعة والرد" : "Review & Reply"}
              </button>
              {!isClosed && (
                <button
                  onClick={() => onCloseTicket(ticket.id)}
                  className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer text-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
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
