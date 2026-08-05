import React from "react";

interface PlatformActionsPanelProps {
  userId: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  isRtl?: boolean;
  onSuspend: () => void;
  onBan: () => void;
  onReactivate: () => void;
}

interface ActionRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger" | "muted";
  isRtl: boolean;
}

const ActionRow: React.FC<ActionRowProps> = ({ icon, label, sublabel, onClick, disabled, variant = "default", isRtl }) => {
  const colorMap = {
    default: "text-[#1a1c19] hover:bg-[#eeeee9]",
    danger: "text-red-600 hover:bg-red-50",
    muted: "text-[#bfc9be] cursor-not-allowed",
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
        <span className="text-[10px] text-[#707a70]">{sublabel}</span>
      </div>
    </button>
  );
};

export const PlatformActionsPanel: React.FC<PlatformActionsPanelProps> = ({
  status,
  isRtl = false,
  onSuspend,
  onBan,
  onReactivate,
}) => {
  const isActive = status === "ACTIVE";
  const isSuspended = status === "SUSPENDED";

  return (
    <div className={`bg-white rounded-2xl border border-[#e0e6df] p-5 shadow-sm flex flex-col gap-1 ${isRtl ? "text-right" : "text-left"}`}>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#707a70] mb-2">
        {isRtl ? "إجراءات المنصة" : "Platform Actions"}
      </h3>

      <ActionRow
        isRtl={isRtl}
        variant="default"
        onClick={onSuspend}
        disabled={isSuspended}
        label={isRtl ? "تعطيل الحساب" : "Suspend Account"}
        sublabel={isRtl ? "إيقاف مؤقت لنشاط المستخدم" : "Temporarily restrict user activity"}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        }
      />

      <ActionRow
        isRtl={isRtl}
        variant="danger"
        onClick={onBan}
        label={isRtl ? "حظر نهائي للمستخدم" : "Ban User Permanently"}
        sublabel={isRtl ? "إجراء لا يمكن عكسه — يتطلب تأكيد" : "Irreversible action — requires confirmation"}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      />

      <ActionRow
        isRtl={isRtl}
        variant={isActive ? "muted" : "default"}
        onClick={onReactivate}
        disabled={isActive}
        label={isRtl ? "إعادة تنشيط" : "Reactivate"}
        sublabel={isActive ? (isRtl ? "الحساب نشط بالفعل" : "Already Active") : (isRtl ? "استعادة وصول المستخدم" : "Restore user access")}
        icon={
          <svg className={`w-5 h-5 ${isActive ? "text-[#bfc9be]" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
};
