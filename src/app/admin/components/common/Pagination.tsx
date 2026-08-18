"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  isRtl?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 5,
  onPageChange,
  isRtl = false,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array (strictly 2 pages before and 2 pages after current page)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const prevButton = (
    <button
      key="prev"
      type="button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
      title={isRtl ? "الصفحة السابقة" : "Previous Page"}
    >
      <svg
        className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="hidden sm:inline">{isRtl ? "السابق" : "Prev"}</span>
    </button>
  );

  const nextButton = (
    <button
      key="next"
      type="button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages || totalPages === 0}
      className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
      title={isRtl ? "الصفحة التالية" : "Next Page"}
    >
      <span className="hidden sm:inline">{isRtl ? "التالي" : "Next"}</span>
      <svg
        className={`w-3.5 h-3.5 ${isRtl ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );

  const pageNumbers = (
    <div key="numbers" className="flex items-center gap-1">
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
              isActive
                ? "bg-primary-container text-white shadow-xs scale-105"
                : "bg-white text-on-surface-variant border border-surface-container hover:bg-surface-container"
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="px-4 py-3 bg-surface border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline"
    >
      {/* Range Counter */}
      <div className="font-medium">
        {isRtl ? (
          <>
            عرض{" "}
            <span className="font-extrabold text-on-surface">{startItem}</span>{" "}
            - <span className="font-extrabold text-on-surface">{endItem}</span>{" "}
            من إجمالي{" "}
            <span className="font-extrabold text-on-surface">{totalItems}</span>{" "}
            عنصر
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-extrabold text-on-surface">{startItem}</span>{" "}
            to <span className="font-extrabold text-on-surface">{endItem}</span>{" "}
            of{" "}
            <span className="font-extrabold text-on-surface">{totalItems}</span>{" "}
            entries
          </>
        )}
      </div>

      {/* Page controls */}
      {totalPages > 1 && (
        <div dir={isRtl ? "rtl" : "ltr"} className="flex items-center gap-1.5">
          {prevButton}
          {pageNumbers}
          {nextButton}
        </div>
      )}
    </div>
  );
};
