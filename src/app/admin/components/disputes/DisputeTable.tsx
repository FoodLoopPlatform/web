"use client";

import React from "react";
import { Dispute } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { CheckIcon } from "@/components/icons";

interface DisputeTableProps {
  disputes: Dispute[];
  t: AdminDictionary;
  isRtl?: boolean;
  onOpenDispute: (id: string) => void;
  onResolveDispute: (id: string) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({
  disputes,
  t,
  isRtl = false,
  onOpenDispute,
  onResolveDispute,
}) => {
  return (
    <table
      className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
    >
      <thead>
        <tr className="bg-surface border-b border-card-border">
          <th className="px-3 py-3 min-w-[280px] max-w-[450px] text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.reason}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.userCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.orderCol}
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
        {disputes.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-3 py-12 text-center text-xs font-semibold text-outline"
            >
              {t.noData}
            </td>
          </tr>
        ) : (
          disputes.map((dispute) => (
            <tr
              key={dispute.id}
              onClick={() => onOpenDispute(dispute.id)}
              className={`hover:bg-surface/80 transition-colors cursor-pointer ${
                dispute.isResolved ? "opacity-75" : ""
              }`}
            >
              <td className="px-3 py-3 min-w-[280px] max-w-[450px]">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface hover:text-primary-container transition-colors">
                    {dispute.reason || "—"}
                  </span>
                  <span className="text-[10px] text-outline mt-0.5 font-mono">
                    {dispute.id}
                  </span>
                </div>
              </td>

              <td className="px-2 py-3 whitespace-nowrap text-xs font-bold text-on-surface">
                {dispute.raisedByName}
              </td>

              <td className="px-2 py-3 whitespace-nowrap text-xs text-outline font-mono">
                {dispute.orderId
                  ? dispute.orderId.slice(0, 8).toUpperCase()
                  : "—"}
              </td>

              <td className="px-2 py-3 whitespace-nowrap">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                    dispute.isResolved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {dispute.isResolved
                    ? t.disputeResolvedLabel || (isRtl ? "تم حله" : "Resolved")
                    : t.disputeOpenLabel || (isRtl ? "قيد المراجعة" : "Open")}
                </span>
              </td>

              <td className="px-2 py-3 text-xs text-outline whitespace-nowrap">
                {new Date(dispute.createdAt).toLocaleDateString(
                  isRtl ? "ar-EG" : "en-US",
                )}
              </td>

              <td
                className="px-3 py-3 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onOpenDispute(dispute.id)}
                    className="px-3 py-1.5 text-[10px] font-bold bg-surface-container text-primary-container hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {isRtl ? "مراجعة والتفاصيل" : "Review & Details"}
                  </button>
                  {!dispute.isResolved && (
                    <button
                      onClick={() => onResolveDispute(dispute.id)}
                      className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer"
                      title={isRtl ? "تسوية النزاع" : "Resolve Dispute"}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
