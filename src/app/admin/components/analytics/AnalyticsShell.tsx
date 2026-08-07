"use client";

import React from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import {
  getAnalyticsSummary,
  type AnalyticsSummary,
} from "../../api/admin-api";
import { adminDictionary } from "../../constants/dictionary";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { AnalyticsSkeleton } from "./AnalyticsSkeleton";

interface AnalyticsShellProps {
  initialAnalytics?: AnalyticsSummary | null;
}

export function AnalyticsShell({ initialAnalytics }: AnalyticsShellProps = {}) {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];

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

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className={lang === "ar" ? "text-right" : "text-left"}>
          <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight font-brand">
            {t.analyticsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-outline mt-1">
            {t.analyticsSub}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white hover:bg-surface-container text-on-surface-variant px-4 py-2 rounded-xl text-xs font-bold border border-outline-variant transition-all shadow-xs cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-outline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
              {t.wasteReduced}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.wasteReducedKg != null
                ? `${analytics.wasteReducedKg.toLocaleString()} ${t.tons}`
                : `8,520 ${t.tons}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">
            {t.vsLastMonth}
          </span>
          <div
            className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-primary-container/10`}
          />
        </div>

        <div
          className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
              {t.co2Saved}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.co2SavedKg != null
                ? `${analytics.co2SavedKg.toLocaleString()} ${t.tons}`
                : `19,600 ${t.tons}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">
            {t.treeEquivalent.replace("{count}", "320")}
          </span>
          <div
            className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-surface-tint/10`}
          />
        </div>

        <div
          className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
              {t.valueSaved}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.revenueSavedEGP != null
                ? `${analytics.revenueSavedEGP.toLocaleString()} ${t.egp}`
                : `624,000 ${t.egp}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-on-tertiary-container font-bold whitespace-nowrap">
            {t.savingsSub}
          </span>
          <div
            className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-tertiary-fixed/40`}
          />
        </div>

        <div
          className={`bg-white rounded-2xl border border-card-border p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
            lang === "ar" ? "text-right" : "text-left"
          }`}
        >
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
              {t.disputesRate}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              0.8%
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">
            {t.safetyLimit}
          </span>
          <div
            className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-green-500/10`}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left Column: Charts (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          {/* Chart 1: Waste Reduction Trend (Line Chart) */}
          <AnalyticsCharts t={t} lang={lang} />

          {/* Partner & Charity performance grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Top Partner Stores */}
            <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-3">
              <h4
                className={`text-sm font-extrabold text-primary font-brand ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                {t.topStores}
              </h4>
              <div className="divide-y divide-surface-container mt-2">
                {[
                  {
                    nameAr: "حلواني العبد",
                    nameEn: "El Abd Pastry",
                    salesAr: "340 حقيبة طعام",
                    salesEn: "340 bags",
                    rateAr: "98% نسبة الاسترداد",
                    rateEn: "98% recovery",
                  },
                  {
                    nameAr: "مترو ماركت",
                    nameEn: "Metro Market",
                    salesAr: "290 حقيبة طعام",
                    salesEn: "290 bags",
                    rateAr: "91% نسبة الاسترداد",
                    rateEn: "91% recovery",
                  },
                  {
                    nameAr: "جورميه إيجيبت",
                    nameEn: "Gourmet Egypt",
                    salesAr: "182 حقيبة طعام",
                    salesEn: "182 bags",
                    rateAr: "94% نسبة الاسترداد",
                    rateEn: "94% recovery",
                  },
                  {
                    nameAr: "سوبرماركت سعودي",
                    nameEn: "Seoudi Supermarket",
                    salesAr: "145 حقيبة طعام",
                    salesEn: "145 bags",
                    rateAr: "88% نسبة الاسترداد",
                    rateEn: "88% recovery",
                  },
                ].map((store, idx) => (
                  <div
                    key={idx}
                    className={`py-2.5 flex justify-between items-center text-xs ${
                      lang === "ar" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <span className="font-bold text-on-surface">
                      {lang === "ar" ? store.nameAr : store.nameEn}
                    </span>
                    <div
                      className={`flex flex-col ${lang === "ar" ? "items-end" : "items-start"}`}
                    >
                      <span className="font-semibold text-primary-container">
                        {lang === "ar" ? store.salesAr : store.salesEn}
                      </span>
                      <span className="text-[9px] text-outline mt-0.5">
                        {lang === "ar" ? store.rateAr : store.rateEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recipient Charities */}
            <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-3">
              <h4
                className={`text-sm font-extrabold text-primary font-brand ${lang === "ar" ? "text-right" : "text-left"}`}
              >
                {t.topCharities}
              </h4>
              <div className="divide-y divide-surface-container mt-2">
                {[
                  {
                    nameAr: "بنك الطعام المصري",
                    nameEn: "Egyptian Food Bank",
                    receivedAr: "1,200 كجم",
                    receivedEn: "1,200 kg",
                    bagsAr: "450 صندوق طعام",
                    bagsEn: "450 boxes",
                  },
                  {
                    nameAr: "جمعية رسالة",
                    nameEn: "Resala Association",
                    receivedAr: "950 كجم",
                    receivedEn: "950 kg",
                    bagsAr: "310 صندوق طعام",
                    bagsEn: "310 boxes",
                  },
                  {
                    nameAr: "جمعية الأورمان",
                    nameEn: "Al Orman Association",
                    receivedAr: "410 كجم",
                    receivedEn: "410 kg",
                    bagsAr: "180 صندوق طعام",
                    bagsEn: "180 boxes",
                  },
                  {
                    nameAr: "مؤسسة مرسال",
                    nameEn: "Mersal Foundation",
                    receivedAr: "220 كجم",
                    receivedEn: "220 kg",
                    bagsAr: "95 صندوق طعام",
                    bagsEn: "95 boxes",
                  },
                ].map((charity, idx) => (
                  <div
                    key={idx}
                    className={`py-2.5 flex justify-between items-center text-xs ${
                      lang === "ar" ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <span className="font-bold text-on-surface">
                      {lang === "ar" ? charity.nameAr : charity.nameEn}
                    </span>
                    <div
                      className={`flex flex-col ${lang === "ar" ? "items-end" : "items-start"}`}
                    >
                      <span className="font-semibold text-primary-container">
                        {lang === "ar"
                          ? charity.receivedAr
                          : charity.receivedEn}
                      </span>
                      <span className="text-[9px] text-outline mt-0.5">
                        {lang === "ar" ? charity.bagsAr : charity.bagsEn}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Spans 1) */}
        <div className="flex flex-col gap-6">
          {/* Smart Recommendation */}
          <div className="bg-primary-container text-white p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-elevation-2 relative overflow-hidden">
            <div
              className={`flex gap-4 items-start z-10 ${lang === "ar" ? "flex-row text-right" : "flex-row-reverse text-left"}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-on-primary-container"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-extrabold tracking-tight font-brand text-on-primary-container">
                  {t.demandSupply}
                </h4>
                <h3 className="text-base font-bold leading-snug mt-1">
                  {t.bakeryOpportunity}
                </h3>
                <p className="text-xs text-outline-variant leading-relaxed mt-2">
                  {t.bakeryDesc}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = "/admin/settings";
              }}
              className={`mt-6 bg-white hover:bg-surface text-primary-container font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 ${
                lang === "ar" ? "self-start" : "self-end"
              }`}
            >
              {t.adjustSettings}
            </button>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
          </div>

          {/* Analytics Logs */}
          <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm">
            <h3
              className={`text-sm font-extrabold text-primary pb-4 border-b border-surface-container ${
                lang === "ar" ? "text-right" : "text-left"
              }`}
            >
              {t.systemReports}
            </h3>
            <p className="mt-4 text-center text-xs text-outline py-6">
              {lang === "ar"
                ? "لا يتوفر سجل حوادث حالياً."
                : "No audit logs available yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
