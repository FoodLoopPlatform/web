import React from "react";
import { UserDetail } from "../../api/user-detail-api";
import { ConfirmationModal } from "../common/ConfirmationModal";

interface UserDetailConfirmationModalsProps {
  user: UserDetail;
  confirmModal: {
    isOpen: boolean;
    action: "suspend" | "ban" | "approve" | "reject" | "reactivate" | null;
  };
  isRtl: boolean;
  onClose: () => void;
  onApprove: (reason?: string) => void;
  onSuspend: (reason?: string) => void;
  onReactivate: (reason?: string) => void;
  onBan: () => void;
}

export const UserDetailConfirmationModals: React.FC<
  UserDetailConfirmationModalsProps
> = ({
  user,
  confirmModal,
  isRtl,
  onClose,
  onApprove,
  onSuspend,
  onReactivate,
  onBan,
}) => {
  return (
    <>
      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.action === "approve"}
        title={isRtl ? "توثيق واعتماد الطلب" : "Approve & Verify Application"}
        message={
          isRtl
            ? `هل ترغب في اعتماد وتوثيق حساب ${user.name}؟ يمكنك كتابة ملاحظات التوثيق أدناه.`
            : `Are you sure you want to approve & verify ${user.name}? You can add verification notes below.`
        }
        confirmLabel={isRtl ? "تأكيد التوثيق والاعتماد" : "Confirm Approval"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="success"
        showReasonInput={true}
        reasonPlaceholder={
          isRtl
            ? "أدخل ملاحظات الاعتماد (مثلاً: المستندات مكتملة ومطابقة)..."
            : "Enter verification notes..."
        }
        presetReasons={
          isRtl
            ? [
                "مستندات مكتملة وموثقة",
                "تم التحقق من السجل التجاري",
                "استيفاء شروط التسجيل",
              ]
            : [
                "Documents complete & verified",
                "Tax ID & License checked",
                "All requirements met",
              ]
        }
        isRtl={isRtl}
        onConfirm={onApprove}
        onClose={onClose}
      />

      <ConfirmationModal
        isOpen={
          confirmModal.isOpen &&
          (confirmModal.action === "reject" ||
            confirmModal.action === "suspend")
        }
        title={
          confirmModal.action === "reject"
            ? isRtl
              ? "رفض طلب التوثيق"
              : "Reject Verification Application"
            : isRtl
              ? "تأكيد تعطيل الحساب"
              : "Confirm Account Suspension"
        }
        message={
          isRtl
            ? `سيتم تعطيل حساب ${user.name} مؤقتاً. يرجى توضيح سبب الرفض/التعطيل لتسجيله بالمنظومة.`
            : `Account access for ${user.name} will be suspended. Please provide the reason below.`
        }
        confirmLabel={isRtl ? "تأكيد الإجراء والتعطيل" : "Confirm Suspension"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="warning"
        showReasonInput={true}
        reasonPlaceholder={
          isRtl
            ? "اكتب سبب رفض التوثيق أو تعليق الحساب..."
            : "Write the reason for rejection/suspension..."
        }
        presetReasons={
          isRtl
            ? [
                "مستندات غير واضحة",
                "سجل تجاري منتهي",
                "بيانات غير مطابقة للموقع",
                "مخالفة سياسات المنصة",
              ]
            : [
                "Unclear/unreadable documents",
                "Expired commercial registration",
                "Information mismatch",
                "Policy violation",
              ]
        }
        isRtl={isRtl}
        onConfirm={onSuspend}
        onClose={onClose}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.action === "reactivate"}
        title={isRtl ? "إعادة تنشيط الحساب" : "Reactivate Account"}
        message={
          isRtl
            ? `إعادة تنشيط حساب ${user.name} وإتاحة الوصول الكامل للمنصة.`
            : `Restore full access for ${user.name}.`
        }
        confirmLabel={isRtl ? "إعادة التنشيط" : "Reactivate"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="default"
        showReasonInput={true}
        reasonPlaceholder={
          isRtl ? "سبب إعادة التنشيط..." : "Reason for reactivation..."
        }
        presetReasons={
          isRtl
            ? [
                "استيفاء المستندات المطلوبة",
                "حل الخلاف بنجاح",
                "انتهاء فترة التعليق",
              ]
            : [
                "Requirements completed",
                "Dispute resolved",
                "Suspension period ended",
              ]
        }
        isRtl={isRtl}
        onConfirm={onReactivate}
        onClose={onClose}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen && confirmModal.action === "ban"}
        title={isRtl ? "تأكيد الحظر النهائي" : "Confirm Permanent Ban"}
        message={
          isRtl
            ? `هل أنت متأكد من حظر ${user.name} نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.`
            : `Are you sure you want to permanently ban ${user.name}? This action is irreversible.`
        }
        confirmLabel={isRtl ? "حظر دائم" : "Permanently Ban"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="danger"
        showReasonInput={true}
        reasonPlaceholder={
          isRtl ? "سبب الحظر النهائي..." : "Reason for permanent ban..."
        }
        presetReasons={
          isRtl
            ? [
                "احتيال تجاري",
                "مخالفات جسيمة ومكررة",
                "التزوير وإنشاء حسابات وهمية",
              ]
            : [
                "Fraudulent activity",
                "Severe repeated violations",
                "Identity theft / fake account",
              ]
        }
        isRtl={isRtl}
        onConfirm={onBan}
        onClose={onClose}
      />
    </>
  );
};
