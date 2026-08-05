import React from "react";
import { AdminDictionary } from "../constants/dictionary";
import { ModerationStatItem } from "./ModerationStatItem";

interface ModerationEmptyStateProps {
  t: AdminDictionary;
  isRtl?: boolean;
  onRefresh: () => void;
  onClearSearch?: () => void;
  searchQuery?: string;
  lastSyncTime?: string;
  isRefreshing?: boolean;
}

export const ModerationEmptyState: React.FC<ModerationEmptyStateProps> = ({
  t,
  isRtl = false,
  onRefresh,
  onClearSearch,
  searchQuery = "",
  lastSyncTime = "05:57 PM",
  isRefreshing = false,
}) => {
  const percentClearText = t.footerPercentClear.replace("{percent}", "100");
  const syncText = t.lastSync.replace("{time}", lastSyncTime);
  const isSearchEmpty = Boolean(searchQuery.trim());

  return (
    <div
      style={{ width: "100%", minWidth: "100%", boxSizing: "border-box" }}
      className="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-2xs block"
    >
      {/* Centered Empty Card Box with Inline Styles to guarantee 100% width */}
      <div
        style={{ width: "100%", maxWidth: "600px", margin: "0 auto", textAlign: "center", display: "block" }}
        className="py-6"
      >
        {/* Icon Circle */}
        <div
          style={{ width: "64px", height: "64px", margin: "0 auto 16px auto" }}
          className="rounded-full bg-primary-fixed/70 flex items-center justify-center text-primary shrink-0"
        >
          {isSearchEmpty ? (
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Heading */}
        <h2
          style={{ width: "100%", display: "block", textAlign: "center", marginBottom: "8px" }}
          className="text-lg sm:text-xl font-extrabold text-on-surface tracking-tight leading-snug"
        >
          {isSearchEmpty
            ? isRtl
              ? "لم يتم العثور على أي نتائج بحث."
              : "No search results found."
            : t.emptyHeading}
        </h2>

        {/* Body Description */}
        <p
          style={{ width: "100%", maxWidth: "520px", margin: "0 auto 24px auto", display: "block", textAlign: "center" }}
          className="text-xs sm:text-sm text-on-surface-variant leading-relaxed"
        >
          {isSearchEmpty
            ? isRtl
              ? `لم تطابق أي قوائم مراجعة عبارة البحث '${searchQuery}'. يرجى المحاولة بكلمات رئيسية مختلفة أو مسح عوامل التصفية.`
              : `No moderation listings match '${searchQuery}'. Try searching with different keywords or clear filters.`
            : t.emptyBody}
        </p>

        {/* Action Button */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          {isSearchEmpty && onClearSearch ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary-container text-on-primary shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-on-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>{isRtl ? "مسح البحث والتصفية" : "Clear Search & Filters"}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isRefreshing}
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary-container text-on-primary shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <svg
                className={`w-3.5 h-3.5 text-on-primary shrink-0 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{t.refreshQueueBtn}</span>
            </button>
          )}

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-outline mt-2 block">
            {syncText}
          </span>
        </div>
      </div>

      {/* Footer Stats Row */}
      <div
        style={{ width: "100%" }}
        className="border-t border-outline-variant/60 pt-5 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
      >
        <ModerationStatItem
          isRtl={isRtl}
          label={t.footerQueueStatus}
          value={
            <span className="text-primary font-black uppercase tracking-wider text-xs">
              {percentClearText}
            </span>
          }
        />
        <ModerationStatItem
          isRtl={isRtl}
          label={t.footerTotalReviewed}
          value={<span className="font-mono text-xs font-black">142</span>}
        />
        <ModerationStatItem
          isRtl={isRtl}
          label={t.footerActiveModerators}
          value={
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center">
                  SA
                </div>
                <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-tertiary-container text-on-tertiary-container text-[9px] font-bold flex items-center justify-center">
                  MK
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-outline bg-surface-container-high px-1.5 py-0.5 rounded-full">
                +4
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
};
