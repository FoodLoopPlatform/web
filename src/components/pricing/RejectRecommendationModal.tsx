"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { AiRecommendation } from "@/app/pricing/api/types";

type RejectRecommendationModalProps = {
  open: boolean;
  onClose: () => void;
  recommendation: AiRecommendation | null;
  onConfirmReject: (id: string, reason?: string) => Promise<void>;
  isSubmitting?: boolean;
};

const PREDEFINED_REASONS = [
  "هامش الربح منخفض للغاية مقارنة بالتكلفة",
  "لدي خطة تسويقية أو عروض بديلة لهذا الصنف",
  "كمية المخزون الفعلي تختلف عن البيانات المسجلة",
  "أفضل الاحتفاظ بالسعر الحالي مؤقتًا",
];

export function RejectRecommendationModal({
  open,
  onClose,
  recommendation,
  onConfirmReject,
  isSubmitting = false,
}: RejectRecommendationModalProps) {
  const [prevOpen, setPrevOpen] = useState(open);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (!open) {
      setSelectedReason("");
      setCustomReason("");
    }
  }

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isSubmitting]);

  if (!open || !recommendation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      customReason.trim() || selectedReason || "تم الرفض بواسطة مدير المتجر";
    await onConfirmReject(recommendation.id, finalReason);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => !isSubmitting && onClose()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[540px] p-6 sm:p-8 shadow-2xl flex flex-col gap-6 text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-error-container/40 text-error flex items-center justify-center shrink-0">
              <Icon name="cancel" className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-on-surface">
                رفض توصية التسعير
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant line-clamp-1">
                {recommendation.productName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="إغلاق"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-2.5">
              ما هو سبب رفض هذه التوصية؟ (اختياري)
            </label>
            <div className="flex flex-col gap-2">
              {PREDEFINED_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setSelectedReason(reason);
                    setCustomReason("");
                  }}
                  className={`text-start px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${
                    selectedReason === reason
                      ? "border-primary bg-light-green font-bold text-primary shadow-xs"
                      : "border-outline-variant/30 text-on-surface hover:bg-surface-container-lowest"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant mb-1.5">
              أو اكتب سببًا آخر:
            </label>
            <textarea
              value={customReason}
              onChange={(e) => {
                setCustomReason(e.target.value);
                if (e.target.value) setSelectedReason("");
              }}
              placeholder="اكتب ملاحظاتك لمساعدة الذكاء الاصطناعي على تحسين التوصيات المستقبلية..."
              rows={3}
              className="w-full bg-[#ecefe8] border border-outline-variant/40 rounded-xl p-3 text-xs sm:text-sm text-on-surface outline-none focus:border-primary transition-colors resize-none placeholder:text-on-surface-variant/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-error text-white font-bold py-3 px-5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>جارٍ الرفض...</span>
                </>
              ) : (
                <>
                  <Icon name="check" className="h-4 w-4" />
                  <span>تأكيد الرفض</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-5 rounded-xl border border-outline-variant/30 text-on-surface font-medium hover:bg-surface-container-low transition-colors text-sm text-center disabled:opacity-50 cursor-pointer"
            >
              تراجع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
