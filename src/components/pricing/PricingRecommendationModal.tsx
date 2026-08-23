"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { AiRecommendation } from "@/app/pricing/api/types";
import { RejectRecommendationModal } from "./RejectRecommendationModal";
import { PricingProductImage } from "./PricingProductImage";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

type PricingRecommendationModalProps = {
  open: boolean;
  onClose: () => void;
  recommendation?: AiRecommendation | null;
  recommendations?: AiRecommendation[];
  onApprove?: (id: string) => Promise<boolean | void>;
  onReject?: (id: string, reason?: string) => Promise<boolean | void>;
};

export function PricingRecommendationModal({
  open,
  onClose,
  recommendation,
  recommendations,
  onApprove,
  onReject,
}: PricingRecommendationModalProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Derive active recommendation (from array if provided, otherwise single item prop)
  const activeRecommendation =
    recommendations !== undefined
      ? (recommendations[0] ?? null)
      : (recommendation ?? null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isApproving && !isRejecting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isApproving, isRejecting]);

  if (!open) return null;

  if (!activeRecommendation) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
        dir="rtl"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-white p-8 rounded-2xl w-full max-w-[480px] text-center flex flex-col items-center gap-4 shadow-xl"
        >
          <div className="h-14 w-14 rounded-2xl bg-light-green text-primary flex items-center justify-center">
            <Icon name="check_circle" className="h-7 w-7 text-primary" fill />
          </div>
          <h3 className="text-xl font-bold text-on-surface">
            تمت مراجعة كافة التوصيات!
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            لا توجد توصيات تسعير معلقة حاليًا. جميع المنتجات تم تحديث أسعارها
            بنجاح.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-primary text-white font-bold py-2.5 px-6 rounded-xl cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
          >
            تم، إغلاق النافذة
          </button>
        </div>
      </div>
    );
  }

  const handleApproveAction = async () => {
    if (!onApprove || !activeRecommendation) return;
    setIsApproving(true);
    try {
      const res = await onApprove(activeRecommendation.id);
      if (res === false) return;
      // Do not close modal; next item in `recommendations` array is automatically displayed
    } finally {
      setIsApproving(false);
    }
  };

  const handleConfirmRejectAction = async (id: string, reason?: string) => {
    if (!onReject) {
      setShowRejectModal(false);
      return;
    }
    setIsRejecting(true);
    try {
      const res = await onReject(id, reason);
      if (res === false) return;
      setShowRejectModal(false);
      // Do not close modal; next item in `recommendations` array is automatically displayed
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !isApproving && onClose()}
        dir="rtl"
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-white flex flex-col sm:flex-row w-full max-w-[700px] rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Product Image */}
          <div className="relative shrink-0 w-full sm:w-72 h-48 sm:h-auto min-h-48 bg-[#ecefe8] flex items-center justify-center">
            <PricingProductImage
              key={activeRecommendation.id}
              src={activeRecommendation.productImageUrl}
              alt={activeRecommendation.productName}
              sizes="300px"
              containerClassName="absolute inset-0 w-full h-full flex items-center justify-center bg-[#ecefe8]"
              iconClassName="h-16 w-16 text-primary/40"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-linear-to-t from-black/80 via-black/40 to-transparent px-6 pb-5 pt-7 z-10">
              <span className="self-start rounded-full bg-[#633d00] px-3.5 py-1 text-[11px] font-bold text-[#dfa964]">
                {activeRecommendation.riskLevel === "Critical"
                  ? "أولوية قصوى: اقتراب الصلاحية"
                  : "توصية تسعير ذكي"}
              </span>
              <h3 className="pt-1 text-lg sm:text-xl font-bold text-white truncate">
                {activeRecommendation.productName}
              </h3>
              <span className="text-xs text-white/80">
                المخزون المعرض: {activeRecommendation.quantityAvailable} قطعة
              </span>
            </div>
          </div>

          {/* Content & Actions */}
          <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 gap-6">
            <div className="flex flex-col gap-5">
              <div className="relative">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isApproving}
                  aria-label="إغلاق"
                  className="absolute top-0 left-0 p-1 rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="block text-xs font-bold tracking-wide text-on-surface-variant">
                    اقتراح التسعير الديناميكي
                  </span>
                  {recommendations && recommendations.length > 1 && (
                    <span className="bg-light-green text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20">
                      متبقي {recommendations.length}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2.5 flex-wrap">
                  <span
                    dir="ltr"
                    className="font-data-mono text-xl text-on-surface-variant/40 line-through"
                  >
                    {formatEGP(
                      activeRecommendation.currentPrice ||
                        activeRecommendation.originalPrice,
                    )}
                  </span>
                  <Icon
                    name="arrow_back"
                    className="h-4 w-4 text-on-surface-variant shrink-0"
                  />
                  <span
                    dir="ltr"
                    className="font-data-mono text-2xl font-bold text-[#633d00]"
                  >
                    {formatEGP(activeRecommendation.recommendedPrice)}
                  </span>
                  <span
                    dir="ltr"
                    className="rounded-lg bg-[#98f3b0] px-2 py-0.5 text-xs font-bold text-[#0b723c]"
                  >
                    -{activeRecommendation.discountPercentage}%
                  </span>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="flex flex-col gap-2 rounded-xl border-s-4 border-[#633d00] bg-light-green ps-5 pe-4 py-4 w-full text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Icon
                    name="auto_awesome"
                    className="h-4 w-4 text-[#633d00]"
                    fill
                  />
                  <span className="font-bold text-on-surface">
                    رؤية الذكاء الاصطناعي (
                    {Math.round(
                      (activeRecommendation.confidence || 0.9) * 100,
                    )}
                    % ثقة)
                  </span>
                </div>
                <p className="text-on-surface-variant leading-relaxed">
                  {activeRecommendation.reason}
                </p>
                {activeRecommendation.actionReason && (
                  <p className="text-[11px] text-on-surface-variant/70 pt-1 border-t border-[#633d00]/10">
                    {activeRecommendation.actionReason}
                  </p>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={handleApproveAction}
                disabled={isApproving}
                className="flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 text-sm shadow-xs"
              >
                {isApproving ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>جارٍ التطبيق...</span>
                  </>
                ) : (
                  <>
                    <Icon name="check_circle" className="h-4.5 w-4.5" />
                    <span>الموافقة على التوصية وتطبيق السعر</span>
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  disabled={isApproving}
                  className="flex-1 text-error font-bold py-2.5 cursor-pointer hover:bg-error-container/20 rounded-xl transition-colors border border-error/30 text-center text-xs sm:text-sm"
                >
                  رفض التوصية
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isApproving}
                  className="flex-1 text-on-surface-variant font-medium py-2.5 cursor-pointer hover:bg-surface-container-low rounded-xl transition-colors border border-outline-variant/30 text-center text-xs sm:text-sm"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RejectRecommendationModal
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        recommendation={activeRecommendation}
        onConfirmReject={handleConfirmRejectAction}
        isSubmitting={isRejecting}
      />
    </>
  );
}
