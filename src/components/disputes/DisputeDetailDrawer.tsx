"use client";

import React from "react";
import type { Dispute } from "@/app/disputes/types";
import { CloseIcon } from "@/components/icons";

interface DisputeDetailDrawerProps {
  dispute: Dispute | null;
  onCloseDrawer: () => void;
}

const raisedByTypeLabel: Record<string, string> = {
  Consumer: "مستهلك",
  Store: "متجر شريك",
  Charity: "جمعية خيرية",
};

export const DisputeDetailDrawer: React.FC<DisputeDetailDrawerProps> = ({
  dispute,
  onCloseDrawer,
}) => {
  if (!dispute) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCloseDrawer}
        className="fixed inset-0 z-[9998] bg-black/55"
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 bottom-0 left-0 z-[9999] w-[90vw] sm:w-[520px] shrink-0 bg-white shadow-2xl flex flex-col p-6 overflow-y-auto gap-5">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-container pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                تفاصيل النزاع
              </span>
              <h3 className="text-base font-extrabold text-on-surface mt-0.5">
                {dispute.id}
              </h3>
            </div>
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Metadata Card */}
          <div className="bg-surface p-4 rounded-xl border border-card-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">
                {dispute.raisedByName}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  dispute.isResolved
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {dispute.isResolved ? "تم حله" : "قيد المراجعة"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-outline">
              <span>
                {raisedByTypeLabel[dispute.raisedByType || "Consumer"]}
              </span>
              {dispute.orderId && (
                <span className="font-mono">
                  طلب رقم: {dispute.orderId.slice(0, 8).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Reason / Description */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-extrabold text-outline uppercase">
              سبب النزاع
            </h4>
            <div className="p-4 bg-surface rounded-xl border border-surface-container text-xs text-on-surface-variant leading-relaxed">
              {dispute.reason || "—"}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-extrabold text-outline uppercase mb-1">
                تاريخ الإنشاء
              </h4>
              <p className="text-xs text-on-surface font-medium">
                {new Date(dispute.createdAt).toLocaleString("ar-EG")}
              </p>
            </div>
            {dispute.resolvedAt && (
              <div>
                <h4 className="text-xs font-extrabold text-outline uppercase mb-1">
                  تاريخ الحل
                </h4>
                <p className="text-xs text-on-surface font-medium">
                  {new Date(dispute.resolvedAt).toLocaleString("ar-EG")}
                </p>
              </div>
            )}
          </div>

          {/* Admin Resolution Note */}
          {dispute.adminNote && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-extrabold text-outline uppercase">
                ملاحظة الإدارة
              </h4>
              <div className="p-3 rounded-xl text-xs flex flex-col gap-1 bg-primary-fixed/30 border border-primary-fixed">
                <p className="text-on-surface leading-relaxed">
                  {dispute.adminNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-surface-container pt-4 mt-6">
          <button
            onClick={onCloseDrawer}
            className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </>
  );
};
