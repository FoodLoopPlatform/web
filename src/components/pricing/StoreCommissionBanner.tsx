"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { getMyStoreCommission } from "@/app/settings/api/stores-api";
import { StoreCommissionDetails } from "@/app/settings/api/types";

export function StoreCommissionBanner() {
  const [commission, setCommission] = useState<StoreCommissionDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getMyStoreCommission()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setCommission(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching store commission:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-light-green border border-outline-variant/30 rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-48 bg-outline-variant/30 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-outline-variant/20 rounded-xl" />
          <div className="h-16 bg-outline-variant/20 rounded-xl" />
          <div className="h-16 bg-outline-variant/20 rounded-xl" />
        </div>
      </div>
    );
  }

  const rate = commission?.commissionRate ?? 10;
  const totalSales = commission?.totalSales ?? 0;
  const commissionDue = commission?.totalCommissionDue ?? 0;
  const netEarnings = Math.max(0, totalSales - commissionDue);

  return (
    <div className="bg-gradient-to-br from-light-green to-surface-container-low border border-primary/20 rounded-2xl p-6 shadow-xs flex flex-col gap-5 text-right relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            %
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-base font-bold text-on-surface">
                نسبة عمولة المنصة المطبقة على متجرك
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                سارية
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              تُحسب العمولة تلقائياً على كل طلب مكتمل وفق اتفاقية الشراكة مع
              FoodLoop.
            </p>
          </div>
        </div>

        {/* Big Rate Badge */}
        <div className="inline-flex items-center self-start sm:self-auto gap-1.5 bg-primary-fixed text-primary px-4 py-2 rounded-xl border border-primary/20">
          <span className="text-xs font-bold">النسبة المطبقة:</span>
          <span className="text-xl font-black">{rate}%</span>
        </div>
      </div>

      {/* Financial Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
        {/* Gross Sales */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-outline">
            إجمالي مبيعات المتجر
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-on-surface font-headline-md">
              {totalSales.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-outline">ج.م</span>
          </div>
        </div>

        {/* Platform Commission Due */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-outline">
            عمولة المنصة المحتسبة ({rate}%)
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary font-headline-md">
              {commissionDue.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-outline">ج.م</span>
          </div>
        </div>

        {/* Net Store Earnings */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3.5 border border-outline-variant/30 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-outline">
            صافي مستحقات المتجر
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg font-bold text-emerald-700 font-headline-md">
              {netEarnings.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-outline">ج.م</span>
          </div>
        </div>
      </div>

      {/* Footer Info Notice */}
      <div className="flex items-center gap-2 text-[11px] text-outline pt-2 border-t border-outline-variant/20">
        <Icon name="info" className="h-4 w-4 text-primary shrink-0" />
        <span>
          يتم احتساب العمولة فور تسليم الطلب للعميل، ويتم تحويل مستحقات المتجر
          الصافية دورياً.
        </span>
      </div>
    </div>
  );
}
