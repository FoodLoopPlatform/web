"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isRtl?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  isRtl = false,
}) => {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div
      className={`px-4 py-3 bg-surface border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline ${
        isRtl ? "flex-row-reverse" : ""
      }`}
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
        <div
          className={`flex items-center gap-1.5 ${isRtl ? "flex-row-reverse" : ""}`}
        >
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1"
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
            <span className="hidden sm:inline">
              {isRtl ? "السابق" : "Prev"}
            </span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pages.map((page) => {
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "bg-primary-container text-white shadow-xs"
                      : "bg-white text-on-surface-variant border border-surface-container hover:bg-surface-container"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1"
            title={isRtl ? "الصفحة التالية" : "Next Page"}
          >
            <span className="hidden sm:inline">
              {isRtl ? "التالي" : "Next"}
            </span>
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
        </div>
      )}
    </div>
  );
};
