import React, { useState } from "react";
import Image from "next/image";
import { ModerationItem } from "../types/admin.types";
import { AdminDictionary } from "../constants/dictionary";
import {
  ModerationConfidenceBadge,
  ModerationFlagBadge,
} from "./ModerationBadge";
import { ModerationActions } from "./ModerationActions";

interface ModerationListingCardProps {
  item: ModerationItem;
  t: AdminDictionary;
  isRtl?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestChanges: (id: string) => void;
  isProcessing?: boolean;
}

export const ModerationListingCard: React.FC<ModerationListingCardProps> = ({
  item,
  t,
  isRtl = false,
  onApprove,
  onReject,
  onRequestChanges,
  isProcessing = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const productName = isRtl
    ? item.productNameAr || item.productName
    : item.productNameEn || item.productName;
  const storeName = isRtl
    ? item.storeNameAr || item.storeName
    : item.storeNameEn || item.storeName;
  const flagReasonQuote = isRtl
    ? item.flagReasonQuoteAr || item.flagReasonQuote
    : item.flagReasonQuoteEn || item.flagReasonQuote;

  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-outline-variant/60 shadow-2xs hover:shadow-md transition-all p-3.5 flex flex-col gap-3 overflow-hidden ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      {/* Product Image Container & AI Badge */}
      <div className="relative w-full h-36 sm:h-40 rounded-lg overflow-hidden bg-surface-container-high shrink-0 border border-outline-variant/40">
        {!imgError && item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={productName || "Product"}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized
            className="object-cover transition-opacity duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-quality Fallback SVG */
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface-container-high text-outline gap-1">
            <svg
              className="w-10 h-10 opacity-50 text-primary"
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
            <span className="text-[10px] font-bold text-outline">
              {isRtl ? "صورة المنتج" : "Product Image"}
            </span>
          </div>
        )}

        {/* AI Confidence Badge pinned cleanly inside top corner */}
        <div
          className={`absolute top-2.5 ${isRtl ? "left-2.5" : "right-2.5"} z-10`}
        >
          <ModerationConfidenceBadge confidence={item.aiConfidence} t={t} />
        </div>
      </div>

      {/* Product & Store Details */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-on-surface tracking-tight leading-snug">
          {productName}
        </h3>
        <p className="text-[11px] font-medium text-outline">{storeName}</p>
      </div>

      {/* Context / Flag Badges */}
      <div className="flex flex-wrap gap-1.5 items-center">
        {item.flags.map((flag) => (
          <ModerationFlagBadge key={flag} flagType={flag} t={t} />
        ))}
      </div>

      {/* Flagged Reason Quote */}
      {flagReasonQuote && (
        <blockquote className="text-[11px] italic text-on-surface-variant bg-surface p-2.5 rounded-lg border border-outline-variant/40 leading-relaxed">
          &ldquo;{flagReasonQuote}&rdquo;
        </blockquote>
      )}

      {/* Actions Group */}
      <div className="border-t border-outline-variant/40 pt-2 mt-auto">
        <ModerationActions
          itemId={item.id}
          t={t}
          onApprove={onApprove}
          onReject={onReject}
          onRequestChanges={onRequestChanges}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};
