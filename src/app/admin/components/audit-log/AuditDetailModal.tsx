"use client";

import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { AuditLogItem } from "../../types/admin.types";
import { AuditActionBadge } from "../audit-log/AuditActionBadge";
import { AuditSeverityBadge } from "../audit-log/AuditSeverityBadge";
import { CloseIcon } from "@/components/icons";

interface AuditDetailModalProps {
  t: AdminDictionary;
  isRtl?: boolean;
  item: AuditLogItem | null;
  onClose: () => void;
}

export const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  t,
  isRtl = false,
  item,
  onClose,
}) => {
  if (!item) return null;

  const detailText = isRtl ? item.detailsAr || item.detailsEn : item.detailsEn;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl min-w-[320px] sm:min-w-[540px] md:min-w-[650px] bg-white rounded-3xl shadow-2xl border border-card-border p-6 sm:p-8 flex flex-col gap-6 shrink-0 my-auto ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-card-border pb-5 gap-4 ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black text-primary bg-primary-fixed/40 px-3 py-1.5 rounded-xl border border-primary-fixed-dim/40">
              {item.id}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-on-surface font-brand">
              {t.viewAuditDetailsModalTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer shrink-0"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-5 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface p-5 rounded-2xl border border-outline-variant/60">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                {t.actionTypeLabel}
              </span>
              <AuditActionBadge actionType={item.actionType} t={t} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                {t.severityLabel}
              </span>
              <AuditSeverityBadge severity={item.severity} t={t} />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                {t.actorCol}
              </span>
              <span className="font-extrabold text-on-surface block text-sm">
                {item.actorName}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1.5">
                {t.timestampCol}
              </span>
              <span className="font-mono font-bold text-on-surface-variant block text-xs sm:text-sm">
                {item.timestamp}
              </span>
            </div>
          </div>

          {/* Log Details Description Box */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
              {t.detailsCol}
            </span>
            <div className="p-4 bg-surface rounded-2xl border border-outline-variant/50 text-sm font-medium text-on-surface leading-relaxed whitespace-pre-wrap">
              {detailText}
            </div>
          </div>

          {/* Target Resource Metadata if available */}
          {item.targetName && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline">
                {isRtl ? "المورد المستهدف" : "Target Resource"}
              </span>
              <div className="flex items-center justify-between p-4 bg-primary-fixed/20 rounded-2xl border border-primary-fixed-dim/30">
                <span className="font-bold text-primary text-sm">
                  {item.targetName}
                </span>
                <span className="font-mono text-xs text-primary-container font-extrabold">
                  {item.targetId}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end pt-4 border-t border-card-border ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-extrabold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            {t.drawerClose}
          </button>
        </div>
      </div>
    </div>
  );
};
