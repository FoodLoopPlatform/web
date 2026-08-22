"use client";

import Link from "next/link";
import {
  ArrowForwardIcon,
  HeartHandshakeIcon,
  TruckIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  SparklesIcon,
  ZapIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function LandingCharitySection() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <section
      id="charities"
      className="scroll-mt-24 bg-gradient-to-b from-[#fafaf4] via-[#f7f5eb] to-[#f0efe2] py-16 border-t border-gray-200/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Charities Content Details */}
          <div
            className={`space-y-6 min-w-0 ${isAr ? "text-right" : "text-left"}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#5c4100] text-white text-xs font-bold shadow-2xs">
              <HeartHandshakeIcon className="w-4 h-4 shrink-0" />
              <span>
                {isAr
                  ? "للجمعيات والمؤسسات الخيرية"
                  : "For NGOs & Charitable Foundations"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] leading-tight">
              {isAr
                ? "مسار آمن وشفاف لتوجيه التبرعات الغذائية للأسر المستحقة"
                : "A Smart & Transparent Pipeline for Direct Food Relief"}
            </h2>

            <p className="text-[#404941] text-base sm:text-lg leading-relaxed">
              {isAr
                ? "ربط لوجستي آلي مع المتاجر يضمن وصول الوجبات الطازجة بأعلى معايير الجودة وفي الوقت المناسب، لدعم أنشطتكم المجتمعية بسلاسة ودون أي أعباء مالية."
                : "Automated logistical connection with merchants ensuring timely delivery of fresh meals to families with top quality standards and zero financial burdens."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1.5">
                <div className="text-[#5c4100] font-bold text-sm flex items-center gap-1.5">
                  <TruckIcon className="w-4 h-4 shrink-0 text-[#5c4100]" />
                  <span>
                    {isAr ? "استلام لوجستي آلي" : "Automated Pickup Routing"}
                  </span>
                </div>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "إشعارات فورية ومسارات استلام مبرمجة مسبقاً من المتاجر الأقرب جغرافياً لجمعيتكم."
                    : "Instant match alerts and pre-programmed pickup routes from nearest stores."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1.5">
                <div className="text-[#5c4100] font-bold text-sm flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 shrink-0 text-[#5c4100]" />
                  <span>
                    {isAr ? "سلامة غذائية مضمونة" : "Food Safety Compliance"}
                  </span>
                </div>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "تتبع دقيق لتواريخ الصلاحية لضمان تقديم طعام آمن وصحي 100%."
                    : "Strict expiration tracking to ensure 100% safe and healthy food."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1.5">
                <div className="text-[#5c4100] font-bold text-sm flex items-center gap-1.5">
                  <TrendingUpIcon className="w-4 h-4 shrink-0 text-[#5c4100]" />
                  <span>
                    {isAr
                      ? "تقارير شفافة للمانحين"
                      : "Transparent Donor Reporting"}
                  </span>
                </div>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "توثيق رقمي شامل للوجبات الموزعة وحالات الاستلام لتعزيز موثوقية مؤسستكم أمام المتبرعين."
                    : "Comprehensive digital logging of distributed meals to boost donor credibility."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1.5">
                <div className="text-[#5c4100] font-bold text-sm flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 shrink-0 text-[#5c4100]" />
                  <span>{isAr ? "مجاني بالكامل" : "100% Free Platform"}</span>
                </div>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "منصة FoodLoop تقدم خدماتها الرقمية مجاناً لجميع الجمعيات والمؤسسات الخيرية المعتمدة."
                    : "FoodLoop platform provides its digital services free of charge for accredited NGOs."}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#5c4100] hover:bg-[#422e00] text-white font-semibold text-sm rounded-full shadow-md transition-all"
              >
                <span>
                  {isAr ? "انضم كجمعية خيرية شريكة" : "Join as Partner Charity"}
                </span>
                <ArrowForwardIcon
                  className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>

          {/* NGO Impact Stats Graphic */}
          <div className="w-full min-w-0 flex justify-center">
            <div className="w-full min-w-[290px] sm:min-w-[380px] max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 shrink-0">
              <div className="text-center space-y-2 border-b pb-4 border-gray-100">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#5c4100]">
                  +15,000
                </div>
                <div className="text-sm font-bold text-[#1a1c19]">
                  {isAr
                    ? "وجبة وُجهت للأسر الكريمة"
                    : "Meals Delivered to Families"}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {isAr
                    ? "+40 جمعية ومؤسسة خيرية شريكة"
                    : "Across 40+ partner NGO networks"}
                </div>
              </div>

              <div className="space-y-3 text-xs font-medium text-gray-700">
                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="flex items-center gap-1.5">
                    <ZapIcon className="w-3.5 h-3.5 text-[#5c4100] shrink-0" />
                    <span>
                      {isAr
                        ? "نسبة استجابة الجمعيات السريعة"
                        : "NGO Fast Response Rate"}
                    </span>
                  </span>
                  <span className="font-bold text-[#5c4100]">98.5%</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5 text-[#5c4100] shrink-0" />
                    <span>
                      {isAr
                        ? "متوسط وقت وصول التبرعات"
                        : "Avg Donation Delivery Time"}
                    </span>
                  </span>
                  <span className="font-bold text-[#5c4100]">
                    {isAr ? "35 دقيقة" : "35 mins"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="flex items-center gap-1.5">
                    <CheckCircleIcon className="w-3.5 h-3.5 text-[#5c4100] shrink-0" />
                    <span>
                      {isAr
                        ? "نسبة سلامة الوجبات الموجهة للتبرع"
                        : "Donation Food Safety Compliance"}
                    </span>
                  </span>
                  <span className="font-bold text-[#5c4100]">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
