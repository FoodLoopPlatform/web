"use client";

import {
  SparklesIcon,
  StoreIcon,
  UserIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BarChartIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function LandingFeatures() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <div className="py-16 space-y-24">
      {/* SECTION 1: How It Works Summary */}
      <section id="how-it-works" className="scroll-mt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#005129]/10 text-[#005129] text-xs font-bold">
              <SparklesIcon className="w-4 h-4" />
              <span>{isAr ? "منظومة متكاملة" : "Integrated Ecosystem"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19]">
              {isAr
                ? "كيف تحول FoodLoop الهدر إلى قيمة مستدامة؟"
                : "How FoodLoop Transforms Waste Into Sustainable Value"}
            </h2>
            <p className="text-[#404941] text-base sm:text-lg">
              {isAr
                ? "ثلاثة أطراف رئيسية تلتقي في منصة واحدة مدعومة بالذكاء الاصطناعي لحماية الموارد وضمان الاستدامة."
                : "Three key stakeholders unite on a single AI-powered platform to protect resources and ensure sustainability."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Card 1: Business Owners */}
            <div
              id="business"
              className={`scroll-mt-28 bg-white border border-[#e0e6df] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden ${isAr ? "text-right" : "text-left"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#00381a] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <StoreIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1c19] mb-3">
                {isAr
                  ? "1. لأصحاب الأعمال والمتاجر"
                  : "1. Business & Store Owners"}
              </h3>
              <p className="text-[#404941] text-sm leading-relaxed mb-4">
                {isAr
                  ? "قم بربط نظام المخزون لديك بـ FoodLoop. خوارزمياتنا تقترح خصومات ديناميكية تلقائية قبل انتهاء الصلاحية لتعظيم الإيرادات بدلاً من الخسارة."
                  : "Connect your inventory system to FoodLoop. Our algorithms automatically suggest dynamic discount pricing before expiry to maximize revenue."}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "تحليل تلقائي لمعدل استهلاك الرفوف"
                      : "Automatic shelf turnover rate analysis"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "استرداد تكلفة المنتجات قبل انتهائها"
                      : "Recover product costs prior to expiration"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 2: Consumers */}
            <div
              id="consumers"
              className={`scroll-mt-28 bg-white border border-[#e0e6df] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden ${isAr ? "text-right" : "text-left"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#005129] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1c19] mb-3">
                {isAr ? "2. للمستهلكين الأذكياء" : "2. Smart Consumers"}
              </h3>
              <p className="text-[#404941] text-sm leading-relaxed mb-4">
                {isAr
                  ? "تصفح أقرب المخابز والسوبرماركت واحصل على صفقات ممتازة بخصومات تصل إلى 70% على أطعمة طازجة ذات جودة ممتازة."
                  : "Browse nearby bakeries and supermarkets to secure great deals up to 70% off high-quality fresh food."}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "توفير يومي كبير في مصروفات الغذاء"
                      : "Significant daily savings on food expenses"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "تنبيهات فورية للمخبوزات والمنتجات المفضلة"
                      : "Instant alerts for favorite baked goods"}
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 3: Charities */}
            <div
              id="charities"
              className={`scroll-mt-28 bg-white border border-[#e0e6df] rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden ${isAr ? "text-right" : "text-left"}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#5c4100] text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-[#1a1c19] mb-3">
                {isAr
                  ? "3. للجمعيات الخيرية"
                  : "3. Charitable NGO Organizations"}
              </h3>
              <p className="text-[#404941] text-sm leading-relaxed mb-4">
                {isAr
                  ? "توجيه التبرعات الغذائية المباشرة للأسر المستحقة عبر مسار ذكي يضمن وصول الطعام بجودة عالية وفي الوقت المناسب."
                  : "Direct food donations to deserving families via a smart pipeline ensuring timely delivery of high-quality meals."}
              </p>
              <ul className="space-y-2 text-xs font-medium text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "ربط لوجستي مباشر مع المتاجر المتبرعة"
                      : "Direct logistical connection with donating stores"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-[#005129] shrink-0" />
                  <span>
                    {isAr
                      ? "شفافية كاملة في تتبع سلامة الوجبات"
                      : "Full transparency tracking meal safety"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: AI Pricing Tech Showcase */}
      <section className="bg-gradient-to-b from-[#f2f6f1] to-[#fafaf4] py-14 border-y border-gray-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${isAr ? "text-right" : "text-left"}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#005129] text-xs font-bold">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>
                  {isAr ? "محرك التسعير الآلي" : "Automated Pricing Engine"}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] leading-tight">
                {isAr
                  ? "ذكاء اصطناعي يحمي هوامش ربحك ويمنع الهدر"
                  : "AI Protecting Profit Margins & Eliminating Waste"}
              </h2>
              <p className="text-[#404941] text-base leading-relaxed">
                {isAr
                  ? "يقوم محرك AI الخاص بـ FoodLoop بتحليل حركة البيع والوقت المتبقي للصلاحية، فيقوم بتعديل الأسعار ديناميكياً لضمان بيع كل وحدة قبل انتهائها بأفضل سعر ممكن."
                  : "FoodLoop's AI engine analyzes sales velocity and remaining shelf-life, dynamically adjusting prices to guarantee unit sales at optimal value before expiration."}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-[#00381a] mb-1">
                    94%
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {isAr
                      ? "نسبة إنقاذ المخزون المعرض للهدر"
                      : "Stock Rescued Rate"}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="text-2xl font-bold text-[#00381a] mb-1">
                    3.2x
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {isAr
                      ? "زيادة في سرعة تصريف المنتجات القريبة من الصلاحية"
                      : "Faster Turnover Velocity for Near-Expiry Items"}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Graphic Container */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-gray-100">
                <span className="font-bold text-sm text-[#1a1c19] flex items-center gap-2">
                  <BarChartIcon className="w-5 h-5 text-[#005129]" />
                  {isAr
                    ? "محاكاة التسعير الديناميكي مباشر"
                    : "Live Dynamic Pricing Simulation"}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                  {isAr ? "نشط الآن" : "Live Active"}
                </span>
              </div>

              {/* Progress items */}
              <div className="space-y-4 text-xs font-medium">
                <div>
                  <div className="flex justify-between mb-1 text-gray-700">
                    <span>
                      {isAr
                        ? "مخبوزات صباحية (تبقي 6 ساعات)"
                        : "Morning Pastries (6 hrs remaining)"}
                    </span>
                    <span className="font-bold text-[#00381a]">
                      {isAr ? "خصم 20%" : "20% OFF"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-gray-700">
                    <span>
                      {isAr
                        ? "صندوق وجبات جاهزة (تبقي 3 ساعات)"
                        : "Ready Meal Box (3 hrs remaining)"}
                    </span>
                    <span className="font-bold text-amber-700">
                      {isAr ? "خصم 50%" : "50% OFF"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[50%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-gray-700">
                    <span>
                      {isAr
                        ? "منتجات ألبان طازجة (تبقي ساعة واحدة)"
                        : "Fresh Dairy Items (1 hr remaining)"}
                    </span>
                    <span className="font-bold text-emerald-800">
                      {isAr ? "تحويل للتبرع الخيري" : "Rerouted to Charity"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#00381a] h-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
