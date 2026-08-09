import React from "react";
import { AdminDictionary } from "../../constants/dictionary";

interface AnalyticsChartsProps {
  t: AdminDictionary;
  lang: "ar" | "en";
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  t,
  lang,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-4">
      <div className={lang === "ar" ? "text-right" : "text-left"}>
        <h3 className="text-base font-extrabold text-primary font-sans">
          {t.wasteTrendTitle}
        </h3>
        <span className="text-[10px] text-outline font-medium block mt-0.5">
          {t.wasteTrendSub}
        </span>
      </div>

      {/* Custom SVG Line Chart */}
      <div className="w-full h-[220px] relative mt-4" dir="ltr">
        <svg
          className="w-full h-full"
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-primary-fixed)"
                stopOpacity="0.4"
              />
              <stop
                offset="100%"
                stopColor="var(--color-primary-fixed)"
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>
          {/* Grid Lines */}
          <line
            x1="0"
            y1="40"
            x2="600"
            y2="40"
            className="stroke-surface-container"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="0"
            y1="90"
            x2="600"
            y2="90"
            className="stroke-surface-container"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="0"
            y1="140"
            x2="600"
            y2="140"
            className="stroke-surface-container"
            strokeWidth="1"
            strokeDasharray="4"
          />
          <line
            x1="0"
            y1="190"
            x2="600"
            y2="190"
            className="stroke-surface-container"
            strokeWidth="1"
          />

          {/* Filled Area */}
          <path
            d="M 20 190 L 20 140 Q 110 130 200 110 T 380 70 T 560 40 L 560 190 Z"
            fill="url(#chartGradient)"
          />

          {/* Line Path */}
          <path
            d="M 20 140 Q 110 130 200 110 T 380 70 T 560 40"
            fill="none"
            className="stroke-primary-container"
            strokeWidth="3"
          />

          {/* Dots at key points */}
          <circle cx="20" cy="140" r="4" className="fill-primary-container" />
          <circle cx="110" cy="132" r="4" className="fill-primary-container" />
          <circle cx="200" cy="110" r="4" className="fill-primary-container" />
          <circle cx="380" cy="70" r="4" className="fill-primary-container" />
          <circle cx="560" cy="40" r="4" className="fill-primary-container" />
        </svg>

        {/* Chart Labels */}
        <div className="flex justify-between text-[9px] text-outline mt-2 font-bold px-2">
          <span>{t.month3}</span>
          <span>{t.month4}</span>
          <span>{t.month5}</span>
          <span>{t.month6}</span>
          <span>{t.month7}</span>
        </div>
      </div>
    </div>
  );
};
