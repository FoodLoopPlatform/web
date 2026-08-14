"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  orderId: string;
}

export function CancelOrderModal({
  isOpen,
  onClose,
  onConfirmCancel,
  orderId,
}: CancelOrderModalProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  if (!isOpen) return null;

  const displayId =
    orderId.length > 8 ? `ORD-${orderId.slice(0, 4).toUpperCase()}` : orderId;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full min-w-[320px] sm:min-w-[420px] p-6 sm:p-8 border border-card-border shadow-2xl flex flex-col gap-5 shrink-0 box-border select-none"
        style={{
          width: "100%",
          maxWidth: "28rem",
          minWidth: "320px",
          boxSizing: "border-box",
        }}
      >
        {/* Header Icon + Title */}
        <div className="flex items-center gap-3.5 text-rose-700">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
            <Icon name="warning" className="w-6 h-6 text-rose-700" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-extrabold text-on-surface font-sans">
              {t.confirmCancelTitle}
            </h3>
            <span className="text-xs font-mono font-bold text-outline">
              #{displayId}
            </span>
          </div>
        </div>

        {/* Confirmation Description */}
        <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
          {t.confirmCancelDesc}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container mt-1">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-outline-variant text-on-surface font-bold text-xs hover:bg-surface-container-low transition-all active:scale-95 cursor-pointer"
          >
            {t.keepOrder}
          </button>

          <button
            type="button"
            onClick={onConfirmCancel}
            className="py-2.5 px-5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {t.cancelOrder}
          </button>
        </div>
      </div>
    </div>
  );
}
