"use client";

import Link from "next/link";
import {
  UserIcon,
  CheckCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowForwardIcon,
  MapPinIcon,
  ClockIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function LandingConsumerSection() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  return (
    <section id="consumers" className="scroll-mt-24 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Consumer Text Details */}
          <div
            className={`space-y-6 min-w-0 ${isAr ? "text-right" : "text-left"}`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#005129] text-white text-xs font-bold shadow-2xs">
              <UserIcon className="w-4 h-4 shrink-0" />
              <span>{isAr ? "للمستهلك الذكي" : "For Smart Consumers"}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1c19] leading-tight">
              {isAr
                ? "طعام طازج وعالي الجودة.. بخصومات تصل إلى 70%"
                : "Fresh, High Quality Food.. At Up to 70% Off"}
            </h2>

            <p className="text-[#404941] text-base sm:text-lg leading-relaxed">
              {isAr
                ? "استمتع بوجبات ومنتجات طازجة يومياً من أفضل المخابز، المطاعم، والسوبر ماركت المجاورة لك بأسعار استثنائية. وفّر أموالك، وساهم معنا في حماية البيئة وتقليل هدر الطعام."
                : "Enjoy fresh meals and products daily from top local bakeries, restaurants, and supermarkets at exceptional prices. Save money and join us in protecting the environment and reducing food waste."}
            </p>

            <h3 className="font-bold text-[#1a1c19] text-base pt-1">
              {isAr ? "لماذا تستخدم FoodLoop؟" : "Why use FoodLoop?"}
            </h3>

            <div className="space-y-3.5 text-sm font-medium text-gray-800">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-[#005129] mt-0.5 shrink-0">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1a1c19] block">
                    {isAr ? "توفير يومي ضخم" : "Significant Daily Savings"}
                  </span>
                  <span className="text-xs text-[#5a605a]">
                    {isAr
                      ? "خصومات حقيقية تصل إلى 70% على أطعمة طازجة وسليمة 100%."
                      : "Real discounts up to 70% on 100% fresh, safe food."}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-[#005129] mt-0.5 shrink-0">
                  <BellIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1a1c19] block">
                    {isAr
                      ? "تنبيهات فورية لمفضلاتك"
                      : "Instant Favorite Alerts"}
                  </span>
                  <span className="text-xs text-[#5a605a]">
                    {isAr
                      ? "اشترك في إشعارات المتاجر والمخابز المفضلة لديك، ليصلك العرض فور نزوله."
                      : "Subscribe to notifications for your favorite stores and bakeries to get deals as soon as they drop."}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-[#005129] mt-0.5 shrink-0">
                  <ShieldCheckIcon className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#1a1c19] block">
                    {isAr
                      ? "ضمان الجودة والسلامة"
                      : "Guaranteed Quality & Safety"}
                  </span>
                  <span className="text-xs text-[#5a605a]">
                    {isAr
                      ? "تخضع جميع المنتجات لمعايير صارمة لضمان جودتها وسلامتها التامة قبل العرض."
                      : "All products undergo strict quality standards to ensure complete safety before display."}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="https://drive.google.com/drive/folders/1V0SYmpNhS637Qd-LJNLtPBhk8SJv1LBv"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#005129] hover:bg-[#00381a] text-white font-semibold text-sm rounded-full shadow-md transition-all"
              >
                <span>
                  {isAr
                    ? "حمّل التطبيق وابدأ التوفير"
                    : "Download App & Start Saving"}
                </span>
                <ArrowForwardIcon
                  className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`}
                />
              </Link>
            </div>
          </div>

          {/* Visual Consumer App Showcase Preview */}
          <div className="w-full min-w-0 flex justify-center">
            <div className="w-full min-w-[290px] sm:min-w-[380px] max-w-lg bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden shrink-0">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPinIcon className="w-5 h-5 text-[#005129] shrink-0" />
                  <span className="font-bold text-sm sm:text-base text-[#1a1c19] truncate">
                    {isAr ? "عروض حية قريبة منك" : "Live Deals Near You"}
                  </span>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-[#005129] rounded-full shrink-0">
                  {isAr ? "خصم يصل إلى 70%" : "Up to 70% Off"}
                </span>
              </div>

              {/* Offer Card 1 */}
              <div className="p-4 rounded-2xl bg-[#fafaf4] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="text-xs text-amber-700 font-bold flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isAr
                        ? "الوقت المتبقي: 45 دقيقة"
                        : "Time remaining: 45 mins"}
                    </span>
                  </div>
                  <div className="font-bold text-sm sm:text-base text-[#1a1c19] truncate">
                    {isAr ? "صندوق مخبوزات طازجة" : "Fresh Bakery Box"}
                  </div>
                  <div className="text-xs text-[#5a605a] truncate">
                    {isAr
                      ? "مخبز النيل (على بعد 500م)"
                      : "Nile Bakery (500m away)"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400 line-through">
                    120 EGP
                  </div>
                  <div className="text-base font-bold text-[#00381a]">
                    40 EGP
                  </div>
                </div>
              </div>

              {/* Offer Card 2 */}
              <div className="p-4 rounded-2xl bg-[#fafaf4] border border-gray-200/80 flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isAr
                        ? "الوقت المتبقي: ساعتان"
                        : "Time remaining: 2 hours"}
                    </span>
                  </div>
                  <div className="font-bold text-sm sm:text-base text-[#1a1c19] truncate">
                    {isAr ? "طبق وجبة غداء فاخرة" : "Premium Lunch Meal"}
                  </div>
                  <div className="text-xs text-[#5a605a] truncate">
                    {isAr
                      ? "مطعم الجرين (على بعد 1.2كم)"
                      : "Green Bistro (1.2km away)"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400 line-through">
                    180 EGP
                  </div>
                  <div className="text-base font-bold text-[#00381a]">
                    75 EGP
                  </div>
                </div>
              </div>

              {/* Savings Banner */}
              <div className="p-4 rounded-xl bg-[#00381a] text-white flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                <span>
                  {isAr
                    ? "إجمالي توفير المستهلكين هذا الشهر"
                    : "Total Community Savings"}
                </span>
                <span className="text-emerald-300 font-bold text-sm sm:text-base shrink-0">
                  +450,000 EGP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
