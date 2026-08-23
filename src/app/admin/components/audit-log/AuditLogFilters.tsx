"use client";

import React, { useState, useEffect } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import {
  AuditLogFilterParams,
  AuditActionType,
  AuditSeverity,
} from "../../types/admin.types";
import { SearchIcon, ChevronDownIcon, DownloadIcon } from "@/components/icons";
import { useDebounce } from "../../hooks/useDebounce";

interface AuditLogFiltersProps {
  t: AdminDictionary;
  isRtl?: boolean;
  filters: AuditLogFilterParams;
  onFilterChange: (updated: AuditLogFilterParams) => void;
  onExportCsv: () => void;
  isExporting?: boolean;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  t,
  isRtl = false,
  filters,
  onFilterChange,
  onExportCsv,
  isExporting = false,
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Trigger filter change when debounced search input changes
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      onFilterChange({
        ...filters,
        search: debouncedSearch,
        page: 1,
      });
    }
  }, [debouncedSearch, filters, onFilterChange]);

  const handleActionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "ALL" | AuditActionType;
    onFilterChange({ ...filters, actionType: val, page: 1 });
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "ALL" | "TODAY" | "7DAYS" | "30DAYS";
    onFilterChange({ ...filters, dateRange: val, page: 1 });
  };

  const handleSeverityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as "ALL" | AuditSeverity;
    onFilterChange({ ...filters, severity: val, page: 1 });
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-card-border p-4 sm:p-5 shadow-sm">
      <div
        className={`flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 ${
          isRtl ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Search Bar Input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <div
            className={`absolute inset-y-0 ${
              isRtl ? "right-0 pr-3.5" : "left-0 pl-3.5"
            } flex items-center pointer-events-none text-outline`}
          >
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t.searchAuditPlaceholder}
            className={`w-full ${
              isRtl ? "pr-10 pl-8 text-right" : "pl-10 pr-8 text-left"
            } py-2.5 bg-surface-container-low rounded-full border border-outline-variant/60 text-xs font-medium text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs`}
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                onFilterChange({ ...filters, search: "", page: 1 });
              }}
              className={`absolute inset-y-0 ${
                isRtl ? "left-0 pl-3.5" : "right-0 pr-3.5"
              } flex items-center text-xs text-outline hover:text-on-surface cursor-pointer`}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div
          className={`flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto ${
            isRtl ? "justify-start flex-row-reverse" : "justify-start"
          }`}
        >
          {/* Action Type Select */}
          <div className="relative min-w-[140px] sm:min-w-[165px] flex-1 sm:flex-initial">
            <select
              value={filters.actionType || "ALL"}
              onChange={handleActionTypeChange}
              className={`w-full appearance-none ${
                isRtl ? "pr-4 pl-9 text-right" : "pl-4 pr-9 text-left"
              } py-2.5 bg-surface-container-low rounded-full border border-card-border text-xs font-bold text-on-surface hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer`}
            >
              <option value="ALL">{t.allActions}</option>
              <option value="UserStatusUpdated">
                {isRtl ? "تحديث حالة حساب" : "User Status Updated"}
              </option>
              <option value="StoreVerified">
                {isRtl ? "توثيق/مراجعة مؤسسة" : "Store/Org Verified"}
              </option>
              <option value="Pricing Change">{t.pricingChange}</option>
              <option value="Listing Moderation">{t.listingModeration}</option>
              <option value="Donation Decision">{t.donationDecision}</option>
            </select>
            <div
              className={`absolute inset-y-0 ${
                isRtl ? "left-0 pl-3.5" : "right-0 pr-3.5"
              } flex items-center pointer-events-none text-outline`}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Date Range Select */}
          <div className="relative min-w-[130px] sm:min-w-[150px] flex-1 sm:flex-initial">
            <select
              value={filters.dateRange || "ALL"}
              onChange={handleDateRangeChange}
              className={`w-full appearance-none ${
                isRtl ? "pr-4 pl-9 text-right" : "pl-4 pr-9 text-left"
              } py-2.5 bg-surface-container-low rounded-full border border-card-border text-xs font-bold text-on-surface hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer`}
            >
              <option value="ALL">{t.allTime}</option>
              <option value="TODAY">{t.today}</option>
              <option value="7DAYS">{t.last7Days}</option>
              <option value="30DAYS">{t.last30Days}</option>
            </select>
            <div
              className={`absolute inset-y-0 ${
                isRtl ? "left-0 pl-3.5" : "right-0 pr-3.5"
              } flex items-center pointer-events-none text-outline`}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Severity Select */}
          <div className="relative min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-initial">
            <select
              value={filters.severity || "ALL"}
              onChange={handleSeverityChange}
              className={`w-full appearance-none ${
                isRtl ? "pr-4 pl-9 text-right" : "pl-4 pr-9 text-left"
              } py-2.5 bg-surface-container-low rounded-full border border-card-border text-xs font-bold text-on-surface hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs cursor-pointer`}
            >
              <option value="ALL">{t.allSeverities}</option>
              <option value="Low">{t.severityLow}</option>
              <option value="Med">{t.severityMed}</option>
              <option value="High">{t.severityHigh}</option>
            </select>
            <div
              className={`absolute inset-y-0 ${
                isRtl ? "left-0 pl-3.5" : "right-0 pr-3.5"
              } flex items-center pointer-events-none text-outline`}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCsv}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-container hover:bg-primary text-white text-xs font-extrabold rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <DownloadIcon className="w-4 h-4 text-white" />
            <span>{t.exportCsvBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
