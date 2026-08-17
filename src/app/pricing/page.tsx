"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { PricingStatCards } from "@/components/pricing/PricingStatCards";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingRecommendationModal } from "@/components/pricing/PricingRecommendationModal";
import { PricingHistoryView } from "@/components/pricing/PricingHistoryView";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { getProductsPricing } from "./api/pricing-api";
import type { ProductPricingItem, PricingStatsData } from "./api/types";

function PricingPage() {
  const store = useStoreProfile();
  const [activeTab, setActiveTab] = useState<"live" | "history">("live");
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);

  const [products, setProducts] = useState<ProductPricingItem[]>([]);
  const [stats, setStats] = useState<PricingStatsData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<
    string | null
  >(null);

  // Fetch data from /stores/me/products/pricing
  useEffect(() => {
    let isMounted = true;

    getProductsPricing()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setProducts(res.data);
          setStats(res.stats);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRunAutoAdjustment = () => {
    if (isRunningAutomation) return;
    setIsRunningAutomation(true);
    setTimeout(() => {
      setIsRunningAutomation(false);
      setIsRecommendationModalOpen(true);
    }, 900);
  };

  const handleViewHistory = (productId: string) => {
    setSelectedProductForHistory(productId);
    setActiveTab("history");
  };

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <>
          <main
            className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
          >
            <MerchantTopHeader
              onMenuClick={() => setMobileSidebarOpen(true)}
              storeName={store?.name}
              avatarUrl={resolveImageUrl(store?.logo)}
              left={
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
              }
            />

            {/* Pricing Content */}
            <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-sans text-3xl font-bold text-primary">
                    لوحة التسعير
                  </h1>
                  <p className="text-body-lg text-on-surface-variant max-w-2xl">
                    حسّن هوامش مخزونك من خلال التسعير الديناميكي الفوري وإدارة
                    دورات التخفيض وسجل الأسعار.
                  </p>
                </div>
                <div className="flex gap-4 shrink-0 flex-wrap">
                  <button
                    type="button"
                    className="flex items-center gap-2 border border-outline px-6 py-4 rounded-xl text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Icon name="download" className="h-4 w-4" />
                    تصدير التقرير
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAutoAdjustment}
                    disabled={isRunningAutomation}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-4 rounded-xl text-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isRunningAutomation ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <Icon name="bolt" className="h-4 w-4" fill />
                    )}
                    {isRunningAutomation
                      ? "جارٍ التشغيل..."
                      : "تشغيل الضبط التلقائي"}
                  </button>
                  <Link
                    href="/pricing/automation-settings"
                    className="flex items-center gap-2 border border-outline px-6 py-4 rounded-xl text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Icon name="settings" className="h-4 w-4" />
                    إعدادات الأتمتة
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-outline-variant/20">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                    activeTab === "live"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  التسعير المباشر
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer ${
                    activeTab === "history"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  سجل الأسعار
                </button>
              </div>

              {activeTab === "live" ? (
                <>
                  <PricingStatCards stats={stats} isLoading={isLoading} />
                  <PricingTable
                    items={products}
                    isLoading={isLoading}
                    onViewHistory={handleViewHistory}
                  />
                </>
              ) : (
                <PricingHistoryView
                  products={products}
                  initialProductId={selectedProductForHistory}
                />
              )}
            </div>
          </main>
          <PricingRecommendationModal
            open={isRecommendationModalOpen}
            onClose={() => setIsRecommendationModalOpen(false)}
            products={products}
          />
        </>
      )}
    </MerchantShell>
  );
}

export default withAuth(PricingPage);
