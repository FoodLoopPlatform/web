"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminDictionary } from "../../constants/dictionary";
import { SecuritySettings } from "../../types/admin.types";
import { ClockIcon } from "@/components/icons";

interface AuditLogRetentionCardProps {
  securitySettings: SecuritySettings;
  t: AdminDictionary;
  isRtl?: boolean;
  onUpdateSecuritySettings: (settings: SecuritySettings) => void;
}

export const AuditLogRetentionCard: React.FC<AuditLogRetentionCardProps> = ({
  securitySettings,
  t,
  isRtl = false,
  onUpdateSecuritySettings,
}) => {
  const [secData, setSecData] = useState<SecuritySettings>({
    ...securitySettings,
  });

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSecuritySettings(secData);
  };

  return (
    <div className="bg-white rounded-2xl border border-card-border p-6 shadow-sm flex flex-col gap-6">
      <div
        className={`flex items-center gap-3 ${isRtl ? "text-right" : "text-left"}`}
      >
        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <ClockIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-primary font-brand">
            {t.auditRetentionLabel}
          </h3>
          <p className="text-xs text-outline font-medium">
            {t.auditRetentionSub}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSecuritySave}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
          <label className="text-xs font-bold text-on-surface">
            {t.auditRetentionLabel}
          </label>
          <select
            value={secData.auditLogRetentionDays}
            onChange={(e) =>
              setSecData((prev) => ({
                ...prev,
                auditLogRetentionDays: parseInt(
                  e.target.value,
                  10,
                ) as SecuritySettings["auditLogRetentionDays"],
              }))
            }
            className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-semibold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value={90}>
              {isRtl
                ? "٩٠ يوماً (الحد الأدنى اللوجستي)"
                : "90 Days (Logistics Minimum)"}
            </option>
            <option value={180}>
              {isRtl ? "١٨٠ يوماً (موصى به)" : "180 Days (Recommended)"}
            </option>
            <option value={365}>
              {isRtl ? "سنة كاملة (٣٦٥ يوماً)" : "1 Full Year (365 Days)"}
            </option>
            <option value={-1}>
              {isRtl
                ? "حفظ دائم دون أرشفة تلقائية"
                : "Permanent (No Auto Archive)"}
            </option>
          </select>
        </div>

        <div className="flex flex-col gap-2 p-4 bg-surface rounded-xl border border-outline-variant/40">
          <label className="text-xs font-bold text-on-surface">
            {t.sessionTimeoutLabel}
          </label>
          <input
            type="number"
            min={5}
            max={240}
            value={secData.sessionTimeoutMinutes}
            onChange={(e) =>
              setSecData((prev) => ({
                ...prev,
                sessionTimeoutMinutes: parseInt(e.target.value, 10) || 30,
              }))
            }
            className="mt-2 w-full p-2.5 rounded-lg border border-outline-variant bg-white text-xs font-bold text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-surface-container">
          <Link
            href="/admin/audit-log"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
          >
            <span>{t.linkAuditLogPage}</span>
          </Link>

          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {t.saveBtn}
          </button>
        </div>
      </form>
    </div>
  );
};
