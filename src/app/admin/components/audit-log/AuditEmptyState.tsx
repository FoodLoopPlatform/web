import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { SearchIcon, RefreshIcon } from "@/components/icons";

interface AuditEmptyStateProps {
  t: AdminDictionary;
  onResetFilters: () => void;
}

export const AuditEmptyState: React.FC<AuditEmptyStateProps> = ({
  t,
  onResetFilters,
}) => {
  return (
    <div
      style={{ width: "100%" }}
      className="bg-white border border-card-border rounded-2xl p-8 sm:p-14 shadow-sm flex flex-col items-center justify-center text-center gap-4 my-2 min-h-[300px]"
    >
      <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-outline shadow-2xs shrink-0">
        <SearchIcon className="w-7 h-7 text-outline" />
      </div>

      <h3
        style={{ width: "100%" }}
        className="text-base sm:text-lg font-extrabold text-on-surface font-sans text-center"
      >
        {t.noAuditResultsHeading}
      </h3>

      <p
        style={{
          width: "100%",
          maxWidth: "32rem",
          marginLeft: "auto",
          marginRight: "auto",
        }}
        className="text-xs sm:text-sm text-outline leading-relaxed text-center"
      >
        {t.noAuditResultsBody}
      </p>

      <button
        type="button"
        onClick={onResetFilters}
        className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-extrabold bg-primary text-white hover:bg-primary/90 shadow-xs transition-all cursor-pointer shrink-0"
      >
        <RefreshIcon className="w-4 h-4 text-white" />
        <span>{t.resetFiltersBtn}</span>
      </button>
    </div>
  );
};
