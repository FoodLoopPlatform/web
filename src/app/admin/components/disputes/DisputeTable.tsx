"use client";

import React from "react";
import { Dispute } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { CheckIcon } from "@/components/icons";

interface DisputeTableProps {
  disputes: Dispute[];
  t: AdminDictionary;
  isRtl?: boolean;
  onResolveDispute: (id: string) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({
  disputes,
  t,
  isRtl = false,
  onResolveDispute,
}) => {
  return (
    <table
      className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
    >
      <thead>
        <tr className="bg-surface border-b border-card-border">
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
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
              className={`hover:bg-surface/60 transition-colors ${
                dispute.isResolved ? "opacity-60" : ""
              }`}
            >
              <td className="px-3 py-3 max-w-[220px] truncate">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface">
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
                {dispute.orderId ? dispute.orderId.slice(0, 8).toUpperCase() : "—"}
              </td>

              <td className="px-2 py-3 whitespace-nowrap">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                    dispute.isResolved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dispute.isResolved
                    ? t.disputeResolvedLabel
                    : t.disputeOpenLabel}
                </span>
              </td>

              <td className="px-2 py-3 text-xs text-outline whitespace-nowrap">
                {new Date(dispute.createdAt).toLocaleDateString(
                  isRtl ? "ar-EG" : "en-US",
                )}
              </td>

              <td className="px-3 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  {!dispute.isResolved ? (
                    <button
                      onClick={() => onResolveDispute(dispute.id)}
                      className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer text-[10px] font-bold whitespace-nowrap"
                    >
                      <CheckIcon className="w-4 h-4" />
                      {t.resolveDisputeBtn}
                    </button>
                  ) : (
                    <span className="text-[10px] text-outline italic max-w-[160px] truncate">
                      {dispute.adminNote || "—"}
                    </span>
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
