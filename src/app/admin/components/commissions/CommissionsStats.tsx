"use client";

import React from "react";
import { StoreCommission } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface CommissionsStatsProps {
  commissions: StoreCommission[];
  t: AdminDictionary;
  isRtl?: boolean;
}

export const CommissionsStats: React.FC<CommissionsStatsProps> = ({
  commissions,
  t,
  isRtl = false,
}) => {
  const totalCommission = commissions.reduce(
    (acc, curr) => acc + (curr.totalCommission || 0),
    0,
  );
  const totalWithdrawable = commissions.reduce(
    (acc, curr) => acc + (curr.withdrawableAmount || 0),
    0,
  );
  const totalWithdrawn = commissions.reduce(
    (acc, curr) => acc + (curr.withdrawnAmount || 0),
    0,
  );
  const avgRate = commissions.length
    ? Math.round(
        commissions.reduce((acc, curr) => acc + (curr.commissionRate || 0), 0) /
          commissions.length,
      )
    : 10;

  const activeStoresCount = commissions.filter(
    (c) => c.status === "ACTIVE",
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Total Platform Commission */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            {t.totalPlatformCommission}
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-black text-on-surface font-headline-md tracking-tight">
            {totalCommission.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-outline">
            {isRtl ? "ج.م" : "EGP"}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-emerald-700 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>
            {isRtl
              ? `عبر ${commissions.length} متجر مسجل`
              : `Across ${commissions.length} registered stores`}
          </span>
        </div>
      </div>

      {/* 2. Withdrawable Balance */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            {t.totalWithdrawable}
          </span>
          <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-black text-primary font-headline-md tracking-tight">
            {totalWithdrawable.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-outline">
            {isRtl ? "ج.م" : "EGP"}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-primary flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          <span>
            {isRtl
              ? "مستحق للتحصيل الإداري الفوري"
              : "Available for immediate admin withdrawal"}
          </span>
        </div>
      </div>

      {/* 3. Total Withdrawn */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            {t.totalWithdrawn}
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-black text-on-surface font-headline-md tracking-tight">
            {totalWithdrawn.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-outline">
            {isRtl ? "ج.م" : "EGP"}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-blue-700 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>
            {isRtl ? "تم تحصيله وتسويته" : "Successfully settled & collected"}
          </span>
        </div>
      </div>

      {/* 4. Avg Rate & Stores */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-xs flex flex-col justify-between relative overflow-hidden group hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-outline uppercase tracking-wider">
            {t.avgCommissionRate}
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-black text-on-surface font-headline-md tracking-tight">
            {avgRate}%
          </span>
          <span className="text-xs font-semibold text-outline">
            {isRtl ? "نسبة ثابتة" : "Avg rate"}
          </span>
        </div>
        <div className="mt-2 text-[11px] font-medium text-amber-700 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>
            {isRtl
              ? `${activeStoresCount} متجر نشط بالعمولة`
              : `${activeStoresCount} active commission stores`}
          </span>
        </div>
      </div>
    </div>
  );
};
