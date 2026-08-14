import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { AnalyticsSummary } from "../../types/admin.types";
import { StatsCard } from "../common/StatsCard";

interface UserManagementStatsProps {
  t: AdminDictionary;
  analytics: AnalyticsSummary | null;
  isRtl: boolean;
}

export const UserManagementStats: React.FC<UserManagementStatsProps> = ({
  t,
  analytics,
  isRtl,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatsCard
        label={t.totalUsers}
        value={
          analytics?.totalConsumers != null
            ? analytics.totalConsumers.toLocaleString()
            : "0"
        }
        accentClass="bg-emerald-800"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeStores}
        value={
          analytics?.totalStores != null
            ? analytics.totalStores.toLocaleString()
            : "0"
        }
        accentClass="bg-emerald-800"
        textColorClass="text-emerald-900"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeCharities}
        value={
          analytics?.totalCharities != null
            ? analytics.totalCharities.toLocaleString()
            : "0"
        }
        accentClass="bg-blue-400"
        textColorClass="text-on-surface"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.pendingApproval}
        value={
          analytics != null
            ? (
                (analytics.pendingStoresCount ?? 0) +
                (analytics.pendingCharitiesCount ?? 0)
              ).toLocaleString()
            : "0"
        }
        accentClass="bg-amber-500"
        iconBgClass="bg-slate-100 text-slate-400"
        isRtl={isRtl}
      />
    </div>
  );
};
