"use client";

import { Suspense } from "react";
import { DisputesShell } from "../components";
import { DisputesSkeleton } from "../components";

export default function DisputesPage() {
  return (
    <Suspense fallback={<DisputesSkeleton />}>
      <DisputesShell />
    </Suspense>
  );
}
