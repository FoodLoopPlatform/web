"use client";

import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { AnalyticsSummaryMonthlyTrend } from "../../types/admin.types";

interface AnalyticsChartsProps {
  t: AdminDictionary;
  lang: "ar" | "en";
  monthlyTrends?: AnalyticsSummaryMonthlyTrend[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  t,
  lang,
  monthlyTrends = [],
}) => {
  const isRtl = lang === "ar";

  const data =
    monthlyTrends.length > 0
      ? monthlyTrends
      : [
          {
            month: "مارس",
            year: 2026,
            wastePreventedKg: 420,
            financialSavings: 950,
            ordersCount: 78,
          },
          {
            month: "أبريل",
            year: 2026,
            wastePreventedKg: 680,
            financialSavings: 1420,
            ordersCount: 120,
          },
          {
            month: "مايو",
            year: 2026,
            wastePreventedKg: 1100,
            financialSavings: 2300,
            ordersCount: 195,
          },
          {
            month: "يونيو",
            year: 2026,
            wastePreventedKg: 1580,
            financialSavings: 3100,
            ordersCount: 280,
          },
          {
            month: "يوليو",
            year: 2026,
            wastePreventedKg: 2021,
            financialSavings: 4081,
            ordersCount: 360,
          },
        ];

  const maxWaste = Math.max(...data.map((d) => d.wastePreventedKg), 100);

  const svgWidth = 600;
  const svgHeight = 190;
  const paddingX = 45;
  const paddingY = 25;

  const points = data.map((item, index) => {
    const stepX = (svgWidth - paddingX * 2) / Math.max(data.length - 1, 1);
    const x = paddingX + index * stepX;
    const y =
      svgHeight -
      paddingY -
      (item.wastePreventedKg / maxWaste) * (svgHeight - paddingY * 2);
    return { x, y, item };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  return (
    <div className="bg-white rounded-2xl border border-card-border p-5 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container">
        <div className={isRtl ? "text-right" : "text-left"}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-sm sm:text-base font-extrabold text-primary font-sans">
              {t.wasteTrendTitle ||
                (isRtl
                  ? "تطور نمو استرداد الطعام والتوفير"
                  : "Food Recovery & Savings Growth")}
            </h3>
          </div>
          <p className="text-xs text-outline mt-0.5 font-medium">
            {t.wasteTrendSub ||
              (isRtl
                ? "تتبع الكمية المستردة (كجم) والقيمة الإجمالية شهرياً"
                : "Monthly breakdown of saved food weight and financial impact")}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {isRtl ? "منع الهدر (كجم)" : "Waste Saved (kg)"}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            {isRtl ? "التوفير (ج.م)" : "Savings (EGP)"}
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full h-[200px] relative" dir="ltr">
        <svg
          className="w-full h-full overflow-visible"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="modernChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.45, 0.7, 0.95].map((ratio, idx) => (
            <line
              key={idx}
              x1="0"
              y1={svgHeight * ratio}
              x2={svgWidth}
              y2={svgHeight * ratio}
              className="stroke-surface-container"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          ))}

          {/* Area */}
          <path d={areaD} fill="url(#modernChartGrad)" />

          {/* Smooth Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#059669"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                className="fill-white stroke-emerald-600 stroke-[2.5]"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fontSize="10"
                fontWeight="800"
                fill="#065f46"
                className="font-sans select-none"
              >
                {p.item.wastePreventedKg.toLocaleString()}{" "}
                {isRtl ? "كجم" : "kg"}
              </text>
            </g>
          ))}
        </svg>

        {/* Month labels below chart */}
        <div className="flex justify-between text-xs text-outline font-bold mt-2 px-4">
          {data.map((d, i) => (
            <span key={i} className="text-on-surface font-sans">
              {d.month} {d.year}
            </span>
          ))}
        </div>
      </div>

      {/* Monthly summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
        {data.map((trend, idx) => (
          <div
            key={idx}
            className="bg-surface hover:bg-white p-2.5 rounded-xl border border-card-border transition-all flex flex-col gap-0.5 text-center"
          >
            <span className="text-[10px] font-bold text-outline uppercase">
              {trend.month} {trend.year}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-800 font-sans mt-0.5">
              {trend.wastePreventedKg.toLocaleString()}{" "}
              <span className="text-[10px] text-emerald-600">
                {isRtl ? "كجم" : "kg"}
              </span>
            </span>
            <span className="text-xs font-bold text-blue-700 font-sans">
              {trend.financialSavings.toLocaleString()}{" "}
              <span className="text-[9px] text-blue-600">
                {isRtl ? "ج.م" : "EGP"}
              </span>
            </span>
            <span className="text-[10px] text-outline border-t border-surface-container pt-1 mt-0.5">
              {trend.ordersCount} {isRtl ? "طلب" : "orders"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
