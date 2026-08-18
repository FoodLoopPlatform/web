"use client";

import { use } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ApiResponse } from "@/utils/server";
import type { StoreAnalytics } from "@/app/dashboard/api/types";

interface OrdersFulfillmentWidgetProps {
  analyticsPromise: Promise<ApiResponse<StoreAnalytics>>;
}

export function OrdersFulfillmentWidget({
  analyticsPromise,
}: OrdersFulfillmentWidgetProps) {
  const analyticsRes = use(analyticsPromise);
  const analytics = analyticsRes.data;

  if (!analytics) return null;

  const total = analytics.ordersCount || 0;
  const pending = analytics.pendingOrdersCount || 0;
  const confirmed = analytics.confirmedOrdersCount || 0;
  const preparing = analytics.preparingOrdersCount || 0;
  const ready = analytics.readyForPickupOrdersCount || 0;
  const completed = analytics.completedOrdersCount || 0;
  const cancelled = analytics.cancelledOrdersCount || 0;

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const statusItems = [
    {
      label: "قيد الانتظار",
      sublabel: "بانتظار موافقة المتجر",
      count: pending,
      icon: "schedule",
      barColor: "bg-amber-500",
      cardBorder: "border-amber-300 hover:border-amber-500",
      cardBg: "bg-gradient-to-br from-amber-50/80 to-white",
      badgeBg: "bg-amber-100 text-amber-900 border-amber-200",
      iconColor: "text-amber-600",
      dotColor: "bg-amber-500",
    },
    {
      label: "مؤكدة",
      sublabel: "تم التأكيد بنجاح",
      count: confirmed,
      icon: "check_circle",
      barColor: "bg-blue-500",
      cardBorder: "border-blue-300 hover:border-blue-500",
      cardBg: "bg-gradient-to-br from-blue-50/80 to-white",
      badgeBg: "bg-blue-100 text-blue-900 border-blue-200",
      iconColor: "text-blue-600",
      dotColor: "bg-blue-500",
    },
    {
      label: "قيد التجهيز",
      sublabel: "جاري تحضير المنتجات",
      count: preparing,
      icon: "soup_kitchen",
      barColor: "bg-orange-500",
      cardBorder: "border-orange-300 hover:border-orange-500",
      cardBg: "bg-gradient-to-br from-orange-50/80 to-white",
      badgeBg: "bg-orange-100 text-orange-900 border-orange-200",
      iconColor: "text-orange-600",
      dotColor: "bg-orange-500",
    },
    {
      label: "جاهزة للاستلام",
      sublabel: "بانتظار العميل",
      count: ready,
      icon: "storefront",
      barColor: "bg-teal-500",
      cardBorder: "border-teal-300 hover:border-teal-500",
      cardBg: "bg-gradient-to-br from-teal-50/80 to-white",
      badgeBg: "bg-teal-100 text-teal-900 border-teal-200",
      iconColor: "text-teal-600",
      dotColor: "bg-teal-500",
    },
    {
      label: "مكتملة ومستلمة",
      sublabel: "تم تسليم الطلب بنجاح",
      count: completed,
      icon: "task_alt",
      barColor: "bg-emerald-600",
      cardBorder: "border-emerald-300 hover:border-emerald-600",
      cardBg: "bg-gradient-to-br from-emerald-50/80 to-white",
      badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      iconColor: "text-emerald-700",
      dotColor: "bg-emerald-600",
    },
    {
      label: "ملغاة",
      sublabel: "تم إلغاء الطلب",
      count: cancelled,
      icon: "cancel",
      barColor: "bg-rose-500",
      cardBorder: "border-rose-300 hover:border-rose-500",
      cardBg: "bg-gradient-to-br from-rose-50/80 to-white",
      badgeBg: "bg-rose-100 text-rose-900 border-rose-200",
      iconColor: "text-rose-600",
      dotColor: "bg-rose-500",
    },
  ];

  return (
    <div className="bg-light-green rounded-2xl border border-outline-variant p-5 sm:p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-2xs">
            <Icon name="local_shipping" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-on-surface">
              تحليل وتوزيع حالات الطلبات
            </h3>
            <p className="text-xs sm:text-sm text-outline font-medium">
              متابعة مسار تنفيذ الطلبات الحالية والمنتهية
            </p>
          </div>
        </div>

        <Link
          href="/orders"
          className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-1.5 rounded-full border border-card-border shadow-2xs"
        >
          <span>إدارة الطلبات</span>
          <Icon name="arrow_back" className="w-4 h-4" />
        </Link>
      </div>

      {/* Visual Multi-Color Progress Track */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-bold text-on-surface">
          <span>شريط توزيع الحالات ({total} طلب)</span>
          <span className="text-outline font-data-mono font-medium">
            نسبة الإنجاز: {total > 0 ? getPercentage(completed) : 0}%
          </span>
        </div>

        <div className="w-full h-4 rounded-xl bg-surface-container overflow-hidden flex shadow-inner border border-card-border">
          {total === 0 ? (
            <div className="w-full h-full bg-surface-container flex items-center justify-center text-[10px] text-outline font-bold">
              لا توجد طلبات مسجلة
            </div>
          ) : (
            <>
              {pending > 0 && (
                <div
                  style={{ width: `${getPercentage(pending)}%` }}
                  className="bg-amber-500 h-full transition-all"
                  title={`قيد الانتظار: ${pending} (${getPercentage(pending)}%)`}
                />
              )}
              {confirmed > 0 && (
                <div
                  style={{ width: `${getPercentage(confirmed)}%` }}
                  className="bg-blue-500 h-full transition-all"
                  title={`مؤكدة: ${confirmed} (${getPercentage(confirmed)}%)`}
                />
              )}
              {preparing > 0 && (
                <div
                  style={{ width: `${getPercentage(preparing)}%` }}
                  className="bg-orange-500 h-full transition-all"
                  title={`قيد التجهيز: ${preparing} (${getPercentage(preparing)}%)`}
                />
              )}
              {ready > 0 && (
                <div
                  style={{ width: `${getPercentage(ready)}%` }}
                  className="bg-teal-500 h-full transition-all"
                  title={`جاهزة للاستلام: ${ready} (${getPercentage(ready)}%)`}
                />
              )}
              {completed > 0 && (
                <div
                  style={{ width: `${getPercentage(completed)}%` }}
                  className="bg-emerald-600 h-full transition-all"
                  title={`مكتملة: ${completed} (${getPercentage(completed)}%)`}
                />
              )}
              {cancelled > 0 && (
                <div
                  style={{ width: `${getPercentage(cancelled)}%` }}
                  className="bg-rose-500 h-full transition-all"
                  title={`ملغاة: ${cancelled} (${getPercentage(cancelled)}%)`}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Distinct Color-Coded Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {statusItems.map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-2xl border-2 ${item.cardBorder} ${item.cardBg} shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-3`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
                <span className="text-xs sm:text-sm font-bold text-on-surface">
                  {item.label}
                </span>
              </div>
              <span className={`p-1.5 rounded-lg ${item.badgeBg}`}>
                <Icon name={item.icon} className="w-4 h-4" />
              </span>
            </div>

            <div className="flex items-end justify-between pt-1">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-on-surface font-data-mono">
                  {new Intl.NumberFormat("ar-EG").format(item.count)}
                </span>
                <span className="text-[10px] text-outline font-medium">
                  {item.sublabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
