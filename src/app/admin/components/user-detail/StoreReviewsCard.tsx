"use client";

import React, { useState } from "react";
import { Review } from "../../types/admin.types";
import { arText } from "../../constants/arabic-mapper";
import { TrashIcon, SpinnerIcon } from "@/components/icons";
import { Pagination } from "../common/Pagination";
import { ConfirmationModal } from "../common/ConfirmationModal";

interface StoreReviewsCardProps {
  reviews: Review[];
  isLoading?: boolean;
  isRtl?: boolean;
  onDeleteReview: (reviewId: string) => Promise<void>;
}

const PAGE_SIZE = 5;

export const StoreReviewsCard: React.FC<StoreReviewsCardProps> = ({
  reviews,
  isLoading = false,
  isRtl = false,
  onDeleteReview,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteReview, setPendingDeleteReview] = useState<Review | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset pagination when reviews list changes
  const [prevReviewsLength, setPrevReviewsLength] = useState(reviews.length);
  if (prevReviewsLength !== reviews.length) {
    setPrevReviewsLength(reviews.length);
    setCurrentPage(1);
  }

  const confirmDelete = async () => {
    if (!pendingDeleteReview) return;
    const targetId = pendingDeleteReview.id;
    setPendingDeleteReview(null);
    setDeletingId(targetId);
    try {
      await onDeleteReview(targetId);
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE) || 1;
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            {paginatedReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-surface border border-surface-container hover:border-outline-variant/80 rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:shadow-2xs"
              >
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <span className="text-xs font-extrabold text-on-surface">
                      {arText(rev.userName || "عميل", isRtl)}
                    </span>

                    {/* Rating Pill */}
                    <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full text-amber-700 font-extrabold text-xs">
                      <span>
                        {"★".repeat(Math.min(5, Math.max(1, rev.rating)))}
                      </span>
                      <span className="text-[11px] font-mono text-amber-900 ms-0.5">
                        ({rev.rating})
                      </span>
                    </div>

                    {rev.createdAt && (
                      <span className="text-[10px] text-outline font-mono bg-white border border-outline-variant/40 px-2 py-0.5 rounded-md">
                        {arText(rev.createdAt, isRtl)}
                      </span>
                    )}
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
                      {arText(rev.comment, isRtl)}
                    </p>
                  )}

                  {rev.flagged && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 border border-red-200/80 rounded-lg px-2.5 py-1 font-bold w-fit mt-0.5">
                      <span>{isRtl ? "مبلغ عنه:" : "Flagged:"}</span>
                      <span>
                        {arText(rev.flagReason || "غير ملائم", isRtl)}
                      </span>
                    </span>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() => setPendingDeleteReview(rev)}
                  disabled={deletingId === rev.id}
                  className="px-3 py-1.5 text-xs font-extrabold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 rounded-xl transition-all shrink-0 self-start sm:self-center cursor-pointer disabled:opacity-50 flex items-center gap-1.5 active:scale-95 shadow-2xs"
                >
                  {deletingId === rev.id ? (
                    <SpinnerIcon className="w-3.5 h-3.5 animate-spin text-red-600" />
                  ) : (
                    <TrashIcon className="w-3.5 h-3.5 text-red-600" />
                  )}
                  <span>
                    {deletingId === rev.id
                      ? isRtl
                        ? "جارٍ الحذف..."
                        : "Deleting..."
                      : isRtl
                        ? "حذف التقييم"
                        : "Delete Review"}
                  </span>
                </button>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={reviews.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            isRtl={isRtl}
          />
        </div>
      )}

      {/* Styled Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!pendingDeleteReview}
        title={isRtl ? "حذف التقييم" : "Delete Review"}
        message={
          isRtl
            ? `هل أنت تأكد من إزالة هذا التقييم الصادر من (${pendingDeleteReview?.userName || "عميل"})؟ لا يمكن التراجع عن هذا الإجراء.`
            : `Are you sure you want to delete this review by (${pendingDeleteReview?.userName || "Customer"})? This action cannot be undone.`
        }
        confirmLabel={isRtl ? "تأكيد الحذف" : "Confirm Delete"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="danger"
        isRtl={isRtl}
        onConfirm={confirmDelete}
        onClose={() => setPendingDeleteReview(null)}
      />
    </div>
  );
};
