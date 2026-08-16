import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import type {
  AuditLogFilterParams,
  AuditLogFetchResult,
  RawActivityLog,
  AuditLogItem,
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

export async function getAuditLogsServer(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;

  try {
    const res = await withServerAuth<AuditLogFetchResult>(async (token) => {
      const query = new URLSearchParams();
      query.set("pageNumber", page.toString());
      query.set("pageSize", pageSize.toString());

      console.log(
        `[getAuditLogsServer] Token starts with: ${token?.substring(0, 10)}...`,
      );

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
    console.error("Failed to fetch server audit logs:", err);
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
