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
    <div className="space-y-md mb-lg">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
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
              {currency(analytics.savingsImpact ?? 0)}
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
              {currency(analytics.revenue ?? 0)}
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
              إجمالي الطلبات
            </p>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              {new Intl.NumberFormat("ar-EG").format(
                analytics.ordersCount ?? 0,
              )}{" "}
              طلب
            </h2>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
          <div className="flex justify-between items-start mb-xs">
            <span className="bg-amber-100 p-2 rounded-lg flex items-center justify-center">
              <Icon
                name="trending_up"
                className="h-6 w-6 text-amber-800"
                fill={true}
              />
            </span>
            <span className="text-amber-900 font-data-mono text-data-mono font-bold text-xs bg-white/60 px-2 py-1 rounded-full">
              {periodLabel}
            </span>
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant mb-1">
              متوسط قيمة الطلب
            </p>
            <h2 className="font-headline-md text-headline-md text-primary font-bold">
              {currency(analytics.averageOrderValue ?? 0)}
            </h2>
          </div>
        </div>
      </section>

      {/* Secondary Financial & Health Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface p-3.5 rounded-xl border border-card-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-outline block font-medium">
              قيمة التبرعات الغذائية
            </span>
            <span className="text-sm sm:text-base font-bold text-emerald-800 font-data-mono">
              {currency(analytics.donatedValue ?? 0)}
            </span>
          </div>
          <Icon
            name="volunteer_activism"
            className="w-5 h-5 text-emerald-700"
          />
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-card-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-outline block font-medium">
              مبالغ مستردة للعملاء
            </span>
            <span className="text-sm sm:text-base font-bold text-rose-700 font-data-mono">
              {currency(analytics.refundedAmount ?? 0)}
            </span>
          </div>
          <Icon name="currency_exchange" className="w-5 h-5 text-rose-600" />
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-card-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-outline block font-medium">
              منتجات قريبة الصلاحية
            </span>
            <span className="text-sm sm:text-base font-bold text-amber-800 font-data-mono">
              {new Intl.NumberFormat("ar-EG").format(
                analytics.expiringSoonProductsCount ?? 0,
              )}{" "}
              منتج
            </span>
          </div>
          <Icon name="alarm" className="w-5 h-5 text-amber-600" />
        </div>

        <div className="bg-surface p-3.5 rounded-xl border border-card-border flex items-center justify-between">
          <div>
            <span className="text-[11px] text-outline block font-medium">
              نزاعات تتطلب مراجعة
            </span>
            <span
              className={`text-sm sm:text-base font-bold font-data-mono ${(analytics.unresolvedDisputesCount ?? 0) > 0 ? "text-rose-700" : "text-green-700"}`}
            >
              {new Intl.NumberFormat("ar-EG").format(
                analytics.unresolvedDisputesCount ?? 0,
              )}{" "}
              نزاع
            </span>
          </div>
          <Icon name="gavel" className="w-5 h-5 text-outline" />
        </div>
      </div>
    </div>
  );
}
