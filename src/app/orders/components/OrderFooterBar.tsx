"use client";

import React from "react";
import { OrderTab } from "../types/orders.types";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";

interface OrderFooterBarProps {
  currentStatus: OrderTab;
  itemsVerified?: boolean;
  isRefunded?: boolean;
  onPrintInvoice?: () => void;
  onOpenCancelModal?: () => void;
  onOpenRefundModal?: () => void;
  onAdvanceStatus?: () => void;
}

export function OrderFooterBar({
  currentStatus,
  itemsVerified = true,
  isRefunded = false,
  onPrintInvoice,
  onOpenCancelModal,
  onOpenRefundModal,
  onAdvanceStatus,
}: OrderFooterBarProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const getPrimaryButtonText = () => {
    switch (currentStatus) {
      case "PENDING":
        return t.confirmOrder || (isRtl ? "تأكيد الطلب" : "Confirm Order");
      case "CONFIRMED":
        return t.startPreparing || (isRtl ? "بدء التحضير" : "Start Preparing");
      case "PREPARING":
        return t.markDelivered || (isRtl ? "تم التسليم" : "Mark Delivered");
      case "DELIVERED":
        return isRtl ? "طلب مكتمل" : "Completed";
      case "CANCELLED":
        return isRtl ? "طلب ملغى" : "Cancelled";
      default:
        return t.confirmOrder || (isRtl ? "تأكيد الطلب" : "Confirm Order");
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="sticky bottom-0 left-0 right-0 z-40 bg-white border-t border-outline-variant/60 shadow-lg py-4 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Left Utility Links: Items verified | Print Invoice */}
      <div className="flex items-center gap-6 text-xs text-on-surface-variant font-medium">
        <div className="flex items-center gap-2 text-emerald-800 font-bold">
          <Icon
            name="check_circle"
            className="w-4 h-4 text-emerald-700"
            fill={itemsVerified}
          />
          <span>{t.itemsVerified}</span>
        </div>

        <div className="h-4 w-px bg-outline-variant/60" />

        <button
          type="button"
          onClick={onPrintInvoice}
          className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer font-bold underline underline-offset-4 decoration-outline-variant"
        >
          <Icon name="download" className="w-4 h-4 text-outline" />
          <span>{t.printInvoice}</span>
        </button>
      </div>

      {/* Right Action Buttons: Refund + Cancel Order + Primary Action Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {onOpenRefundModal && !isRefunded && (
          <button
            type="button"
            onClick={onOpenRefundModal}
            className="py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Icon name="currency_exchange" className="w-4 h-4" />
            <span>{isRtl ? "استرداد المبلغ" : "Refund Order"}</span>
          </button>
        )}

        {isRefunded && (
          <span className="py-2 px-3 rounded-xl bg-rose-100 text-rose-800 font-bold text-xs flex items-center gap-1.5">
            <Icon name="check_circle" className="w-4 h-4" />
            <span>{isRtl ? "تم استرداد المبلغ" : "Refunded"}</span>
          </span>
        )}

        {currentStatus !== "CANCELLED" && currentStatus !== "DELIVERED" && (
          <button
            type="button"
            onClick={onOpenCancelModal}
            className="py-2.5 px-4 rounded-xl text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.cancelOrder}
          </button>
        )}

        <button
          type="button"
          disabled={
            currentStatus === "DELIVERED" || currentStatus === "CANCELLED"
          }
          onClick={onAdvanceStatus}
          className="py-2.5 px-6 rounded-xl bg-[#0B3C26] hover:bg-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          <Icon name="tune" className="w-4 h-4 text-emerald-300" />
          <span>{getPrimaryButtonText()}</span>
        </button>
      </div>
    </div>
  );
}
