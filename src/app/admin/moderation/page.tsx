import { Suspense } from "react";
import { ModerationShell, ModerationSkeleton } from "../components";
import { getModerationQueueServer } from "../api/server-admin-api";

export default async function ModerationQueuePage() {
  const modRes = await getModerationQueueServer();

  return (
    <Suspense fallback={<ModerationSkeleton />}>
      <ModerationShell initialItems={modRes.data ?? []} />
    </Suspense>
  );
}
