"use client";

import React from "react";
import { SupportTicket } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import {
  getPriorityBadgeClasses,
  statusBadgeTokens,
} from "../../constants/status-tokens";
import { arText } from "../../constants/arabic-mapper";
import { CheckIcon } from "@/components/icons";

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
    <table
      className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
    >
      <thead>
        <tr className="bg-surface border-b border-card-border">
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.ticketCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.senderCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.priorityCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.statusCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.dateCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
            {t.actionsCol}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
        {tickets.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-3 py-12 text-center text-xs font-semibold text-outline"
            >
              {t.noData}
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => {
            const priorityColor = getPriorityBadgeClasses(ticket.priority);
            const isClosed = ticket.status === "Closed";
            const badge =
              statusBadgeTokens[ticket.status] || statusBadgeTokens.Closed;
            const statusText = t[badge.textKey] || ticket.status;

            return (
              <tr
                key={ticket.id}
                className={`hover:bg-surface/60 transition-colors ${
                  isClosed ? "opacity-60" : ""
                }`}
              >
                <td className="px-3 py-3 max-w-[180px] truncate">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">
                      {arText(ticket.subject, isRtl)}
                    </span>
                    <span className="text-[10px] text-outline mt-0.5 font-mono">
                      {ticket.id}
                    </span>
                  </div>
                </td>

                <td className="px-2 py-3 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-on-surface">
                      {arText(ticket.userName, isRtl)}
                    </span>
                    <span className="text-[9px] text-primary-container font-bold uppercase tracking-wider mt-0.5">
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

                <td className="px-2 py-3 text-xs text-outline whitespace-nowrap">
                  {new Date(ticket.createdAt).toLocaleDateString(
                    isRtl ? "ar-EG" : "en-US",
                  )}
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onOpenTicket(ticket.id)}
                      className="px-3 py-1.5 text-[10px] font-bold bg-surface-container text-primary-container hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {isRtl ? "مراجعة والرد" : "Review & Reply"}
                    </button>
                    {!isClosed && (
                      <button
                        onClick={() => onCloseTicket(ticket.id)}
                        className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer"
                        title={
                          isRtl ? "إغلاق التذكرة كتم الحل" : "Resolve & Close"
                        }
                      >
                        <CheckIcon className="w-4 h-4" />
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
