import React from "react";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/icons";

interface PlatformActionsPanelProps {
  userId: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  isRtl?: boolean;
  onSuspend: () => void;
  onBan: () => void;
  onReactivate: () => void;
}

export const PlatformActionsPanel: React.FC<PlatformActionsPanelProps> = ({
  status,
  isRtl = false,
  onSuspend,
  onBan,
  onReactivate,
}) => {
  const isActive = status === "ACTIVE";
  const isSuspended = status === "SUSPENDED";

  const renderActionRow = (
    icon: React.ReactNode,
    label: string,
    sublabel: string,
    onClick: () => void,
    disabled?: boolean,
    variant: "default" | "danger" | "muted" = "default",
  ) => {
    const colorMap = {
      default: "text-on-surface hover:bg-surface-container",
      danger: "text-error hover:bg-error/10",
      muted: "text-outline-variant cursor-not-allowed",
    };

    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${colorMap[variant]} ${isRtl ? "text-right" : "text-left"}`}
      >
        <span className="shrink-0">{icon}</span>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold">{label}</span>
          <span className="text-[10px] text-outline">{sublabel}</span>
        </div>
      </button>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-1 ${isRtl ? "text-right" : "text-left"}`}
    >
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">
        {isRtl ? "إجراءات المنصة" : "Platform Actions"}
      </h3>

      {renderActionRow(
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>,
        isRtl ? "تعطيل الحساب" : "Suspend Account",
        isRtl
          ? "إيقاف مؤقت لنشاط المستخدم"
          : "Temporarily restrict user activity",
        onSuspend,
        isSuspended,
        "default",
      )}

      {renderActionRow(
        <AlertCircleIcon className="w-5 h-5 text-error" />,
        isRtl ? "حظر نهائي للمستخدم" : "Ban User Permanently",
        isRtl
          ? "إجراء لا يمكن عكسه — يتطلب تأكيد"
          : "Irreversible action — requires confirmation",
        onBan,
        false,
        "danger",
      )}

      {renderActionRow(
        <CheckCircleIcon
          className={`w-5 h-5 ${isActive ? "text-outline-variant" : "text-green-600"}`}
        />,
        isRtl ? "إعادة تنشيط" : "Reactivate",
        isActive
          ? isRtl
            ? "الحساب نشط بالفعل"
            : "Already Active"
          : isRtl
            ? "استعادة وصول المستخدم"
            : "Restore user access",
        onReactivate,
        isActive,
        isActive ? "muted" : "default",
      )}
    </div>
  );
};
