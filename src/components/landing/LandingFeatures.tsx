"use client";

import { SparklesIcon, CheckCircleIcon } from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";
import { LandingBusinessSection } from "./LandingBusinessSection";
import { LandingConsumerSection } from "./LandingConsumerSection";
import { LandingCharitySection } from "./LandingCharitySection";

export function LandingFeatures() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <div className="py-12 space-y-24">
      {/* ========================================================================= */}
      {/* SECTION 1: How It Works Overview (#how-it-works) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#005129]/10 text-[#005129] text-xs sm:text-sm font-bold border border-[#005129]/20">
              <SparklesIcon className="w-4 h-4" />
              <span>{isAr ? "منظومة متكاملة" : "Integrated Ecosystem"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a1c19] tracking-tight">
              {isAr
                ? "كيف تحول FoodLoop الهدر إلى قيمة مستدامة؟"
                : "How FoodLoop Transforms Waste Into Sustainable Value"}
            </h2>
            <p className="text-[#404941] text-base sm:text-lg leading-relaxed">
              {isAr
                ? "منظومة متكاملة مدعومة بالذكاء الاصطناعي لإنقاذ الطعام الطازج، تمكين المتاجر، ودعم المجتمع بحلول آمنة واقتصادية."
                : "An integrated AI-powered ecosystem to rescue fresh food, empower merchants, and support the community with safe, economical solutions."}
            </p>
          </div>

          {/* 3 Steps Process Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 relative">
            {/* Step 1 */}
            <div className="bg-white border border-[#e0e6df] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#00381a] text-white flex items-center justify-center font-bold text-lg">
                    01
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-[#005129] rounded-full border border-emerald-200">
                    {isAr
                      ? "المتاجر والموردون (B2B)"
                      : "Merchants & Suppliers (B2B)"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  {isAr
                    ? "إدارة المخزون والتسعير الذكي"
                    : "Smart Inventory & Pricing"}
                </h3>
                <p className="text-[#404941] text-sm leading-relaxed">
                  {isAr
                    ? "رصد المنتجات القريبة من انتهاء الصلاحية تلقائياً، وإدراجها بعروض خصم ديناميكية تضمن بيعها السريع وتقليل الخسائر المالية."
                    : "Automatically detect near-expiry products and list them with dynamic discounts to ensure rapid turnover and reduce financial losses."}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "ربط مباشر بنظام المخزون"
                      : "Direct Inventory POS Integration"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr ? "تسعير ذكي متكيف" : "Adaptive AI Smart Pricing"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#e0e6df] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#005129] text-white flex items-center justify-center font-bold text-lg">
                    02
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-[#005129] rounded-full border border-emerald-200">
                    {isAr ? "المستهلك الذكي (B2C)" : "Smart Consumer (B2C)"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  {isAr
                    ? "تسوق بذكاء وأنقذ وجبات طازجة"
                    : "Shop Smart & Rescue Fresh Meals"}
                </h3>
                <p className="text-[#404941] text-sm leading-relaxed">
                  {isAr
                    ? "اكتشاف عروض يومية على الأطعمة والمخبوزات الطازجة بخصومات تصل إلى 70% من المتاجر والمطاعم المجاورة."
                    : "Discover daily deals on fresh food and bakery items with discounts up to 70% from nearby stores and restaurants."}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr ? "خصومات يومية متجددة" : "Daily Renewable Discounts"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "تنبيهات فورية للمفضلات"
                      : "Instant Favorite Alerts"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#e0e6df] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#5c4100] text-white flex items-center justify-center font-bold text-lg">
                    03
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-[#5c4100] rounded-full border border-amber-200">
                    {isAr
                      ? "الجمعيات الخيرية (Impact / NGO)"
                      : "Charities & Impact (NGO)"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1a1c19]">
                  {isAr
                    ? "توجيه آمن وفوري للتبرعات"
                    : "Safe & Instant Donation Routing"}
                </h3>
                <p className="text-[#404941] text-sm leading-relaxed">
                  {isAr
                    ? "تحويل الفائض غير المبيع تلقائياً إلى وجبات مجانية تُسلّم للجمعيات المعتمدة لضمان وصول الدعم لمستحقيه بأعلى معايير الجودة."
                    : "Automatically convert unsold surplus into free meals delivered to verified charities, ensuring support reaches those in need with top quality."}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "تتبع لوجستي منظم"
                      : "Organized Logistical Tracking"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "ضمان معايير السلامة"
                      : "Full Food Safety Standards"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Dedicated For Business Section (#business) */}
      <LandingBusinessSection />

      {/* SECTION 3: Dedicated For Consumers Section (#consumers) */}
      <LandingConsumerSection />

      {/* SECTION 4: Dedicated For Charities Section (#charities) */}
      <LandingCharitySection />
    </div>
  );
}
