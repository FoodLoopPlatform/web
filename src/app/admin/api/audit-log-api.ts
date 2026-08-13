import {
  AuditLogFilterParams,
  AuditLogFetchResult,
  AuditLogItem,
} from "../types/admin.types";
import { fetchMockAuditLogs } from "../mocks/audit-log.mock";
import { withAuth } from "@/utils/api-client";

/**
 * Fetches paginated and filtered audit log entries requiring admin authentication.
 */
export async function getAuditLogs(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  const res = await withAuth<AuditLogFetchResult>(async () => {
    const data = await fetchMockAuditLogs(params);
    return { data };
  });

  return (
    res.data ?? {
      items: [],
      total: 0,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 5,
      totalPages: 0,
      stats: {
        activeSessions: 0,
        aiDecisions24h: 0,
        flaggedEvents: 0,
        systemHealthStatus: "Unavailable",
      },
    }
  );
}

/**
 * Generates and downloads a CSV export of audit logs adhering to applied filters.
 * Requires admin authentication via withAuth.
 */
export async function exportAuditLogsCsv(
  params: AuditLogFilterParams = {},
  isRtl: boolean = false,
): Promise<void> {
  return withAuth<undefined>(async () => {
    const fullResult = await getAuditLogs({
      ...params,
      page: 1,
      pageSize: 10000,
    });

    const headers = isRtl
      ? [
          "المعرف",
          "نوع الإجراء",
          "الجهة الفاعلة",
          "التوقيت",
          "الأهمية",
          "التفاصيل",
        ]
      : ["ID", "Action Type", "Actor", "Timestamp", "Severity", "Details"];

    const rows = fullResult.items.map((item: AuditLogItem) => [
      item.id,
      item.actionType,
      item.actorName,
      item.timestamp,
      item.severity,
      `"${(isRtl ? item.detailsAr : item.detailsEn).replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `foodloop_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return { data: undefined };
  }).then(() => undefined);
}
