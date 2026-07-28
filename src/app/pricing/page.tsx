"use client";

import { useState } from "react";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { PricingStatCards } from "@/components/pricing/PricingStatCards";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingInsights } from "@/components/pricing/PricingInsights";
import { withAuth } from "@/lib/auth/with-auth";

// Unprotected for now so the UI can be reviewed without a session; wrap with
// withAuth once this is wired to real pricing data.
function PricingPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "history">("live");

  return (
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
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
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-light-green border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            <div className="relative max-w-md w-full hidden md:block">
              <Icon
                name="search"
                className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="w-full bg-surface-container-high border-none rounded-full py-2 pr-11 pl-4 font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="ابحث عن منتجات، طلبات..."
                type="text"
              />
            </div>
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

            <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-highest p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="صورة التاجر"
                src="/pricing/avatar.jpg"
                width={32}
                height={32}
              />
              <span className="font-label-caps text-label-caps text-primary font-bold hidden md:block">
                سوبرماركت النيل
              </span>
            </div>
          </div>
        </header>

        {/* Pricing Content */}
        <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-3xl font-bold text-primary">
                لوحة التسعير
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                حسّن هوامش مخزونك من خلال التسعير الديناميكي الفوري وإدارة دورات
                التخفيض.
              </p>
            </div>
            <div className="flex gap-4 shrink-0">
              <button
                type="button"
                className="flex items-center gap-2 border border-outline px-6 py-4 rounded-xl text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <Icon name="download" className="h-4 w-4" />
                تصدير التقرير
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Icon name="bolt" className="h-4 w-4" fill />
                تشغيل الضبط التلقائي
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-outline-variant/20">
            <button
              onClick={() => setActiveTab("live")}
              className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === "live"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              التسعير المباشر
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              سجل الأسعار
            </button>
          </div>

          {activeTab === "live" ? (
            <>
              <PricingStatCards />
              <PricingTable />
              <PricingInsights />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
              <p className="text-body-lg font-bold text-on-surface">
                سجل الأسعار غير متاح بعد
              </p>
              <p className="text-body-md text-on-surface-variant">
                سيتم عرض سجل التعديلات السابقة على الأسعار هنا قريبًا.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default withAuth(PricingPage);
