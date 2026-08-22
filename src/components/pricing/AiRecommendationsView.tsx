"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type {
  AiRecommendation,
  AiRecommendationsSchedule,
} from "@/app/pricing/api/types";
import { RejectRecommendationModal } from "./RejectRecommendationModal";
import { PricingProductImage } from "./PricingProductImage";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

function getRiskBadge(riskLevel: string) {
  const normalized = riskLevel?.toLowerCase() || "low";
  if (normalized.includes("crit")) {
    return {
      label: "خطورة حرجة: اقتراب الصلاحية",
      className: "bg-error-container text-on-error-container border-error/30",
    };
  }
  if (normalized.includes("high")) {
    return {
      label: "أولوية مرتفعة: ركود المخزون",
      className: "bg-amber-100 text-amber-900 border-amber-300",
    };
  }
  if (normalized.includes("med")) {
    return {
      label: "أولوية متوسطة: تحسين الهامش",
      className: "bg-blue-100 text-blue-900 border-blue-300",
    };
  }
  return {
    label: "توصية ذكية اعتيادية",
    className: "bg-emerald-100 text-emerald-900 border-emerald-300",
  };
}

type AiRecommendationsViewProps = {
  recommendations: AiRecommendation[];
  schedule?: AiRecommendationsSchedule | null;
  isLoading?: boolean;
  onApprove: (id: string) => Promise<boolean | void>;
  onReject: (id: string, reason?: string) => Promise<boolean | void>;
  onRefresh?: () => void;
};

