import { getMany } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import type {
  AuditLogFilterParams,
  AuditLogFetchResult,
} from "../types/admin.types";

export async function getAuditLogsServer(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  return withServerAuth(async (token) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));

    const res = await unwrapEnvelope<AuditLogFetchResult>(
      getMany<FoodLoopEnvelope<AuditLogFetchResult>>(
        `${Endpoints.admin.userActivityLog("all")}?${query.toString()}`,
        { token },
      ),
    );

    if (res.data) return { data: res.data };
    return {
      data: {
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
      },
    };
  }).then((res) => res.data!);
}
