import { Suspense } from "react";
import { AnalyticsShell, AnalyticsSkeleton } from "../components";
import { getAnalyticsSummaryServer } from "../api/server-admin-api";

export default async function AnalyticsPage() {
  const analyticsRes = await getAnalyticsSummaryServer();

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsShell initialAnalytics={analyticsRes.data ?? null} />
    </Suspense>
  );
}
