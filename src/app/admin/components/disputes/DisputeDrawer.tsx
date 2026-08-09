"use client";

import React, { useState } from "react";
import { Dispute } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { arText } from "../../constants/arabic-mapper";
import { CloseIcon, CheckIcon } from "@/components/icons";

interface DisputeDrawerProps {
  dispute: Dispute | null;
  t: AdminDictionary;
  isRtl?: boolean;
  onCloseDrawer: () => void;
  onResolveDispute: (id: string, adminNote: string) => void;
}

export const DisputeDrawer: React.FC<DisputeDrawerProps> = ({
  dispute,
  t,
  isRtl = false,
  onCloseDrawer,
  onResolveDispute,
}) => {
  const [adminNoteInput, setAdminNoteInput] = useState("");

  if (!dispute) return null;

  const isResolved = dispute.isResolved;
  const statusText = isResolved
    ? t.disputeResolvedLabel || (isRtl ? "تم حله" : "Resolved")
    : t.disputeOpenLabel || (isRtl ? "قيد المراجعة" : "Open");

  const handleConfirmResolve = () => {
    const noteText = adminNoteInput.trim() || (isRtl ? "تمت معالجة النزاع وتسويته بواسطة الإدارة" : "Dispute resolved by admin.");
    onResolveDispute(dispute.id, noteText);
    setAdminNoteInput("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCloseDrawer}
        className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRtl ? "left-0" : "right-0"
        } z-[9999] w-[90vw] sm:w-[520px] shrink-0 bg-white shadow-2xl flex flex-col p-6 overflow-y-auto gap-5`}
      >
        <div className="flex flex-col gap-6 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-container pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                {isRtl ? "تفاصيل النزاع والتظلم" : "Dispute Details"}
              </span>
              <h3 className="text-base font-extrabold text-on-surface mt-0.5 font-mono">
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

          {/* Dispute Metadata Card */}
          <div className="bg-surface p-4 rounded-xl border border-card-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-bold">
                  {isRtl ? "مُقدّم التظلم:" : "Raised By:"}
                </span>
                <span className="text-xs font-bold text-on-surface">
                  {arText(dispute.raisedByName, isRtl)}
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  isResolved
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {statusText}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-outline border-t border-surface-container pt-2 mt-1">
              <span>
                {dispute.raisedByType === "Store"
                  ? isRtl
                    ? "متجر شريك"
                    : "Store Partner"
                  : dispute.raisedByType === "Charity"
                    ? isRtl
                      ? "جمعية خيرية"
                      : "Charity"
                    : isRtl
                      ? "مستهلك"
                      : "Consumer"}
              </span>
              {dispute.orderId && (
                <span className="font-mono text-[11px] text-on-surface">
                  {isRtl ? "رقم الطلب: " : "Order: "}
                  {dispute.orderId}
                </span>
              )}
            </div>
          </div>

          {/* Reason & Details */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-extrabold text-outline uppercase">
              {isRtl ? "سبب النزاع والتفاصيل" : "Dispute Reason & Details"}
            </h4>
            <div className="p-4 bg-surface rounded-xl border border-surface-container text-xs text-on-surface leading-relaxed font-medium">
              {arText(dispute.reason, isRtl)}
            </div>
          </div>

          {/* Admin Resolution Note if resolved */}
          {isResolved && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-extrabold text-outline uppercase">
                {isRtl ? "ملاحظات القرار والتسوية" : "Resolution Notes"}
              </h4>
              <div className="p-3 bg-green-50/70 border border-green-200 rounded-xl text-xs text-green-900 leading-relaxed font-semibold">
                {dispute.adminNote || (isRtl ? "تم حل النزاع بدون ملاحظات إضافية" : "Resolved without additional notes.")}
              </div>
              {dispute.resolvedAt && (
                <span className="text-[10px] text-outline font-mono">
                  {isRtl ? "تاريخ الحل: " : "Resolved At: "}
                  {new Date(dispute.resolvedAt).toLocaleString(isRtl ? "ar-EG" : "en-US")}
                </span>
              )}
            </div>
          )}

          {/* Resolution Action Input (If Open) */}
          {!isResolved && (
            <div className="flex flex-col gap-2.5 mt-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
              <h4 className="text-xs font-extrabold text-on-surface">
                {isRtl ? "إضافة قرار الإدارة وحل النزاع:" : "Administrative Resolution Note:"}
              </h4>
              <textarea
                rows={3}
                placeholder={isRtl ? "اكتب ملاحظة الحل والإجراء المتخذ لإغلاق النزاع..." : "Type resolution note or actions taken..."}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                className={`w-full p-3 text-xs rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-surface-tint bg-white text-on-surface ${
                  isRtl ? "text-right" : "text-left"
                }`}
              />
              <button
                onClick={handleConfirmResolve}
                className="py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckIcon className="w-4 h-4" />
                {isRtl ? "اعتماد وتسوية النزاع" : "Confirm Dispute Resolution"}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-container pt-4 mt-4">
          <button
            onClick={onCloseDrawer}
            className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            {t.drawerClose || (isRtl ? "إغلاق النافذة" : "Close")}
          </button>
        </div>
      </div>
    </>
  );
};
