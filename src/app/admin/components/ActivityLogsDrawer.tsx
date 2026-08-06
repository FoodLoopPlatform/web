import React from "react";
import { ActivityLog } from "../types/admin.types";
import { CloseIcon } from "@/components/icons";

interface ActivityLogsDrawerProps {
  isOpen: boolean;
  isRtl?: boolean;
  userId: string | null;
  userName: string;
  logs: ActivityLog[];
  onClose: () => void;
}

export const ActivityLogsDrawer: React.FC<ActivityLogsDrawerProps> = ({
  isOpen,
  isRtl = false,
  userId,
  userName,
  logs,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Dim overlay */}
      <div className="fixed inset-0 z-[9998] bg-black/55" onClick={onClose} />
      {/* Drawer panel */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRtl ? "left-0" : "right-0"
        } z-[9999] w-full max-w-[420px] bg-white shadow-2xl flex flex-col p-6 gap-5 overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-container pb-4">
          <div>
            <div className="text-sm font-extrabold text-on-surface">
              {userName}
            </div>
            <div className="text-[10px] text-outline font-mono mt-0.5">
              {userId}
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer bg-transparent border-0 p-1.5 rounded-lg text-outline hover:text-on-surface transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Log entries */}
        <div className="flex flex-col gap-2.5 flex-1">
          {logs.length === 0 ? (
            <p className="text-xs text-outline text-center py-8">
              {isRtl
                ? "لا توجد سجلات تدقيق لهذه الجهة."
                : "No activity logs found for this user."}
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-surface border border-surface-container rounded-xl text-xs flex flex-col gap-1"
              >
                <div className="flex justify-between text-[10px] text-outline">
                  <span className="font-bold">{log.adminName}</span>
                  <span>{log.timestamp}</span>
                </div>
                <p className="text-on-surface m-0">{log.action}</p>
              </div>
            ))
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2.5 bg-surface-container text-on-surface font-bold rounded-xl border-0 cursor-pointer text-xs hover:bg-surface-container-high transition-colors"
        >
          {isRtl ? "إغلاق اللوحة" : "Close Panel"}
        </button>
      </div>
    </>
  );
};
