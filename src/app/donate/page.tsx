"use client";

import { useState } from "react";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { DonationHeroSection } from "@/components/donate/DonationHeroSection";
import { UnsoldInventoryList } from "@/components/donate/UnsoldInventoryList";
import { VerifiedCharitiesList } from "@/components/donate/VerifiedCharitiesList";
import { ConfirmDonationButton } from "@/components/donate/ConfirmDonationButton";
import { withAuth } from "@/lib/auth/with-auth";

function DonatePage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
        className={`flex-1 min-h-screen min-w-0 flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
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

            <div className="relative max-w-112 w-full hidden md:block">
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

        {/* Donation Content */}
        <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex flex-col gap-1">
            <h1 className="font-sans text-3xl font-bold text-primary">
              التبرع وأثر المجتمع
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              حوّل مخزونك غير المباع إلى شريان حياة للأسر المحتاجة بدلاً من
              الهدر.
            </p>
          </div>

          <DonationHeroSection />
          <UnsoldInventoryList />
          <VerifiedCharitiesList />
          <ConfirmDonationButton />
        </div>
      </main>
    </div>
  );
}

export default withAuth(DonatePage);
