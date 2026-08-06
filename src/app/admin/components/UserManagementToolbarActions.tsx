import React from "react";

interface UserManagementToolbarActionsProps {
  onExportCSV: () => void;
  onOpenEnrollModal: () => void;
  exportCsvLabel: string;
  isRtl: boolean;
}

export const UserManagementToolbarActions: React.FC<
  UserManagementToolbarActionsProps
> = ({ onExportCSV, onOpenEnrollModal, exportCsvLabel, isRtl }) => {
  return (
    <div className="flex items-center gap-3 self-end md:self-auto">
      <button
        onClick={onExportCSV}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer whitespace-nowrap"
      >
        <svg
          className="w-4 h-4 text-outline"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <span>{exportCsvLabel}</span>
      </button>

      <button
        onClick={onOpenEnrollModal}
        className="flex items-center gap-2 bg-primary-container hover:bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
        <span>{isRtl ? "تسجيل يدوي" : "Manual Enroll"}</span>
      </button>
    </div>
  );
};
