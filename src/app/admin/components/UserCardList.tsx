import React from "react";
import Link from "next/link";
import { Consumer, Store, Charity } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { statusBadgeTokens } from "../constants/status-tokens";
import { arText } from "../constants/arabic-mapper";

type AdminUserItem = (Consumer | Store | Charity) & {
  automationMode?: string;
  verified?: boolean;
  taxId?: string;
  joinedDate?: string;
};

interface UserCardListProps {
  users: AdminUserItem[];
  t: AdminDictionary;
  activeTab: "Consumers" | "Stores" | "Charities";
  isRtl?: boolean;
  onViewActivity: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onVerify: (id: string) => void;
}

export const UserCardList: React.FC<UserCardListProps> = ({
  users,
  t,
  activeTab,
  isRtl = false,
  onViewActivity,
  onToggleStatus,
  onVerify,
}) => {
  if (users.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-[#707a70]">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-[#eeeee9]">
      {users.map((item) => {
        const isSuspended = item.status === "SUSPENDED";
        const isPending = item.status === "PENDING";
        const badge = statusBadgeTokens[item.status] || statusBadgeTokens.ACTIVE;
        const badgeText = t[badge.textKey] || item.status;

        return (
          <div
            key={item.id}
            className={`p-4 flex flex-col gap-3 transition-colors ${
              isSuspended ? "bg-red-50/40" : ""
            }`}
          >
            {/* Top row: Avatar, name, email & status badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#eeeee9] text-[#00381a] font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <Link
                    href={`/admin/users/${item.id}`}
                    className="text-xs font-bold text-[#1a1c19] hover:text-[#005129] transition-colors"
                  >
                    {arText(item.name, isRtl)}
                  </Link>
                  <span className="text-[10px] text-[#707a70] mt-0.5">{item.email}</span>
                </div>
              </div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${badge.classes}`}
              >
                {badgeText}
              </span>
            </div>

            {/* Middle row: Metadata info grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-[#eeeee9] pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.idCol}
                </span>
                <span
                  className="font-mono text-[10px] text-[#404941] bg-[#fafaf4] px-1.5 py-0.5 rounded border border-[#eeeee9] inline-block mt-0.5 max-w-[110px] truncate cursor-help"
                  title={item.id}
                >
                  {item.id.length > 14 ? `${item.id.slice(0, 8)}...${item.id.slice(-4)}` : item.id}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.locationCol}
                </span>
                <span className="text-[#1a1c19] font-medium mt-0.5 block">{arText(item.location, isRtl)}</span>
              </div>
              {activeTab !== "Consumers" && (
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                    {isRtl ? "التوثيق" : "Verification"}
                  </span>
                  <span className="mt-0.5 block">
                    {(item.verified ?? (item.status === "ACTIVE")) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>{isRtl ? "موثق" : "Verified"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{isRtl ? "غير موثق" : "Unverified"}</span>
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.joinedDateCol}
                </span>
                <span className="text-[#404941] mt-0.5 block">
                  {arText(item.joinedDate, isRtl)}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-[#707a70] block">
                  {t.lastActiveCol}
                </span>
                <span className="text-[#707a70] mt-0.5 block">{arText(item.lastActive, isRtl)}</span>
              </div>
            </div>

            {/* Bottom row: Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#eeeee9]/50">
              <Link
                href={`/admin/users/${item.id}`}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-[#eeeee9] text-[#707a70] hover:text-[#005129] rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                title={isRtl ? "عرض التفاصيل" : "View Details"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{isRtl ? "عرض التفاصيل" : "View Details"}</span>
              </Link>

              <button
                onClick={() => onToggleStatus(item.id, item.status)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors cursor-pointer text-xs ${
                  isSuspended
                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}
              >
                {isSuspended ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t.activate}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span>{t.suspend}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
