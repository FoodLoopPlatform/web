"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { PricingStatCards } from "@/components/pricing/PricingStatCards";
import { StoreCommissionBanner } from "@/components/pricing/StoreCommissionBanner";
import { PricingTable } from "@/components/pricing/PricingTable";
import { PricingRecommendationModal } from "@/components/pricing/PricingRecommendationModal";
import { PricingHistoryView } from "@/components/pricing/PricingHistoryView";
import { AiRecommendationsView } from "@/components/pricing/AiRecommendationsView";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import {
  getProductsPricing,
  getAiRecommendations,
  getAiRecommendationsSchedule,
  approveAiRecommendation,
  rejectAiRecommendation,
} from "./api/pricing-api";
import type {
  ProductPricingItem,
  PricingStatsData,
  AiRecommendation,
  AiRecommendationsSchedule,
} from "./api/types";

type PricingTab = "live" | "recommendations" | "history";
type ToastState = { message: string; type: "success" | "error" } | null;

function PricingPage() {
  const store = useStoreProfile();
  const [activeTab, setActiveTab] = useState<PricingTab>("live");

  const [products, setProducts] = useState<ProductPricingItem[]>([]);
  const [stats, setStats] = useState<PricingStatsData | undefined>(undefined);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(
    [],
  );
  const [schedule, setSchedule] = useState<AiRecommendationsSchedule | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(true);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<
    string | null
  >(null);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] =
    useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  // Auto dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load all pricing, AI recommendations, and schedule data
  const loadPricingData = useCallback(async () => {
    try {
      const [pricingRes, schedRes] = await Promise.allSettled([
        getProductsPricing(),
        getAiRecommendationsSchedule(),
      ]);

      let loadedProducts: ProductPricingItem[] = [];
      const imageLookup: Record<string, string> = {};

      if (pricingRes.status === "fulfilled" && pricingRes.value.data) {
        loadedProducts = pricingRes.value.data;
        setProducts(loadedProducts);
        setStats(pricingRes.value.stats);
        for (const p of loadedProducts) {
          if (p.id && p.image) {
            imageLookup[p.id] = p.image;
          }
          if (p.code && p.image) {
            imageLookup[p.code] = p.image;
          }
        }
      }

      if (schedRes.status === "fulfilled") {
        setSchedule(schedRes.value.data ?? null);
      }

      // Fetch AI recommendations with image lookup from products
      const recsRes = await getAiRecommendations(imageLookup);
      if (recsRes.data) {
        const enrichedRecs = recsRes.data.map((rec) => {
          if (
            !rec.productImageUrl &&
            rec.productId &&
            imageLookup[rec.productId]
          ) {
            return { ...rec, productImageUrl: imageLookup[rec.productId] };
          }
          return rec;
        });
        setRecommendations(enrichedRecs);

        // Backfill any products missing images if recommendation has one
        const recImageMap: Record<string, string> = {};
        for (const r of enrichedRecs) {
          if (r.productId && r.productImageUrl) {
            recImageMap[r.productId] = r.productImageUrl;
          }
        }
        if (Object.keys(recImageMap).length > 0) {
          setProducts((prev) =>
            prev.map((p) =>
              !p.image && recImageMap[p.id]
                ? { ...p, image: recImageMap[p.id] }
                : p,
            ),
          );
        }
      }
    } finally {
      setIsLoading(false);
      setIsLoadingRecommendations(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    setIsLoadingRecommendations(true);
    void loadPricingData();
  }, [loadPricingData]);

  useEffect(() => {
    void loadPricingData();
  }, [loadPricingData]);

  // Handle Approve Recommendation
  const handleApproveRecommendation = async (id: string): Promise<boolean> => {
    const res = await approveAiRecommendation(id);
    if (!res.success) {
      setToast({
        message: res.error || "فشل في اعتماد توصية التسعير",
        type: "error",
      });
      return false;
    }

    setToast({
      message: "تم اعتماد توصية السعر وتطبيق الخصم بنجاح",
      type: "success",
    });
    setRecommendations((prev) => prev.filter((r) => r.id !== id));

    // Refresh products list in background so the table shows the new price
    getProductsPricing().then((pricingRes) => {
      if (pricingRes.data) {
        setProducts(pricingRes.data);
        setStats(pricingRes.stats);
      }
    });
    return true;
  };

  // Handle Reject Recommendation
  const handleRejectRecommendation = async (
    id: string,
    reason?: string,
  ): Promise<boolean> => {
    const res = await rejectAiRecommendation(id, reason);
    if (!res.success) {
      setToast({
        message: res.error || "فشل في رفض توصية التسعير",
        type: "error",
      });
      return false;
    }

    setToast({
      message: "تم رفض توصية السعر بنجاح",
      type: "success",
    });
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const handleViewHistory = (productId: string) => {
    setSelectedProductForHistory(productId);
    setActiveTab("history");
  };

  const handleOpenTopRecommendationModal = () => {
    setIsRecommendationModalOpen(true);
  };

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <>
          <main
            className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 w-full min-w-0 max-w-full overflow-x-hidden ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
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

            {/* Toast Notification */}
            {toast && (
              <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border border-white/20 animate-in fade-in slide-in-from-top-3 duration-300 pointer-events-auto select-none ${
                  toast.type === "success"
                    ? "bg-[#0b723c] text-white"
                    : "bg-error text-white"
                }`}
                dir="rtl"
              >
                <Icon
                  name={toast.type === "success" ? "check_circle" : "error"}
                  className="h-5 w-5 shrink-0"
                />
                <span>{toast.message}</span>
                <button
                  type="button"
                  onClick={() => setToast(null)}
                  className="p-1 hover:opacity-80 transition-opacity cursor-pointer"
                  aria-label="إغلاق الإشعار"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Pricing Content */}
            <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-8">
              {/* Header Section */}
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="font-sans text-2xl sm:text-3xl font-bold text-primary">
                    لوحة التسعير
                  </h1>
                  <p className="text-sm sm:text-body-lg text-on-surface-variant max-w-[650px]">
                    حسّن هوامش مخزونك من خلال التسعير الديناميكي الفوري، وإدارة
                    توصيات الذكاء الاصطناعي، ودورات التخفيض وسجل الأسعار.
                  </p>
                </div>

                <div className="flex gap-2.5 sm:gap-4 shrink-0 flex-wrap w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleOpenTopRecommendationModal}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-body-md font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    <Icon name="auto_awesome" className="h-4 w-4" fill />
                    <span>توصيات الذكاء الاصطناعي</span>
                    {recommendations.length > 0 && (
                      <span className="bg-white text-primary text-xs px-2 py-0.5 rounded-full font-bold">
                        {recommendations.length}
                      </span>
                    )}
                  </button>

                  <Link
                    href="/pricing/automation-settings"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 border border-outline px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl text-xs sm:text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    <Icon name="settings" className="h-4 w-4" />
                    <span>إعدادات الأتمتة</span>
                  </Link>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-outline-variant/20 overflow-x-auto scrollbar-none w-full">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === "live"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  التسعير المباشر
                </button>
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "recommendations"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>توصيات الذكاء الاصطناعي</span>
                  {recommendations.length > 0 && (
                    <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {recommendations.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-2.5 px-2 text-body-md font-medium border-b-2 -mb-px transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === "history"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  سجل الأسعار
                </button>
              </div>

              {/* Tab Panels */}
              {activeTab === "live" && (
                <>
                  <StoreCommissionBanner />
                  <PricingStatCards
                    stats={stats}
                    schedule={schedule}
                    isLoading={isLoading}
                  />

                  {/* AI Recommendations Banner Callout (if recommendations exist) */}
                  {recommendations.length > 0 && (
                    <div className="bg-light-green border border-primary/20 rounded-2xl p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap shadow-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Icon name="bolt" className="h-6 w-6" fill />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-primary">
                              لديك {recommendations.length} توصيات تسعير ذكية
                              جديدة بانتظار المراجعة
                            </h3>
                          </div>
                          <p className="text-xs sm:text-sm text-on-surface-variant">
                            اكتشف المحرك فرصًا لتسريع بيع المنتجات القريبة من
                            انتهاء الصلاحية وتحسين الهوامش.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("recommendations")}
                        className="inline-flex items-center gap-2 bg-primary text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                      >
                        <span>مراجعة التوصيات الآن</span>
                        <Icon name="arrow_back" className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <PricingTable
                    items={products}
                    isLoading={isLoading}
                    onViewHistory={handleViewHistory}
                  />
                </>
              )}

              {activeTab === "recommendations" && (
                <AiRecommendationsView
                  recommendations={recommendations}
                  schedule={schedule}
                  isLoading={isLoadingRecommendations}
                  onApprove={handleApproveRecommendation}
                  onReject={handleRejectRecommendation}
                  onRefresh={handleRefresh}
                />
              )}

              {activeTab === "history" && (
                <PricingHistoryView
                  products={products}
                  initialProductId={selectedProductForHistory}
                />
              )}
            </div>
          </main>

          {/* Quick Single Recommendation Modal */}
          <PricingRecommendationModal
            open={isRecommendationModalOpen}
            onClose={() => setIsRecommendationModalOpen(false)}
            recommendations={recommendations}
            onApprove={handleApproveRecommendation}
            onReject={handleRejectRecommendation}
          />
        </>
      )}
    </MerchantShell>
  );
}

export default withAuth(PricingPage);
