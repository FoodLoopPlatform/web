import React from "react";
import { isStatEmpty } from "../../constants/design-tokens";
import { StatsCardProps } from "../../types/common.types";

export type { StatsCardProps };

/**
 * Renders appropriate icon based on stat label if no custom icon is provided.
 */
function getStatIcon(label: string): React.ReactNode {
  const l = label.toLowerCase();
  if (
    l.includes("sales") ||
    l.includes("مبيعات") ||
    l.includes("مبلغ") ||
    l.includes("amount") ||
    l.includes("revenue")
  ) {
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    );
  }
  if (
    l.includes("order") ||
    l.includes("طلبات") ||
    l.includes("إجمالي") ||
    l.includes("users") ||
    l.includes("حسابات")
  ) {
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    );
  }
  if (
    l.includes("dispute") ||
    l.includes("نزاع") ||
    l.includes("شكاوى") ||
    l.includes("complaint")
  ) {
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    );
  }
  if (
    l.includes("waste") ||
    l.includes("هدر") ||
    l.includes("co2") ||
    l.includes("انبعاثات")
  ) {
    return (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  );
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  unit,
  subtitle,
  accentClass = "bg-primary",
  isRtl = false,
  textColorClass,
  icon,
  iconBgClass,
}) => {
  const isEmpty = isStatEmpty(value);
  const displayIcon = icon || getStatIcon(label);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`rounded-2xl border p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between transition-all duration-200 min-h-[110px] ${
        isEmpty
          ? "bg-slate-50/50 border-slate-200/70"
          : "bg-white border-card-border shadow-xs hover:shadow-sm"
      } ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Header Row: Label & Icon Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider block font-sans truncate ${
            isEmpty ? "text-slate-400" : "text-outline"
          }`}
        >
          {label}
        </span>
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
            isEmpty
              ? "bg-slate-100 text-slate-400"
              : iconBgClass || "bg-emerald-50 text-emerald-800"
          }`}
        >
          {displayIcon}
        </div>
      </div>

      {/* Metric Value Row & Optional Empty Tag */}
      <div className="flex items-baseline justify-between gap-2 mt-auto">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span
            className={`text-2xl sm:text-3xl font-black tracking-tight font-sans ${
              isEmpty
                ? "text-slate-400 italic"
                : textColorClass || "text-on-surface"
            }`}
          >
            {value}
          </span>
          {unit && (
            <span
              className={`text-xs font-bold font-sans ${
                isEmpty ? "text-slate-400" : "text-outline"
              }`}
            >
              {unit}
            </span>
          )}
        </div>
        {isEmpty && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-500 font-bold uppercase tracking-wider">
            {isRtl ? "لا توجد بيانات" : "Empty"}
          </span>
        )}
      </div>

      {/* Subtitle / Extra info if available */}
      {subtitle && (
        <div className="mt-2 text-[10px] font-bold block whitespace-nowrap">
          {typeof subtitle === "string" ? (
            <span className="text-outline">{subtitle}</span>
          ) : (
            subtitle
          )}
        </div>
      )}

      {/* Bottom Accent Bar */}
      {!isEmpty && accentClass && (
        <div
          className={`absolute bottom-0 right-0 left-0 w-full h-1 ${accentClass}`}
        />
      )}
    </div>
  );
};
