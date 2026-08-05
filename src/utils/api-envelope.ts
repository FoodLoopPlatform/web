import type { ApiResponse } from "./server";

export type FoodLoopEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
};

export async function unwrapEnvelope<T>(
  request: Promise<ApiResponse<any>>,
): Promise<ApiResponse<T>> {
  const res = await request;

  if (!res.data) {
    return { error: res.error ?? "حدث خطأ غير متوقع", status: res.status };
  }

  const payload = res.data;

  // Check if payload is wrapped in FoodLoopEnvelope
  if (typeof payload === "object" && payload !== null && "success" in payload) {
    if (!payload.success) {
      const detail = Array.isArray(payload.errors) && payload.errors.length
        ? payload.errors.join("\n")
        : payload.message;
      return {
        error: detail ?? "حدث خطأ غير متوقع",
        status: res.status,
      };
    }
    const innerData = payload.data?.items ?? payload.data;
    return { data: innerData as T, status: res.status };
  }

  // Handle direct data or paginated object { items: [...] }
  const directData = payload?.items ?? payload;
  return { data: directData as T, status: res.status };
}
