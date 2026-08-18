"use client";

import React from "react";
import type { Dispute } from "@/app/disputes/types";

interface DisputeCardListProps {
  disputes: Dispute[];
  onOpenDispute: (id: string) => void;
}

export const DisputeCardList: React.FC<DisputeCardListProps> = ({
  disputes,
  onOpenDispute,
}) => {
  if (disputes.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-outline">
        لا توجد نزاعات لعرضها
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-surface-container">
      {disputes.map((dispute) => (
        <div
          key={dispute.id}
          onClick={() => onOpenDispute(dispute.id)}
          className={`p-4 sm:p-5 flex flex-col gap-3.5 transition-colors cursor-pointer hover:bg-surface/50 ${
            dispute.isResolved ? "opacity-75" : ""
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-on-surface">
                {dispute.reason || "—"}
              </span>
              <span className="text-xs text-outline mt-0.5 font-mono">
                {dispute.id}
              </span>
            </div>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                dispute.isResolved
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {dispute.isResolved ? "تم حله" : "قيد المراجعة"}
            </span>
          </div>

          {/* Metadata fields */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-1 text-xs sm:text-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-outline block mb-0.5">
                العميل
              </span>
              <span className="font-bold text-on-surface">
                {dispute.raisedByName}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-outline block mb-0.5">
                رقم الطلب
              </span>
              <span className="text-outline font-mono font-semibold">
                {dispute.orderId
                  ? dispute.orderId.slice(0, 8).toUpperCase()
                  : "—"}
              </span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-outline block mb-0.5">
                التاريخ
              </span>
              <span className="text-outline font-medium">
                {new Date(dispute.createdAt).toLocaleDateString("ar-EG")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-between gap-2 pt-2.5 border-t border-surface-container/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onOpenDispute(dispute.id)}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-surface-container text-primary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
