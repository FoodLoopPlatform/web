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

function applyLocalFilters(
  items: AuditLogItem[],
  params: AuditLogFilterParams,
): AuditLogItem[] {
  let filtered = [...items];

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

  if (params.severity && params.severity !== "ALL") {
    const reqSev = params.severity;
    filtered = filtered.filter((item) => item.severity === reqSev);
  }

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

export async function getAuditLogsServer(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 5;

  try {
    return await withServerAuth(async (token) => {
      const query = new URLSearchParams();
      query.set("pageNumber", "1");
      query.set("pageSize", "100");

      if (params.search?.trim()) {
        query.set("searchTerm", params.search.trim());
      }
      if (params.actionType && params.actionType !== "ALL") {
        query.set("eventType", params.actionType);
      }

      const res = await unwrapEnvelope<
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

      const rawList = Array.isArray(res.data)
        ? res.data
        : (res.data as { items?: RawActivityLog[] })?.items || [];

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
            systemHealthStatus: res.error ? "Degraded" : "Operational",
          },
        },
      };
    }).then(
      (res) =>
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
        },
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