export function AiRecommendationsView({
  recommendations = [],
  schedule,
  isLoading = false,
  onApprove,
  onReject,
  onRefresh,
}: AiRecommendationsViewProps) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingRecommendation, setRejectingRecommendation] =
    useState<AiRecommendation | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async (id: string) => {
    if (approvingId) return;
    setApprovingId(id);
    try {
      await onApprove(id);
    } finally {
      setApprovingId(null);
    }
  };

  const handleConfirmReject = async (id: string, reason?: string) => {
    setIsRejecting(true);
    try {
      await onReject(id, reason);
      setRejectingRecommendation(null);
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6" dir="rtl">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="bg-white border border-outline-variant/30 rounded-2xl p-6 flex flex-col gap-4 animate-pulse shadow-xs"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-outline-variant/30 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-5 w-48 bg-outline-variant/30 rounded" />
                  <div className="h-4 w-28 bg-outline-variant/20 rounded" />
                </div>
              </div>
              <div className="h-16 bg-outline-variant/20 rounded-xl" />
              <div className="h-10 bg-outline-variant/30 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <section
        className="bg-white border border-outline-variant/30 rounded-2xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center gap-6"
        dir="rtl"
      >
        <div className="relative">
          <div className="h-20 w-20 rounded-3xl bg-light-green text-primary flex items-center justify-center shadow-sm">
            <Icon name="auto_awesome" className="h-10 w-10 text-primary" fill />
          </div>
          <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white shadow-xs">
            <Icon name="check" className="h-4 w-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
            لا توجد توصيات تسعير معلقة حاليًا
          </h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            جميع منتجات متجرك مُسعّرة بكفاءة وفقًا لآخر قراءات الطلب وتواريخ
            الصلاحية. محرك الذكاء الاصطناعي يفحص حركة المخزون بشكل مستمر
            وسيقترح خصومات وتعديلات ديناميكية عند الحاجة.
          </p>
        </div>

        {/* Schedule Info Box */}
        <div className="bg-light-green/60 border border-outline-variant/30 rounded-xl p-4 sm:p-5 w-full flex items-center justify-between gap-4 text-start">
          <div className="flex items-center gap-3">
            <Icon name="schedule" className="h-6 w-6 text-primary shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">
                وضع الأتمتة المعتمد
              </span>
              <span className="text-xs text-on-surface-variant">
                {schedule?.automationMode === "Autonomous"
                  ? "تسعير مستقل بالكامل (تطبيق آلي)"
                  : schedule?.automationMode === "Assisted"
                    ? "تسعير بمساعدة (اقتراح واعتماد بنقرة)"
                    : "تسعير يدوي (اقتراح وتطبيق يدوي)"}
              </span>
            </div>
          </div>
          <Link
            href="/pricing/automation-settings"
            className="text-xs font-bold text-primary hover:underline shrink-0"
          >
            تعديل الإعدادات
          </Link>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 text-xs font-bold text-primary bg-light-green hover:bg-light-green/80 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Icon name="refresh" className="h-3.5 w-3.5" />
            <span>إعادة الفحص الآن</span>
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6" dir="rtl">
      {/* Header Info */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-white border border-outline-variant/30 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-light-green text-primary flex items-center justify-center shrink-0">
            <Icon name="bolt" className="h-5 w-5" fill />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-on-surface">
                توصيات التسعير المقترحة من الذكاء الاصطناعي
              </h2>
              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {recommendations.length} معلقة
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">
              راجع التوصيات المخصصة لمتجرك بناءً على سرعة البيع وتواريخ اقتراب
              الصلاحية.
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface bg-surface-container-high hover:bg-surface-container-highest px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Icon name="refresh" className="h-4 w-4" />
            <span>تحديث التوصيات</span>
          </button>
        )}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendations.map((rec) => {
          const risk = getRiskBadge(rec.riskLevel);
          const confidencePercent = Math.round((rec.confidence || 0.9) * 100);
          const isApproving = approvingId === rec.id;

          return (
            <div
              key={rec.id}
              className="bg-white border border-outline-variant/30 rounded-2xl sm:rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between gap-6"
            >
              {/* Card Top: Product Info & Badges */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full border ${risk.className}`}
                  >
                    {risk.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-light-green px-2.5 py-1 rounded-full border border-primary/20">
                    <Icon name="auto_awesome" className="h-3 w-3" fill />
                    <span>{confidencePercent}% ثقة الذكاء الاصطناعي</span>
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <PricingProductImage
                    src={rec.productImageUrl}
                    alt={rec.productName}
                    sizes="(max-width: 640px) 64px, 80px"
                    containerClassName="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative flex items-center justify-center"
                    iconClassName="h-8 w-8 text-primary/40"
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-on-surface truncate">
                      {rec.productName}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant flex-wrap">
                      <span>المخزون المعرض: {rec.quantityAvailable} قطعة</span>
                      {rec.expirationDate && (
                        <span>
                          الصلاحية:{" "}
                          {new Date(rec.expirationDate).toLocaleDateString(
                            "ar-EG",
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Shift Display */}
                <div className="bg-[#f7f9f4] border border-outline-variant/20 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-on-surface-variant">
                      السعر الحالي
                    </span>
                    <span
                      dir="ltr"
                      className="font-data-mono text-base text-on-surface-variant/70 line-through"
                    >
                      {formatEGP(rec.currentPrice || rec.originalPrice)}
                    </span>
                  </div>

                  <Icon
                    name="arrow_back"
                    className="h-4 w-4 text-on-surface-variant/50 hidden sm:block shrink-0"
                  />

                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-primary">
                      السعر المقترح الجديد
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        dir="ltr"
                        className="font-data-mono text-xl sm:text-2xl font-bold text-primary"
                      >
                        {formatEGP(rec.recommendedPrice)}
                      </span>
                      <span
                        dir="ltr"
                        className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800"
                      >
                        -{rec.discountPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-xs text-on-surface-variant ms-auto sm:ms-0">
                    <span className="text-[11px] font-semibold text-emerald-700">
                      وفر للمشتري: {formatEGP(rec.discountAmount)}
                    </span>
                  </div>
                </div>

                {/* AI Rationale / Reasoning Box */}
                <div className="bg-light-green/70 border-r-4 border-primary rounded-xl p-4 flex flex-col gap-1.5 text-xs sm:text-sm text-on-surface">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <Icon name="insights" className="h-4 w-4" />
                    <span>تحليل وتوصية النظام:</span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    {rec.reason}
                  </p>
                  {rec.actionReason && (
                    <p className="text-[11px] text-on-surface-variant/80 pt-1 border-t border-primary/10">
                      {rec.actionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleApprove(rec.id)}
                  disabled={isApproving || isRejecting}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {isApproving ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      <span>جارٍ الاعتماد والتطبيق...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="check_circle" className="h-4.5 w-4.5" fill />
                      <span>اعتماد وتطبيق السعر</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRejectingRecommendation(rec)}
                  disabled={isApproving || isRejecting}
                  className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-outline-variant/40 text-on-surface-variant hover:text-error hover:border-error/40 hover:bg-error-container/20 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="close" className="h-4 w-4" />
                  <span>رفض</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reject Reason Modal */}
      <RejectRecommendationModal
        open={Boolean(rejectingRecommendation)}
        onClose={() => setRejectingRecommendation(null)}
        recommendation={rejectingRecommendation}
        onConfirmReject={handleConfirmReject}
        isSubmitting={isRejecting}
      />
    </section>
  );
}
