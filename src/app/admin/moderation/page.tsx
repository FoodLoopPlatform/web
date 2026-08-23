import { Suspense } from "react";
import { ModerationShell, ModerationSkeleton } from "../components";
import { getModerationQueueServer } from "../api/server-admin-api";

export const metadata = {
  title: "قائمة المراجعة الذكية | Content Moderation",
  description:
    "FoodLoop Admin Portal - AI-Driven Product Verification and Content Moderation Queue",
};

export default async function ModerationQueuePage() {
  const modRes = await getModerationQueueServer();

  return (
    <Suspense fallback={<ModerationSkeleton />}>
      <ModerationShell initialItems={modRes.data ?? []} />
    </Suspense>
  );
}
