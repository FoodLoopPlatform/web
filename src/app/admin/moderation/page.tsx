import { Suspense } from "react";
import { ModerationShell } from "../components/moderation/ModerationShell";
import { ModerationSkeleton } from "../components/moderation/ModerationSkeleton";
import { getModerationQueueServer } from "../api/server-admin-api";

export default async function ModerationQueuePage() {
  const modRes = await getModerationQueueServer();

  return (
    <Suspense fallback={<ModerationSkeleton />}>
      <ModerationShell initialItems={modRes.data ?? []} />
    </Suspense>
  );
}
