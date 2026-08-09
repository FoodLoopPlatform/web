"use client";

import { use } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { ApiResponse } from "@/utils/server";
import type { StoreAnalytics } from "@/app/dashboard/api/types";

const currency = (value: number) =>
  new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
  }).format(value);

interface TopProductsWidgetProps {
  analyticsPromise: Promise<ApiResponse<StoreAnalytics>>;
}

export function TopProductsWidget({
  analyticsPromise,
}: TopProductsWidgetProps) {
  const analyticsRes = use(analyticsPromise);
  const topProducts = analyticsRes.data?.topProducts ?? [];

  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant">
      <div className="p-md bg-surface-container-high border-b border-outline-variant flex items-center gap-2">
        <Icon name="sell" className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-primary">
          المنتجات الأكثر مبيعاً
        </h3>
      </div>

      {topProducts.length === 0 ? (
        <div className="p-lg text-center text-on-surface-variant text-body-md">
          لا توجد مبيعات مسجلة خلال هذه الفترة
        </div>
      ) : (
        <div className="divide-y divide-outline-variant">
          {topProducts.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center justify-between gap-sm p-md hover:bg-surface-container-high/40 transition-colors"
            >
              <div className="flex items-center gap-sm min-w-0">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-fixed text-primary text-xs font-bold shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-on-surface text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-xs text-on-surface-variant font-data-mono">
                    {new Intl.NumberFormat("ar-EG").format(
                      product.quantitySold,
                    )}{" "}
                    وحدة مباعة
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-primary shrink-0">
                {currency(product.revenueGenerated)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
