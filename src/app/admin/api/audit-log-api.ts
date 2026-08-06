import {
  AuditLogFilterParams,
  AuditLogFetchResult,
  AuditLogItem,
} from "../types/admin.types";
import { fetchMockAuditLogs } from "../mocks/audit-log.mock";

/**
 * Fetches paginated and filtered audit log entries.
 */
export async function getAuditLogs(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  // Simulate network delay for non-blocking asynchronous fetching
  await new Promise((resolve) => setTimeout(resolve, 80));
  return fetchMockAuditLogs(params);
}

/**
 * Generates and downloads a CSV export of audit logs adhering to applied filters.
 * Runs asynchronously via Blob creation without blocking UI thread.
 */
export async function exportAuditLogsCsv(
  params: AuditLogFilterParams = {},
  isRtl: boolean = false,
): Promise<void> {
  // Fetch all matching records without pagination for the export
  const fullResult = fetchMockAuditLogs({
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
    "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

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
}
