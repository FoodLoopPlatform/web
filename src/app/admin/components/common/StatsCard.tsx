import React from "react";
import {
  ADMIN_DESIGN_TOKENS,
  isStatEmpty,
} from "../../constants/design-tokens";

interface StatsCardProps {
  label: string;
  value: string | number;
  accentClass?: string;
  isRtl?: boolean;
  textColorClass?: string;
  icon?: React.ReactNode;
}

/**
 * Renders appropriate icon based on stat label if no custom icon is provided.
 */
function getStatIcon(label: string): React.ReactNode {
  const l = label.toLowerCase();
  if (
    l.includes("sales") ||
    l.includes("مبيعات") ||
    l.includes("مبلغ") ||
    l.includes("amount")
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
  if (l.includes("order") || l.includes("طلبات") || l.includes("إجمالي")) {
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
    l.includes("fulfillment") ||
    l.includes("تنفيذ") ||
    l.includes("معدل") ||
    l.includes("rate")
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
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    );
  }
  if (l.includes("donation") || l.includes("تبرع") || l.includes("خيرية")) {
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
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
  accentClass = "bg-primary-container/20",
  isRtl = false,
  textColorClass,
  icon,
}) => {
  const isEmpty = isStatEmpty(value);
  const styles = isEmpty
    ? ADMIN_DESIGN_TOKENS.statCard.empty
    : ADMIN_DESIGN_TOKENS.statCard.active;

  const displayIcon = icon || getStatIcon(label);

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between ${
        styles.container
      } ${isRtl ? "text-right" : "text-left"}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={styles.label}>{label}</span>
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
            styles.iconBox
          }`}
        >
          {displayIcon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span
          className={`${styles.value} ${
            !isEmpty && textColorClass ? textColorClass : ""
          }`}
        >
          {value}
        </span>
        {isEmpty && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-500 font-semibold uppercase tracking-wider">
            {isRtl ? "لا توجد بيانات" : "Empty"}
          </span>
        )}
      </div>

      {!isEmpty && (
        <div
          className={`absolute bottom-0 ${
            isRtl ? "right-0" : "left-0"
          } w-full h-1 ${accentClass}`}
        />
      )}
    </div>
  );
};
