import React from "react";
import { UserDetail } from "../api/user-detail-api";
import { statusBadgeTokens } from "../constants/status-tokens";
import { StatsCard } from "./StatsCard";

interface UserProfileCardProps {
  user: UserDetail;
  isRtl?: boolean;
}

const MetaRow: React.FC<{ icon: React.ReactNode; text: string; isRtl: boolean }> = ({ icon, text, isRtl }) => (
  <div className="flex items-center gap-2 text-xs text-[#404941]">
    <span className="text-[#707a70] shrink-0">{icon}</span>
    <span>{text}</span>
  </div>
);

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, isRtl = false }) => {
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
  const stats: { label: string; value: string | number; accent: string; color: string; progress?: number }[] =
    user.role === "Store"
      ? [
          { label: isRtl ? "إجمالي المبيعات" : "Total Sales", value: user.stats.totalSales ?? "—", accent: "bg-[#005129]/20", color: "text-[#00381a]" },
          { label: isRtl ? "معدل التنفيذ" : "Fulfillment Rate", value: `${user.stats.fulfillmentRate ?? 0}%`, accent: "bg-blue-600/20", color: "text-blue-900", progress: user.stats.fulfillmentRate },
          { label: isRtl ? "النزاعات الفعالة" : "Active Disputes", value: user.stats.activeDisputes ?? 0, accent: "bg-amber-500/20", color: "text-amber-900" },
        ]
      : user.role === "Consumer"
      ? [
          { label: isRtl ? "إجمالي الطلبات" : "Total Orders", value: user.stats.totalOrders ?? 0, accent: "bg-[#005129]/20", color: "text-[#00381a]" },
          { label: isRtl ? "المبلغ الموفر" : "Amount Saved", value: user.stats.savedAmount ?? "—", accent: "bg-blue-600/20", color: "text-blue-900" },
          { label: isRtl ? "النزاعات الفعالة" : "Active Disputes", value: user.stats.activeDisputes ?? 0, accent: "bg-amber-500/20", color: "text-amber-900" },
        ]
      : [
          { label: isRtl ? "التبرعات المستلمة" : "Donations Received", value: user.stats.donationsReceived ?? 0, accent: "bg-[#005129]/20", color: "text-[#00381a]" },
          { label: isRtl ? "القيمة الموفرة" : "Value Saved", value: user.stats.savedAmount ?? "—", accent: "bg-blue-600/20", color: "text-blue-900" },
          { label: isRtl ? "النزاعات الفعالة" : "Active Disputes", value: user.stats.activeDisputes ?? 0, accent: "bg-amber-500/20", color: "text-amber-900" },
        ];

  return (
    <div className={`bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-5 ${isRtl ? "text-right" : "text-left"}`}>
      {/* Avatar + name + status */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-[#eeeee9] text-[#00381a] font-extrabold text-lg flex items-center justify-center shrink-0 border-2 border-[#bfc9be]">
          {user.name.slice(0, 2).toUpperCase()}
        </div>
        <div className={`flex flex-col gap-1 ${isRtl ? "items-start" : ""}`}>
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-[#1a1c19]">{user.name}</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${badge.classes}`}>
              {statusLabel}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#707a70]">{roleLabel}</span>
        </div>
      </div>

      {/* Contact & Meta Info */}
      <div className={`flex flex-col gap-2 border-t border-[#eeeee9] pt-4 ${isRtl ? "items-end" : ""}`}>
        {user.ownerName && (
          <MetaRow isRtl={isRtl} text={`${isRtl ? "صاحب الحساب: " : "Owner: "}${user.ownerName}`} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          } />
        )}
        {user.ownerPhone && (
          <MetaRow isRtl={isRtl} text={`${isRtl ? "هاتف المالك: " : "Owner Phone: "}${user.ownerPhone}`} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          } />
        )}
        {user.phone && user.phone !== user.ownerPhone && (
          <MetaRow isRtl={isRtl} text={user.phone} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          } />
        )}
        {user.email && (
          <MetaRow isRtl={isRtl} text={user.email} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          } />
        )}
        {user.taxId && (
          <MetaRow isRtl={isRtl} text={`${isRtl ? "الرقم الضريبي: " : "Tax ID: "}${user.taxId}`} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          } />
        )}
        {user.businessCategory && (
          <MetaRow isRtl={isRtl} text={`${isRtl ? "فئة النشاط: " : "Category: "}${user.businessCategory}`} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          } />
        )}
        {user.location && (
          <MetaRow isRtl={isRtl} text={user.location} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          } />
        )}
        {user.joinedDate && (
          <MetaRow isRtl={isRtl} text={`${isRtl ? "انضم" : "Joined"} ${user.joinedDate}`} icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } />
        )}
        {user.description && (
          <p className="text-xs text-[#707a70] italic pt-1 border-t border-[#eeeee9]/50">
            {user.description}
          </p>
        )}
      </div>

      {/* Role-specific stat cards */}
      <div className="grid grid-cols-3 gap-3 border-t border-[#eeeee9] pt-4">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-1">
            <StatsCard label={s.label} value={s.value} accentClass={s.accent} textColorClass={s.color} isRtl={isRtl} />
            {s.progress !== undefined && (
              <div className="w-full h-1.5 rounded-full bg-[#eeeee9] overflow-hidden mt-1">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${s.progress}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
