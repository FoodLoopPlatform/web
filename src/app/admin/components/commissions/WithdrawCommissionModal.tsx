"use client";

import React, { useState } from "react";
import { StoreCommission } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { withdrawStoreCommission } from "../../api/commissions-api";

interface WithdrawCommissionModalProps {
  store: StoreCommission | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (storeId: string, amount: number) => void;
  t: AdminDictionary;
  isRtl?: boolean;
}

export const WithdrawCommissionModal: React.FC<
  WithdrawCommissionModalProps
> = ({ store, isOpen, onClose, onSuccess, t, isRtl = false }) => {
  const [prevStoreId, setPrevStoreId] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStoreId = store ? store.id || store.storeId : null;
  if (currentStoreId !== prevStoreId) {
    setPrevStoreId(currentStoreId);
    setAmount(store ? String(store.withdrawableAmount || "") : "");
    setErrorMessage(null);
  }

  if (!isOpen || !store) return null;

  const available = store.withdrawableAmount || 0;
  const numAmount = parseFloat(amount) || 0;
  const remaining = Math.max(0, available - numAmount);
  const isValidAmount = numAmount > 0 && numAmount <= available;

  const handlePreset = (percent: number) => {
    const calculated = Math.round(available * (percent / 100) * 100) / 100;
    setAmount(String(calculated));
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) {
      setErrorMessage(
        isRtl
          ? `يرجى إدخال مبلغ صحيح بين 1 و ${available.toLocaleString()} ج.م`
          : `Please enter a valid amount between 1 and ${available.toLocaleString()} EGP`,
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await withdrawStoreCommission(
        store.rawApiId || store.storeId || store.id,
        numAmount,
      );
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        onSuccess(store.storeId || store.id, numAmount);
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.withdrawFailed;
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      dir={isRtl ? "rtl" : "ltr"}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-card-border shadow-2xl w-full max-w-3xl p-7 flex flex-col gap-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-container pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg shrink-0">
              💰
            </div>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-on-surface">
                {t.withdrawModalTitle}
              </h2>
              <span className="text-xs text-outline font-medium">
                {store.storeName} ({store.ownerName})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Store Balance Preview Card */}
        <div className="bg-surface rounded-2xl p-4 border border-card-border flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-outline font-medium">
              {t.currentBalance}:
            </span>
            <span className="text-primary font-black text-sm">
              {available.toLocaleString()} {isRtl ? "ج.م" : "EGP"}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-outline font-medium">
              {t.commissionRate}:
            </span>
            <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-md text-[11px]">
              {store.commissionRate}%
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-card-border/60">
            <span className="text-outline font-medium">
              {t.remainingBalance}:
            </span>
            <span
              className={`font-black text-xs ${
                numAmount > available ? "text-error" : "text-emerald-700"
              }`}
            >
              {remaining.toLocaleString()} {isRtl ? "ج.م" : "EGP"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface">
              {t.withdrawAmount}
            </label>
            <div className="relative">
              <input
                type="number"
                step="any"
                min="0.01"
                max={available}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder={t.withdrawAmountPlaceholder}
                disabled={isSubmitting}
                className="w-full bg-surface border border-card-border rounded-xl py-2.5 px-4 text-sm font-bold text-on-surface focus:bg-white focus:border-primary focus:outline-hidden transition-all"
                autoFocus
              />
              <span
                className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-outline ${
                  isRtl ? "left-4" : "right-4"
                }`}
              >
                {isRtl ? "ج.م" : "EGP"}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePreset(25)}
              className="flex-1 py-1.5 rounded-lg border border-card-border text-[11px] font-bold text-on-surface hover:bg-surface hover:border-primary/50 transition-colors cursor-pointer"
            >
              {t.withdraw25}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(50)}
              className="flex-1 py-1.5 rounded-lg border border-card-border text-[11px] font-bold text-on-surface hover:bg-surface hover:border-primary/50 transition-colors cursor-pointer"
            >
              {t.withdraw50}
            </button>
            <button
              type="button"
              onClick={() => handlePreset(100)}
              className="flex-1 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              {t.withdrawMax}
            </button>
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Prompt warning */}
          <p className="text-[11px] text-outline leading-relaxed">
            {t.confirmWithdrawPrompt}
          </p>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-card-border text-xs font-bold text-on-surface hover:bg-surface transition-colors cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValidAmount}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isRtl ? "جارٍ السحب..." : "Processing..."}</span>
                </>
              ) : (
                <span>{t.withdrawCommission}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
