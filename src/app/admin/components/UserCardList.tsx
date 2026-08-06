import React from "react";
import Link from "next/link";
import { AdminDictionary } from "../constants/dictionary";
import { statusBadgeTokens } from "../constants/status-tokens";
import { arText } from "../constants/arabic-mapper";
import { AdminUserItem } from "../types/admin.types";
import { EyeIcon, CheckCircleIcon, ClockIcon } from "@/components/icons";

interface UserCardListProps {
  users: AdminUserItem[];
  t: AdminDictionary;
  activeTab: "Consumers" | "Stores" | "Charities";
  isRtl?: boolean;
  onViewActivity?: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onVerify?: (id: string) => void;
}

export const UserCardList: React.FC<UserCardListProps> = ({
  users,
  t,
  activeTab,
  isRtl = false,
  onToggleStatus,
}) => {
  if (users.length === 0) {
    return (
      <div className="px-6 py-12 text-center text-xs font-semibold text-outline">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="block md:hidden divide-y divide-surface-container">
      {users.map((item) => {
        const isSuspended = item.status === "SUSPENDED";
        const badge =
          statusBadgeTokens[item.status] || statusBadgeTokens.ACTIVE;
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
                <div className="w-9 h-9 rounded-full bg-surface-container text-on-primary-fixed font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  {item.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <Link
                    href={`/admin/users/${item.id}`}
                    className="text-xs font-bold text-on-surface hover:text-primary-container transition-colors"
                  >
                    {arText(item.name, isRtl)}
                  </Link>
                  <span className="text-[10px] text-outline mt-0.5">
                    {item.email}
                  </span>
                </div>
              </div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${badge.classes}`}
              >
                {badgeText}
              </span>
            </div>

            {/* Middle row: Metadata info grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs border-b border-surface-container pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.idCol}
                </span>
                <span
                  className="font-mono text-[10px] text-on-surface-variant bg-surface px-1.5 py-0.5 rounded border border-surface-container inline-block mt-0.5 max-w-[110px] truncate cursor-help"
                  title={item.id}
                >
                  {item.id.length > 14
                    ? `${item.id.slice(0, 8)}...${item.id.slice(-4)}`
                    : item.id}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.locationCol}
                </span>
                <span className="text-on-surface font-medium mt-0.5 block">
                  {arText(item.location, isRtl)}
                </span>
              </div>
              {activeTab !== "Consumers" && (
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-outline block">
                    {isRtl ? "التوثيق" : "Verification"}
                  </span>
                  <span className="mt-0.5 block">
                    {(item.verified ?? item.status === "ACTIVE") ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircleIcon className="w-3 h-3 text-emerald-600" />
                        <span>{isRtl ? "موثق" : "Verified"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        <ClockIcon className="w-3 h-3 text-amber-600" />
                        <span>{isRtl ? "غير موثق" : "Unverified"}</span>
                      </span>
                    )}
                  </span>
                </div>
              )}
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.joinedDateCol}
                </span>
                <span className="text-on-surface-variant mt-0.5 block">
                  {arText(item.joinedDate, isRtl)}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-outline block">
                  {t.lastActiveCol}
                </span>
                <span className="text-outline mt-0.5 block">
                  {arText(item.lastActive, isRtl)}
                </span>
              </div>
            </div>

            {/* Bottom row: Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container/50">
              <Link
                href={`/admin/users/${item.id}`}
                className="flex items-center gap-1 px-3 py-1.5 hover:bg-surface-container text-outline hover:text-primary-container rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                title={isRtl ? "عرض التفاصيل" : "View Details"}
              >
                <EyeIcon className="w-4 h-4" />
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
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>{t.activate}</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
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
