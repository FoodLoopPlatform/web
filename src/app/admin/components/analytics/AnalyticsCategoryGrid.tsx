import React from "react";
import { AnalyticsSummaryCategory } from "../../types/admin.types";

interface AnalyticsCategoryGridProps {
  categoryBreakdown: AnalyticsSummaryCategory[];
  isRtl?: boolean;
}

export const AnalyticsCategoryGrid: React.FC<AnalyticsCategoryGridProps> = ({
  categoryBreakdown,
  isRtl = false,
}) => {
  if (categoryBreakdown.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
        <div className={isRtl ? "text-right" : "text-left"}>
          <h3 className="text-sm font-extrabold text-primary font-sans">
            {isRtl
              ? "توزيع هدر الطعام حسب الفئات والأنواع"
              : "Food Waste Recovery by Category"}
          </h3>
          <p className="text-xs text-outline mt-0.5">
            {isRtl
              ? "نسب الاسترداد، الكيلوجرامات المحفوظة، والقيمة المستردة لكل فئة"
              : "Percentages, saved weights, and financial recovery by category"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoryBreakdown.map((cat: AnalyticsSummaryCategory) => (
          <div
            key={cat.categoryId}
            className="bg-surface-container-low p-4 rounded-xl border border-card-border flex flex-col justify-between gap-3 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface">
                {isRtl ? cat.nameAr : cat.name}
              </span>
              <span className="font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                {cat.percentageOfTotal}%
              </span>
            </div>

            <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(cat.percentageOfTotal, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-1 text-[10px] text-outline border-t border-surface-container pt-2 text-center">
              <div className="flex flex-col">
                <span className="font-bold text-outline uppercase">
                  {isRtl ? "الطعام" : "Saved"}
                </span>
                <span className="font-extrabold text-emerald-800 mt-0.5">
                  {cat.foodSavedKg} {isRtl ? "كجم" : "kg"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-outline uppercase">
                  {isRtl ? "العناصر" : "Items"}
                </span>
                <span className="font-extrabold text-on-surface mt-0.5">
                  {cat.rescuedItemsCount}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-outline uppercase">
                  {isRtl ? "القيمة" : "Value"}
                </span>
                <span className="font-extrabold text-blue-700 mt-0.5">
                  {cat.totalFinancialValue} {isRtl ? "ج.م" : "EGP"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
