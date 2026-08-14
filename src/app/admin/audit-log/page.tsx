import { Suspense } from "react";
import { AuditLogClientContainer, AuditLogSkeleton } from "../components";
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
