"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { getMyStoreReviews } from "./api/reviews-api";
import { ReviewStatsCards } from "./components/ReviewStatsCards";
import { RatingBreakdown } from "./components/RatingBreakdown";
import { ReviewCard } from "./components/ReviewCard";
import type {
  StoreReview,
  ReviewsStats,
  ReviewRatingFilter,
  ReviewSortOption,
} from "./api/types";

function StoreReviewsPage() {
  const store = useStoreProfile();
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [stats, setStats] = useState<ReviewsStats>({
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    positivePercentage: 0,
    withCommentsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<ReviewRatingFilter>("all");
  const [sortOption, setSortOption] = useState<ReviewSortOption>("newest");

  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    getMyStoreReviews()
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setReviews(res.data);
          setStats(res.stats);
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل تقييمات المتجر",
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getMyStoreReviews()
      .then((res) => {
        if (!isMounted) return;
        if (res.error) {
          setError(res.error);
        } else {
          setReviews(res.data);
          setStats(res.stats);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل تقييمات المتجر",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered & Sorted Reviews
  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(q) ||
          r.userFullName?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.orderId?.toLowerCase().includes(q),
      );
    }

    // Rating filter
    if (ratingFilter === "with_comment") {
      list = list.filter((r) => Boolean(r.comment && r.comment.length > 0));
    } else if (typeof ratingFilter === "number") {
      list = list.filter((r) => r.rating === ratingFilter);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortOption === "highest") {
        return b.rating - a.rating;
      }
      if (sortOption === "lowest") {
        return a.rating - b.rating;
      }
      // newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [reviews, searchQuery, ratingFilter, sortOption]);

  const filterTabs: { key: ReviewRatingFilter; label: string }[] = [
    { key: "all", label: "جميع التقييمات" },
    { key: 5, label: "5 نجوم" },
    { key: 4, label: "4 نجوم" },
    { key: 3, label: "3 نجوم" },
    { key: 2, label: "نجمتان" },
    { key: 1, label: "نجمة واحدة" },
    { key: "with_comment", label: "مع تعليق مكتوب" },
  ];

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${
            sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
          }`}
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

          {/* Page Content */}
          <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-sans text-3xl font-bold text-primary">
                  تقييمات المتجر
                </h1>
                <p className="text-body-lg text-on-surface-variant max-w-2xl">
                  تابع آراء العملاء وتجاربهم لتحسين جودة المنتجات ومستوى الخدمة
                  المقدمة.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="flex items-center gap-2 border border-outline-variant px-5 py-3 rounded-xl text-body-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer bg-white"
                >
                  <Icon
                    name="refresh"
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  تحديث التقييمات
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <ReviewStatsCards stats={stats} isLoading={isLoading} />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Rating Breakdown Card */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <RatingBreakdown
                  distribution={stats.distribution}
                  totalReviews={stats.totalReviews}
                  selectedFilter={ratingFilter}
                  onSelectFilter={setRatingFilter}
                />

                {/* Customer Satisfaction Tip Box */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <Icon name="auto_awesome" className="h-4 w-4" fill />
                    <span>نصيحة لتحسين التقييمات</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    الاستجابة السريعة وتوفير معلومات دقيقة حول تاريخ انتهاء
                    الصلاحية يرفع من معدل رضا العملاء بنسبة تزيد عن 30%.
                  </p>
                </div>
              </div>

              {/* Right Column: Filter Bar and Reviews List */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-outline-variant/30 rounded-2xl p-4 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Icon
                        name="search"
                        className="h-4 w-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث في التقييمات أو اسم العميل..."
                        className="w-full bg-[#ecefe8] border border-outline-variant/40 rounded-xl py-2 pr-10 pl-4 text-sm text-on-surface outline-none focus:border-primary transition-colors"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                        >
                          <Icon name="close" className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Sort Selector */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-on-surface-variant whitespace-nowrap hidden sm:inline">
                        ترتيب حسب:
                      </span>
                      <div className="relative">
                        <select
                          value={sortOption}
                          onChange={(e) =>
                            setSortOption(e.target.value as ReviewSortOption)
                          }
                          className="appearance-none bg-[#ecefe8] border border-outline-variant/40 rounded-xl py-2 ps-3.5 pe-8 text-xs font-semibold text-on-surface cursor-pointer outline-none focus:border-primary transition-colors"
                        >
                          <option value="newest">الأحدث أولاً</option>
                          <option value="highest">الأعلى تقييماً</option>
                          <option value="lowest">الأقل تقييماً</option>
                        </select>
                        <Icon
                          name="expand_more"
                          className="h-3.5 w-3.5 text-on-surface-variant absolute inset-s-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
                    {filterTabs.map((tab) => {
                      const isSelected = ratingFilter === tab.key;
                      return (
                        <button
                          key={String(tab.key)}
                          type="button"
                          onClick={() => setRatingFilter(tab.key)}
                          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary text-white font-bold"
                              : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews Feed */}
                {isLoading ? (
                  <div className="flex flex-col gap-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="bg-white border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-full bg-outline-variant/30 shrink-0" />
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-36 bg-outline-variant/30 rounded" />
                            <div className="h-3 w-24 bg-outline-variant/20 rounded" />
                          </div>
                        </div>
                        <div className="h-16 w-full bg-outline-variant/20 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="bg-white border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
                    <Icon
                      name="error_outline"
                      className="h-10 w-10 text-error"
                    />
                    <h3 className="font-bold text-on-surface text-lg">
                      تعذر تحميل التقييمات
                    </h3>
                    <p className="text-sm text-on-surface-variant max-w-md">
                      {error}
                    </p>
                    <button
                      type="button"
                      onClick={handleRefresh}
                      className="mt-2 bg-primary text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : filteredReviews.length === 0 ? (
                  <div className="bg-white border border-outline-variant/30 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                    <div className="h-16 w-16 rounded-full bg-light-green flex items-center justify-center text-primary">
                      <Icon name="rate_review" className="h-8 w-8" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-on-surface">
                      لم يتم العثور على تقييمات
                    </h3>
                    <p className="text-body-md text-on-surface-variant max-w-md">
                      {searchQuery || ratingFilter !== "all"
                        ? "لا توجد تقييمات تطابق معايير التصفية والبحث المحددة."
                        : "لم يتم تسجيل أي تقييمات لهذا المتجر حتى الآن."}
                    </p>
                    {(searchQuery || ratingFilter !== "all") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setRatingFilter("all");
                        }}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer mt-1"
                      >
                        إعادة تعيين خيارات التصفية
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
                      <span>
                        عرض {filteredReviews.length} من أصل {reviews.length}{" "}
                        تقييم
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(StoreReviewsPage);
