"use client";

import { use } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ApiResponse } from "@/utils/server";
import type { StoreAnalytics } from "@/app/dashboard/api/types";

interface DisputesAnalyticsWidgetProps {
  analyticsPromise: Promise<ApiResponse<StoreAnalytics>>;
}

export function DisputesAnalyticsWidget({
  analyticsPromise,
}: DisputesAnalyticsWidgetProps) {
  const analyticsRes = use(analyticsPromise);
  const analytics = analyticsRes.data;

  if (!analytics) return null;

  const total = analytics.totalDisputesCount || 0;
  const unresolved = analytics.unresolvedDisputesCount || 0;
  const resolved = analytics.resolvedDisputesCount || 0;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  return (
    <div className="bg-light-green rounded-2xl border border-outline-variant p-5 sm:p-6 flex flex-col gap-4 justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <Icon name="gavel" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              النزاعات وخدمة العملاء
            </h3>
            <p className="text-xs text-outline font-medium">
              متابعة شكاوى ونزاعات طلبات المتجر
            </p>
          </div>
        </div>

        <Link
          href="/disputes"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>النزاعات</span>
          <Icon name="arrow_back" className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-outline font-bold">
            إجمالي النزاعات
          </span>
          <span className="text-lg font-extrabold text-on-surface font-data-mono">
            {new Intl.NumberFormat("ar-EG").format(total)}
          </span>
          <span className="text-[10px] text-outline font-medium">
            حالة مسجلة
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-rose-800 font-bold">
            قيد المراجعة
          </span>
          <span
            className={`text-lg font-extrabold font-data-mono ${unresolved > 0 ? "text-rose-700" : "text-emerald-700"}`}
          >
            {new Intl.NumberFormat("ar-EG").format(unresolved)}
          </span>
          <span className="text-[10px] text-rose-700 font-medium">
            تتطلب إجراء
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-emerald-800 font-bold">
            تم حلها
          </span>
          <span className="text-lg font-extrabold text-emerald-700 font-data-mono">
            {new Intl.NumberFormat("ar-EG").format(resolved)}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">
            مكتملة بنجاح
          </span>
        </div>
      </div>

      <div className="p-3 bg-white/70 rounded-xl border border-card-border text-xs flex items-center justify-between text-on-surface-variant">
        <span>نسبة تسوية وحل النزاعات:</span>
        <span className="font-bold text-emerald-800 font-data-mono">
          {resolutionRate}% تسوية
        </span>
      </div>
    </div>
  );
}
