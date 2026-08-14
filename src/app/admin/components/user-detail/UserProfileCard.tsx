/* eslint-disable react/no-multi-comp */
"use client";

import React from "react";
import Image from "next/image";
import { UserDetail } from "../../types/admin.types";
import { statusBadgeTokens } from "../../constants/status-tokens";
import { StatsCard } from "../common/StatsCard";
import {
  UserIcon,
  MapPinIcon,
  ClockIcon,
  FileIcon,
  StoreIcon,
  ShieldCheckIcon,
  BagIcon,
  LeafIcon,
} from "@/components/icons";

interface UserProfileCardProps {
  user: UserDetail;
  isRtl?: boolean;
}

// Helper SVG icons for Phone and Mail
const PhoneIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MailIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  isRtl = false,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const renderMetaRow = (icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-2.5 text-xs text-on-surface-variant font-medium hover:text-on-surface transition-colors">
      <span className="text-outline shrink-0">{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  );

  const rawStatus = (user.status || "ACTIVE").toString().toUpperCase();
  const badge =
    statusBadgeTokens[rawStatus] ||
    (rawStatus.includes("ACTIVE") ||
    rawStatus.includes("APPROV") ||
    rawStatus.includes("VERIF")
      ? statusBadgeTokens.ACTIVE
      : rawStatus.includes("SUSPEND") ||
          rawStatus.includes("BAN") ||
          rawStatus.includes("REJECT")
        ? statusBadgeTokens.SUSPENDED
        : statusBadgeTokens.PENDING);

  const statusLabel =
    rawStatus.includes("ACTIVE") ||
    rawStatus.includes("APPROV") ||
    rawStatus.includes("VERIF")
      ? isRtl
        ? "نشط"
        : "Active"
      : rawStatus.includes("SUSPEND") ||
          rawStatus.includes("BAN") ||
          rawStatus.includes("REJECT")
        ? isRtl
          ? "معطل"
          : "Suspended"
        : isRtl
          ? "قيد المراجعة"
          : "Pending";

  const roleLabel =
    {
      Consumer: isRtl ? "مستهلك" : "Consumer",
      Store: isRtl ? "مالك متجر" : "Store Owner",
      Charity: isRtl ? "جمعية خيرية" : "Charity",
    }[user.role] || user.role;

  const roleBadgeIcon =
    user.role === "Store" ? (
      <StoreIcon className="w-3.5 h-3.5 text-primary" />
    ) : user.role === "Charity" ? (
      <LeafIcon className="w-3.5 h-3.5 text-emerald-600" />
    ) : (
      <BagIcon className="w-3.5 h-3.5 text-blue-600" />
    );

  const initials = (user.name || "US").slice(0, 2).toUpperCase();

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
      {/* Avatar + name + status badges */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          {user.avatar && !imgError ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={56}
              height={56}
              unoptimized
              onError={() => setImgError(true)}
              className="w-14 h-14 rounded-2xl object-cover border border-outline-variant/60 shadow-2xs bg-surface-container"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-on-surface font-black text-lg flex items-center justify-center border border-outline-variant/60 shadow-2xs">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-lg shadow-2xs border border-surface-container">
            {roleBadgeIcon}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h2 className="text-lg font-black text-on-surface tracking-tight truncate">
              {user.name}
            </h2>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wide border inline-flex items-center gap-1.5 shadow-2xs ${badge.classes}`}
            >
              {statusLabel === "نشط" || statusLabel === "Active" ? (
                <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : null}
              <span>{statusLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-outline bg-surface px-2.5 py-0.5 rounded-md border border-surface-container inline-flex items-center gap-1">
              {roleBadgeIcon}
              <span>{roleLabel}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Contact & Meta Info Grid */}
      <div className="flex flex-col gap-2.5 border-t border-surface-container pt-4">
        {user.ownerName &&
          renderMetaRow(
            <UserIcon className="w-3.5 h-3.5" />,
            `${isRtl ? "صاحب الحساب: " : "Owner: "}${user.ownerName}`,
          )}
        {user.ownerPhone &&
          renderMetaRow(
            <PhoneIcon className="w-3.5 h-3.5 text-emerald-600" />,
            `${isRtl ? "هاتف المالك: " : "Owner Phone: "}${user.ownerPhone}`,
          )}
        {user.phone &&
          user.phone !== user.ownerPhone &&
          renderMetaRow(
            <PhoneIcon className="w-3.5 h-3.5 text-emerald-600" />,
            user.phone,
          )}
        {user.email &&
          renderMetaRow(
            <MailIcon className="w-3.5 h-3.5 text-blue-600" />,
            user.email,
          )}
        {user.taxId &&
          renderMetaRow(
            <FileIcon className="w-3.5 h-3.5 text-amber-600" />,
            `${isRtl ? "الرقم الضريبي: " : "Tax ID: "}${user.taxId}`,
          )}
        {user.businessCategory &&
          renderMetaRow(
            <FileIcon className="w-3.5 h-3.5 text-purple-600" />,
            `${isRtl ? "فئة النشاط: " : "Category: "}${user.businessCategory}`,
          )}
        {user.location &&
          renderMetaRow(
            <MapPinIcon className="w-3.5 h-3.5 text-red-500" />,
            user.location,
          )}
        {user.joinedDate &&
          renderMetaRow(
            <ClockIcon className="w-3.5 h-3.5 text-outline" />,
            `${isRtl ? "انضم " : "Joined "}${user.joinedDate}`,
          )}
        {user.description && (
          <p className="text-xs text-outline italic pt-2 border-t border-surface-container/60 leading-relaxed font-sans">
            {user.description}
          </p>
        )}
      </div>

      {/* Role-specific stat cards */}
      <div className="grid grid-cols-3 gap-3 border-t border-surface-container pt-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
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
