"use client";

import React from "react";
import { AdminDictionary } from "../constants/dictionary";
import { AuditLogItem } from "../types/admin.types";
import { AuditActionBadge } from "./AuditActionBadge";
import { AuditSeverityBadge } from "./AuditSeverityBadge";
import { EyeIcon } from "@/components/icons";

interface AuditLogTableProps {
  t: AdminDictionary;
  isRtl?: boolean;
  items: AuditLogItem[];
  onViewDetails: (item: AuditLogItem) => void;
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  t,
  isRtl = false,
  items,
  onViewDetails,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table
          className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
        >
          <thead>
            <tr className="bg-surface border-b border-card-border">
              <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-outline whitespace-nowrap">
                {t.actionTypeLabel}
              </th>
              <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-outline whitespace-nowrap">
                {t.actorCol}
              </th>
              <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-outline whitespace-nowrap">
                {t.timestampCol}
              </th>
              <th className="px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-outline whitespace-nowrap">
                {t.severityLabel}
              </th>
              <th className="px-4 py-3.5 text-[10px] font-extrabold uppercase tracking-wider text-outline whitespace-nowrap text-center">
                {t.actionsCol}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {items.map((item) => {
              const initials = item.actorName
                .replace("Admin ", "")
                .replace("System ", "")
                .slice(0, 2)
                .toUpperCase();

              return (
                <tr
                  key={item.id}
                  className="hover:bg-surface/70 transition-colors group cursor-pointer"
                  onClick={() => onViewDetails(item)}
                >
                  {/* Action Type */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <AuditActionBadge actionType={item.actionType} t={t} />
                  </td>

                  {/* Actor */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      {item.actorRole === "System AI" ? (
                        <div className="w-7 h-7 rounded-full bg-primary-fixed border border-primary-fixed-dim/40 flex items-center justify-center text-primary font-black text-[10px] shrink-0 shadow-2xs">
                          AI
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/60 text-on-surface font-extrabold flex items-center justify-center text-[10px] shrink-0 shadow-2xs">
                          {initials}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-on-surface">
                          {item.actorRole === "System AI"
                            ? t.systemAiActor
                            : item.actorName}
                        </span>
                        <span className="text-[10px] text-outline font-medium">
                          {item.actorRole}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Timestamp */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono font-medium text-on-surface-variant">
                      {item.timestamp}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <AuditSeverityBadge severity={item.severity} t={t} />
                  </td>

                  {/* View Details Icon Action */}
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(item);
                      }}
                      className="p-2 rounded-xl text-outline hover:text-primary hover:bg-surface-container transition-all cursor-pointer inline-flex items-center justify-center"
                      title={t.detailsCol}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
