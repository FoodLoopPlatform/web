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

function applyLocalFilters(
  items: AuditLogItem[],
  params: AuditLogFilterParams,
): AuditLogItem[] {
  let filtered = [...items];

  // Search filter
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (item) =>
        item.actorName.toLowerCase().includes(q) ||
        item.actionType.toLowerCase().includes(q) ||
        item.detailsEn.toLowerCase().includes(q) ||
        item.detailsAr.toLowerCase().includes(q) ||
        (item.targetName && item.targetName.toLowerCase().includes(q)) ||
        (item.targetId && item.targetId.toLowerCase().includes(q)),
    );
  }

  // Action type filter
  if (params.actionType && params.actionType !== "ALL") {
    const act = params.actionType.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.actionType.toLowerCase().includes(act) ||
        (act === "pricing change" &&
          item.actionType.toLowerCase().includes("pricing")) ||
        (act === "listing moderation" &&
          item.actionType.toLowerCase().includes("moderation")) ||
        (act === "userstatusupdated" &&
          (item.actionType.toLowerCase().includes("user") ||
            item.actionType.toLowerCase().includes("status"))) ||
        (act === "storeverified" &&
          (item.actionType.toLowerCase().includes("store") ||
            item.actionType.toLowerCase().includes("organization"))),
    );
  }

  // Severity filter
  if (params.severity && params.severity !== "ALL") {
    const reqSev = params.severity; // "Low" | "Med" | "High"
    filtered = filtered.filter((item) => item.severity === reqSev);
  }

  // Date range filter
  if (params.dateRange && params.dateRange !== "ALL") {
    const now = new Date().getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    filtered = filtered.filter((item) => {
      const itemTime = new Date(item.isoDate).getTime();
      if (isNaN(itemTime)) return true;
      const diffDays = (now - itemTime) / oneDayMs;

      if (params.dateRange === "TODAY") return diffDays <= 1;
      if (params.dateRange === "7DAYS") return diffDays <= 7;
      if (params.dateRange === "30DAYS") return diffDays <= 30;
      return true;
    });
  }

  return filtered;
}

/**
 * Fetches real activity logs from GET /admin/activity-logs (Strictly no mock data).
 */
export async function getAuditLogs(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 5;

  try {
    const res = await withAuth<AuditLogFetchResult>(async (token) => {
      const query = new URLSearchParams();
      // Fetch a larger dataset (up to 100) so local severity/search/date filters work across full history
      query.set("pageNumber", "1");
      query.set("pageSize", "100");

      if (params.search?.trim()) {
        query.set("searchTerm", params.search.trim());
      }
      if (params.actionType && params.actionType !== "ALL") {
        query.set("eventType", params.actionType);
      }

      const result = await unwrapEnvelope<
        RawActivityLog[] | { items: RawActivityLog[]; total?: number }
      >(
        getMany<
          FoodLoopEnvelope<
            RawActivityLog[] | { items: RawActivityLog[]; total?: number }
          >
        >(`${Endpoints.admin.activityLogs}?${query.toString()}`, {
          token,
          headers: { "Accept-Language": "ar" },
        }),
      );

      const rawList = Array.isArray(result.data)
        ? result.data
        : (result.data as { items?: RawActivityLog[] })?.items || [];

      const normalizedItems = rawList.map(normalizeActivityLog);
      const filteredItems = applyLocalFilters(normalizedItems, params);

      const total = filteredItems.length;
      const totalPages = Math.ceil(total / pageSize) || (total > 0 ? 1 : 0);

      const startIndex = (page - 1) * pageSize;
      const paginatedItems = filteredItems.slice(
        startIndex,
        startIndex + pageSize,
      );

      const uniqueActors = new Set(normalizedItems.map((i) => i.actorName))
        .size;
      const aiDecisions = normalizedItems.filter(
        (i) => i.actorRole === "System AI",
      ).length;
      const flaggedCount = normalizedItems.filter(
        (i) => i.severity === "High",
      ).length;

      return {
        data: {
          items: paginatedItems,
          total,
          page,
          pageSize,
          totalPages,
          stats: {
            activeSessions: uniqueActors || 0,
            aiDecisions24h: aiDecisions,
            flaggedEvents: flaggedCount,
            systemHealthStatus: result.error ? "Degraded" : "Operational",
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
    console.error("Failed to fetch activity logs from API:", err);
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
