import React from "react";
import { AdminDictionary } from "../constants/dictionary";

interface ModerationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: AdminDictionary;
  isRtl?: boolean;
  selectedFlagType: string;
  onSelectFlagType: (flag: string) => void;
  confidenceRange: "ALL" | "low" | "medium" | "high";
  onSelectConfidenceRange: (range: "ALL" | "low" | "medium" | "high") => void;
  onResetFilters: () => void;
}

export const ModerationFilterModal: React.FC<ModerationFilterModalProps> = ({
  isOpen,
  onClose,
  t,
  isRtl = false,
  selectedFlagType,
  onSelectFlagType,
  confidenceRange,
  onSelectConfidenceRange,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const flagOptions: { id: string; label: string }[] = [
    { id: "ALL", label: t.all },
    { id: "user_report", label: t.flagUserReport },
    { id: "unverified_origin", label: t.flagUnverifiedOrigin },
    { id: "low_ai_confidence", label: t.flagLowAiConfidence },
    { id: "duplicate_listing", label: t.flagDuplicateListing },
  ];

  const confidenceOptions: { id: "ALL" | "low" | "medium" | "high"; label: string }[] = [
    { id: "ALL", label: t.all },
    { id: "low", label: isRtl ? "ثقة منخفضة (< 50٪)" : "Low Confidence (< 50%)" },
    { id: "medium", label: isRtl ? "ثقة متوسطة (50٪ - 75٪)" : "Medium Confidence (50% - 75%)" },
    { id: "high", label: isRtl ? "ثقة مرتفعة (> 75٪)" : "High Confidence (> 75%)" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-5 min-w-[320px] sm:min-w-[440px] w-full max-w-md shrink-0 shadow-2xl flex flex-col gap-4 ${
          isRtl ? "text-right" : "text-left"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/60 pb-3">
          <h3 className="text-sm font-extrabold text-on-surface">{t.filterBtn}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface-container-high rounded-lg text-outline transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Flag Type Section */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface">
            {isRtl ? "نوع البلاغ / التنبيه" : "Flag / Report Type"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {flagOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectFlagType(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedFlagType === opt.id
                    ? "bg-primary text-on-primary shadow-2xs"
                    : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Confidence Range Section */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-on-surface">
            {isRtl ? "مستوى ثقة الذكاء الاصطناعي" : "AI Confidence Level"}
          </label>
          <div className="flex flex-col gap-1">
            {confidenceOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectConfidenceRange(opt.id)}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-start flex items-center justify-between cursor-pointer ${
                  confidenceRange === opt.id
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant"
                }`}
              >
                <span>{opt.label}</span>
                {confidenceRange === opt.id && (
                  <svg className="w-4 h-4 text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-outline-variant/60 pt-3.5 mt-1">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-bold text-error hover:underline cursor-pointer"
          >
            {isRtl ? "إعادة ضبط الفلاتر" : "Reset Filters"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-xs cursor-pointer"
          >
            {isRtl ? "تطبيق التصفية" : "Apply Filter"}
          </button>
        </div>
      </div>
    </div>
  );
};
