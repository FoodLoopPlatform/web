"use client";

import { Suspense } from "react";
import { AnalyticsShell } from "../components";
import { AnalyticsSkeleton } from "../components";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <AnalyticsShell />
    </Suspense>
  );
}
