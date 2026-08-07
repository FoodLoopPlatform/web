"use client";

import React from "react";
import { FilterOption } from "../../types/admin.types";
import { SearchIcon, FilterIcon } from "@/components/icons";

export type { FilterOption };

interface SearchToolbarProps<T extends string> {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  isRtl?: boolean;
  filterTitle?: string;
  filterButtonLabel?: string;
  filterOptions?: FilterOption<T>[];
  activeFilter?: T;
  onFilterSelect?: (filterId: T) => void;
  showFilterDropdown?: boolean;
  onToggleFilterDropdown?: () => void;
}

export function SearchToolbar<T extends string>({
  searchQuery,
  onSearchChange,
  placeholder,
  isRtl = false,
  filterTitle,
  filterButtonLabel,
  filterOptions,
  activeFilter,
  onFilterSelect,
  showFilterDropdown = false,
  onToggleFilterDropdown,
}: SearchToolbarProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
      <div className="relative w-full sm:w-[260px] md:w-[300px]">
        <span
          className={`absolute inset-y-0 ${
            isRtl ? "right-0 pr-3.5" : "left-0 pl-3.5"
          } flex items-center pointer-events-none text-outline`}
        >
          <SearchIcon className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full py-2 text-xs rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-surface-tint focus:border-surface-tint bg-surface text-on-surface ${
            isRtl ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
          }`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {filterOptions && onFilterSelect && onToggleFilterDropdown && (
        <div className="relative">
          <button
            type="button"
            onClick={onToggleFilterDropdown}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              activeFilter && activeFilter !== "ALL"
                ? "border-primary-container bg-primary-container/10 text-primary-container"
                : "border-outline-variant text-on-surface-variant bg-surface hover:bg-surface-container"
            }`}
          >
            <FilterIcon className="w-4 h-4 text-outline" />
            <span>
              {filterButtonLabel || "Filter"}
              {activeFilter && activeFilter !== "ALL" && (
                <span className="mr-1 text-[11px] opacity-80">
                  ({filterOptions.find((o) => o.id === activeFilter)?.label})
                </span>
              )}
            </span>
          </button>

          {showFilterDropdown && (
            <>
              <div
                className="fixed inset-0 z-20 cursor-default"
                onClick={onToggleFilterDropdown}
              />
              <div
                className={`absolute top-full mt-2 ${
                  isRtl ? "right-0" : "left-0"
                } bg-white border border-outline-variant rounded-xl shadow-xl p-3 z-30 w-48 flex flex-col gap-1`}
              >
                {filterTitle && (
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider text-outline mb-1.5 px-2 ${
                      isRtl ? "text-right" : "text-left"
                    }`}
                  >
                    {filterTitle}
                  </span>
                )}
                {filterOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      onFilterSelect(opt.id);
                      onToggleFilterDropdown();
                    }}
                    className={`text-xs px-3 py-2 rounded-lg font-medium cursor-pointer transition-all ${
                      isRtl ? "text-right" : "text-left"
                    } ${
                      activeFilter === opt.id
                        ? "bg-primary-fixed text-on-primary-fixed font-bold"
                        : "hover:bg-surface text-on-surface-variant"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
