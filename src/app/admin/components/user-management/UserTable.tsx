"use client";

import React from "react";
import Link from "next/link";
import { AdminDictionary } from "../../constants/dictionary";
import { statusBadgeTokens } from "../../constants/status-tokens";
import { arText } from "../../constants/arabic-mapper";
import { AdminUserItem } from "../../types/admin.types";
import { EyeIcon, CheckCircleIcon, ClockIcon } from "@/components/icons";

interface UserTableProps {
  users: AdminUserItem[];
  t: AdminDictionary;
  activeTab: "Consumers" | "Stores" | "Charities";
  isRtl?: boolean;
  onViewActivity?: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onVerify?: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  t,
  activeTab,
  isRtl = false,
  onToggleStatus,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <table
        className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
      >
        <thead>
          <tr className="bg-surface border-b border-card-border">
            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {activeTab === "Stores"
                ? isRtl
                  ? "تفاصيل المتجر"
                  : "Store Details"
                : activeTab === "Charities"
                  ? isRtl
                    ? "تفاصيل الجمعية"
                    : "Charity Details"
                  : t.detailsCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {t.idCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {t.locationCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {t.statusCol}
            </th>
            {activeTab !== "Consumers" && (
              <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
                {isRtl ? "التوثيق" : "Verification"}
              </th>
            )}
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {t.joinedDateCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
              {t.lastActiveCol}
            </th>
            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
              {t.actionsCol}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-container">
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={activeTab !== "Consumers" ? 8 : 7}
                className="px-3 py-12 text-center text-xs font-semibold text-outline"
              >
                {t.noData}
              </td>
            </tr>
          ) : (
            users.map((item) => {
              const isSuspended = item.status === "SUSPENDED";
              const badge =
                statusBadgeTokens[item.status] || statusBadgeTokens.ACTIVE;
              const badgeText = t[badge.textKey] || item.status;
              const isVerifiedAcc = item.verified ?? item.status === "ACTIVE";

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-surface/60 transition-colors ${
                    isSuspended ? "bg-red-50/50 hover:bg-red-50" : ""
                  }`}
                >
                  {/* Details */}
                  <td
                    className={`px-3 py-3 flex items-center gap-2.5 whitespace-nowrap ${
                      isRtl ? "flex-row" : "flex-row-reverse justify-end"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-surface-container text-on-primary-fixed font-bold flex items-center justify-center shrink-0 text-xs">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[140px] lg:max-w-[180px]">
                      <Link
                        href={`/admin/users/${item.id}`}
                        className="text-xs font-bold text-on-surface hover:text-primary-container transition-colors truncate"
                        title={item.name}
                      >
                        {arText(item.name, isRtl)}
                      </Link>
                      <span
                        className="text-[10px] text-outline mt-0.5 truncate"
                        title={item.email}
                      >
                        {item.email}
                      </span>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span
                      className="font-mono text-[10px] text-on-surface-variant bg-surface px-1.5 py-0.5 rounded border border-surface-container inline-block max-w-[110px] truncate cursor-help"
                      title={item.id}
                    >
                      {item.id.length > 14
                        ? `${item.id.slice(0, 8)}...${item.id.slice(-4)}`
                        : item.id}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="text-xs text-on-surface font-medium">
                      {arText(item.location, isRtl)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${badge.classes}`}
                    >
                      {badgeText}
                    </span>
                  </td>

                  {/* Verification Column */}
                  {activeTab !== "Consumers" && (
                    <td className="px-2 py-3 whitespace-nowrap">
                      {isVerifiedAcc ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{isRtl ? "موثق" : "Verified"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          <ClockIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>{isRtl ? "غير موثق" : "Unverified"}</span>
                        </span>
                      )}
                    </td>
                  )}

                  {/* Joined Date */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="text-xs text-on-surface-variant whitespace-nowrap">
                      {arText(item.joinedDate, isRtl)}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="px-2 py-3 text-xs text-outline whitespace-nowrap">
                    {arText(item.lastActive, isRtl)}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/users/${item.id}`}
                        className="p-1.5 hover:bg-surface-container text-outline hover:text-primary-container rounded-lg transition-colors cursor-pointer"
                        title={isRtl ? "عرض التفاصيل" : "View Details"}
                      >
                        <EyeIcon className="w-4.5 h-4.5" />
                      </Link>

                      <button
                        onClick={() => onToggleStatus(item.id, item.status)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSuspended
                            ? "hover:bg-green-100 text-green-600"
                            : "hover:bg-red-100 text-red-600"
                        }`}
                        title={isSuspended ? t.activate : t.suspend}
                      >
                        {isSuspended ? (
                          <CheckCircleIcon className="w-4.5 h-4.5" />
                        ) : (
                          <svg
                            className="w-4.5 h-4.5"
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
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
