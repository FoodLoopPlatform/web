"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ModerationItem } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import {
  ModerationConfidenceBadge,
  ModerationFlagBadge,
} from "./ModerationBadge";
import { ModerationActions } from "./ModerationActions";

interface ProductDetailsModalProps {
  isOpen: boolean;
  item: ModerationItem | null;
  t: AdminDictionary;
  isRtl?: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestChanges: (id: string) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  item,
  t,
  isRtl = false,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !item) return null;

  const productName = isRtl
    ? item.productNameAr || item.productName
    : item.productNameEn || item.productName;
  const storeName = isRtl
    ? item.storeNameAr || item.storeName
    : item.storeNameEn || item.storeName;
  const flagReasonQuote = isRtl
    ? item.flagReasonQuoteAr || item.flagReasonQuote
    : item.flagReasonQuoteEn || item.flagReasonQuote;

  const discountPercent =
    item.originalPrice && item.discountedPrice
      ? Math.round(
          ((item.originalPrice - item.discountedPrice) / item.originalPrice) *
            100,
        )
      : null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl border border-card-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-outline-variant/40 flex justify-between items-start gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {isRtl ? "تفاصيل إدراج المنتج" : "Product Listing Details"}
              </span>
              <ModerationConfidenceBadge confidence={item.aiConfidence} t={t} />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-on-surface tracking-tight mt-1">
              {productName}
            </h2>
            <p className="text-xs text-outline font-medium">{storeName}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-outline-variant/30 text-outline hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-6">
          {/* Main Image Banner */}
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shrink-0">
            {!imgError && item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={productName || "Product"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high text-outline gap-2">
                <svg
                  className="w-12 h-12 text-primary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-bold text-outline">
                  {isRtl ? "صورة المنتج" : "Product Image"}
                </span>
              </div>
            )}
          </div>

          {/* Key Pricing & Stock Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Price Info */}
            <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {isRtl ? "السعر والتخفيض" : "Price & Discount"}
              </span>
              <div className="flex items-baseline gap-2 flex-wrap mt-0.5">
                {item.discountedPrice ? (
                  <span className="text-sm sm:text-base font-extrabold text-primary">
                    EGP {item.discountedPrice}
                  </span>
                ) : null}
                {item.originalPrice ? (
                  <span className="text-xs text-outline line-through font-semibold">
                    EGP {item.originalPrice}
                  </span>
                ) : null}
              </div>
              {discountPercent !== null && discountPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md w-fit">
                  {isRtl
                    ? `خصم ${discountPercent}٪`
                    : `${discountPercent}% OFF`}
                </span>
              )}
            </div>

            {/* Category */}
            <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {isRtl ? "التصنيف" : "Category"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">
                {item.category || (isRtl ? "منتجات عامة" : "General")}
              </span>
            </div>

            {/* Stock Quantity */}
            <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex flex-col gap-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">
                {isRtl ? "الكمية المتاحة" : "Available Stock"}
              </span>
              <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">
                {item.stockQuantity ?? 1} {isRtl ? "قطع / طرود" : "Items/Units"}
              </span>
            </div>
          </div>

          {/* Moderation Flags & Reason */}
          <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">
                {isRtl ? "سبب التنبيه والمراجعة" : "Moderation Reason & Flags"}
              </span>
              <div className="flex flex-wrap gap-1">
                {item.flags.map((flag) => (
                  <ModerationFlagBadge key={flag} flagType={flag} t={t} />
                ))}
              </div>
            </div>

            {flagReasonQuote && (
              <p className="text-xs italic text-on-surface-variant bg-white p-3 rounded-lg border border-outline-variant/60 leading-relaxed">
                &ldquo;{flagReasonQuote}&rdquo;
              </p>
            )}
          </div>

          {/* Additional Metadata Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex justify-between items-center">
              <span className="text-outline font-medium">
                {isRtl ? "تاريخ الإدراج:" : "Submitted Date:"}
              </span>
              <span className="font-bold text-on-surface">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(
                      isRtl ? "ar-EG" : "en-US",
                      { month: "short", day: "numeric", year: "numeric" },
                    )
                  : "recently"}
              </span>
            </div>

            <div className="p-3 bg-surface rounded-xl border border-outline-variant/40 flex justify-between items-center">
              <span className="text-outline font-medium">
                {isRtl ? "معرف المنتج:" : "Product ID:"}
              </span>
              <span className="font-mono text-[11px] font-bold text-primary px-1.5 py-0.5 bg-primary/10 rounded">
                {item.id.slice(0, 12)}...
              </span>
            </div>
          </div>

          {item.description && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-on-surface">
                {isRtl ? "الوصف والمكونات:" : "Description & Details:"}
              </span>
              <p className="text-xs text-outline leading-relaxed bg-surface p-3 rounded-xl border border-outline-variant/40">
                {item.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-outline-variant/40 bg-surface flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 z-10 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            {isRtl ? "إغلاق" : "Close"}
          </button>
          <div className="w-full sm:w-auto">
            <ModerationActions
              itemId={item.id}
              t={t}
              onApprove={(id) => {
                onClose();
                onApprove(id);
              }}
              onReject={(id) => {
                onClose();
                onReject(id);
              }}
              onRequestChanges={(id) => {
                onClose();
                onRequestChanges(id);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
