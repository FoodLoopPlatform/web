"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import {
  getMerchantProducts,
  getCategories,
} from "@/app/products/api/products-api";
import { RiskAnalysisBoard } from "./components/RiskAnalysisBoard";
import { RiskAnalysisSkeleton } from "./components/RiskAnalysisSkeleton";

function InventoryRiskAnalysisPage() {
  const store = useStoreProfile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const categoriesPromise = useMemo(() => getCategories(), []);

  // A large pageSize pulls the full merchant catalog so the risk model can
  // analyze it client-side, mirroring the "fetch everything" pattern used
  // for admin audit-log analysis (see app/admin/api/audit-log-api.ts).
  const productsPromise = useMemo(
    () => getMerchantProducts({ pageSize: 500 }),
    [],
  );

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
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>

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

        <section className="px-margin-mobile md:px-margin-desktop py-lg flex-1">
          {/* Breadcrumb back to inventory */}
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-4"
          >
            <Icon name="arrow_forward" className="h-3.5 w-3.5" />
            <span>العودة إلى المخزون</span>
          </Link>

          <Suspense fallback={<RiskAnalysisSkeleton />}>
            <RiskAnalysisBoard
              productsPromise={productsPromise}
              categoriesPromise={categoriesPromise}
            />
          </Suspense>
        </section>

        {/* Decorative Watermark logo */}
        <div className="fixed bottom-0 left-0 p-margin-desktop opacity-5 pointer-events-none select-none">
          <span className="font-display-lg text-display-lg text-primary -rotate-12 block">
            FoodLoop
          </span>
        </div>
      </main>
    </div>
  );
}

export default withAuth(InventoryRiskAnalysisPage);
