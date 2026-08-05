import React from "react";
import { Review } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { arText } from "../constants/arabic-mapper";

interface ReviewCardListProps {
  reviews: Review[];
  t: AdminDictionary;
  isRtl?: boolean;
  onDeleteReview: (id: string) => void;
  onDismissFlag: (id: string) => void;
}

export const ReviewCardList: React.FC<ReviewCardListProps> = ({
  reviews,
  t,
  isRtl = false,
  onDeleteReview,
  onDismissFlag,
}) => {
  if (reviews.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-[#707a70]">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-[#eeeee9]">
      {reviews.map((review) => (
        <div key={review.id} className="p-4 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1a1c19]">{arText(review.userName, isRtl)}</span>
              <span className="text-[10px] text-[#707a70] mt-0.5">
                {isRtl ? "متجر: " : "Store: "}
                {arText(review.storeName, isRtl)}
              </span>
            </div>
            <span className="text-amber-500 font-bold text-xs">★ {review.rating}</span>
          </div>

          {/* Comment & Flag Reason */}
          <div className="flex flex-col gap-2 mt-1 text-xs">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                {t.commentCol}
              </span>
              <p className="text-[#404941] bg-[#fafaf4] p-3 rounded-lg border border-[#eeeee9] mt-0.5 leading-relaxed">
                {arText(review.comment, isRtl)}
              </p>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                {t.flagReasonCol}
              </span>
              <span className="inline-block text-[10px] text-red-600 bg-red-50/50 border border-red-100 rounded px-2 py-0.5 mt-0.5 font-bold">
                {arText(review.flagReason, isRtl)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeee9]/50">
            <button
              onClick={() => onDeleteReview(review.id)}
              className="px-3 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              {t.deleteReview}
            </button>
            <button
              onClick={() => onDismissFlag(review.id)}
              className="px-3 py-1.5 text-xs font-bold bg-[#eeeee9] text-[#707a70] hover:text-[#1a1c19] rounded-lg transition-colors cursor-pointer"
            >
              {t.dismissFlag}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
