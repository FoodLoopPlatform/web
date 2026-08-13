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
import { DemandForecastChart } from "@/components/dashboard/DemandForecastChart";
import { InventoryRiskWidget } from "@/components/dashboard/InventoryRiskWidget";
import { ExpiringSoonWidget } from "@/components/dashboard/ExpiringSoonWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { LogisticsAlertWidget } from "@/components/dashboard/LogisticsAlertWidget";
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
          className={`flex-grow min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
            left={
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-bold">
                لوحة تحكم التاجر والتحليلات
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

            {/* Hero Metrics Section */}
            <Suspense fallback={<DashboardHeroMetricsSkeleton />}>
              <DashboardHeroMetrics analyticsPromise={analyticsPromise} />
            </Suspense>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-start">
              {/* Left/Center Column: Charts & Lists */}
              <div className="md:col-span-8 space-y-md">
                {/* Demand Forecast Chart Bento Card */}
                <DemandForecastChart />

                {/* Top Products — real sales data from GET /stores/me/analytics */}
                <Suspense fallback={<TopProductsWidgetSkeleton />}>
                  <TopProductsWidget analyticsPromise={analyticsPromise} />
                </Suspense>

                {/* Row of Widgets: Risk & Expiring */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <InventoryRiskWidget />
                  <ExpiringSoonWidget />
                </div>
              </div>

              {/* Right Column: Actions & Notifications */}
              <aside className="md:col-span-4 space-y-md">
                <QuickActionsWidget />
                <RecentActivityWidget />
                <LogisticsAlertWidget />
              </aside>
            </div>
          </div>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(DashboardPage);
