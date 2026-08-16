import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  AuditLogFilterParams,
  AuditLogFetchResult,
  AuditLogItem,
  RawActivityLog,
} from "../types/admin.types";
import { normalizeActivityLog } from "./admin-normalizers";

function getDateRangeParams(range?: string): { from?: string; to?: string } {
  if (!range || range === "ALL") return {};

  const now = new Date();
  const to = now.toISOString();
  let from = "";

  if (range === "TODAY") {
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    from = startOfDay.toISOString();
  } else if (range === "7DAYS") {
    from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  } else if (range === "30DAYS") {
    from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  return { from, to };
}

export async function getAuditLogs(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 5;

  try {
    const res = await withAuth<AuditLogFetchResult>(async (token) => {
      const query = new URLSearchParams();
      query.set("pageNumber", page.toString());
      query.set("pageSize", pageSize.toString());

      if (params.search?.trim()) {
        query.set("searchTerm", params.search.trim());
      }
      if (params.actionType && params.actionType !== "ALL") {
        query.set("eventType", params.actionType);
      }

      const { from, to } = getDateRangeParams(params.dateRange);
      if (from) query.set("dateFrom", from);
      if (to) query.set("dateTo", to);

      const url = `${Endpoints.baseUrl}${Endpoints.admin.adminActionsLogs}?${query.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "ar",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        console.error(
          `Audit API failed: ${response.status} ${response.statusText}`,
        );
        throw new Error("Failed to fetch audit logs");
      }

      const json = await response.json();
      const payload = json.data || json;
      const itemsArray = Array.isArray(payload) ? payload : payload.items || [];

      let normalizedItems = itemsArray.map(normalizeActivityLog);

      if (params.severity && params.severity !== "ALL") {
        normalizedItems = normalizedItems.filter(
          (item: AuditLogItem) => item.severity === params.severity,
        );
      }

      const total =
        payload.totalCount ??
        payload.totalItems ??
        payload.total ??
        normalizedItems.length;
      const totalPages = Math.ceil(total / pageSize) || (total > 0 ? 1 : 0);

      const uniqueActors = new Set(
        normalizedItems.map((i: AuditLogItem) => i.actorName),
      ).size;
      const aiDecisions = normalizedItems.filter(
        (i: AuditLogItem) => i.actorRole === "System AI",
      ).length;
      const flaggedCount = normalizedItems.filter(
        (i: AuditLogItem) => i.severity === "High",
      ).length;

      return {
        data: {
          items: normalizedItems,
          total,
          page,
          pageSize,
          totalPages,
          stats: {
            activeSessions: uniqueActors || 0,
            aiDecisions24h: aiDecisions,
            flaggedEvents: flaggedCount,
            systemHealthStatus: "Operational",
          },
        },
      };
    });

    return (
      res.data ?? {
        items: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        stats: {
          activeSessions: 0,
          aiDecisions24h: 0,
          flaggedEvents: 0,
          systemHealthStatus: "Unavailable",
        },
      }
    );
  } catch (err) {
    console.error("Failed to fetch audit logs:", err);
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      stats: {
        activeSessions: 0,
        aiDecisions24h: 0,
        flaggedEvents: 0,
        systemHealthStatus: "Unavailable",
      },
    };
  }
}

/**
 * GET /admin/activity-logs/{id}
 */
export async function getActivityLogById(
  id: string,
  lang: string = "ar",
): Promise<AuditLogItem | null> {
  try {
    const res = await withAuth<AuditLogItem | null>(async (token) => {
      const result = await unwrapEnvelope<RawActivityLog>(
        getMany<FoodLoopEnvelope<RawActivityLog>>(
          Endpoints.admin.activityLogById(id),
          { token, headers: { "Accept-Language": lang } },
        ),
      );

      if (result.data) {
        return { data: normalizeActivityLog(result.data) };
      }

      return { data: null };
    });

    return res.data ?? null;
  } catch (err) {
    console.error(`Failed to fetch activity log ${id}:`, err);
    return null;
  }
}

/**
 * Generates and downloads a CSV export of real audit logs adhering to applied filters.
 */
export async function exportAuditLogsCsv(
  params: AuditLogFilterParams = {},
  isRtl: boolean = false,
): Promise<void> {
  try {
    await withAuth<undefined>(async () => {
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
    });
  } catch (err) {
    console.error("Export CSV failed:", err);
  }
}
