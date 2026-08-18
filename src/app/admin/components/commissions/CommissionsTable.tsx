"use client";

import React from "react";
import { StoreCommission } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface CommissionsTableProps {
  items: StoreCommission[];
  onOpenWithdraw: (store: StoreCommission) => void;
  t: AdminDictionary;
  isRtl?: boolean;
}

export const CommissionsTable: React.FC<CommissionsTableProps> = ({
  items,
  onOpenWithdraw,
  t,
  isRtl = false,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-card-border bg-white shadow-xs">
      <table
        className="w-full text-left border-collapse"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <thead>
          <tr className="bg-surface-container/50 border-b border-card-border text-[11px] font-bold text-outline uppercase tracking-wider">
            <th className="py-3.5 px-4 text-start">{t.stores}</th>
            <th className="py-3.5 px-4 text-start">{t.commissionRate}</th>
            <th className="py-3.5 px-4 text-start">{t.totalSalesCol}</th>
            <th className="py-3.5 px-4 text-start">{t.totalCommissionCol}</th>
            <th className="py-3.5 px-4 text-start">{t.withdrawableCol}</th>
            <th className="py-3.5 px-4 text-start">{t.withdrawnCol}</th>
            <th className="py-3.5 px-4 text-start">{t.lastWithdrawalCol}</th>
            <th className="py-3.5 px-4 text-center">{t.actionsCol}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border/60 text-xs font-sans">
          {items.map((item) => {
            const hasWithdrawable = item.withdrawableAmount > 0;

            return (
              <tr
                key={item.id}
                className="hover:bg-surface-container/30 transition-colors group"
              >
                {/* Store details */}
                <td className="py-3.5 px-4">
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
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface truncate">
                        {item.storeName}
                      </span>
                      <span className="text-[11px] text-outline truncate mt-0.5">
                        {item.ownerEmail || item.ownerName || ""}
                        {item.location ? ` • ${item.location}` : ""}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Commission Rate */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
                    {item.commissionRate}%
                  </span>
                </td>

                {/* Total Gross Sales */}
                <td className="py-3.5 px-4 font-bold text-on-surface">
                  {item.totalSales.toLocaleString()}{" "}
                  <span className="text-[10px] text-outline font-medium">
                    {isRtl ? "ج.م" : "EGP"}
                  </span>
                </td>

                {/* Total Commission Accrued */}
                <td className="py-3.5 px-4 font-bold text-on-surface">
                  {item.totalCommission.toLocaleString()}{" "}
                  <span className="text-[10px] text-outline font-medium">
                    {isRtl ? "ج.م" : "EGP"}
                  </span>
                </td>

                {/* Withdrawable Balance */}
                <td className="py-3.5 px-4">
                  <span
                    className={`font-black text-sm ${
                      hasWithdrawable ? "text-primary" : "text-outline"
                    }`}
                  >
                    {item.withdrawableAmount.toLocaleString()}
                  </span>{" "}
                  <span className="text-[10px] text-outline font-medium">
                    {isRtl ? "ج.م" : "EGP"}
                  </span>
                </td>

                {/* Withdrawn Amount */}
                <td className="py-3.5 px-4 font-medium text-outline">
                  {item.withdrawnAmount.toLocaleString()}{" "}
                  <span className="text-[10px]">{isRtl ? "ج.م" : "EGP"}</span>
                </td>

                {/* Last Withdrawal Date */}
                <td className="py-3.5 px-4 text-[11px] text-outline">
                  {item.lastWithdrawalDate ? (
                    new Date(item.lastWithdrawalDate).toLocaleDateString(
                      isRtl ? "ar-EG" : "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  ) : (
                    <span className="text-outline/60">
                      {isRtl ? "لا توجد سحوبات سابقة" : "No prior withdrawals"}
                    </span>
                  )}
                </td>

                {/* Action button */}
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => onOpenWithdraw(item)}
                    disabled={!hasWithdrawable}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 mx-auto ${
                      hasWithdrawable
                        ? "bg-primary text-white hover:opacity-90 active:scale-95 shadow-2xs"
                        : "bg-surface-container text-outline cursor-not-allowed opacity-60"
                    }`}
                    title={
                      hasWithdrawable
                        ? t.withdrawCommission
                        : isRtl
                          ? "لا يوجد رصيد متاح للسحب"
                          : "No balance available for withdrawal"
                    }
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
