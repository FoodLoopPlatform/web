import React from "react";
import { UserActivityEntry } from "../api/user-detail-api";
import { ActivityLogEntry } from "./ActivityLogEntry";

interface UserActivityLogProps {
  entries: UserActivityEntry[];
  isLoading?: boolean;
  isRtl?: boolean;
  onExport: () => void;
}

export const UserActivityLog: React.FC<UserActivityLogProps> = ({
  entries,
  isLoading = false,
  isRtl = false,
  onExport,
}) => {
  return (
    <div className={`bg-white rounded-2xl border border-[#e0e6df] p-6 shadow-sm flex flex-col gap-6 ${isRtl ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eeeee9] pb-4">
        <h3 className="text-sm font-extrabold text-[#1a1c19]">
          {isRtl ? "سجل أنشطة المستخدم" : "User Activity Log"}
        </h3>

        <button
          onClick={onExport}
          disabled={entries.length === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#404941] bg-[#fafaf4] hover:bg-[#eeeee9] border border-[#bfc9be] rounded-xl transition-all disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-[#707a70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isRtl ? "تصدير السجلات" : "Export Logs"}
        </button>
      </div>

      {/* Content body */}
      {isLoading ? (
        <div className="py-12 flex justify-center items-center text-xs text-[#707a70]">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#005129]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {isRtl ? "جارٍ التحميل..." : "Loading activity log..."}
        </div>
      ) : entries.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#707a70]">
          {isRtl ? "لا يوجد أنشطة مسجلة لهذا المستخدم." : "No activity recorded for this user yet."}
        </div>
      ) : (
        <div className="flex flex-col pt-2">
          {entries.map((entry, idx) => (
            <ActivityLogEntry
              key={`${entry.id || "act"}-${idx}`}
              entry={entry}
              isLast={idx === entries.length - 1}
              isRtl={isRtl}
            />
          ))}
        </div>
      )}
    </div>
  );
};
