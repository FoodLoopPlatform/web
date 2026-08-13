import { Suspense } from "react";
import { UserDetailShell } from "../../components/user-detail/UserDetailShell";
import { UserDetailSkeleton } from "../../components/user-detail/UserDetailSkeleton";
import {
  getUserDetailServer,
  getUserActivityEntriesServer,
  getAdminReviewsServer,
  getAdminNoteServer,
} from "../../api/server-admin-api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [userRes, actRes, revRes, noteRes] = await Promise.all([
    getUserDetailServer(id),
    getUserActivityEntriesServer(id),
    getAdminReviewsServer({ storeId: id, pageSize: 50 }),
    getAdminNoteServer(id),
  ]);

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailShell
        id={id}
        initialUser={userRes.data ?? null}
        initialActivities={actRes.data ?? []}
        initialReviews={revRes.data ?? []}
        initialAdminNote={noteRes.data ?? ""}
      />
    </Suspense>
  );
}
