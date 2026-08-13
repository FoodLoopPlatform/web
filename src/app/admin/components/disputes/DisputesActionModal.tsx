import React from "react";
import { DisputeActionModalState } from "../../types/disputes.types";

interface DisputesActionModalProps {
  modalState: DisputeActionModalState;
  isRtl?: boolean;
  adminNoteInput: string;
  refundAmountInput: string;
  isSubmitting: boolean;
  onClose: () => void;
  onAdminNoteChange: (val: string) => void;
  onRefundAmountChange: (val: string) => void;
  onConfirm: () => void;
}

export const DisputesActionModal: React.FC<DisputesActionModalProps> = ({
  modalState,
  isRtl = false,
  adminNoteInput,
  refundAmountInput,
  isSubmitting,
  onClose,
  onAdminNoteChange,
  onRefundAmountChange,
  onConfirm,
}) => {
  if (!modalState.isOpen || !modalState.type) return null;

  const isDispute = modalState.itemType === "dispute";
  const isTicket = modalState.itemType === "ticket";

  const getTitle = () => {
    if (modalState.type === "RESOLVE") {
      return isTicket
        ? isRtl
          ? "إغلاق التذكرة كمحلولة"
          : "Resolve & Close Ticket"
        : isRtl
          ? "قبول النزاع وإصدار استرداد"
          : "Resolve Dispute & Issue Refund";
    }
    if (modalState.type === "REJECT") {
      return isRtl ? "رفض النزاع" : "Reject Dispute";
    }
    return isRtl ? "إغلاق التذكرة" : "Close Support Ticket";
  };

  const getButtonText = () => {
    if (modalState.type === "RESOLVE") {
      return isTicket
        ? isRtl
          ? "تأكيد الحل والإغلاق"
          : "Confirm Resolution"
        : isRtl
          ? "تأكيد الاسترداد والحل"
          : "Confirm Refund & Resolve";
    }
    if (modalState.type === "REJECT") {
      return isRtl ? "تأكيد الرفض" : "Confirm Rejection";
    }
    return isRtl ? "تأكيد الإغلاق" : "Confirm Close";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl flex flex-col gap-4">
        <h3 className="text-base font-extrabold text-on-surface">
          {getTitle()}
        </h3>
        <p className="text-xs text-outline font-medium">
          {modalState.targetTitle}
        </p>

        {isDispute && modalState.type === "RESOLVE" && (
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {isRtl ? "مبلغ الاسترداد (جنيه مصري)" : "Refund Amount (EGP)"}
            </label>
            <input
              type="number"
              value={refundAmountInput}
              onChange={(e) => onRefundAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full p-2.5 rounded-xl border border-outline-variant text-xs outline-none focus:border-primary"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-on-surface mb-1">
            {isTicket
              ? isRtl
                ? "سبب الإغلاق / ملاحظات الحل"
                : "Resolution / Closing Notes"
              : isRtl
                ? "ملاحظات الإدارة (اختياري)"
                : "Admin Notes (Optional)"}
          </label>
          <textarea
            rows={3}
            value={adminNoteInput}
            onChange={(e) => onAdminNoteChange(e.target.value)}
            placeholder={
              isRtl ? "اكتب ملاحظات الإدارة هنا..." : "Enter notes here..."
            }
            className="w-full p-2.5 rounded-xl border border-outline-variant text-xs outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-surface-container">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-bold text-outline hover:bg-surface transition-colors cursor-pointer disabled:opacity-50"
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-50 ${
              modalState.type === "REJECT"
                ? "bg-error hover:bg-error/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {isSubmitting
              ? isRtl
                ? "جاري المعالجة..."
                : "Processing..."
              : getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};
