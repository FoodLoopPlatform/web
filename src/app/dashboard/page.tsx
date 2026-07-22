"use client";

import { useState } from "react";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { DashboardHeroMetrics } from "@/components/dashboard/DashboardHeroMetrics";
import { DemandForecastChart } from "@/components/dashboard/DemandForecastChart";
import { InventoryRiskWidget } from "@/components/dashboard/InventoryRiskWidget";
import { ExpiringSoonWidget } from "@/components/dashboard/ExpiringSoonWidget";
import { QuickActionsWidget } from "@/components/dashboard/QuickActionsWidget";
import { RecentActivityWidget } from "@/components/dashboard/RecentActivityWidget";
import { LogisticsAlertWidget } from "@/components/dashboard/LogisticsAlertWidget";

export default function DashboardPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="bg-[#fdf9f2] text-[#1c1c18] font-sans min-h-screen flex"
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
                className="p-1 rounded-full bg-[#f2f5ee] border border-[#bfc9be] text-[#00381a] hover:bg-[#e0e3dd] transition-all cursor-pointer flex items-center justify-center"
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
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-[#f2f5ee] border-b border-[#bfc9be] sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            {/* Hamburger menu button for opening drawer on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-[#e0e3dd] transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-[#00381a]" />
            </button>

            {/* Page Title / Context */}
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#00381a] font-bold">
              لوحة تحكم التاجر والتحليلات
            </h1>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors relative flex items-center justify-center cursor-pointer">
                <Icon name="notifications" className="h-5 w-5 text-[#404940]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-[#404940]" />
              </button>
              <button className="p-2 hover:bg-[#e0e3dd] rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="language" className="h-5 w-5 text-[#404940]" />
              </button>
            </div>
            <div className="h-8 w-px bg-[#bfc9be]"></div>

            {/* User Profile */}
            <div className="flex items-center gap-sm cursor-pointer hover:bg-[#e0e3dd] p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-[#bfc9be] object-cover"
                alt="صورة التاجر"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-label-caps text-label-caps text-[#00381a] font-bold hidden md:block">
                سوبرماركت النيل
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <div className="px-margin-mobile md:px-margin-desktop py-lg flex-grow">
          {/* Hero Metrics Section */}
          <DashboardHeroMetrics />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md items-start">
            {/* Left/Center Column: Charts & Lists */}
            <div className="md:col-span-8 space-y-md">
              {/* Demand Forecast Chart Bento Card */}
              <DemandForecastChart />

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
