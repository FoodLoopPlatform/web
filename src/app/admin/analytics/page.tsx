import { Suspense } from "react";
import { AnalyticsShell, AnalyticsSkeleton } from "../components";
import { getAnalyticsSummaryServer } from "../api/server-admin-api";

export const metadata = {
  title: "التحليلات والمؤشرات البيئية | Analytics & Impact",
  description:
    "FoodLoop Admin Portal - Environmental Impact, CO2 Reduction, and Financial Recovery Analytics",
};

export default async function AnalyticsPage() {
  const analyticsRes = await getAnalyticsSummaryServer();

  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsShell initialAnalytics={analyticsRes.data ?? null} />
    </Suspense>
  );
}
