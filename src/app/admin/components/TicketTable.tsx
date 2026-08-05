import React from "react";
import { SupportTicket } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { getPriorityBadgeClasses, statusBadgeTokens } from "../constants/status-tokens";
import { arText } from "../constants/arabic-mapper";

interface TicketTableProps {
  tickets: SupportTicket[];
  t: AdminDictionary;
  isRtl?: boolean;
  onOpenTicket: (id: string) => void;
  onCloseTicket: (id: string) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  t,
  isRtl = false,
  onOpenTicket,
  onCloseTicket,
}) => {
  return (
    <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
      <thead>
        <tr className="bg-[#fafaf4] border-b border-[#e0e6df]">
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.ticketCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.senderCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.priorityCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.statusCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.dateCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] text-center whitespace-nowrap">
            {t.actionsCol}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#eeeee9]">
        {tickets.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-3 py-12 text-center text-xs font-semibold text-[#707a70]">
              {t.noData}
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => {
            const priorityColor = getPriorityBadgeClasses(ticket.priority);
            const isClosed = ticket.status === "Closed";
            const badge = statusBadgeTokens[ticket.status] || statusBadgeTokens.Closed;
            const statusText = t[badge.textKey] || ticket.status;

            return (
              <tr
                key={ticket.id}
                className={`hover:bg-[#fafaf4]/60 transition-colors ${
                  isClosed ? "opacity-60" : ""
                }`}
              >
                <td className="px-3 py-3 max-w-[180px] truncate">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1c19]">{arText(ticket.subject, isRtl)}</span>
                    <span className="text-[10px] text-[#707a70] mt-0.5 font-mono">{ticket.id}</span>
                  </div>
                </td>

                <td className="px-2 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1c19]">{arText(ticket.userName, isRtl)}</span>
                    <span className="text-[9px] text-[#266b40] font-bold uppercase tracking-wider mt-0.5">
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
                </td>

                <td className="px-2 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 border rounded-full text-[9px] font-bold ${priorityColor} whitespace-nowrap`}
                  >
                    {ticket.priority === "High"
                      ? t.high
                      : ticket.priority === "Medium"
                      ? t.medium
                      : t.low}
                  </span>
                </td>

                <td className="px-2 py-3 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${badge.classes}`}
                  >
                    {statusText}
                  </span>
                </td>

                <td className="px-2 py-3 text-xs text-[#707a70] whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-US"
                  )}
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onOpenTicket(ticket.id)}
                      className="px-3 py-1.5 text-[10px] font-bold bg-[#eeeee9] text-[#00381a] hover:bg-[#e0e6df] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? "مراجعة والرد" : "Review & Reply"}
                    </button>
                    {!isClosed && (
                      <button
                        onClick={() => onCloseTicket(ticket.id)}
                        className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer"
                        title={isRtl ? "إغلاق التذكرة كتم الحل" : "Resolve & Close"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
};
