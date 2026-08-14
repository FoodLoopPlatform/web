import React from "react";
import { AnalyticsSummary } from "../../types/admin.types";
import { StatsCard } from "../common/StatsCard";
import {
  LeafIcon,
  SparklesIcon,
  BarChartIcon,
  ShieldCheckIcon,
} from "@/components/icons";

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
      <StatsCard
        label={isRtl ? "هدر طعام تم منعه" : "Food Waste Saved"}
        value={(analytics.foodWastePreventedKg ?? 103.2).toLocaleString()}
        unit={isRtl ? "كجم" : "kg"}
        subtitle={
          <span className="text-emerald-600 font-bold">
            +18.4% {isRtl ? "أثر بيئي مباشر" : "Direct Impact"}
          </span>
        }
        accentClass="bg-emerald-500"
        iconBgClass="bg-emerald-50 text-emerald-700"
        icon={<LeafIcon className="w-4 h-4" />}
        isRtl={isRtl}
      />

      {/* KPI 2: CO2 Saved */}
      <StatsCard
        label={isRtl ? "انبعاثات CO2 المحفوظة" : "CO2 Saved"}
        value={(analytics.co2EmissionsSavedKg ?? 258).toLocaleString()}
        unit={isRtl ? "كجم CO₂" : "kg CO₂"}
        subtitle={
          <span className="text-teal-600 font-bold">
            {isRtl ? "يعادل زراعة 320 شجرة" : "320 trees offset"}
          </span>
        }
        accentClass="bg-teal-500"
        iconBgClass="bg-teal-50 text-teal-700"
        icon={<SparklesIcon className="w-4 h-4" />}
        isRtl={isRtl}
      />

      {/* KPI 3: Financial Value Recovered */}
      <StatsCard
        label={isRtl ? "القيمة المالية المستردة" : "Value Recovered"}
        value={(analytics.financialValueRecovered ?? 2021).toLocaleString()}
        unit={isRtl ? "ج.م" : "EGP"}
        subtitle={
          <span className="text-blue-600 font-bold">
            {isRtl ? "توفير مباشر للمستفيدين" : "Direct Value Saved"}
          </span>
        }
        accentClass="bg-blue-500"
        iconBgClass="bg-blue-50 text-blue-700"
        icon={<ShieldCheckIcon className="w-4 h-4" />}
        isRtl={isRtl}
      />

      {/* KPI 4: Total Revenue */}
      <StatsCard
        label={isRtl ? "إجمالي مبيعات المنصة" : "Platform Revenue"}
        value={(analytics.totalRevenue ?? 4397.5).toLocaleString()}
        unit={isRtl ? "ج.م" : "EGP"}
        subtitle={
          <span className="text-purple-600 font-bold">
            55 {isRtl ? "معاملة مكتملة" : "completed orders"}
          </span>
        }
        accentClass="bg-purple-500"
        iconBgClass="bg-purple-50 text-purple-700"
        icon={<BarChartIcon className="w-4 h-4" />}
        isRtl={isRtl}
      />
    </div>
  );
};
