"use client";

import Link from "next/link";
import { ArrowUpIcon, LeafIcon } from "@/components/icons";
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
      className="bg-[#002d15] text-[#fafaf4] pt-16 pb-10 overflow-hidden transition-all relative border-t border-[#005129]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Massive Brand Statement Typography */}
        <div
          dir="ltr"
          className="w-full flex items-center justify-center py-2 select-none overflow-hidden"
        >
          <Link
            href="/"
            dir="ltr"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
            className="group inline-flex flex-row items-center gap-3 sm:gap-4 cursor-pointer focus:outline-hidden"
            aria-label="FoodLoop Home"
            title="FoodLoop Home"
          >
            <h1 className="text-[9.5vw] sm:text-[10vw] font-black tracking-tight leading-none text-[#fafaf4] opacity-95 uppercase font-brand transition-all group-hover:opacity-100 group-hover:text-emerald-300 drop-shadow-sm whitespace-nowrap">
              FOODLOOP
            </h1>
            <LeafIcon className="w-[6vw] h-[6vw] max-w-[60px] max-h-[60px] aspect-square text-emerald-400 group-hover:scale-115 group-hover:rotate-12 transition-all duration-300 shrink-0" />
          </Link>
        </div>

        {/* Primary Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs sm:text-sm font-medium text-[#fafaf4]/80 border-t border-b border-white/10 py-6">
          <a
            href="#how-it-works"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "كيف يعمل؟" : "How It Works"}
          </a>
          <a
            href="#business"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "لأصحاب الأعمال" : "For Business"}
          </a>
          <a
            href="#consumers"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "للمستهلك الذكي" : "For Consumers"}
          </a>
          <a
            href="#charities"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "للجمعيات الخيرية" : "For Charities"}
          </a>
          <a
            href="#faq"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "الأسئلة الشائعة" : "FAQ"}
          </a>
          <Link
            href="/policies"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
          </Link>
          <Link
            href="/policies#privacy"
            className="hover:text-white hover:underline transition-all"
          >
            {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
          </Link>
          <a
            href="mailto:contact@foodloop.eg"
            className="hover:text-[#fafaf4] hover:underline transition-all"
          >
            {isAr ? "تواصل معنا" : "Contact Us"}
          </a>
        </div>

        {/* Bottom Bar: Copyright & Back to top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#fafaf4]/60">
          <div>
            {isAr
              ? "جميع الحقوق محفوظة © 2026 فودلوب — المبادرة الوطنية للحد من هدر الطعام"
              : "Copyright © 2026 FoodLoop. All Rights Reserved."}
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs font-extrabold active:scale-95 border border-white/10"
            aria-label={isAr ? "العودة للأعلى" : "Back to top"}
            title={isAr ? "العودة للأعلى" : "Back to top"}
          >
            <ArrowUpIcon className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </footer>
  );
}
