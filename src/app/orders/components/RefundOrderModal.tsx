"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { refundOrder } from "../api/orders-api";
import { useAppLang } from "@/store/use-app-lang";

interface RefundOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  maxAmount: number;
  currency?: string;
  onRefundSuccess?: (amount: number, reason: string) => void;
}

export function RefundOrderModal({
  isOpen,
  onClose,
  orderId,
  maxAmount,
  currency = "EGP",
  onRefundSuccess,
}: RefundOrderModalProps) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";

  const [amount, setAmount] = useState<string>(String(maxAmount || ""));
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage(
        isRtl
          ? "يرجى إدخال مبلغ استرداد صحيح أكبر من 0."
          : "Please enter a valid refund amount greater than 0.",
      );
      return;
    }

    if (!reason.trim()) {
      setErrorMessage(
        isRtl
          ? "يرجى كتابة سبب الاسترداد."
          : "Please provide a reason for the refund.",
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    const res = await refundOrder(
      orderId,
      {
        amount: numAmount,
        reason: reason.trim(),
      },
      lang,
    );

    setIsLoading(false);

    if (res.success) {
      if (onRefundSuccess) {
        onRefundSuccess(numAmount, reason.trim());
      }
      onClose();
    } else {
      setErrorMessage(
        res.error ||
          (isRtl
            ? "فشل إتمام عملية الاسترداد. يرجى المحاولة مرة أخرى."
            : "Failed to process refund. Please try again."),
      );
    }
  };

  const displayId =
    orderId.length > 8 ? `ORD-${orderId.slice(0, 4).toUpperCase()}` : orderId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10 border border-card-border animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
            <Icon name="currency_exchange" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-on-surface">
              {isRtl ? "استرداد مبلغ الطلب" : "Refund Order"}
            </h3>
            <p className="text-xs text-outline font-medium">#{displayId}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <Icon name="error" className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Refund Amount Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface flex items-center justify-between">
              <span>{isRtl ? "مبلغ الاسترداد" : "Refund Amount"}</span>
              <span className="text-[11px] text-outline font-normal">
                {isRtl
                  ? `الحد الأقصى: ${maxAmount} ${currency}`
                  : `Max: ${maxAmount} ${currency}`}
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={maxAmount || 100000}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full py-2.5 px-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary pr-12"
              />
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs font-bold text-outline">
                {currency}
              </span>
            </div>
          </div>

          {/* Refund Reason Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface">
              {isRtl ? "سبب الاسترداد" : "Reason for Refund"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                isRtl
                  ? "اكتب سبب إرجاع المبلغ للعميل..."
                  : "State the reason for issuing the refund..."
              }
              className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isLoading || !reason.trim() || !amount}
              className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Icon name="refresh" className="w-4 h-4 animate-spin" />
                  <span>{isRtl ? "جاري الاسترداد..." : "Processing..."}</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="w-4 h-4" />
                  <span>{isRtl ? "تأكيد الاسترداد" : "Confirm Refund"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
