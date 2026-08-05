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

interface UserTableProps {
  users: AdminUserItem[];
  t: AdminDictionary;
  activeTab: "Consumers" | "Stores" | "Charities";
  isRtl?: boolean;
  onViewActivity: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onVerify: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  t,
  activeTab,
  isRtl = false,
  onViewActivity,
  onToggleStatus,
  onVerify,
}) => {
  return (
    <div className="hidden md:block overflow-x-auto w-full">
      <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
        <thead>
          <tr className="bg-[#fafaf4] border-b border-[#e0e6df]">
            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
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
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
              {t.idCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
              {t.locationCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
              {t.statusCol}
            </th>
            {activeTab !== "Consumers" && (
              <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
                {isRtl ? "التوثيق" : "Verification"}
              </th>
            )}
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
              {t.joinedDateCol}
            </th>
            <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
              {t.lastActiveCol}
            </th>
            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] text-center whitespace-nowrap">
              {t.actionsCol}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eeeee9]">
          {users.length === 0 ? (
            <tr>
              <td colSpan={activeTab !== "Consumers" ? 8 : 7} className="px-3 py-12 text-center text-xs font-semibold text-[#707a70]">
                {t.noData}
              </td>
            </tr>
          ) : (
            users.map((item) => {
              const isSuspended = item.status === "SUSPENDED";
              const isPending = item.status === "PENDING";
              const badge = statusBadgeTokens[item.status] || statusBadgeTokens.ACTIVE;
              const badgeText = t[badge.textKey] || item.status;
              const isVerifiedAcc = item.verified ?? (item.status === "ACTIVE");

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#fafaf4]/60 transition-colors ${
                    isSuspended ? "bg-red-50/50 hover:bg-red-50" : ""
                  }`}
                >
                  {/* Details */}
                  <td
                    className={`px-3 py-3 flex items-center gap-2.5 whitespace-nowrap ${
                      isRtl ? "flex-row" : "flex-row-reverse justify-end"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#eeeee9] text-[#00381a] font-bold flex items-center justify-center shrink-0 text-xs">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col max-w-[140px] lg:max-w-[180px]">
                      <Link
                        href={`/admin/users/${item.id}`}
                        className="text-xs font-bold text-[#1a1c19] hover:text-[#005129] transition-colors truncate"
                        title={item.name}
                      >
                        {arText(item.name, isRtl)}
                      </Link>
                      <span className="text-[10px] text-[#707a70] mt-0.5 truncate" title={item.email}>{item.email}</span>
                    </div>
                  </td>

                  {/* ID */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span
                      className="font-mono text-[10px] text-[#404941] bg-[#fafaf4] px-1.5 py-0.5 rounded border border-[#eeeee9] inline-block max-w-[110px] truncate cursor-help"
                      title={item.id}
                    >
                      {item.id.length > 14 ? `${item.id.slice(0, 8)}...${item.id.slice(-4)}` : item.id}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="text-xs text-[#1a1c19] font-medium">{arText(item.location, isRtl)}</span>
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
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>{isRtl ? "موثق" : "Verified"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{isRtl ? "غير موثق" : "Unverified"}</span>
                        </span>
                      )}
                    </td>
                  )}

                  {/* Joined Date */}
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="text-xs text-[#404941] whitespace-nowrap">
                      {arText(item.joinedDate, isRtl)}
                    </span>
                  </td>

                  {/* Last Active */}
                  <td className="px-2 py-3 text-xs text-[#707a70] whitespace-nowrap">
                    {arText(item.lastActive, isRtl)}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/users/${item.id}`}
                        className="p-1.5 hover:bg-[#eeeee9] text-[#707a70] hover:text-[#005129] rounded-lg transition-colors cursor-pointer"
                        title={isRtl ? "عرض التفاصيل" : "View Details"}
                      >
                        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
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
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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
