import { Suspense } from "react";
import { UserManagementShell, UserManagementSkeleton } from "./components";
import {
  getAnalyticsSummaryServer,
  getAdminConsumersServer,
  getAdminStoresServer,
  getAdminCharitiesServer,
} from "./api/server-admin-api";

export default async function UserManagementPage() {
  const [analyticsRes, consumersRes, storesRes, charitiesRes] =
    await Promise.all([
      getAnalyticsSummaryServer(),
      getAdminConsumersServer(),
      getAdminStoresServer(),
      getAdminCharitiesServer(),
    ]);

  return (
    <Suspense fallback={<UserManagementSkeleton />}>
      <UserManagementShell
        initialAnalytics={analyticsRes.data ?? null}
        initialConsumers={consumersRes.data ?? []}
        initialStores={storesRes.data ?? []}
        initialCharities={charitiesRes.data ?? []}
      />
    </Suspense>
  );
}
