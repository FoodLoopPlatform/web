import React from "react";
import { AdminDictionary } from "../constants/dictionary";

interface ModerationPageHeaderProps {
  pendingCount: number;
  t: AdminDictionary;
  isRtl?: boolean;
  onFilterClick?: () => void;
  isFilterActive?: boolean;
}

export const ModerationPageHeader: React.FC<ModerationPageHeaderProps> = ({
  pendingCount,
  t,
  isRtl = false,
  onFilterClick,
  isFilterActive = false,
}) => {
  const countText = t.pendingItemsCount.replace("{count}", String(pendingCount));

  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/60 pb-5 ${isRtl ? "text-right" : "text-left"}`}>
      {/* Eyebrow & Title */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-outline">
          {t.overviewEyebrow}
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-on-surface tracking-tight font-headline-md">
          {t.contentModerationTitle}
        </h1>
      </div>

      {/* Pill & Filter Action */}
      <div className="flex items-center gap-3 self-start md:self-end">
        {/* Pending Items Count Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-tertiary-fixed/70 text-on-tertiary-fixed-variant border border-tertiary-fixed-dim font-bold text-xs shadow-2xs">
          <svg className="w-4 h-4 text-on-tertiary-fixed-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="font-mono text-xs font-extrabold">{countText}</span>
        </div>

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-on-primary transition-all shadow-xs cursor-pointer active:scale-95 ${
            isFilterActive ? "bg-primary-container ring-2 ring-primary-fixed-dim" : "bg-primary hover:bg-primary-container"
          }`}
        >
          <svg className="w-4 h-4 text-on-primary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>{t.filterBtn}</span>
        </button>
      </div>
    </div>
  );
};
