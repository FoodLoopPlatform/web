import React from "react";
import { AdminDictionary } from "../../constants/dictionary";

interface AuditStatsRowProps {
  t: AdminDictionary;
  isRtl?: boolean;
  stats: {
    activeSessions: number;
    aiDecisions24h: number;
    flaggedEvents: number;
    systemHealthStatus: string;
  };
}

export const AuditStatsRow: React.FC<AuditStatsRowProps> = ({
  t,
  isRtl = false,
  stats,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-2">
      {/* 1. Active Sessions */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm relative overflow-hidden flex flex-col justify-between ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {t.activeSessions}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-mono">
            {stats.activeSessions}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
            {t.liveNow}
          </span>
        </div>
        <div
          className={`absolute top-0 ${
            isRtl ? "left-0" : "right-0"
          } w-1.5 h-full bg-primary-container/15`}
        />
      </div>

      {/* 2. AI Decisions (24h) */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm relative overflow-hidden flex flex-col justify-between ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {t.aiDecisions24h}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-primary block mt-2 tracking-tight font-mono">
            {stats.aiDecisions24h.toLocaleString()}
          </span>
        </div>
        <span className="text-[10px] text-outline font-medium mt-3 block">
          High-Precision Logic
        </span>
        <div
          className={`absolute top-0 ${
            isRtl ? "left-0" : "right-0"
          } w-1.5 h-full bg-surface-tint/15`}
        />
      </div>

      {/* 3. Flagged Events */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm relative overflow-hidden flex flex-col justify-between ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {t.flaggedEvents}
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-error block mt-2 tracking-tight font-mono">
            {stats.flaggedEvents}
          </span>
        </div>
        <span className="text-[10px] font-extrabold text-error-container bg-error-container/20 px-2 py-0.5 rounded-full inline-block mt-3 self-start">
          {t.attentionSub}
        </span>
        <div
          className={`absolute top-0 ${
            isRtl ? "left-0" : "right-0"
          } w-1.5 h-full bg-error/20`}
        />
      </div>

      {/* 4. System Health */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm relative overflow-hidden flex flex-col justify-between ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div>
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase tracking-wider block">
            {t.systemHealth}
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-primary block mt-2 tracking-tight font-sans">
            {t.stableOps}
          </span>
        </div>
        <span className="text-[10px] text-outline font-medium mt-3 block font-mono">
          PostgreSQL / .NET API
        </span>
        <div
          className={`absolute top-0 ${
            isRtl ? "left-0" : "right-0"
          } w-1.5 h-full bg-tertiary-fixed-dim/30`}
        />
      </div>
    </div>
  );
};
