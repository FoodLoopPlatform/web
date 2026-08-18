"use client";

import React from "react";
import { StoreCommission } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface CommissionsCardListProps {
  items: StoreCommission[];
  onOpenWithdraw: (store: StoreCommission) => void;
  t: AdminDictionary;
  isRtl?: boolean;
}

export const CommissionsCardList: React.FC<CommissionsCardListProps> = ({
  items,
  onOpenWithdraw,
  t,
  isRtl = false,
}) => {
  return (
    <div className="flex flex-col gap-3 sm:hidden" dir={isRtl ? "rtl" : "ltr"}>
      {items.map((item) => {
        const hasWithdrawable = item.withdrawableAmount > 0;

        return (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-card-border p-4 shadow-xs flex flex-col gap-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {item.storeLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.storeLogo}
                    alt={item.storeName}
                    className="w-10 h-10 rounded-xl object-cover border border-card-border shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                    {item.storeName
                      ? item.storeName.slice(0, 2).toUpperCase()
                      : "ST"}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-sm">
                    {item.storeName}
                  </span>
                  <span className="text-[11px] text-outline">
                    {item.ownerName} • {item.location}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60 shrink-0">
                {item.commissionRate}%
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 bg-surface p-3 rounded-xl border border-card-border text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-medium">
                  {t.totalSalesCol}
                </span>
                <span className="font-bold text-on-surface">
                  {item.totalSales.toLocaleString()} {isRtl ? "ج.م" : "EGP"}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] text-outline font-medium">
                  {t.totalCommissionCol}
                </span>
                <span className="font-bold text-on-surface">
                  {item.totalCommission.toLocaleString()}{" "}
                  {isRtl ? "ج.م" : "EGP"}
                </span>
              </div>

              <div className="flex flex-col pt-1 border-t border-card-border/60">
                <span className="text-[10px] text-primary font-bold">
                  {t.withdrawableCol}
                </span>
                <span className="font-black text-primary text-sm">
                  {item.withdrawableAmount.toLocaleString()}{" "}
                  {isRtl ? "ج.م" : "EGP"}
                </span>
              </div>

              <div className="flex flex-col pt-1 border-t border-card-border/60">
                <span className="text-[10px] text-outline font-medium">
                  {t.withdrawnCol}
                </span>
                <span className="font-medium text-outline">
                  {item.withdrawnAmount.toLocaleString()}{" "}
                  {isRtl ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>

            {/* Withdraw CTA */}
            <button
              type="button"
              onClick={() => onOpenWithdraw(item)}
              disabled={!hasWithdrawable}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                hasWithdrawable
                  ? "bg-primary text-white hover:opacity-90 active:scale-95 shadow-2xs cursor-pointer"
                  : "bg-surface-container text-outline cursor-not-allowed opacity-60"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{t.withdrawCommission}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
