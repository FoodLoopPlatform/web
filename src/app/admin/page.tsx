import { Suspense } from "react";
import { UserManagementShell, UserManagementSkeleton } from "./components";
import {
  getAnalyticsSummaryServer,
  getAdminConsumersServer,
  getAdminStoresServer,
  getAdminCharitiesServer,
} from "./api/server-admin-api";
import { getAuditLogsServer } from "./api/server-audit-log-api";

export default async function UserManagementPage() {
  const [analyticsRes, consumersRes, storesRes, charitiesRes, auditRes] =
    await Promise.all([
      getAnalyticsSummaryServer(),
      getAdminConsumersServer(),
      getAdminStoresServer(),
      getAdminCharitiesServer(),
      getAuditLogsServer({ pageSize: 5 }),
    ]);

  return (
    <Suspense fallback={<UserManagementSkeleton />}>
      <UserManagementShell
        initialAnalytics={analyticsRes.data ?? null}
        initialConsumers={consumersRes.data ?? []}
        initialStores={storesRes.data ?? []}
        initialCharities={charitiesRes.data ?? []}
        initialAuditLogs={auditRes.items ?? []}
      />
    </Suspense>
  );
}
