"use client";

import Image from "next/image";
import { useState } from "react";
import {
  SparklesIcon,
  MapPinIcon,
  SearchIcon,
  ClockIcon,
  PlusIcon,
  HomeIcon,
  BagIcon,
  UserIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

export function MobileAppShowcase() {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  const [activeCategory, setActiveCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    { id: "all", label: isAr ? "الكل" : "All" },
    { id: "bakery", label: isAr ? "مخبوزات" : "Bakery" },
    { id: "dairy", label: isAr ? "ألبان" : "Dairy" },
    { id: "meals", label: isAr ? "وجبات جاهزة" : "Meals" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[380px] lg:max-w-[400px] py-6 select-none">
      {/* Dynamic Background Glow Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-[#90d6a2]/40 via-[#005129]/20 to-emerald-200/50 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />

      {/* FLOATING BADGE 1: AI Recommendation */}
      <div
        className={`absolute top-2 z-30 bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl p-3 shadow-xl transition-all hover:scale-105 duration-300 flex items-center gap-3 ${isAr ? "-left-4 sm:-left-8" : "-right-4 sm:-right-8"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-[#005129]/10 text-[#005129] flex items-center justify-center shrink-0">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <div className={isAr ? "text-right" : "text-left"}>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-[#1a1c19]">
              {isAr ? "توصية AI" : "AI Recommendation"}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-[#005129]">
            {isAr ? "خصم 20% مقترح" : "Suggested 20% OFF"}
          </p>
        </div>
      </div>

      {/* PHONE FRAME CONTAINER */}
      <div className="relative rounded-[44px] p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-2xl border-4 border-slate-800/80">
        {/* Outer Phone Bezel Glow */}
        <div className="rounded-[36px] bg-[#fafaf4] overflow-hidden border border-slate-700/40 relative shadow-inner">
          {/* Top Speaker / Camera Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-xl z-40 flex items-center justify-center">
            <div className="w-10 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* INSIDE PHONE SCREEN CONTENT */}
          <div
            dir={isAr ? "rtl" : "ltr"}
            className={`pt-6 pb-2 px-3.5 space-y-3.5 bg-gradient-to-b from-[#f8faf7] via-[#fafaf4] to-[#f2f6f1] text-[#1a1c19] min-h-[580px] flex flex-col justify-between ${isAr ? "text-right" : "text-left"}`}
          >
            {/* Top Bar: Current Location */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{isAr ? "موقعك الحالي" : "Current Location"}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPinIcon className="w-4 h-4 text-[#005129] shrink-0" />
                <span className="font-bold text-sm text-[#1a1c19]">
                  {isAr ? "القاهرة، المعادي" : "Maadi, Cairo"}
                </span>
              </div>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder={
                  isAr
                    ? "ابحث عن مخبز، خضار..."
                    : "Search bakeries, groceries..."
                }
                className={`w-full bg-white border border-gray-200 rounded-xl py-2 text-xs text-[#1a1c19] placeholder-gray-400 shadow-2xs focus:outline-hidden ${isAr ? "pr-9 pl-3" : "pl-9 pr-3"}`}
              />
              <SearchIcon
                className={`w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 ${isAr ? "right-3" : "left-3"}`}
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-medium cursor-pointer ${
                      isActive
                        ? "bg-[#00381a] text-white shadow-xs font-semibold"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* FOOD ITEM CARD 1: Bakery Box */}
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all">
              <div className="relative h-28 w-full bg-slate-100">
                <Image
                  src="/images/bakery_box.png"
                  alt={isAr ? "صندوق مخبوزات مشكل" : "Assorted Bakery Box"}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
                {/* Timer Badge */}
                <div
                  className={`absolute top-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1 ${isAr ? "right-2" : "left-2"}`}
                >
                  <ClockIcon className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? "ينتهي خلال 3 ساعات" : "Expires in 3h"}</span>
                </div>
              </div>

              <div className="p-3">
                <h4 className="font-bold text-sm text-[#1a1c19]">
                  {isAr ? "صندوق مخبوزات مشكل" : "Assorted Bakery Box"}
                </h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isAr ? "مخبز أرتيزان" : "Artisan Bakery"}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-sm text-[#00381a]">
                      {isAr ? "45 ج.م" : "45 EGP"}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      {isAr ? "90 ج.م" : "90 EGP"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartCount((c) => c + 1)}
                    className="w-7 h-7 rounded-full bg-[#00381a] hover:bg-[#005129] text-white flex items-center justify-center transition-transform active:scale-90"
                    aria-label="Add to cart"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* FOOD ITEM CARD 2: Dairy Jars */}
            <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
              <div className="relative h-20 w-full bg-slate-100">
                <Image
                  src="/images/dairy_jars.png"
                  alt={isAr ? "منتجات ألبان طازجة" : "Fresh Dairy Products"}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
                <div
                  className={`absolute top-2 bg-red-600/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${isAr ? "right-2" : "left-2"}`}
                >
                  <span>{isAr ? "⚠️ كمية محدودة" : "⚠️ Limited Quantity"}</span>
                </div>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#1a1c19]">
                    {isAr ? "قشطة طازجة من المزرعة" : "Fresh Farm Dairy"}
                  </h4>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {isAr ? "خصم 50% مستمر" : "50% Discount"}
                  </p>
                </div>
                <span className="font-bold text-xs text-[#00381a]">
                  {isAr ? "35 ج.م" : "35 EGP"}
                </span>
              </div>
            </div>

            {/* Phone Bottom Navigation Bar */}
            <div className="bg-white border-t border-gray-200/80 rounded-xl py-2 px-3 flex items-center justify-around text-[10px] text-gray-500 mt-auto">
              <div className="flex flex-col items-center gap-0.5 text-[#00381a] font-bold">
                <HomeIcon className="w-4 h-4 text-[#00381a]" />
                <span>{isAr ? "الرئيسية" : "Home"}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 hover:text-gray-900">
                <SearchIcon className="w-4 h-4" />
                <span>{isAr ? "استكشف" : "Explore"}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5 hover:text-gray-900 relative">
                <BagIcon className="w-4 h-4" />
                <span>{isAr ? "سلة الإنقاذ" : "Basket"}</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-emerald-600 text-white text-[8px] rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col items-center gap-0.5 hover:text-gray-900">
                <UserIcon className="w-4 h-4" />
                <span>{isAr ? "حسابي" : "Profile"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING BADGE 2: Price Protection */}
      <div
        className={`absolute -bottom-4 z-30 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl px-4 py-3 shadow-xl transition-all hover:scale-105 duration-300 flex items-center gap-3.5 ${isAr ? "left-4 sm:left-2" : "right-4 sm:right-2"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center justify-center shrink-0 text-base">
          🔒
        </div>
        <div className={isAr ? "text-right" : "text-left"}>
          <h5 className="text-xs font-bold text-[#1a1c19]">
            {isAr ? "حماية السعر" : "Price Guarantee"}
          </h5>
          <p className="text-[11px] text-gray-500 font-medium">
            {isAr ? "الحد الأدنى مضمون" : "Lowest Rate Guaranteed"}
          </p>
        </div>
      </div>
    </div>
  );
}
