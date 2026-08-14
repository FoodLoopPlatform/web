import React from "react";
import { AnalyticsSummary } from "../../types/admin.types";

interface AnalyticsExecutiveKpisProps {
  analytics: AnalyticsSummary;
  isRtl?: boolean;
}

export const AnalyticsExecutiveKpis: React.FC<AnalyticsExecutiveKpisProps> = ({
  analytics,
  isRtl = false,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1: Food Waste Saved */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {isRtl ? "هدر طعام تم منعه" : "Food Waste Saved"}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-sans whitespace-nowrap">
            {(analytics.foodWastePreventedKg ?? 103.2).toLocaleString()}{" "}
            <span className="text-xs text-outline">{isRtl ? "كجم" : "kg"}</span>
          </span>
        </div>
        <span className="text-[10px] mt-3 block text-emerald-600 font-bold whitespace-nowrap">
          +18.4% {isRtl ? "أثر بيئي مباشر" : "Direct Impact"}
        </span>
        <div
          className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-1.5 h-full bg-emerald-500`}
        />
      </div>

      {/* KPI 2: CO2 Saved */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {isRtl ? "انبعاثات CO2 المحفوظة" : "CO2 Saved"}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-sans whitespace-nowrap">
            {(analytics.co2EmissionsSavedKg ?? 258).toLocaleString()}{" "}
            <span className="text-xs text-outline">
              {isRtl ? "كجم CO₂" : "kg CO₂"}
            </span>
          </span>
        </div>
        <span className="text-[10px] mt-3 block text-teal-600 font-bold whitespace-nowrap">
          {isRtl ? "يعادل زراعة 320 شجرة" : "320 trees offset"}
        </span>
        <div
          className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-1.5 h-full bg-teal-500`}
        />
      </div>

      {/* KPI 3: Financial Value Recovered */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {isRtl ? "القيمة المالية المستردة" : "Value Recovered"}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-sans whitespace-nowrap">
            {(analytics.financialValueRecovered ?? 2021).toLocaleString()}{" "}
            <span className="text-xs text-outline">
              {isRtl ? "ج.م" : "EGP"}
            </span>
          </span>
        </div>
        <span className="text-[10px] mt-3 block text-blue-600 font-bold whitespace-nowrap">
          {isRtl ? "توفير مباشر للمستفيدين" : "Direct Value Saved"}
        </span>
        <div
          className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-1.5 h-full bg-blue-500`}
        />
      </div>

      {/* KPI 4: Total Revenue */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {isRtl ? "إجمالي مبيعات المنصة" : "Platform Revenue"}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-sans whitespace-nowrap">
            {(analytics.totalRevenue ?? 4397.5).toLocaleString()}{" "}
            <span className="text-xs text-outline">
              {isRtl ? "ج.م" : "EGP"}
            </span>
          </span>
        </div>
        <span className="text-[10px] mt-3 block text-purple-600 font-bold whitespace-nowrap">
          55 {isRtl ? "معاملة مكتملة" : "completed orders"}
        </span>
        <div
          className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} w-1.5 h-full bg-purple-500`}
        />
      </div>
    </div>
  );
};
