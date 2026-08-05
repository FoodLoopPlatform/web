"use client";

import React, { useState, useEffect } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import {
  getAnalyticsSummary,
  AnalyticsSummary
} from "../api/admin-api";
import { adminDictionary } from "../constants/dictionary";

export default function AnalyticsPage() {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  const loadData = async () => {
    const res = await getAnalyticsSummary();
    if (res.data) setAnalytics(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[1200px] mx-auto pb-12">
      {/* Header */}
      <div className={lang === "ar" ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-bold font-brand tracking-tight text-[#00381a] serif-ish">
          {t.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#707a70] mt-1 sm:mt-1.5 font-medium">
          {t.subtitle}
        </p>
      </div>

      {/* Top Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className={`bg-white rounded-2xl border border-[#e0e6df] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
          lang === "ar" ? "text-right" : "text-left"
        }`}>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#707a70] uppercase tracking-wider block">{t.wasteReduced}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00381a] block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.wasteReducedKg != null ? `${analytics.wasteReducedKg.toLocaleString()} ${t.tons}` : `8,520 ${t.tons}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">{t.vsLastMonth}</span>
          <div className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-[#005129]/10`} />
        </div>

        <div className={`bg-white rounded-2xl border border-[#e0e6df] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
          lang === "ar" ? "text-right" : "text-left"
        }`}>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#707a70] uppercase tracking-wider block">{t.co2Saved}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00381a] block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.co2SavedKg != null ? `${analytics.co2SavedKg.toLocaleString()} ${t.tons}` : `19,600 ${t.tons}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">{t.treeEquivalent.replace("{count}", "320")}</span>
          <div className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-[#266b40]/10`} />
        </div>

        <div className={`bg-white rounded-2xl border border-[#e0e6df] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
          lang === "ar" ? "text-right" : "text-left"
        }`}>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#707a70] uppercase tracking-wider block">{t.valueSaved}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00381a] block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              {analytics?.revenueSavedEGP != null ? `${analytics.revenueSavedEGP.toLocaleString()} ${t.egp}` : `624,000 ${t.egp}`}
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-[#e3aa2b] font-bold whitespace-nowrap">{t.savingsSub}</span>
          <div className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-[#ffdea4]/40`} />
        </div>

        <div className={`bg-white rounded-2xl border border-[#e0e6df] p-5 sm:p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
          lang === "ar" ? "text-right" : "text-left"
        }`}>
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#707a70] uppercase tracking-wider block">{t.disputesRate}</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#00381a] block mt-2 sm:mt-3 tracking-tight font-brand whitespace-nowrap">
              0.8%
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] mt-3 sm:mt-4 block text-green-600 font-medium whitespace-nowrap">{t.safetyLimit}</span>
          <div className={`absolute top-0 ${lang === "ar" ? "left-0" : "right-0"} w-1.5 h-full bg-green-500/10`} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: Charts (Spans 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
          
          {/* Chart 1: Waste Reduction Trend (Line Chart) */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-4">
            <div className={lang === "ar" ? "text-right" : "text-left"}>
              <h3 className="text-base font-extrabold text-[#00381a] font-brand">{t.wasteTrendTitle}</h3>
              <span className="text-[10px] text-[#707a70] font-medium block mt-0.5">{t.wasteTrendSub}</span>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="w-full h-[220px] relative mt-4" dir="ltr">
              <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#abf3bc" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#abf3bc" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#eeeee9" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#eeeee9" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#eeeee9" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#eeeee9" strokeWidth="1" />

                {/* Filled Area */}
                <path
                  d="M 20 190 L 20 140 Q 110 130 200 110 T 380 70 T 560 40 L 560 190 Z"
                  fill="url(#chartGradient)"
                />

                {/* Line Path */}
                <path
                  d="M 20 140 Q 110 130 200 110 T 380 70 T 560 40"
                  fill="none"
                  stroke="#005129"
                  strokeWidth="3"
                />

                {/* Dots at key points */}
                <circle cx="20" cy="140" r="4" fill="#005129" />
                <circle cx="110" cy="132" r="4" fill="#005129" />
                <circle cx="200" cy="110" r="4" fill="#005129" />
                <circle cx="380" cy="70" r="4" fill="#005129" />
                <circle cx="560" cy="40" r="4" fill="#005129" />
              </svg>

              {/* Chart Labels */}
              <div className="flex justify-between text-[9px] text-[#707a70] mt-2 font-bold px-2">
                <span>{t.month3}</span>
                <span>{t.month4}</span>
                <span>{t.month5}</span>
                <span>{t.month6}</span>
                <span>{t.month7}</span>
              </div>
            </div>
          </div>

          {/* Partner & Charity performance grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Top Partner Stores */}
            <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-3">
              <h4 className={`text-sm font-extrabold text-[#00381a] font-brand ${lang === "ar" ? "text-right" : "text-left"}`}>{t.topStores}</h4>
              <div className="divide-y divide-[#eeeee9] mt-2">
                {[
                  { nameAr: "حلواني العبد", nameEn: "El Abd Pastry", salesAr: "340 حقيبة طعام", salesEn: "340 bags", rateAr: "98% نسبة الاسترداد", rateEn: "98% recovery" },
                  { nameAr: "مترو ماركت", nameEn: "Metro Market", salesAr: "290 حقيبة طعام", salesEn: "290 bags", rateAr: "91% نسبة الاسترداد", rateEn: "91% recovery" },
                  { nameAr: "جورميه إيجيبت", nameEn: "Gourmet Egypt", salesAr: "182 حقيبة طعام", salesEn: "182 bags", rateAr: "94% نسبة الاسترداد", rateEn: "94% recovery" },
                  { nameAr: "سوبرماركت سعودي", nameEn: "Seoudi Supermarket", salesAr: "145 حقيبة طعام", salesEn: "145 bags", rateAr: "88% نسبة الاسترداد", rateEn: "88% recovery" }
                ].map((store, idx) => (
                  <div key={idx} className={`py-2.5 flex justify-between items-center text-xs ${
                    lang === "ar" ? "flex-row" : "flex-row-reverse"
                  }`}>
                    <span className="font-bold text-[#1a1c19]">{lang === "ar" ? store.nameAr : store.nameEn}</span>
                    <div className={`flex flex-col ${lang === "ar" ? "items-end" : "items-start"}`}>
                      <span className="font-semibold text-[#005129]">{lang === "ar" ? store.salesAr : store.salesEn}</span>
                      <span className="text-[9px] text-[#707a70] mt-0.5">{lang === "ar" ? store.rateAr : store.rateEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Recipient Charities */}
            <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-3">
              <h4 className={`text-sm font-extrabold text-[#00381a] font-brand ${lang === "ar" ? "text-right" : "text-left"}`}>{t.topCharities}</h4>
              <div className="divide-y divide-[#eeeee9] mt-2">
                {[
                  { nameAr: "بنك الطعام المصري", nameEn: "Egyptian Food Bank", receivedAr: "1,200 كجم", receivedEn: "1,200 kg", bagsAr: "450 صندوق طعام", bagsEn: "450 boxes" },
                  { nameAr: "جمعية رسالة", nameEn: "Resala Association", receivedAr: "950 كجم", receivedEn: "950 kg", bagsAr: "310 صندوق طعام", bagsEn: "310 boxes" },
                  { nameAr: "جمعية الأورمان", nameEn: "Al Orman Association", receivedAr: "410 كجم", receivedEn: "410 kg", bagsAr: "180 صندوق طعام", bagsEn: "180 boxes" },
                  { nameAr: "مؤسسة مرسال", nameEn: "Mersal Foundation", receivedAr: "220 كجم", receivedEn: "220 kg", bagsAr: "95 صندوق طعام", bagsEn: "95 boxes" }
                ].map((charity, idx) => (
                  <div key={idx} className={`py-2.5 flex justify-between items-center text-xs ${
                    lang === "ar" ? "flex-row" : "flex-row-reverse"
                  }`}>
                    <span className="font-bold text-[#1a1c19]">{lang === "ar" ? charity.nameAr : charity.nameEn}</span>
                    <div className={`flex flex-col ${lang === "ar" ? "items-end" : "items-start"}`}>
                      <span className="font-semibold text-[#005129]">{lang === "ar" ? charity.receivedAr : charity.receivedEn}</span>
                      <span className="text-[9px] text-[#707a70] mt-0.5">{lang === "ar" ? charity.bagsAr : charity.bagsEn}</span>
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
          <div className="bg-[#005129] text-white p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-elevation-2 relative overflow-hidden">
            <div className={`flex gap-4 items-start z-10 ${lang === "ar" ? "flex-row text-right" : "flex-row-reverse text-left"}`}>
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#7dc390]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-extrabold tracking-tight font-brand text-[#7dc390]">{t.demandSupply}</h4>
                <h3 className="text-base font-bold leading-snug mt-1">{t.bakeryOpportunity}</h3>
                <p className="text-xs text-[#bfc9be] leading-relaxed mt-2">
                  {t.bakeryDesc}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                window.location.href = "/admin/settings";
              }}
              className={`mt-6 bg-white hover:bg-[#fafaf4] text-[#005129] font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 ${
                lang === "ar" ? "self-start" : "self-end"
              }`}
            >
              {t.adjustSettings}
            </button>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
          </div>

          {/* Analytics Logs */}
          <div className="bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm">
            <h3 className={`text-sm font-extrabold text-[#00381a] pb-4 border-b border-[#eeeee9] ${
              lang === "ar" ? "text-right" : "text-left"
            }`}>{t.systemReports}</h3>
            <p className="mt-4 text-center text-xs text-[#707a70] py-6">
              {lang === "ar" ? "لا يتوفر سجل حوادث حالياً." : "No audit logs available yet."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
