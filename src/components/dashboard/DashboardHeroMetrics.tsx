"use client";

import { use } from "react";
import { Icon } from "@/components/ui/icon";
import type { ApiResponse } from "@/utils/server";
import type {
  StoreAnalytics,
  AnalyticsPeriod,
} from "@/app/dashboard/api/types";

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  today: "اليوم",
  week: "هذا الأسبوع",
  month: "هذا الشهر",
  all: "كل الفترات",
};

const currency = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(value);

interface DashboardHeroMetricsProps {
  analyticsPromise: Promise<ApiResponse<StoreAnalytics>>;
}

export function DashboardHeroMetrics({
  analyticsPromise,
}: DashboardHeroMetricsProps) {
  const analyticsRes = use(analyticsPromise);
  const analytics = analyticsRes.data;

  if (!analytics) {
    return (
      <section className="mb-lg p-md rounded-xl border border-error-container bg-error-container/10 text-error text-body-md">
        {analyticsRes.error ?? "تعذر تحميل إحصائيات المتجر"}
      </section>
    );
  }

  const periodLabel = PERIOD_LABELS[analytics.period] ?? analytics.period;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
      {/* Savings Impact */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-primary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon name="eco" className="h-6 w-6 text-link" fill={true} />
          </span>
          <span className="text-link font-data-mono text-data-mono font-bold text-xs bg-white/60 px-2 py-1 rounded-full">
            {periodLabel}
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            قيمة التوفير من الهدر
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {currency(analytics.savingsImpact)}
          </h2>
        </div>
      </div>

      {/* Revenue */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-tertiary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="payments"
              className="h-6 w-6 text-on-tertiary-fixed"
              fill={true}
            />
          </span>
          <span className="text-on-tertiary-fixed-variant font-data-mono text-data-mono font-bold text-xs bg-white/60 px-2 py-1 rounded-full">
            {periodLabel}
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            الإيرادات المستردة
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {currency(analytics.revenue)}
          </h2>
        </div>
      </div>

      {/* Orders Count */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-primary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="shopping_cart"
              className="h-6 w-6 text-primary"
              fill={true}
            />
          </span>
          <span className="text-primary font-data-mono text-data-mono font-bold text-xs bg-white/60 px-2 py-1 rounded-full">
            {periodLabel}
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            عدد الطلبات المكتملة
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {new Intl.NumberFormat("ar-EG").format(analytics.ordersCount)} طلب
          </h2>
        </div>
      </div>
    </section>
  );
}
