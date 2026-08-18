"use client";

import { use } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ApiResponse } from "@/utils/server";
import type { StoreAnalytics } from "@/app/dashboard/api/types";

interface InventoryAnalyticsWidgetProps {
  analyticsPromise: Promise<ApiResponse<StoreAnalytics>>;
}

export function InventoryAnalyticsWidget({
  analyticsPromise,
}: InventoryAnalyticsWidgetProps) {
  const analyticsRes = use(analyticsPromise);
  const analytics = analyticsRes.data;

  if (!analytics) return null;

  const total = analytics.totalProductsCount || 0;
  const expiringSoon = analytics.expiringSoonProductsCount || 0;
  const outOfStock = analytics.outOfStockProductsCount || 0;
  const inStock = Math.max(0, total - outOfStock);

  return (
    <div className="bg-light-green rounded-2xl border border-outline-variant p-5 sm:p-6 flex flex-col gap-4 justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
            <Icon name="inventory_2" className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">
              حالة المخزون والمنتجات
            </h3>
            <p className="text-xs text-outline font-medium">
              متابعة المنتجات المعروضة وصلاحياتها
            </p>
          </div>
        </div>

        <Link
          href="/inventory"
          className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>المخزون</span>
          <Icon name="arrow_back" className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-outline font-bold">
            إجمالي المنتجات
          </span>
          <span className="text-lg font-extrabold text-on-surface font-data-mono">
            {new Intl.NumberFormat("ar-EG").format(total)}
          </span>
          <span className="text-[10px] text-primary font-medium">
            منتج مسجل
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-amber-800 font-bold">
            قريب الصلاحية
          </span>
          <span className="text-lg font-extrabold text-amber-700 font-data-mono">
            {new Intl.NumberFormat("ar-EG").format(expiringSoon)}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">
            بحاجة لتخفيض
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-card-border flex flex-col gap-1">
          <span className="text-[11px] text-rose-800 font-bold">
            نفد من المخزون
          </span>
          <span className="text-lg font-extrabold text-rose-700 font-data-mono">
            {new Intl.NumberFormat("ar-EG").format(outOfStock)}
          </span>
          <span className="text-[10px] text-rose-700 font-medium">
            بحاجة للتجديد
          </span>
        </div>
      </div>

      {total > 0 && (
        <div className="p-3 bg-white/70 rounded-xl border border-card-border text-xs flex items-center justify-between text-on-surface-variant">
          <span>نسبة توفر المخزون:</span>
          <span className="font-bold text-primary font-data-mono">
            {Math.round((inStock / total) * 100)}% متوفر
          </span>
        </div>
      )}
    </div>
  );
}
