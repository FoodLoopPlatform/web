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
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`absolute top-0 ${
            isRtl ? "right-0" : "left-0"
          } w-1.5 h-full bg-emerald-500`}
        />
        <div className="pl-1 pr-1">
          <span className="text-[11px] font-extrabold text-outline uppercase tracking-wider block">
            {t.activeSessions}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-on-surface block mt-2 tracking-tight font-mono">
            {stats.activeSessions}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-4 self-start pl-1 pr-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>{t.liveNow}</span>
          </span>
        </div>
      </div>

      {/* 2. AI Decisions (24h) */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`absolute top-0 ${
            isRtl ? "right-0" : "left-0"
          } w-1.5 h-full bg-blue-500`}
        />
        <div className="pl-1 pr-1">
          <span className="text-[11px] font-extrabold text-outline uppercase tracking-wider block">
            {t.aiDecisions24h}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-on-surface block mt-2 tracking-tight font-mono">
            {stats.aiDecisions24h.toLocaleString()}
          </span>
        </div>
        <div className="mt-4 self-start pl-1 pr-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-950 border border-blue-300">
            High-Precision Logic
          </span>
        </div>
      </div>

      {/* 3. Flagged Events */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`absolute top-0 ${
            isRtl ? "right-0" : "left-0"
          } w-1.5 h-full bg-rose-500`}
        />
        <div className="pl-1 pr-1">
          <span className="text-[11px] font-extrabold text-outline uppercase tracking-wider block">
            {t.flaggedEvents}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-rose-700 block mt-2 tracking-tight font-mono">
            {stats.flaggedEvents}
          </span>
        </div>
        <div className="mt-4 self-start pl-1 pr-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-950 border border-rose-300">
            {t.attentionSub}
          </span>
        </div>
      </div>

      {/* 4. System Health */}
      <div
        className={`bg-white rounded-2xl border border-card-border p-5 shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-sm transition-all ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`absolute top-0 ${
            isRtl ? "right-0" : "left-0"
          } w-1.5 h-full bg-teal-500`}
        />
        <div className="pl-1 pr-1">
          <span className="text-[11px] font-extrabold text-outline uppercase tracking-wider block">
            {t.systemHealth}
          </span>
          <span className="text-xl sm:text-2xl font-black text-on-surface block mt-2 tracking-tight font-sans">
            {t.stableOps}
          </span>
        </div>
        <div className="mt-4 self-start pl-1 pr-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 text-teal-950 border border-teal-300 font-mono">
            PostgreSQL / .NET API
          </span>
        </div>
      </div>
    </div>
  );
};
