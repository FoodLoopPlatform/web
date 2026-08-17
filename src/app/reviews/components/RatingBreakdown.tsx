import { Icon } from "@/components/ui/icon";
import type { RatingDistribution, ReviewRatingFilter } from "../api/types";

type RatingBreakdownProps = {
  distribution: RatingDistribution;
  totalReviews: number;
  selectedFilter: ReviewRatingFilter;
  onSelectFilter: (filter: ReviewRatingFilter) => void;
};

export function RatingBreakdown({
  distribution,
  totalReviews,
  selectedFilter,
  onSelectFilter,
}: RatingBreakdownProps) {
  const stars = [5, 4, 3, 2, 1] as const;

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-lg font-bold text-on-surface">
          توزيع النجوم
        </h3>
        <span className="text-xs text-on-surface-variant">اضغط للتصفية</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {stars.map((star) => {
          const count = distribution[star] || 0;
          const percentage =
            totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
          const isSelected = selectedFilter === star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => onSelectFilter(isSelected ? "all" : star)}
              className={`flex items-center gap-3 p-1.5 rounded-xl transition-all text-start cursor-pointer ${
                isSelected
                  ? "bg-light-green border border-primary/30"
                  : "hover:bg-surface-container-low"
              }`}
            >
              {/* Star Label */}
              <div className="flex items-center gap-1 w-14 shrink-0">
                <span className="font-mono text-sm font-bold text-on-surface">
                  {star}
                </span>
                <Icon name="star" className="h-3.5 w-3.5 text-amber-500" fill />
              </div>

              {/* Progress Bar */}
              <div className="flex-1 h-3 rounded-full bg-outline-variant/20 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Count & Percent */}
              <div className="flex items-center justify-end gap-2 w-20 text-xs shrink-0 text-on-surface-variant font-mono">
                <span>{count}</span>
                <span className="opacity-60 text-[11px]">({percentage}%)</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
