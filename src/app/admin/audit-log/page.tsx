import { Suspense } from "react";
import { AuditLogClientContainer } from "../components/audit-log/AuditLogClientContainer";
import { AuditLogSkeleton } from "../components/audit-log/AuditLogSkeleton";
import { getAuditLogsServer } from "../api/server-admin-api";

export default async function AuditLogPage() {
  const initialData = await getAuditLogsServer({
    search: "",
    actionType: "ALL",
    dateRange: "ALL",
    severity: "ALL",
    page: 1,
    pageSize: 5,
  });

  return (
    <Suspense fallback={<AuditLogSkeleton />}>
      <AuditLogClientContainer initialData={initialData} />
    </Suspense>
  );
}
