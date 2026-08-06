import React, { useState } from "react";
import { Review } from "../types/admin.types";
import { arText } from "../constants/arabic-mapper";
import { TrashIcon, SpinnerIcon } from "@/components/icons";

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
    if (
      !confirm(
        isRtl
          ? "هل أنت تأكد من إزالة هذا التقييم؟"
          : "Are you sure you want to delete this review?",
      )
    )
      return;
    setDeletingId(id);
    try {
      await onDeleteReview(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-5 ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm">
            ★
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-on-surface">
              {isRtl
                ? "تقييمات وأكواد العملاء للمتجر"
                : "Store Customer Reviews"}
            </h3>
            <p className="text-[11px] text-outline">
              {isRtl
                ? `إجمالي التقييمات: ${reviews.length}`
                : `Total Reviews: ${reviews.length}`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-8 flex justify-center items-center text-xs text-outline gap-2">
          <SpinnerIcon className="animate-spin h-4 w-4 text-primary-container" />
          {isRtl ? "جارٍ تحميل التقييمات..." : "Loading reviews..."}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-8 text-center text-xs text-outline bg-surface rounded-xl border border-dashed border-card-border">
          {isRtl
            ? "لا توجد تقييمات مسجلة لهذا المتجر حالياً."
            : "No reviews submitted for this store yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 bg-surface border border-surface-container hover:border-outline-variant rounded-xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-on-surface">
                    {arText(rev.userName || "عميل", isRtl)}
                  </span>
                  <div className="flex items-center text-amber-500 font-extrabold text-xs">
                    {"★".repeat(Math.min(5, Math.max(1, rev.rating)))}
                    <span className="text-[11px] text-outline ml-1 font-mono">
                      ({rev.rating})
                    </span>
                  </div>
                  {rev.createdAt && (
                    <span className="text-[10px] text-outline font-mono">
                      {arText(rev.createdAt, isRtl)}
                    </span>
                  )}
                </div>

                {rev.comment && (
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {arText(rev.comment, isRtl)}
                  </p>
                )}

                {rev.flagged && (
                  <span className="inline-block text-[10px] text-red-600 bg-red-50 border border-red-200 rounded px-2 py-0.5 font-bold w-fit mt-1">
                    {isRtl ? "مبلغ عنه: " : "Flagged: "}
                    {arText(rev.flagReason || "غير ملائم", isRtl)}
                  </span>
                )}
              </div>

              {/* Action */}
              <button
                onClick={() => handleDelete(rev.id)}
                disabled={deletingId === rev.id}
                className="px-3 py-1.5 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl transition-colors shrink-0 self-end md:self-center cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {deletingId === rev.id ? (
                  <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-red-600" />
                ) : (
                  <TrashIcon className="w-3.5 h-3.5 text-red-600" />
                )}
                {deletingId === rev.id
                  ? isRtl
                    ? "جارٍ الحذف..."
                    : "Deleting..."
                  : isRtl
                    ? "حذف التقييم"
                    : "Delete Review"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
