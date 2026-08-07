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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label={t.totalUsers}
        value={
          analytics?.totalConsumers != null
            ? analytics.totalConsumers.toLocaleString()
            : "..."
        }
        accentClass="bg-primary-container/20"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeStores}
        value={
          analytics?.totalStores != null
            ? analytics.totalStores.toLocaleString()
            : "..."
        }
        accentClass="bg-primary-container"
        textColorClass="text-primary-container"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeCharities}
        value={
          analytics?.totalCharities != null
            ? analytics.totalCharities.toLocaleString()
            : "..."
        }
        accentClass="bg-blue-600/30"
        textColorClass="text-blue-900"
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
            : "..."
        }
        accentClass="bg-amber-500/30"
        textColorClass="text-amber-900"
        isRtl={isRtl}
      />
    </div>
  );
};
