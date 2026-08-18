import { Suspense } from "react";
import { getAdminCommissionsServer } from "../api/server-admin-api";
import { CommissionsShell } from "../components/commissions/CommissionsShell";

export const metadata = {
  title: "إدارة العمولات والأرباح | Platform Commissions",
  description:
    "FoodLoop Admin Portal - Store Commissions and Revenue Management",
};

export default async function AdminCommissionsPage() {
  const commissionsRes = await getAdminCommissionsServer();

  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-20 bg-surface rounded-2xl animate-pulse border border-card-border" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-surface rounded-2xl animate-pulse border border-card-border"
              />
            ))}
          </div>
          <div className="h-80 bg-surface rounded-2xl animate-pulse border border-card-border" />
        </div>
      }
    >
      <CommissionsShell initialCommissions={commissionsRes.data ?? []} />
    </Suspense>
  );
}
