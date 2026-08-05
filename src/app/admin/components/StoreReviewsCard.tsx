import React, { useState } from "react";
import { Review } from "../api/admin-api";
import { arText } from "../constants/arabic-mapper";

interface StoreReviewsCardProps {
  reviews: Review[];
  isLoading?: boolean;
  isRtl?: boolean;
  onDeleteReview: (reviewId: string) => Promise<void>;
}

export const StoreReviewsCard: React.FC<StoreReviewsCardProps> = ({
  reviews,
  isLoading = false,
  isRtl = false,
  onDeleteReview,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? "هل أنت تأكد من إزالة هذا التقييم؟" : "Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      await onDeleteReview(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-5 ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eeeee9] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm">
            ★
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1a1c19]">
              {isRtl ? "تقييمات وأكواد العملاء للمتجر" : "Store Customer Reviews"}
            </h3>
            <p className="text-[11px] text-[#707a70]">
              {isRtl ? `إجمالي التقييمات: ${reviews.length}` : `Total Reviews: ${reviews.length}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-8 flex justify-center items-center text-xs text-[#707a70]">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#005129]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {isRtl ? "جارٍ تحميل التقييمات..." : "Loading reviews..."}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#707a70] bg-[#fafaf4] rounded-xl border border-dashed border-[#e0e6df]">
          {isRtl ? "لا توجد تقييمات مسجلة لهذا المتجر حالياً." : "No reviews submitted for this store yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-[#fafaf4] border border-[#eeeee9] hover:border-[#bfc9be] rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1a1c19]">
                    {arText(rev.userName || "عميل", isRtl)}
                  </span>
                  <div className="flex items-center text-amber-500 font-extrabold text-xs">
                    {"★".repeat(Math.min(5, Math.max(1, rev.rating)))}
                    <span className="text-[11px] text-[#707a70] ml-1 font-mono">({rev.rating})</span>
                  </div>
                  {rev.createdAt && (
                    <span className="text-[10px] text-[#707a70] font-mono">
                      {arText(rev.createdAt, isRtl)}
                    </span>
                  )}
                </div>

                {rev.comment && (
                  <p className="text-xs text-[#404941] leading-relaxed">
                    {arText(rev.comment, isRtl)}
                  </p>
                )}

                {rev.flagged && (
                  <span className="inline-block text-[10px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5 font-bold w-fit mt-1">
                    {isRtl ? "مبلغ عنه: " : "Flagged: "}{arText(rev.flagReason || "غير ملائم", isRtl)}
                  </span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => handleDelete(rev.id)}
                disabled={deletingId === rev.id}
                className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-colors shrink-0 self-end md:self-center cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {deletingId === rev.id
                  ? (isRtl ? "جارٍ الحذف..." : "Deleting...")
                  : (isRtl ? "حذف التقييم" : "Delete Review")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
