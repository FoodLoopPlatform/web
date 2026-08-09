"use client";

import React from "react";
import { Dispute } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { CheckIcon } from "@/components/icons";

interface DisputeCardListProps {
  disputes: Dispute[];
  t: AdminDictionary;
  isRtl?: boolean;
  onResolveDispute: (id: string) => void;
}

export const DisputeCardList: React.FC<DisputeCardListProps> = ({
  disputes,
  t,
  isRtl = false,
  onResolveDispute,
}) => {
  if (disputes.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-outline">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-surface-container">
      {disputes.map((dispute) => (
        <div
          key={dispute.id}
          className={`p-4 flex flex-col gap-3 transition-colors ${
            dispute.isResolved ? "opacity-60" : ""
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">
                {dispute.reason || "—"}
              </span>
              <span className="text-[10px] text-outline mt-0.5 font-mono">
                {dispute.id}
              </span>
            </div>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                dispute.isResolved
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {dispute.isResolved ? t.disputeResolvedLabel : t.disputeOpenLabel}
            </span>
          </div>

          {/* Metadata fields */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-outline block">
                {t.userCol}
              </span>
              <span className="font-bold text-on-surface">
                {dispute.raisedByName}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-outline block">
                {t.orderCol}
              </span>
              <span className="text-outline font-mono">
                {dispute.orderId
                  ? dispute.orderId.slice(0, 8).toUpperCase()
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-outline block">
                {t.dateCol}
              </span>
              <span className="text-outline font-medium">
                {new Date(dispute.createdAt).toLocaleDateString(
                  isRtl ? "ar-EG" : "en-US",
                )}
              </span>
            </div>
          </div>

          {/* Actions */}
          {!dispute.isResolved ? (
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container/50">
              <button
                onClick={() => onResolveDispute(dispute.id)}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors cursor-pointer text-xs"
              >
                <CheckIcon className="w-4 h-4" />
                <span>{t.resolveDisputeBtn}</span>
              </button>
            </div>
          ) : (
            dispute.adminNote && (
              <p className="text-[11px] text-outline italic pt-2 border-t border-surface-container/50">
                {dispute.adminNote}
              </p>
            )
          )}
        </div>
      ))}
    </div>
  );
};
