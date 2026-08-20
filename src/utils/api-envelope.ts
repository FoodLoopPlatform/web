import type { ApiResponse } from "./server";

export type FoodLoopEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
};

export async function unwrapEnvelope<T>(
  request: Promise<ApiResponse<unknown>>,
): Promise<ApiResponse<T>> {
  const res = await request;

  if (
    res.status === 204 ||
    (res.status &&
      res.status >= 200 &&
      res.status < 300 &&
      !res.error &&
      !res.data)
  ) {
    return { data: undefined as T, status: res.status ?? 200 };
  }

  if (res.error || !res.data) {
    return { error: res.error ?? "حدث خطأ غير متوقع", status: res.status };
  }

  const payload = res.data;

  // Check if payload is wrapped in FoodLoopEnvelope
  if (typeof payload === "object" && payload !== null && "success" in payload) {
    const env = payload as Record<string, unknown>;
    if (!env.success) {
      const errors = Array.isArray(env.errors) ? env.errors : [];
      const msg = typeof env.message === "string" ? env.message : null;
      const detail = errors.length ? errors.join("\n") : msg;
      return {
        error: detail ?? "حدث خطأ غير متوقع",
        status: res.status,
      };
    }
    const envData = env.data;
    if (typeof envData === "object" && envData !== null && "items" in envData) {
      const paginatedData = envData as {
        items: unknown;
        totalCount?: number;
        totalPages?: number;
        page?: number;
        pageSize?: number;
        hasNextPage?: boolean;
        hasPreviousPage?: boolean;
      };
      return {
        data: paginatedData.items as T,
        status: res.status,
        totalCount: paginatedData.totalCount,
        totalPages: paginatedData.totalPages,
        page: paginatedData.page,
        pageSize: paginatedData.pageSize,
        hasNextPage: paginatedData.hasNextPage,
        hasPreviousPage: paginatedData.hasPreviousPage,
      };
    }
    return { data: env.data as T, status: res.status };
  }

  // Handle direct paginated object { items: [...] }
  if (typeof payload === "object" && payload !== null && "items" in payload) {
    const paginated = payload as {
      items: unknown;
      totalCount?: number;
      totalPages?: number;
      page?: number;
      pageSize?: number;
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
    };
    return {
      data: paginated.items as T,
      status: res.status,
      totalCount: paginated.totalCount,
      totalPages: paginated.totalPages,
      page: paginated.page,
      pageSize: paginated.pageSize,
      hasNextPage: paginated.hasNextPage,
      hasPreviousPage: paginated.hasPreviousPage,
    };
  }

  return { data: payload as T, status: res.status };
}
