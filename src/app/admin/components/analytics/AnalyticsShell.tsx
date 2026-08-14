"use client";

import React from "react";
import Link from "next/link";
import { useAppLang } from "@/store/use-app-lang";
import { getAnalyticsSummary } from "../../api/analytics-api";
import {
  AnalyticsSummary,
  AnalyticsSummaryCategory,
  AnalyticsSummaryTopStore,
  AnalyticsSummaryTopCharity,
} from "../../types/admin.types";
import { adminDictionary } from "../../constants/dictionary";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { AnalyticsSkeleton } from "./AnalyticsSkeleton";
import { AnalyticsExecutiveKpis } from "./AnalyticsExecutiveKpis";
import { AnalyticsBentoGrid } from "./AnalyticsBentoGrid";
import { AnalyticsCategoryGrid } from "./AnalyticsCategoryGrid";
import { AnalyticsPartnersHealthTab } from "./AnalyticsPartnersHealthTab";
import { AnalyticsShellProps } from "../../types/analytics.types";
import {
  BarChartIcon,
  LeafIcon,
  SparklesIcon,
  ShieldCheckIcon,
  FileIcon,
} from "@/components/icons";

type AnalyticsTabType = "overview" | "categories_entities" | "partners_health";

export function AnalyticsShell({ initialAnalytics }: AnalyticsShellProps = {}) {
  const { lang } = useAppLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] =
    React.useState<AnalyticsTabType>("overview");

  const [analytics, setAnalytics] = React.useState<AnalyticsSummary | null>(
    initialAnalytics ?? null,
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialAnalytics);

  React.useEffect(() => {
    if (initialAnalytics) return;

    let isSubscribed = true;
    getAnalyticsSummary()
      .then((res) => {
        if (isSubscribed && res.data) {
          setAnalytics(res.data);
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [initialAnalytics]);

  if (isLoading || !analytics) {
    return <AnalyticsSkeleton />;
  }

  const topStores: AnalyticsSummaryTopStore[] = analytics.topStores || [];
  const topCharities: AnalyticsSummaryTopCharity[] =
    analytics.topCharities || [];
  const categoryBreakdown: AnalyticsSummaryCategory[] =
    analytics.categoryBreakdown || [];
  const monthlyTrends = analytics.monthlyTrends || [];
  const aiOpp = analytics.aiOpportunity || {
    title: "فرصة لتفادي هدر المخبوزات",
    description:
      "تشير التحليلات إلى أن 12% من حقائب طعام المخابز المعروضة تنتهي صلاحيتها صباح كل ثلاثاء. يُنصح بتنبيه مديري المتاجر لتعديل أوقات تغليف وتدوير العروض.",
    categoryName: "Bakery",
    wastePercentage: 12,
    actionHint: "ضبط الإعدادات التشغيلية",
  };
  const systemAudit = analytics.systemAudit || {
    activeSessionsCount: 24,
    aiDecisions24hCount: 1420,
    reportedIncidentsCount: 23,
    systemHealth: "تشغيل مستقر PostgreSQL / .NET API",
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto pb-12">
      {/* Print-Only CSS Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:flex {
            display: flex !important;
          }
        }
      `}</style>

      {/* Screen Page Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className={isRtl ? "text-right" : "text-left"}>
          <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight font-sans">
            {t.analyticsTitle ||
              (isRtl
                ? "تحليلات الأثر البيئي والمالي"
                : "Platform Analytics & Intelligence")}
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-1">
            {t.analyticsSub ||
              (isRtl
                ? "تقرير شامل بالأثر البيئي المباشر، الأداء المالي، وإحصائيات الكيانات التشغيلية"
                : "Real-time metrics on saved food, carbon reduction, financial recovery, and entity health")}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white hover:bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FileIcon className="w-4 h-4 text-outline" />
            <span>
              {t.exportPdf ||
                (isRtl ? "تصدير التقرير (PDF)" : "Export Report (PDF)")}
            </span>
          </button>
        </div>
      </div>

      {/* Screen Executive Impact KPIs */}
      <div className="print:hidden">
        <AnalyticsExecutiveKpis analytics={analytics} isRtl={isRtl} />
      </div>

      {/* Screen Interactive Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-surface rounded-xl border border-card-border self-start w-full sm:w-auto mt-1 overflow-x-auto print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "overview"
              ? "bg-white text-primary shadow-xs border border-card-border"
              : "text-outline hover:text-on-surface hover:bg-white/50"
          }`}
        >
          <BarChartIcon className="w-4 h-4 text-primary" />
          <span>
            {isRtl ? "النظرة العامة وتطور النمو" : "Overview & Trends"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories_entities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "categories_entities"
              ? "bg-white text-primary shadow-xs border border-card-border"
              : "text-outline hover:text-on-surface hover:bg-white/50"
          }`}
        >
          <LeafIcon className="w-4 h-4 text-emerald-600" />
          <span>
            {isRtl ? "الكيانات وحالة المنتجات" : "Entities & Categories"}
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">
            {categoryBreakdown.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("partners_health")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "partners_health"
              ? "bg-white text-primary shadow-xs border border-card-border"
              : "text-outline hover:text-on-surface hover:bg-white/50"
          }`}
        >
          <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
          <span>
            {isRtl
              ? "أبرز الشركاء وصحة النظام"
              : "Top Partners & System Health"}
          </span>
        </button>
      </div>

      {/* Screen View: Active Tab Content */}
      <div className="print:hidden">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-2">
              <AnalyticsCharts
                t={t}
                lang={lang}
                monthlyTrends={monthlyTrends}
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-primary-container text-white p-6 rounded-2xl flex flex-col justify-between shadow-elevation-2 relative overflow-hidden min-h-[280px]">
                <div
                  className={`flex gap-4 items-start z-10 ${isRtl ? "flex-row text-right" : "flex-row-reverse text-left"}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <SparklesIcon className="w-5 h-5 text-on-primary-container" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded-full text-white">
                        {aiOpp.categoryName || "AI Insight"}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300">
                        {aiOpp.wastePercentage}%{" "}
                        {isRtl ? "معدل الهدر" : "waste"}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold leading-snug mt-1 font-sans text-white">
                      {aiOpp.title}
                    </h3>
                    <p className="text-xs text-outline-variant leading-relaxed mt-1">
                      {aiOpp.description}
                    </p>
                  </div>
                </div>

                <Link
                  href="/admin/settings"
                  className={`mt-6 bg-white hover:bg-surface text-primary-container font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 inline-block text-center shadow-xs ${
                    isRtl ? "self-start" : "self-end"
                  }`}
                >
                  {aiOpp.actionHint ||
                    (isRtl ? "تعديل إعدادات النظام" : "Adjust Settings")}
                </Link>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "categories_entities" && (
          <div className="flex flex-col gap-6">
            <AnalyticsBentoGrid analytics={analytics} isRtl={isRtl} />
            <AnalyticsCategoryGrid
              categoryBreakdown={categoryBreakdown}
              isRtl={isRtl}
            />
          </div>
        )}

        {activeTab === "partners_health" && (
          <AnalyticsPartnersHealthTab
            topStores={topStores}
            topCharities={topCharities}
            systemAudit={systemAudit}
            isRtl={isRtl}
          />
        )}
      </div>

      {/* PRINT-ONLY COMPLETE MULTI-PAGE ANALYTICS REPORT (Includes ALL 3 Tabs) */}
      <div
        className="hidden print:flex print:flex-col print:gap-8 w-full font-sans text-black"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {/* Printable Report Title & Metadata Header */}
        <div className="border-b-2 border-primary pb-4 mb-2 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-primary font-sans">
              {isRtl
                ? "تقرير تحليلات منصة FoodLoop الشامل"
                : "FoodLoop Platform Comprehensive Analytics Report"}
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              {isRtl
                ? "الأثر البيئي المباشر، المؤشرات المالية، وحالة الكيانات والأنظمة"
                : "Environmental impact, financial metrics, entity distributions & system status"}
            </p>
          </div>
          <div className="text-xs text-gray-500 font-mono text-left">
            <span>
              {isRtl ? "تاريخ التقرير:" : "Report Date:"}{" "}
              {new Date().toLocaleDateString(isRtl ? "ar-EG" : "en-US")}
            </span>
          </div>
        </div>

        {/* Section 1: Executive Impact KPIs */}
        <div>
          <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
            {isRtl
              ? "أولاً: مؤشرات الأثر البيئي والمالي"
              : "1. Executive Environmental & Financial KPIs"}
          </h2>
          <AnalyticsExecutiveKpis analytics={analytics} isRtl={isRtl} />
        </div>

        {/* Section 2: Overview & Growth Charts */}
        <div className="pt-4">
          <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
            {isRtl
              ? "ثانياً: النظرة العامة وتطور النمو عبر الوقت"
              : "2. Overview & Historical Growth Trends"}
          </h2>
          <AnalyticsCharts t={t} lang={lang} monthlyTrends={monthlyTrends} />
        </div>

        {/* Section 3: Entities & Category Distribution */}
        <div className="pt-4 page-break-before">
          <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
            {isRtl
              ? "ثالثاً: الكيانات وتوزيع المنتجات بالفئات"
              : "3. Entities Infrastructure & Category Distribution"}
          </h2>
          <div className="flex flex-col gap-6">
            <AnalyticsBentoGrid analytics={analytics} isRtl={isRtl} />
            <AnalyticsCategoryGrid
              categoryBreakdown={categoryBreakdown}
              isRtl={isRtl}
            />
          </div>
        </div>

        {/* Section 4: Top Partners & System Operational Health */}
        <div className="pt-4">
          <h2 className="text-sm font-extrabold text-primary uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
            {isRtl
              ? "رابعاً: أبرز الشركاء وصحة التشغيل"
              : "4. Top Partners & System Operational Health"}
          </h2>
          <AnalyticsPartnersHealthTab
            topStores={topStores}
            topCharities={topCharities}
            systemAudit={systemAudit}
            isRtl={isRtl}
          />
        </div>
      </div>
    </div>
  );
}
