import type { Category } from "@/app/products/api/types";
import { FilterIcon } from "@/components/icons";
import { RISK_LEVEL_LABELS, type RiskLevel } from "../lib/risk-analysis";

interface RiskFiltersSidebarProps {
  categories: Category[];
  selectedCategoryIds: string[];
  onToggleCategory: (id: string) => void;
  riskFilter: RiskLevel | null;
  onSetRiskFilter: (level: RiskLevel | null) => void;
  riskCounts: Record<RiskLevel, number>;
  insight: { body: string; onView: () => void } | null;
}

// Full-strength container/on-container pairs — the same ones used by
// RiskLevelBadge — only applied when a pill is active. Diluting them with
// opacity for the inactive state (e.g. tertiary-container/50) muddies the
// bright on-tertiary-container gold text against its own washed-out
// background, so inactive pills instead use a plain neutral style.
const RISK_LEVEL_PILL_ACTIVE_STYLES: Record<RiskLevel, string> = {
  high: "bg-error-container text-on-error-container ring-2 ring-error",
  medium:
    "bg-tertiary-container text-on-tertiary-container ring-2 ring-tertiary-fixed-dim",
  low: "bg-secondary-container text-on-secondary-container ring-2 ring-outline",
};

const RISK_LEVEL_PILL_INACTIVE_STYLE =
  "bg-white border border-outline-variant text-on-surface-variant hover:border-primary";

export function RiskFiltersSidebar({
  categories,
  selectedCategoryIds,
  onToggleCategory,
  riskFilter,
  onSetRiskFilter,
  riskCounts,
  insight,
}: RiskFiltersSidebarProps) {
  return (
    <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-md">
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-primary">الفلاتر</h3>
          <FilterIcon className="h-4 w-4 text-on-surface-variant" />
        </div>

        {/* Category checkboxes */}
        <div className="flex flex-col gap-sm">
          <span className="text-xs font-bold text-on-surface-variant">
            الفئة
          </span>
          <div className="flex flex-col gap-3">
            {categories.map((cat) => {
              const checked = selectedCategoryIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {cat.nameAr || cat.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleCategory(cat.id)}
                    className="h-[20px] w-[20px] rounded accent-primary cursor-pointer"
                  />
                </label>
              );
            })}
            {categories.length === 0 && (
              <p className="text-xs text-on-surface-variant opacity-60">
                لا توجد فئات متاحة
              </p>
            )}
          </div>
        </div>

        {/* Risk level filter pills — click to isolate a level, click again to clear */}
        <div className="flex flex-col gap-sm pt-2 border-t border-outline-variant/40">
          <span className="text-xs font-bold text-on-surface-variant">
            مستوى المخاطر
          </span>
          <div className="flex flex-col gap-2">
            {(["high", "medium", "low"] as RiskLevel[]).map((level) => {
              const isActive = riskFilter === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => onSetRiskFilter(isActive ? null : level)}
                  aria-pressed={isActive}
                  className={`flex items-center justify-between px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? RISK_LEVEL_PILL_ACTIVE_STYLES[level]
                      : RISK_LEVEL_PILL_INACTIVE_STYLE
                  }`}
                >
                  <span>{riskCounts[level]}</span>
                  <span>{RISK_LEVEL_LABELS[level]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {insight && (
        <div className="bg-primary text-white rounded-xl p-6 flex flex-col gap-2 shadow-elevation-2">
          <h4 className="text-xs font-bold text-primary-fixed opacity-90">
            رؤية سريعة
          </h4>
          <p className="text-sm leading-relaxed">{insight.body}</p>
          <button
            type="button"
            onClick={insight.onView}
            className="text-xs font-bold text-primary-fixed pt-2 text-right hover:underline cursor-pointer self-start"
          >
            عرض التفاصيل ←
          </button>
        </div>
      )}
    </aside>
  );
}
