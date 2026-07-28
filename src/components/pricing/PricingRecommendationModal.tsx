"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { aiPriceRecommendation } from "@/app/pricing/lib/mock-data";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

type PricingRecommendationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function PricingRecommendationModal({
  open,
  onClose,
}: PricingRecommendationModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const recommendation = aiPriceRecommendation;

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
            src={recommendation.image}
            alt={recommendation.productName}
            fill
            sizes="280px"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-linear-to-t from-black/60 to-transparent px-6 pb-6 pt-7">
            <span className="self-start rounded-full bg-[#633d00] px-4 py-1 text-xs font-bold tracking-wide text-[#dfa964]">
              {recommendation.riskLabel}
            </span>
            <h3 className="pt-1.5 text-2xl font-bold text-white">
              {recommendation.productName}
            </h3>
            <span className="text-sm text-white/80">
              الرمز: {recommendation.sku}
            </span>
          </div>
        </div>

        {/* Left Side: Content & Actions */}
        <div className="flex flex-1 flex-col justify-between p-10">
          <div className="flex flex-col gap-6 pb-10">
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
              <div className="flex items-center gap-6 pt-3">
                <span
                  dir="ltr"
                  className="font-data-mono text-2xl text-on-surface-variant/40 line-through"
                >
                  {formatEGP(recommendation.originalPrice)}
                </span>
                <Icon
                  name="arrow_back"
                  className="h-4 w-4 text-on-surface-variant shrink-0"
                />
                <span
                  dir="ltr"
                  className="font-data-mono text-3xl font-bold text-[#633d00]"
                >
                  {formatEGP(recommendation.recommendedPrice)}
                </span>
                <span
                  dir="ltr"
                  className="rounded-lg bg-[#98f3b0] px-2 py-1 text-sm text-[#0b723c]"
                >
                  -{recommendation.discountPercent}%
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border-s-4 border-[#633d00] bg-light-green ps-7 pe-6 py-6 w-full">
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
                {recommendation.insight.prefix}
                <span className="font-bold">
                  {recommendation.insight.highlightExpiry}
                </span>
                {recommendation.insight.middle}
                <span className="text-error">
                  {recommendation.insight.highlightDrop}
                </span>
                {recommendation.insight.suffix}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-4 bg-primary-container text-white font-bold py-6 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Icon name="check_circle" className="h-5 w-5" />
              الموافقة على التوصية
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 border border-outline-variant px-6 py-4 rounded-xl text-on-surface cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <Icon name="edit" className="h-3.5 w-3.5" />
                تعديل السعر
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 text-on-surface-variant font-medium cursor-pointer hover:bg-surface-container-low rounded-xl transition-colors"
              >
                رفض
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
