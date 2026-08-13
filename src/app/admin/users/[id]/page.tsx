import { Suspense } from "react";
import { UserDetailShell, UserDetailSkeleton } from "../../components";
import {
  getUserDetailServer,
  getUserActivityEntriesServer,
  getAdminReviewsServer,
} from "../../api/server-admin-api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [userRes, actRes, revRes] = await Promise.all([
    getUserDetailServer(id),
    getUserActivityEntriesServer(id),
    getAdminReviewsServer({ storeId: id, pageSize: 50 }),
  ]);

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailShell
        id={id}
        initialUser={userRes.data ?? null}
        initialActivities={actRes.data ?? []}
        initialReviews={revRes.data ?? []}
      />
    </Suspense>
  );
}
