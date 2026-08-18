import React from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { AnalyticsSummary } from "../../types/admin.types";
import { StatsCard } from "../common/StatsCard";

interface UserManagementStatsProps {
  t: AdminDictionary;
  consumersCount: number;
  storesCount: number;
  charitiesCount: number;
  pendingCount: number;
  isRtl: boolean;
}

export const UserManagementStats: React.FC<UserManagementStatsProps> = ({
  t,
  consumersCount,
  storesCount,
  charitiesCount,
  pendingCount,
  isRtl,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <StatsCard
        label={t.totalUsers}
        value={(consumersCount + storesCount + charitiesCount).toLocaleString()}
        accentClass="bg-emerald-800"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeStores}
        value={storesCount.toLocaleString()}
        accentClass="bg-emerald-800"
        textColorClass="text-emerald-900"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.activeCharities}
        value={charitiesCount.toLocaleString()}
        accentClass="bg-blue-400"
        textColorClass="text-on-surface"
        iconBgClass="bg-emerald-50 text-emerald-800 border border-emerald-100/50"
        isRtl={isRtl}
      />
      <StatsCard
        label={t.pendingApproval}
        value={pendingCount.toLocaleString()}
        accentClass="bg-amber-500"
        iconBgClass="bg-slate-100 text-slate-400"
        isRtl={isRtl}
      />
    </div>
  );
};
