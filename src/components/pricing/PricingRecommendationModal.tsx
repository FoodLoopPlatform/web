"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { resolveImageUrl } from "@/utils/image-utils";
import type { ProductPricingItem } from "@/app/pricing/api/types";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

type PricingRecommendationModalProps = {
  open: boolean;
  onClose: () => void;
  products?: ProductPricingItem[];
};

export function PricingRecommendationModal({
  open,
  onClose,
  products = [],
}: PricingRecommendationModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Pick the top urgent or top discounted real product from API
  const recommendedProduct = useMemo(() => {
    if (!products || products.length === 0) return null;
    const urgent = products.find((p) => p.cycleUrgent);
    if (urgent) return urgent;
    const highestDiscount = [...products].sort(
      (a, b) => b.discountPercent - a.discountPercent,
    )[0];
    return highestDiscount || products[0];
  }, [products]);

  if (!open) return null;

  if (!recommendedProduct) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-white p-8 rounded-2xl max-w-md w-full text-center flex flex-col items-center gap-4"
        >
          <Icon name="info" className="h-10 w-10 text-primary" />
          <h3 className="text-xl font-bold text-on-surface">
            لا توجد منتجات مسجلة حاليًا
          </h3>
          <p className="text-sm text-on-surface-variant">
            أضف منتجات إلى متجرك للبدء في تشغيل محرك التسعير الذكي والتوصيات
            التلقائية.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  const discountPercent =
    recommendedProduct.discountPercent > 0
      ? recommendedProduct.discountPercent
      : 15;
  const recommendedPrice =
    recommendedProduct.currentPrice < recommendedProduct.originalPrice
      ? recommendedProduct.currentPrice
      : Math.round(
          recommendedProduct.originalPrice * (1 - discountPercent / 100),
        );

  const displayImage =
    resolveImageUrl(recommendedProduct.image) || "/pricing/sourdough.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="bg-white flex w-full max-w-2xl rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        {/* Right Side: Product Image */}
        <div className="relative shrink-0 w-70 hidden sm:block">
          <Image
            src={displayImage}
            alt={recommendedProduct.name}
            fill
            sizes="280px"
            className="object-cover"
            unoptimized={displayImage.startsWith("http")}
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-linear-to-t from-black/60 to-transparent px-6 pb-6 pt-7">
            <span className="self-start rounded-full bg-[#633d00] px-4 py-1 text-xs font-bold tracking-wide text-[#dfa964]">
              {recommendedProduct.cycleUrgent
                ? "أولوية مرتفعة: اقتراب الصلاحية"
                : "توصية تسعير ذكي"}
            </span>
            <h3 className="pt-1.5 text-2xl font-bold text-white truncate">
              {recommendedProduct.name}
            </h3>
            <span className="text-sm text-white/80">
              الرمز: {recommendedProduct.code}
            </span>
          </div>
        </div>

        {/* Left Side: Content & Actions */}
        <div className="flex flex-1 flex-col justify-between p-8 sm:p-10">
          <div className="flex flex-col gap-6 pb-8">
            <div className="relative">
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق"
                className="absolute top-0 left-0 p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>

              <span className="block text-xs font-bold tracking-wide text-on-surface-variant">
                اقتراح التسعير الديناميكي
              </span>
              <div className="flex items-center gap-4 pt-3 flex-wrap">
                <span
                  dir="ltr"
                  className="font-data-mono text-2xl text-on-surface-variant/40 line-through"
                >
                  {formatEGP(recommendedProduct.originalPrice)}
                </span>
                <Icon
                  name="arrow_back"
                  className="h-4 w-4 text-on-surface-variant shrink-0"
                />
                <span
                  dir="ltr"
                  className="font-data-mono text-3xl font-bold text-[#633d00]"
                >
                  {formatEGP(recommendedPrice)}
                </span>
                <span
                  dir="ltr"
                  className="rounded-lg bg-[#98f3b0] px-2 py-1 text-sm font-bold text-[#0b723c]"
                >
                  -{discountPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border-s-4 border-[#633d00] bg-light-green ps-6 pe-5 py-5 w-full">
              <div className="flex items-center gap-2">
                <Icon
                  name="auto_awesome"
                  className="h-4.5 w-4.5 text-[#633d00]"
                  fill
                />
                <span className="font-bold text-on-surface">
                  رؤية الذكاء الاصطناعي
                </span>
              </div>
              <p className="text-body-md text-on-surface-variant">
                تم تحليل حركة الطلب ودورة الصلاحية للمنتج (
                {recommendedProduct.cycleCountdownLabel}). يُنصح بتطبيق خصم{" "}
                <span className="font-bold text-primary">
                  {discountPercent}%
                </span>{" "}
                لتحفيز الطلب وتسريع تصفية المخزون.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-3 bg-primary text-white font-bold py-3.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Icon name="check_circle" className="h-5 w-5" />
              الموافقة على التوصية
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 text-on-surface-variant font-medium py-2.5 cursor-pointer hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/30 text-center"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
