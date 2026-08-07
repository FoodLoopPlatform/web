"use client";

import { Suspense } from "react";
import { ModerationShell } from "../components";
import { ModerationSkeleton } from "../components";

export default function ModerationQueuePage() {
  return (
    <Suspense fallback={<ModerationSkeleton />}>
      <ModerationShell />
    </Suspense>
  );
}
