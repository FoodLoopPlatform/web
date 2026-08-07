import React from "react";
import { UserDetail } from "../../types/admin.types";
import { statusBadgeTokens } from "../../constants/status-tokens";
import { StatsCard } from "../common/StatsCard";
import { UserIcon, MapPinIcon, ClockIcon, FileIcon } from "@/components/icons";

interface UserProfileCardProps {
  user: UserDetail;
  isRtl?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isRtl = false,
}) => {
  const renderMetaRow = (icon: React.ReactNode, text: string) => (
    <div
      className={`flex items-center gap-2 text-xs text-on-surface-variant ${isRtl ? "flex-row-reverse" : "flex-row"}`}
    >
      <span className="text-outline shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  );
  const badge = statusBadgeTokens[user.status] || statusBadgeTokens.ACTIVE;

  const roleLabel = {
    Consumer: isRtl ? "مستهلك" : "Consumer",
    Store: isRtl ? "مالك متجر" : "Store Owner",
    Charity: isRtl ? "جمعية خيرية" : "Charity",
  }[user.role];

  const statusLabel = {
    ACTIVE: isRtl ? "نشط" : "Active",
    SUSPENDED: isRtl ? "معطل" : "Suspended",
    PENDING: isRtl ? "معلق" : "Pending",
  }[user.status];

  // Role-specific stats
  const stats: {
    label: string;
    value: string | number;
    accent: string;
    color: string;
    progress?: number;
  }[] =
    user.role === "Store"
      ? [
          {
            label: isRtl ? "إجمالي المبيعات" : "Total Sales",
            value: user.stats.totalSales ?? "—",
            accent: "bg-primary-fixed/20",
            color: "text-on-primary-fixed",
          },
          {
            label: isRtl ? "معدل التنفيذ" : "Fulfillment Rate",
            value: `${user.stats.fulfillmentRate ?? 0}%`,
            accent: "bg-blue-600/20",
            color: "text-blue-900",
            progress: user.stats.fulfillmentRate,
          },
          {
            label: isRtl ? "النزاعات الفعالة" : "Active Disputes",
            value: user.stats.activeDisputes ?? 0,
            accent: "bg-amber-500/20",
            color: "text-amber-900",
          },
        ]
      : user.role === "Consumer"
        ? [
            {
              label: isRtl ? "إجمالي الطلبات" : "Total Orders",
              value: user.stats.totalOrders ?? 0,
              accent: "bg-primary-fixed/20",
              color: "text-on-primary-fixed",
            },
            {
              label: isRtl ? "المبلغ الموفر" : "Amount Saved",
              value: user.stats.savedAmount ?? "—",
              accent: "bg-blue-600/20",
              color: "text-blue-900",
            },
            {
              label: isRtl ? "النزاعات الفعالة" : "Active Disputes",
              value: user.stats.activeDisputes ?? 0,
              accent: "bg-amber-500/20",
              color: "text-amber-900",
            },
          ]
        : [
            {
              label: isRtl ? "التبرعات المستلمة" : "Donations Received",
              value: user.stats.donationsReceived ?? 0,
              accent: "bg-primary-fixed/20",
              color: "text-on-primary-fixed",
            },
            {
              label: isRtl ? "القيمة الموفرة" : "Value Saved",
              value: user.stats.savedAmount ?? "—",
              accent: "bg-blue-600/20",
              color: "text-blue-900",
            },
            {
              label: isRtl ? "النزاعات الفعالة" : "Active Disputes",
              value: user.stats.activeDisputes ?? 0,
              accent: "bg-amber-500/20",
              color: "text-amber-900",
            },
          ];

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-5 ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Avatar + name + status */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-surface-container text-on-primary-fixed font-extrabold text-lg flex items-center justify-center shrink-0 border-2 border-outline-variant">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className={`flex flex-col gap-1 ${isRtl ? "items-start" : ""}`}>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-on-surface">
              {user.name}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${badge.classes}`}
            >
              {statusLabel}
            </span>
          </div>
          <span className="text-xs font-semibold text-outline">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Contact & Meta Info */}
      <div
        className={`flex flex-col gap-2 border-t border-surface-container pt-4 ${isRtl ? "items-end" : ""}`}
      >
        {user.ownerName &&
          renderMetaRow(
            <UserIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "صاحب الحساب: " : "Owner: "}${user.ownerName}`,
          )}
        {user.ownerPhone &&
          renderMetaRow(
            <UserIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "هاتف المالك: " : "Owner Phone: "}${user.ownerPhone}`,
          )}
        {user.phone &&
          user.phone !== user.ownerPhone &&
          renderMetaRow(<UserIcon className="w-3.5 h-3.5" />, user.phone)}
        {user.email &&
          renderMetaRow(<UserIcon className="w-3.5 h-3.5" />, user.email)}
        {user.taxId &&
          renderMetaRow(
            <FileIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "الرقم الضريبي: " : "Tax ID: "}${user.taxId}`,
          )}
        {user.businessCategory &&
          renderMetaRow(
            <FileIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "فئة النشاط: " : "Category: "}${user.businessCategory}`,
          )}
        {user.location &&
          renderMetaRow(<MapPinIcon className="w-3.5 h-3.5" />, user.location)}
        {user.joinedDate &&
          renderMetaRow(
            <ClockIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "انضم" : "Joined"} ${user.joinedDate}`,
          )}
        {user.description && (
          <p className="text-xs text-outline italic pt-1 border-t border-surface-container/50">
            {user.description}
          </p>
        )}
      </div>

      {/* Role-specific stat cards */}
      <div className="grid grid-cols-3 gap-3 border-t border-surface-container pt-4">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-1">
            <StatsCard
              label={s.label}
              value={s.value}
              accentClass={s.accent}
              textColorClass={s.color}
              isRtl={isRtl}
            />
            {s.progress !== undefined && (
              <div className="w-full h-1.5 rounded-full bg-surface-container overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${s.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
