import React from "react";

export interface FilterOption<T extends string> {
  id: T;
  label: string;
}

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
            } flex items-center pointer-events-none text-[#707a70]`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder={placeholder}
            className={`w-full py-2 text-xs rounded-xl border border-[#bfc9be] focus:outline-none focus:ring-1 focus:ring-[#266b40] focus:border-[#266b40] bg-[#fafaf4] text-[#1a1c19] ${
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
                  ? "border-[#005129] bg-[#005129]/10 text-[#005129]"
                  : "border-[#bfc9be] text-[#404941] bg-[#fafaf4] hover:bg-[#eeeee9]"
              }`}
            >
              <svg className="w-4 h-4 text-[#707a70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
              </svg>
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
                  } bg-white border border-[#bfc9be] rounded-xl shadow-xl p-3 z-30 w-48 flex flex-col gap-1`}
                >
                  {filterTitle && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider text-[#707a70] mb-1.5 px-2 ${
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
                          ? "bg-[#abf3bc] text-[#00381a] font-bold"
                          : "hover:bg-[#fafaf4] text-[#404941]"
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
