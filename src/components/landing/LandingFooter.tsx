"use client";

import Link from "next/link";
import { LeafIcon, GlobeIcon } from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function LandingFooter() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer
      dir={isAr ? "rtl" : "ltr"}
      className="bg-gradient-to-b from-[#fafaf4] via-[#f4f4ec] to-[#eaeae1] border-t border-gray-200/80 mt-20 pt-16 pb-12 text-[#1a1c19] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Brand & Description Column */}
          <div
            className={`md:col-span-5 w-full flex flex-col gap-4 ${isAr ? "text-right" : "text-left"}`}
          >
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 text-[#00381a] focus:outline-hidden group"
              >
                <LeafIcon className="w-8 h-8 text-[#005129] group-hover:scale-110 transition-transform duration-300 shrink-0" />
                <span className="text-2xl sm:text-3xl font-bold font-brand tracking-tight text-[#00381a]">
                  FoodLoop
                </span>
              </Link>
            </div>

            <p className="w-full text-sm sm:text-base text-[#404941] leading-relaxed font-normal">
              {isAr
                ? "منصة فودلوب المصرية الرائدة للحد من هدر الطعام باستخدام الذكاء الاصطناعي، لربط المتاجر بالمستهلكين والجمعيات الخيرية واستدامة الموارد الغذائية."
                : "FoodLoop is Egypt's leading AI initiative to eliminate food waste, connecting stores, smart consumers, and charities for food security and sustainability."}
            </p>

            <p className="w-full text-xs text-[#5a605a] font-medium">
              {isAr
                ? "© 2026 فودلوب. المبادرة الوطنية للحد من الهدر وتحقيق الأمن الغذائي."
                : "© 2026 FoodLoop. Egypt's AI Food Sovereignty Initiative."}
            </p>

            {/* Social & Contact Icon Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="mailto:contact@foodloop.eg"
                aria-label={isAr ? "البريد الإلكتروني للدعم" : "Email support"}
                className="w-9 h-9 rounded-full bg-white border border-gray-300/80 flex items-center justify-center text-[#404941] hover:text-[#00381a] hover:border-[#005129] hover:bg-[#005129]/10 transition-all shadow-2xs cursor-pointer"
                title="contact@foodloop.eg"
              >
                <span className="text-base leading-none">✉️</span>
              </a>
              <a
                href="https://foodloop.eg"
                target="_blank"
                rel="noreferrer"
                aria-label={isAr ? "الموقع الإلكتروني" : "Website"}
                className="w-9 h-9 rounded-full bg-white border border-gray-300/80 flex items-center justify-center text-[#404941] hover:text-[#00381a] hover:border-[#005129] hover:bg-[#005129]/10 transition-all shadow-2xs cursor-pointer"
                title="foodloop.eg"
              >
                <GlobeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Link Groups */}
          <div
            className={`md:col-span-7 w-full grid grid-cols-2 sm:grid-cols-3 gap-8 ${isAr ? "text-right" : "text-left"}`}
          >
            {/* Column 1: المنتج (Product) */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#1a1c19] tracking-wide">
                {isAr ? "المنتج والحلول" : "Product & Solutions"}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#404941]">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "كيف يعمل؟" : "How it Works"}
                  </a>
                </li>
                <li>
                  <a
                    href="#business"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "لأصحاب الأعمال" : "For Business"}
                  </a>
                </li>
                <li>
                  <a
                    href="#consumers"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "لالمستهلكين" : "For Consumers"}
                  </a>
                </li>
                <li>
                  <a
                    href="#charities"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "للجمعيات الخيرية" : "For Charities"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: الشركة (Company) */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#1a1c19] tracking-wide">
                {isAr ? "عن فودلوب" : "Company"}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#404941]">
                <li>
                  <a
                    href="#hero"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "الرئيسية" : "Home"}
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "رؤيتنا ومهمتنا" : "Mission & Vision"}
                  </a>
                </li>
                <li>
                  <a
                    href="#business"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "شركاء النجاح" : "Partners"}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: قانوني والدعم (Legal & Support) */}
            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <h4 className="text-sm font-bold text-[#1a1c19] tracking-wide">
                {isAr ? "السياسات والشروط" : "Legal & Privacy"}
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#404941]">
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "الشروط والأحكام" : "Legal Terms"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies#privacy"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies#terms"
                    className="hover:text-[#00381a] transition-colors"
                  >
                    {isAr ? "شروط الاستخدام" : "Terms of Use"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar with Back to top button */}
        <div className="mt-12 pt-6 border-t border-gray-300/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5a605a]">
          <span>
            {isAr
              ? "جمهورية مصر العربية — منصة FoodLoop للأمن الغذائي"
              : "Arab Republic of Egypt — FoodLoop Food Security Platform"}
          </span>

          <button
            type="button"
            onClick={scrollToTop}
            className="w-9 h-9 rounded-full bg-white border border-gray-300/80 text-[#00381a] hover:bg-[#005129] hover:text-white transition-all cursor-pointer shadow-2xs flex items-center justify-center font-bold active:scale-95"
            aria-label={isAr ? "العودة للأعلى" : "Back to top"}
            title={isAr ? "العودة للأعلى" : "Back to top"}
          >
            <span className="text-base leading-none">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
