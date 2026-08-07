"use client";

import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { ModerationStatItem } from "./ModerationStatItem";
import {
  SearchIcon,
  CheckIcon,
  CloseIcon,
  SpinnerIcon,
} from "@/components/icons";

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
    <div className="w-full bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 sm:p-10 shadow-2xs block">
      {/* Centered Empty Card Box */}
      <div className="w-full max-w-[600px] mx-auto text-center py-6 block">
        {/* Icon Circle */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-fixed/70 flex items-center justify-center text-primary shrink-0">
          {isSearchEmpty ? (
            <SearchIcon className="w-7 h-7 text-primary" />
          ) : (
            <CheckIcon className="w-7 h-7 text-primary" />
          )}
        </div>

        {/* Heading */}
        <h2 className="w-full block text-center mb-2 text-lg sm:text-xl font-extrabold text-on-surface tracking-tight leading-snug">
          {isSearchEmpty
            ? isRtl
              ? "لم يتم العثور على أي نتائج بحث."
              : "No search results found."
            : t.emptyHeading}
        </h2>

        {/* Body Description */}
        <p className="w-full max-w-[520px] mx-auto mb-6 block text-center text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {isSearchEmpty
            ? isRtl
              ? `لم تطابق أي قوائم مراجعة عبارة البحث '${searchQuery}'. يرجى المحاولة بكلمات رئيسية مختلفة أو مسح عوامل التصفية.`
              : `No moderation listings match '${searchQuery}'. Try searching with different keywords or clear filters.`
            : t.emptyBody}
        </p>

        {/* Action Button */}
        <div className="w-full flex flex-col items-center gap-2">
          {isSearchEmpty && onClearSearch ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary-container text-on-primary shadow-xs hover:shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <CloseIcon className="w-4 h-4 text-on-primary shrink-0" />
              <span>
                {isRtl ? "مسح البحث والتصفية" : "Clear Search & Filters"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              disabled={isRefreshing}
              onClick={onRefresh}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-primary hover:bg-primary-container text-on-primary shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isRefreshing ? (
                <SpinnerIcon className="w-3.5 h-3.5 text-on-primary animate-spin shrink-0" />
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-on-primary shrink-0"
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
              )}
              <span>{t.refreshQueueBtn}</span>
            </button>
          )}

          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-outline mt-2 block">
            {syncText}
          </span>
        </div>
      </div>

      {/* Footer Stats Row */}
      <div className="w-full border-t border-outline-variant/60 pt-5 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
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
