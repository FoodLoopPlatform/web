"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<AnalyticsPeriod>("today");

  const analyticsPromise = useMemo(() => getStoreAnalytics(period), [period]);

  return (
    <div
      className="bg-surface-container-lowest text-on-surface font-sans min-h-screen flex"
      dir="rtl"
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full bg-light-green border border-outline-variant text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MerchantSidebar onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-grow min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-light-green border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            {/* Hamburger menu button for opening drawer on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            {/* Page Title / Context */}
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-bold">
              لوحة تحكم التاجر والتحليلات
            </h1>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors relative flex items-center justify-center cursor-pointer">
                <Icon
                  name="notifications"
                  className="h-5 w-5 text-on-surface-variant"
                />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-on-surface-variant" />
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon
                  name="language"
                  className="h-5 w-5 text-on-surface-variant"
                />
              </button>
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>

            {/* User Profile */}
            <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-highest p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="صورة التاجر"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-label-caps text-label-caps text-primary font-bold hidden md:block">
                {store?.name || "متجري"}
              </span>
            </div>
          </div>
        </header>

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
    </div>
  );
}

export default withAuth(DashboardPage);
