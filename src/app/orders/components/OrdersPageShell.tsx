"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { useAppLang } from "@/store/use-app-lang";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";

interface OrdersPageShellProps {
  pageTitleKey?: string;
  defaultTitle?: string;
  showFeedbackIcons?: boolean;
  children: (searchQuery: string) => ReactNode;
}

export function OrdersPageShell({
  pageTitleKey,
  defaultTitle = "Orders",
  showFeedbackIcons = false,
  children,
}: OrdersPageShellProps) {
  const store = useStoreProfile();
  const { lang, setLang } = useAppLang();
  const isRtl = lang === "ar";

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleLanguage = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const getPageTitle = () => {
    if (pageTitleKey === "orderDetailsControl") {
      return isRtl
        ? "تفاصيل الطلب والتحكم بالتنفيذ"
        : "Order Details & Fulfillment Control";
    }
    return isRtl ? "الطلبات" : defaultTitle;
  };

  return (
    <div
      className="bg-[#FAF9F5] text-on-surface min-h-screen flex font-sans select-none"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`fixed ${
          isRtl ? "right-0" : "left-0"
        } top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                type="button"
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

      {/* Main Container Area */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          isRtl
            ? sidebarCollapsed
              ? "lg:mr-20"
              : "lg:mr-64"
            : sidebarCollapsed
              ? "lg:ml-20"
              : "lg:ml-64"
        }`}
      >
        {/* Merchant Portal Top Bar Header */}
        <header className="h-16 flex justify-between items-center px-4 sm:px-8 w-full bg-[#FAF9F5] border-b border-outline-variant/40 sticky top-0 z-40">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            {/* Page title in Top Bar */}
            <span className="font-bold text-lg text-primary shrink-0 hidden sm:block">
              {getPageTitle()}
            </span>

            {/* Integrated Top Bar Search Bar */}
            <div className="relative w-full max-w-md min-w-[180px] sm:min-w-[280px]">
              <Icon
                name="search"
                className={`h-4 w-4 absolute ${
                  isRtl ? "right-3" : "left-3"
                } top-1/2 -translate-y-1/2 text-outline`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isRtl
                    ? "البحث برقم الطلب، اسم العميل، أو التاريخ..."
                    : "Search order ID, customer, or date..."
                }
                className={`w-full bg-white/80 border border-outline-variant/60 rounded-xl py-2 ${
                  isRtl ? "pr-9 pl-3" : "pl-9 pr-3"
                } text-xs font-sans text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:outline-hidden transition-all`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showFeedbackIcons && (
              <div className="flex items-center gap-1 text-outline">
                <button
                  type="button"
                  className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors cursor-pointer"
                  title="Favorite"
                >
                  <Icon name="star" className="w-4 h-4 text-outline" />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors cursor-pointer"
                  title="Thumbs Up"
                >
                  <Icon name="thumb_up" className="w-4 h-4 text-outline" />
                </button>
                <button
                  type="button"
                  className="p-1.5 hover:bg-surface-container-highest rounded-full transition-colors cursor-pointer"
                  title="Thumbs Down"
                >
                  <Icon name="thumb_down" className="w-4 h-4 text-outline" />
                </button>
              </div>
            )}

            {!showFeedbackIcons && (
              <div className="flex items-center gap-1">
                <NotificationsDropdown />

                <button
                  type="button"
                  className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer"
                  title={isRtl ? "المساعدة" : "Help"}
                >
                  <Icon
                    name="help"
                    className="h-5 w-5 text-on-surface-variant"
                  />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title={isRtl ? "تغيير اللغة" : "Switch Language"}
            >
              <Icon
                name="language"
                className="h-5 w-5 text-on-surface-variant"
              />
            </button>

            <div className="h-7 w-px bg-outline-variant/50" />

            {/* Merchant User Profile Avatar */}
            <div className="flex items-center gap-2 cursor-pointer hover:bg-surface-container-highest p-1 px-2 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="Merchant Avatar"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                width={32}
                height={32}
                unoptimized
              />
              <span className="text-xs font-bold text-primary hidden md:block">
                {store?.name || "GreenGrocer Central"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <section className="px-4 sm:px-8 py-6 flex-1">
          {children(searchQuery)}
        </section>

        {/* Waste Audit Report Badge */}
        {!showFeedbackIcons && (
          <div
            className={`fixed bottom-6 ${
              isRtl ? "right-6" : "left-6"
            } hidden lg:block z-30`}
          >
            <Link
              href="/inventory/risk-analysis"
              className="bg-[#0B3C26] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-primary transition-all active:scale-95 cursor-pointer border border-white/10"
            >
              <Icon name="eco" className="h-4 w-4 text-emerald-300" />
              <span>{isRtl ? "تقرير هدر الطعام" : "Waste Audit Report"}</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
