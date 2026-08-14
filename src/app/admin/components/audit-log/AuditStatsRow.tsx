import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { StatsCard } from "../common/StatsCard";

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
      <StatsCard
        label={t.activeSessions}
        value={stats.activeSessions}
        subtitle={
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.liveNow}</span>
          </span>
        }
        accentClass="bg-emerald-500"
        iconBgClass="bg-emerald-50 text-emerald-700"
        isRtl={isRtl}
      />

      {/* 2. AI Decisions (24h) */}
      <StatsCard
        label={t.aiDecisions24h}
        value={stats.aiDecisions24h.toLocaleString()}
        subtitle={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 font-sans">
            High-Precision Logic
          </span>
        }
        accentClass="bg-blue-500"
        iconBgClass="bg-blue-50 text-blue-700"
        isRtl={isRtl}
      />

      {/* 3. Flagged Events */}
      <StatsCard
        label={t.flaggedEvents}
        value={stats.flaggedEvents}
        textColorClass="text-rose-600"
        subtitle={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-800 border border-rose-200">
            {t.attentionSub}
          </span>
        }
        accentClass="bg-rose-500"
        iconBgClass="bg-rose-50 text-rose-700"
        isRtl={isRtl}
      />

      {/* 4. System Health */}
      <StatsCard
        label={t.systemHealth}
        value={t.stableOps}
        subtitle={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 font-sans">
            PostgreSQL / .NET API
          </span>
        }
        accentClass="bg-teal-500"
        iconBgClass="bg-teal-50 text-teal-700"
        isRtl={isRtl}
      />
    </div>
  );
};
