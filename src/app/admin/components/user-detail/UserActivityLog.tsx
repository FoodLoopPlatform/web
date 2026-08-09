"use client";

import React, { useState } from "react";
import { UserActivityEntry } from "../../types/admin.types";
import { ActivityLogEntry } from "./ActivityLogEntry";
import { DownloadIcon, SpinnerIcon } from "@/components/icons";
import { Pagination } from "../common/Pagination";

interface UserActivityLogProps {
  entries: UserActivityEntry[];
  isLoading?: boolean;
  isRtl?: boolean;
  onExport: () => void;
  pageSize?: number;
}

export const UserActivityLog: React.FC<UserActivityLogProps> = ({
  entries,
  isLoading = false,
  isRtl = false,
  onExport,
  pageSize = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever entries change
  const [prevEntriesLength, setPrevEntriesLength] = useState(entries.length);
  if (prevEntriesLength !== entries.length) {
    setPrevEntriesLength(entries.length);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(entries.length / pageSize) || 1;
  const paginatedEntries = entries.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6 ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container pb-4">
        <h3 className="text-sm font-extrabold text-on-surface">
          {isRtl ? "سجل أنشطة المستخدم" : "User Activity Log"}
        </h3>

        <button
          onClick={onExport}
          disabled={entries.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-on-surface-variant bg-surface hover:bg-surface-container border border-outline-variant rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          <DownloadIcon className="w-3.5 h-3.5 text-outline" />
          {isRtl ? "تصدير السجلات" : "Export Logs"}
        </button>
      </div>

      {/* Content body */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-xs text-outline gap-2">
          <SpinnerIcon className="animate-spin h-4 w-4 text-primary-container" />
          {isRtl ? "جارٍ التحميل..." : "Loading activity log..."}
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-xs text-outline">
          {isRtl
            ? "لا يوجد أنشطة مسجلة لهذا المستخدم."
            : "No activity recorded for this user yet."}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col pt-2">
            {paginatedEntries.map((entry, idx) => (
              <ActivityLogEntry
                key={`${entry.id || "act"}-${idx}`}
                entry={entry}
                isLast={idx === paginatedEntries.length - 1}
                isRtl={isRtl}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={entries.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            isRtl={isRtl}
          />
        </div>
      )}
    </div>
  );
};
