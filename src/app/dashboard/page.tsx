"use client";

import { useState, useMemo, Suspense } from "react";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { DashboardHeroMetrics } from "@/components/dashboard/DashboardHeroMetrics";
import { DashboardHeroMetricsSkeleton } from "@/components/dashboard/DashboardHeroMetricsSkeleton";
import { TopProductsWidget } from "@/components/dashboard/TopProductsWidget";
import { TopProductsWidgetSkeleton } from "@/components/dashboard/TopProductsWidgetSkeleton";
import { OrdersFulfillmentWidget } from "@/components/dashboard/OrdersFulfillmentWidget";
import { InventoryAnalyticsWidget } from "@/components/dashboard/InventoryAnalyticsWidget";
import { DisputesAnalyticsWidget } from "@/components/dashboard/DisputesAnalyticsWidget";
import { AdminNoticesWidget } from "@/components/dashboard/AdminNoticesWidget";
import { CommissionMetricCard } from "@/components/dashboard/CommissionMetricCard";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { getStoreAnalytics } from "./api/analytics-api";
import type { AnalyticsPeriod } from "./api/types";

const PERIOD_OPTIONS: { value: AnalyticsPeriod; label: string }[] = [
  { value: "today", label: "اليوم" },
  { value: "week", label: "الأسبوع" },
  { value: "month", label: "الشهر" },
  { value: "all", label: "الكل" },
];

function DashboardPage() {
  const store = useStoreProfile();
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");

  const analyticsPromise = useMemo(() => getStoreAnalytics(period), [period]);

  return (
    <MerchantShell className="bg-surface-container-lowest text-on-surface font-sans min-h-screen flex">
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-grow min-h-screen flex flex-col transition-all duration-300 mr-0 w-full min-w-0 max-w-full overflow-x-hidden ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
            left={
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-bold">
                لوحة تحكم المتجر والتحليلات
              </h1>
            }
          />

          {/* Dashboard Main Content */}
          <div className="px-margin-mobile md:px-margin-desktop py-lg flex-grow">
            {/* Period Selector */}
            <div className="flex items-center justify-end gap-2 mb-md">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriod(option.value)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    period === option.value
                      ? "bg-primary text-white"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Hero Metrics Section (Revenue, Savings, Orders, Average Order Value, Donations, Refunds, Health) */}
            <Suspense fallback={<DashboardHeroMetricsSkeleton />}>
              <DashboardHeroMetrics analyticsPromise={analyticsPromise} />
            </Suspense>

            {/* Main Content Grid: Real Analytics & Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-start">
              {/* Left/Center Column: Orders Fulfillment & Top Products */}
              <div className="md:col-span-8 space-y-md">
                {/* Orders Fulfillment Breakdown */}
                <Suspense
                  fallback={
                    <div className="h-64 rounded-2xl bg-surface animate-pulse" />
                  }
                >
                  <OrdersFulfillmentWidget
                    analyticsPromise={analyticsPromise}
                  />
                </Suspense>

                {/* Real Top Selling Products */}
                <Suspense fallback={<TopProductsWidgetSkeleton />}>
                  <TopProductsWidget analyticsPromise={analyticsPromise} />
                </Suspense>

                {/* Real Inventory Health & Disputes Analytics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <Suspense
                    fallback={
                      <div className="h-48 rounded-2xl bg-surface animate-pulse" />
                    }
                  >
                    <InventoryAnalyticsWidget
                      analyticsPromise={analyticsPromise}
                    />
                  </Suspense>
                  <Suspense
                    fallback={
                      <div className="h-48 rounded-2xl bg-surface animate-pulse" />
                    }
                  >
                    <DisputesAnalyticsWidget
                      analyticsPromise={analyticsPromise}
                    />
                  </Suspense>
                </div>
              </div>

              {/* Right Column: Admin Notes & Commission Info */}
              <aside className="md:col-span-4 space-y-md">
                <CommissionMetricCard />
                <AdminNoticesWidget />
              </aside>
            </div>
          </div>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(DashboardPage);
