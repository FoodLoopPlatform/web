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

  if (!res.data) {
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
    const envData = env.data as Record<string, unknown> | undefined;
    const innerData = envData?.items ?? env.data;
    return { data: innerData as T, status: res.status };
  }

  // Handle direct data or paginated object { items: [...] }
  if (typeof payload === "object" && payload !== null && "items" in payload) {
    const paginated = payload as { items: unknown };
    return { data: paginated.items as T, status: res.status };
  }

  return { data: payload as T, status: res.status };
}
