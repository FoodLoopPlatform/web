"use client";

import Link from "next/link";
import { StoreIcon, ArrowForwardIcon, BarChartIcon } from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function LandingBusinessSection() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <section
      id="business"
      className="scroll-mt-24 bg-gradient-to-b from-[#f2f6f1] via-[#fafaf4] to-white py-16 border-y border-gray-200/70 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Business Text Details */}
          <div
            className={`space-y-6 min-w-0 ${isAr ? "text-right" : "text-left"}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00381a] text-white text-xs font-bold shadow-2xs">
              <StoreIcon className="w-4 h-4 shrink-0" />
              <span>
                {isAr
                  ? "حلول المتاجر والأعمال"
                  : "Merchant & Business Solutions"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] leading-tight">
              {isAr
                ? "استرد قيمة مخزونك وعظّم أرباحك قبل انتهاء الصلاحية"
                : "Recover Inventory Value & Maximize Profit Margins"}
            </h2>

            <p className="text-[#404941] text-base sm:text-lg leading-relaxed">
              {isAr
                ? "ربط سلس مع أنظمة الـ POS والمخزون لديك. خوارزمياتنا تقترح خصومات ديناميكية في الوقت الفعلي لتسريع تصريف المنتجات، وتحويل الخسائر المحتملة إلى إيرادات فعلية."
                : "Seamlessly connect with your existing POS and inventory software. Our algorithms dynamically optimize pricing to recover costs on near-expiry stock before loss occurs."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#005129]/10 text-[#005129] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <h4 className="font-bold text-[#1a1c19] text-base">
                  {isAr ? "تسعير ديناميكي آلي" : "AI Dynamic Pricing"}
                </h4>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "تعديل الخصومات تلقائياً بناءً على سرعة البيع والوقت المتبقي للصلاحية."
                    : "Automatic discount adjustments based on real-time turnover velocity."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#005129]/10 text-[#005129] flex items-center justify-center font-bold">
                  📊
                </div>
                <h4 className="font-bold text-[#1a1c19] text-base">
                  {isAr ? "لوحة تحكم وتحليلات" : "Real-time Analytics"}
                </h4>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "تقارير لحظية حول المبيعات المستردة، ونسبة الهدر الممنوعة، ومعدلات الربحية."
                    : "Detailed metrics on recovered revenue, waste prevention, and profit gains."}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-2">
                <div className="w-9 h-9 rounded-lg bg-[#005129]/10 text-[#005129] flex items-center justify-center font-bold">
                  🌿
                </div>
                <h4 className="font-bold text-[#1a1c19] text-base">
                  {isAr ? "علامة الاستدامة الخضراء" : "Green Brand Status"}
                </h4>
                <p className="text-xs text-[#5a605a] leading-relaxed">
                  {isAr
                    ? "عزز مكانة متجرك كمؤسسة صديقة للبيئة تدعم الأمن الغذائي والاستدامة."
                    : "Elevate your brand image as a zero-waste sustainable business."}
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00381a] hover:bg-[#005129] text-white font-semibold text-sm rounded-full shadow-md transition-all"
              >
                <span>
                  {isAr ? "سجّل متجرك الآن" : "Register Your Store Now"}
                </span>
                <ArrowForwardIcon
                  className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>

          {/* Business Simulation & Stats Graphic */}
          <div className="w-full min-w-0 flex justify-center">
            <div className="w-full min-w-[290px] sm:min-w-[380px] max-w-lg bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xl space-y-6 shrink-0">
              <div className="flex items-center justify-between border-b pb-4 border-gray-100 gap-2">
                <span className="font-bold text-sm text-[#1a1c19] flex items-center gap-2 min-w-0">
                  <BarChartIcon className="w-5 h-5 text-[#005129] shrink-0" />
                  <span className="truncate">
                    {isAr
                      ? "محاكاة التسعير الآلي"
                      : "Live AI Dynamic Pricing Dashboard"}
                  </span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
                  {isAr ? "نشط الآن" : "Live"}
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-5 text-xs font-medium">
                <div>
                  <div className="flex justify-between mb-1.5 text-gray-700">
                    <span className="font-semibold">
                      {isAr
                        ? "مخبوزات (كرواسون): متبقي 6 ساعات"
                        : "Croissants (6 hrs remaining)"}
                    </span>
                    <span className="font-bold text-[#00381a]">
                      {isAr ? "خصم 25%" : "25% OFF"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[75%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 text-gray-700">
                    <span className="font-semibold">
                      {isAr
                        ? "وجبات طازجة: متبقي 3 ساعات"
                        : "Fresh Meals (3 hrs remaining)"}
                    </span>
                    <span className="font-bold text-amber-700">
                      {isAr ? "خصم 50%" : "50% OFF"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[50%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 text-gray-700">
                    <span className="font-semibold text-emerald-900">
                      {isAr
                        ? "منتجات ألبان: متبقي ساعة واحدة"
                        : "Dairy Products (1 hr remaining)"}
                    </span>
                    <span className="font-bold text-emerald-800">
                      {isAr ? "تحويل للتبرع الخيري" : "Rerouted to NGO"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-[#00381a] h-full w-[100%]" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
                <div className="p-3.5 rounded-xl bg-[#f4f9f4]">
                  <div className="text-2xl font-bold text-[#00381a]">94%</div>
                  <div className="text-xs text-[#5a605a] font-medium mt-0.5">
                    {isAr ? "نسبة مخزون تم إنقاذه" : "Stock Rescued"}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#f4f9f4]">
                  <div className="text-2xl font-bold text-[#00381a]">3.2x</div>
                  <div className="text-xs text-[#5a605a] font-medium mt-0.5">
                    {isAr ? "سرعة أعلى في تصريف المنتجات" : "Turnover Speed"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
