"use client";

import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { SearchIcon, CloseIcon } from "@/components/icons";

interface AuditEmptyStateProps {
  t: AdminDictionary;
  isRtl?: boolean;
  onResetFilters: () => void;
}

export const AuditEmptyState: React.FC<AuditEmptyStateProps> = ({
  t,
  isRtl = false,
  onResetFilters,
}) => {
  return (
    <div
      className={`w-full bg-white border border-card-border rounded-2xl p-8 sm:p-12 shadow-sm text-center my-4 ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-md mx-auto flex flex-col items-center gap-4 text-center">
        {/* Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-outline shadow-2xs">
          <SearchIcon className="w-7 h-7 text-outline" />
        </div>

        {/* Heading */}
        <h3 className="text-base sm:text-lg font-extrabold text-on-surface tracking-tight font-sans">
          {t.noAuditResultsHeading}
        </h3>

        {/* Body Description */}
        <p className="text-xs sm:text-sm text-outline leading-relaxed">
          {t.noAuditResultsBody}
        </p>

        {/* CTA Reset Button */}
        <button
          type="button"
          onClick={onResetFilters}
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold bg-primary hover:bg-primary-container text-on-primary shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <CloseIcon className="w-4 h-4 text-on-primary" />
          <span>{t.resetFiltersBtn}</span>
        </button>
      </div>
    </div>
  );
};
