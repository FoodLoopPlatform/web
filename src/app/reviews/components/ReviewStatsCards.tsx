import { Icon } from "@/components/ui/icon";
import type { ReviewsStats } from "../api/types";

type ReviewStatsCardsProps = {
  stats: ReviewsStats;
  isLoading?: boolean;
};

export function ReviewStatsCards({
  stats,
  isLoading = false,
}: ReviewStatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-light-green border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-36 text-right"
          >
            <div className="h-4 w-28 bg-outline-variant/30 rounded" />
            <div className="h-10 w-20 bg-outline-variant/40 rounded mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Average Rating Card */}
      <div className="bg-light-green border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-36 shadow-xs text-right">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant text-right">
            متوسط التقييم العام
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#ffddb7] text-[#653e00] flex items-center justify-center shrink-0">
            <Icon name="star" className="h-4 w-4" fill />
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 pt-4">
          <div className="flex items-baseline gap-1.5 text-right">
            <span className="font-sans text-4xl font-bold text-primary text-right">
              <bdi>{stats.averageRating > 0 ? stats.averageRating : "0.0"}</bdi>
            </span>
            <span className="text-sm text-on-surface-variant font-medium">
              / 5.0
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon
                key={star}
                name="star"
                className={`h-4 w-4 ${
                  star <= Math.round(stats.averageRating)
                    ? "text-amber-500"
                    : "text-outline-variant/40"
                }`}
                fill={star <= Math.round(stats.averageRating)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Satisfaction / Positive Reviews */}
      <div className="bg-light-green border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-36 shadow-xs text-right">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant text-right">
            نسبة الرضا الإيجابي
          </span>
          <div className="h-8 w-8 rounded-lg bg-[#98f3b0] text-[#0b723c] flex items-center justify-center shrink-0">
            <Icon name="favorite" className="h-4 w-4" fill />
          </div>
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="flex flex-col text-right items-start">
            <span className="font-sans text-4xl font-bold text-primary text-right">
              <bdi>{stats.positivePercentage}%</bdi>
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5 text-right">
              تقييمات 4 و 5 نجوم
            </span>
          </div>
          <span className="text-xs font-bold text-[#0b723c] bg-[#98f3b0]/60 px-2.5 py-1 rounded-full shrink-0">
            ممتاز
          </span>
        </div>
      </div>

      {/* Total Reviews */}
      <div className="bg-light-green border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-36 shadow-xs text-right">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant text-right">
            إجمالي التقييمات
          </span>
          <div className="h-8 w-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
            <Icon name="rate_review" className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="flex flex-col text-right items-start">
            <span className="font-sans text-4xl font-bold text-primary text-right">
              <bdi>{stats.totalReviews}</bdi>
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5 text-right">
              تقييم من عملاء المتجر
            </span>
          </div>
        </div>
      </div>

      {/* Reviews with Comments */}
      <div className="bg-light-green border border-outline-variant/30 rounded-2xl p-5 flex flex-col justify-between min-h-36 shadow-xs text-right">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-on-surface-variant text-right">
            الآراء المكتوبة
          </span>
          <div className="h-8 w-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <Icon name="chat" className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="flex flex-col text-right items-start">
            <span className="font-sans text-4xl font-bold text-primary text-right">
              <bdi>{stats.withCommentsCount}</bdi>
            </span>
            <span className="text-xs text-on-surface-variant mt-0.5 text-right">
              ملاحظات وتعليقات مفصلة
            </span>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full shrink-0">
            {stats.totalReviews > 0
              ? `${Math.round((stats.withCommentsCount / stats.totalReviews) * 100)}%`
              : "0%"}
          </span>
        </div>
      </div>
    </div>
  );
}
