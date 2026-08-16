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

  const userRes = await getUserDetailServer(id);
  const role = userRes.data?.role || "Consumer";

  const [actRes, revRes] = await Promise.all([
    getUserActivityEntriesServer(id, role),
    role === "Store"
      ? getAdminReviewsServer({ storeId: id, pageSize: 50 })
      : Promise.resolve({ data: [] }),
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
