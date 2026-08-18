"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { getMyStoreCommission } from "@/app/settings/api/stores-api";
import { StoreCommissionDetails } from "@/app/settings/api/types";

export function CommissionMetricCard() {
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
        console.error("Error loading store commission in dashboard:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rate = commission?.commissionRate ?? 10;
  const totalSales = commission?.totalSales ?? 0;
  const commissionDue = commission?.totalCommissionDue ?? 0;

  if (isLoading) {
    return (
      <div className="bg-white border border-outline-variant/30 rounded-xl p-5 shadow-xs animate-pulse">
        <div className="h-4 w-32 bg-outline-variant/30 rounded mb-3" />
        <div className="h-8 w-24 bg-outline-variant/20 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-outline-variant/40 rounded-xl p-5 shadow-xs flex flex-col gap-4 text-right">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold text-sm shrink-0">
            %
          </div>
          <span className="font-bold text-sm text-on-surface">
            عمولة المنصة المطبقة
          </span>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200/60">
          {rate}%
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-surface p-3 rounded-xl border border-outline-variant/30 text-xs">
        <div className="flex flex-col">
          <span className="text-[10px] text-outline font-medium">
            مبيعات المتجر
          </span>
          <span className="font-bold text-on-surface">
            {totalSales.toLocaleString()} ج.م
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-outline font-medium">
            العمولة المستحقة
          </span>
          <span className="font-bold text-primary">
            {commissionDue.toLocaleString()} ج.م
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs">
        <span className="text-[11px] text-outline">
          تُحسب تلقائياً على كل طلب مكتمل
        </span>
        <Link
          href="/pricing"
          className="text-primary font-bold hover:underline text-[11px] flex items-center gap-1"
        >
          <span>التفاصيل</span>
          <Icon name="chevron_left" className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
