"use client";

import React from "react";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/icons";
import { ADMIN_DESIGN_TOKENS } from "../../constants/design-tokens";

interface PlatformActionsPanelProps {
  userId: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING" | "BANNED";
  isRtl?: boolean;
  onSuspend: () => void;
  onBan: () => void;
  onReactivate: () => void;
  onSendNote?: () => void;
}

export const PlatformActionsPanel: React.FC<PlatformActionsPanelProps> = ({
  status,
  isRtl = false,
  onSuspend,
  onBan,
  onReactivate,
  onSendNote,
}) => {
  const isActive = status === "ACTIVE";
  const isSuspended = status === "SUSPENDED";
  const isBanned = status.toUpperCase() === "BANNED";

  const renderTieredActionRow = (
    icon: React.ReactNode,
    label: string,
    sublabel: string,
    onClick: () => void,
    tierKey: keyof typeof ADMIN_DESIGN_TOKENS.actionTiers,
    disabled?: boolean,
    highStakesBadge?: string,
  ) => {
    const tier = disabled
      ? ADMIN_DESIGN_TOKENS.actionTiers.MUTED
      : ADMIN_DESIGN_TOKENS.actionTiers[tierKey];

    return (
      <button
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
          tier.container
        } ${isRtl ? "text-right" : "text-left"} cursor-pointer select-none group`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${tier.iconBox}`}
          >
            {icon}
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs ${tier.label}`}>{label}</span>
              {highStakesBadge && !disabled && (
                <span
                  className={ADMIN_DESIGN_TOKENS.actionTiers.DESTRUCTIVE.badge}
                >
                  {highStakesBadge}
                </span>
              )}
            </div>
            <span className={`text-[10px] ${tier.sublabel} truncate`}>
              {sublabel}
            </span>
          </div>
        </div>

        <svg
          className={`w-4 h-4 text-outline/50 group-hover:text-on-surface transition-transform shrink-0 ${
            isRtl
              ? "rotate-180 group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      <div className="flex items-center justify-between border-b border-surface-container pb-3">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline">
          {isRtl ? "إجراءات التحكم بالمنصة" : "Platform Governance Actions"}
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface-container text-outline border border-outline-variant/30">
          {isRtl ? "إدارة الحساب" : "Account Control"}
        </span>
      </div>

      {/* Routine & Communication Actions */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-outline/70">
          {isRtl ? "التواصل والتنشيط" : "Communication & Status"}
        </span>

        {onSendNote &&
          renderTieredActionRow(
            <svg
              className="w-5 h-5 text-primary-container"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>,
            isRtl ? "إرسال ملاحظة / تنبيه" : "Send Note / Notice",
            isRtl
              ? "إرسال رسالة رسمية أو ملاحظة إدارية"
              : "Compose note or official recipient notice",
            onSendNote,
            "ROUTINE_NEUTRAL",
          )}

        {renderTieredActionRow(
          <CheckCircleIcon
            className={`w-5 h-5 ${isActive ? "text-outline-variant" : "text-emerald-600"}`}
          />,
          isRtl ? "إعادة تنشيط الحساب" : "Reactivate Account",
          isActive
            ? isRtl
              ? "الحساب نشط بالفعل"
              : "Account active"
            : isRtl
              ? "استعادة وصول المستخدم كاملاً"
              : "Restore complete user access",
          onReactivate,
          "ROUTINE_POSITIVE",
          isActive || isBanned,
        )}
      </div>

      {/* Restricted & Destructive Governance Actions */}
      <div className="flex flex-col gap-2 border-t border-surface-container pt-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-red-700/80">
          {isRtl ? "القيود والحظر النهائي" : "Restrictions & Bans"}
        </span>

        {renderTieredActionRow(
          <svg
            className="w-5 h-5 text-amber-600"
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
          isRtl ? "تعطيل الحساب مؤقتاً" : "Suspend Account",
          isRtl
            ? "إيقاف مؤقت لنشاط المستخدم"
            : "Temporarily restrict user activity",
          onSuspend,
          "WARNING",
          isSuspended || isBanned,
        )}

        {/* Destructive Permanent Ban */}
        {renderTieredActionRow(
          <AlertCircleIcon className="w-5 h-5 text-red-600" />,
          isRtl ? "حظر نهائي للمستخدم" : "Ban User Permanently",
          isRtl
            ? "إجراء لا يمكن عكسه — يتطلب تأكيد إداري"
            : "Irreversible action — requires confirmation",
          onBan,
          "DESTRUCTIVE",
          isBanned,
          isRtl ? "إجراء خطير" : "HIGH STAKES",
        )}
      </div>
    </div>
  );
};
