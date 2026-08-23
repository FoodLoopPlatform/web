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

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const userRes = await getUserDetailServer(id);
  const userName = userRes.data?.name || "المستخدم";
  return {
    title: `${userName} | تفاصيل الحساب | User Profile`,
    description: `FoodLoop Admin Portal - Account Details for ${userName}`,
  };
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
