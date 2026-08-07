import React from "react";
import { ActivityLog } from "../../types/admin.types";

interface AuditLogsWidgetProps {
  title: string;
  logs: ActivityLog[];
  isRtl?: boolean;
}

export const AuditLogsWidget: React.FC<AuditLogsWidgetProps> = ({
  title,
  logs,
  isRtl = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm">
      <h3
        className={`text-sm font-extrabold text-primary-container pb-4 border-b border-surface-container ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {title}
      </h3>
      <ul className="flex flex-col gap-3.5 mt-4 divide-y divide-surface-container/50">
        {logs.map((log) => {
          let actionText = log.action;
          if (isRtl) {
            if (log.action.includes("Replied to ticket"))
              actionText = actionText.replace(
                "Replied to ticket",
                "ردّ على تذكرة الدعم",
              );
            if (log.action.includes("Closed ticket"))
              actionText = actionText.replace(
                "Closed ticket",
                "أغلق تذكرة الدعم",
              );
            if (log.action.includes("Deleted flagged review"))
              actionText = actionText.replace(
                "Deleted flagged review",
                "حذف التقييم المبلغ عنه",
              );
          }

          return (
            <li
              key={log.id}
              className={`pt-3 first:pt-0 flex flex-col gap-1 text-[11px] ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`flex justify-between ${
                  isRtl ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <span className="font-bold text-on-surface">
                  {log.adminName}
                </span>
                <span className="text-outline">{log.timestamp}</span>
              </div>
              <p className="text-on-surface-variant font-medium leading-relaxed">
                {actionText}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
