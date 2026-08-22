"use client";

import {
  CloseIcon,
  SparklesIcon,
  CheckCircleIcon,
  PlayCircleIcon,
} from "@/components/icons";
import { useAppLang } from "@/store/use-app-lang";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { lang } = useAppLang();
  const isAr = lang === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        dir={isAr ? "rtl" : "ltr"}
        className={`relative w-full max-w-2xl bg-[#fafaf4] rounded-3xl border border-gray-200 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 ${isAr ? "text-right" : "text-left"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200/60 transition-colors ${isAr ? "left-4" : "right-4"}`}
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#005129]/10 text-[#005129] text-xs font-bold">
            <SparklesIcon className="w-4 h-4" />
            <span>{isAr ? "عرض توضيحي للمنظومة" : "Platform Walkthrough"}</span>
          </div>
          <h3 className="text-2xl font-bold text-[#1a1c19]">
            {isAr ? "كيف تعمل منصة FoodLoop؟" : "How FoodLoop Works"}
          </h3>
          <p className="text-sm text-[#404941]">
            {isAr
              ? "شاهد كيف يقود الذكاء الاصطناعي عمليات إنقاذ الطعام خطوة بخطوة."
              : "See how artificial intelligence drives step-by-step food rescue operations."}
          </p>
        </div>

        {/* Mock Interactive Video / Demo Player */}
        <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-slate-900 via-[#00381a] to-slate-800 border border-slate-700 flex flex-col items-center justify-center text-white p-6 shadow-inner group overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
            <PlayCircleIcon className="w-10 h-10 text-white" />
          </div>
          <p className="text-sm font-semibold mt-4 text-emerald-100">
            {isAr
              ? "فيديو توضيحي: رحلة وجبة من المخبز حتى المستهلك"
              : "Demo Video: A meal's journey from bakery to consumer"}
          </p>
          <span className="text-xs text-emerald-300/80 mt-1">
            {isAr ? "المدة: 1:30 دقيقة" : "Duration: 1:30 mins"}
          </span>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 text-xs space-y-1">
            <div className="font-bold text-[#00381a] flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "1. تحليل المخزون" : "1. Inventory Analysis"}</span>
            </div>
            <p className="text-gray-600 leading-snug">
              {isAr
                ? "رصد الأطعمة القريبة من الصلاحية تلقائياً."
                : "Automatically track items near expiration date."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 text-xs space-y-1">
            <div className="font-bold text-[#00381a] flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "2. تسعير ذكي" : "2. Dynamic Pricing"}</span>
            </div>
            <p className="text-gray-600 leading-snug">
              {isAr
                ? "عرض الخصومات المناسبة للمستهلكين فوراً."
                : "Present optimal discount offers to consumers instantly."}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-gray-200/80 text-xs space-y-1">
            <div className="font-bold text-[#00381a] flex items-center gap-1.5">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? "3. إنقاذ الطعام" : "3. Food Rescue"}</span>
            </div>
            <p className="text-gray-600 leading-snug">
              {isAr
                ? "شراء المنتجات أو توجيهها للجمعيات."
                : "Purchase discounted meals or direct to charities."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
