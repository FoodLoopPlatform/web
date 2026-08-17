import React, { useState } from "react";
import type { Dispute, ResolveStoreDisputePayload } from "@/app/disputes/types";
import { CloseIcon } from "@/components/icons";
import { Icon } from "@/components/ui/icon";

interface DisputeDetailDrawerProps {
  dispute: Dispute | null;
  onCloseDrawer: () => void;
  onResolveDispute?: (
    id: string,
    payload: ResolveStoreDisputePayload,
  ) => Promise<{ success: boolean; error?: string }>;
}

const raisedByTypeLabel: Record<string, string> = {
  Consumer: "مستهلك",
  Store: "متجر شريك",
  Charity: "جمعية خيرية",
};

export const DisputeDetailDrawer: React.FC<DisputeDetailDrawerProps> = ({
  dispute,
  onCloseDrawer,
  onResolveDispute,
}) => {
  const [isResolving, setIsResolving] = useState(false);
  const [merchantNote, setMerchantNote] = useState("");
  const [refundAmount, setRefundAmount] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  if (!dispute) return null;

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantNote.trim()) {
      setFormError("يرجى كتابة ملاحظة أو تفاصيل حل النزاع.");
      return;
    }

    setFormError(null);
    setIsResolving(true);

    const payload: ResolveStoreDisputePayload = {
      merchantNote: merchantNote.trim(),
      refundAmount:
        refundAmount && !isNaN(Number(refundAmount)) && Number(refundAmount) > 0
          ? Number(refundAmount)
          : undefined,
    };

    if (onResolveDispute) {
      const res = await onResolveDispute(dispute.id, payload);
      if (!res.success) {
        setFormError(res.error || "فشل حل النزاع. يرجى المحاولة مرة أخرى.");
        setIsResolving(false);
        return;
      }
    }

    setIsResolving(false);
    setMerchantNote("");
    setRefundAmount("");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCloseDrawer}
        className="fixed inset-0 z-[9998] bg-black/55"
      />

      {/* Drawer Panel */}
      <div
        dir="rtl"
        className="fixed top-0 bottom-0 left-0 z-[9999] w-[92vw] sm:w-[580px] shrink-0 bg-white shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto gap-6 animate-in slide-in-from-left duration-250 select-none"
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-container pb-4">
            <div className="flex flex-col">
              <span className="text-xs uppercase font-bold text-outline tracking-wider">
                تفاصيل النزاع
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-on-surface mt-1 font-mono">
                {dispute.id}
              </h3>
            </div>
            <button
              onClick={onCloseDrawer}
              className="p-2 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer transition-colors"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Metadata Card */}
          <div className="bg-surface p-5 rounded-2xl border border-card-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="person" className="w-5 h-5 text-primary" />
                <span className="text-sm sm:text-base font-bold text-on-surface">
                  {dispute.raisedByName}
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  dispute.isResolved
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                {dispute.isResolved ? "تم حله" : "قيد المراجعة"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs sm:text-sm text-outline pt-1">
              <span>
                نوع الحساب:{" "}
                <span className="font-semibold text-on-surface">
                  {raisedByTypeLabel[dispute.raisedByType || "Consumer"]}
                </span>
              </span>
              {dispute.orderId && (
                <span className="font-mono font-semibold">
                  طلب رقم: {dispute.orderId.slice(0, 8).toUpperCase()}
                </span>
              )}
            </div>
            {dispute.productTitle && (
              <div className="text-xs sm:text-sm text-on-surface font-bold pt-2 border-t border-card-border flex items-center gap-1.5">
                <Icon name="shopping_bag" className="w-4 h-4 text-primary" />
                <span>المنتج: {dispute.productTitle}</span>
              </div>
            )}
          </div>

          {/* Reason / Description */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-outline uppercase">
              سبب النزاع
            </h4>
            <div className="p-4 bg-surface rounded-2xl border border-surface-container text-sm sm:text-base text-on-surface leading-relaxed font-medium">
              {dispute.reason || "—"}
            </div>
          </div>

          {/* Additional Details */}
          {dispute.details && dispute.details !== dispute.reason && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-outline uppercase">
                تفاصيل إضافية من العميل
              </h4>
              <div className="p-4 bg-surface rounded-2xl border border-surface-container text-sm sm:text-base text-on-surface-variant leading-relaxed font-medium">
                {dispute.details}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-3.5 rounded-xl border border-surface-container">
              <h4 className="text-xs font-extrabold text-outline uppercase mb-1">
                تاريخ الإنشاء
              </h4>
              <p className="text-xs sm:text-sm text-on-surface font-bold font-data-mono">
                {new Date(dispute.createdAt).toLocaleString("ar-EG", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {dispute.resolvedAt && (
              <div className="bg-surface p-3.5 rounded-xl border border-surface-container">
                <h4 className="text-xs font-extrabold text-outline uppercase mb-1">
                  تاريخ الحل
                </h4>
                <p className="text-xs sm:text-sm text-green-800 font-bold font-data-mono">
                  {new Date(dispute.resolvedAt).toLocaleString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Admin / Merchant Resolution Note */}
          {dispute.adminNote && (
            <div className="flex flex-col gap-2">
              <h4 className="text-xs sm:text-sm font-extrabold text-outline uppercase">
                ملاحظة وإجراء الحل
              </h4>
              <div className="p-4 rounded-2xl text-sm sm:text-base flex flex-col gap-1 bg-primary-fixed/30 border border-primary-fixed">
                <p className="text-on-surface leading-relaxed font-medium">
                  {dispute.adminNote}
                </p>
              </div>
            </div>
          )}

          {/* Resolution Form for Unresolved Disputes */}
          {!dispute.isResolved && onResolveDispute && (
            <form
              onSubmit={handleResolveSubmit}
              className="p-5 bg-light-green rounded-2xl border border-outline-variant flex flex-col gap-4 mt-2"
            >
              <div className="flex items-center gap-2">
                <Icon name="gavel" className="w-5 h-5 text-primary" />
                <h4 className="text-sm font-extrabold text-primary uppercase">
                  حل النزاع كمتجر
                </h4>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-rose-100 text-rose-800 text-xs sm:text-sm font-bold">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-on-surface">
                  ملاحظة وتوضيح التاجر <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={merchantNote}
                  onChange={(e) => setMerchantNote(e.target.value)}
                  placeholder="اكتب تفاصيل وإجراء حل النزاع للعميل والإدارة..."
                  className="w-full p-3 text-sm rounded-xl border border-outline-variant bg-white text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-bold text-on-surface">
                  مبلغ التعويض / الاسترداد للعميل (اختياري - ج.م)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="مثال: 50.00"
                  className="w-full p-2.5 text-sm rounded-xl border border-outline-variant bg-white text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isResolving || !merchantNote.trim()}
                className="mt-2 py-3 px-5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                {isResolving ? (
                  <>
                    <Icon name="refresh" className="w-5 h-5 animate-spin" />
                    <span>جاري تأكيد الحل...</span>
                  </>
                ) : (
                  <>
                    <Icon
                      name="check_circle"
                      className="w-5 h-5 text-emerald-300"
                    />
                    <span>تأكيد حل النزاع</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-surface-container pt-4 mt-4">
          <button
            onClick={onCloseDrawer}
            className="px-5 py-2.5 text-sm font-bold text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </>
  );
};
