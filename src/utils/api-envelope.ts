import type { ApiResponse } from "./server";

export type FoodLoopEnvelope<T> = {
  success: boolean;
  data: T;
  message: string | null;
  errors: string[];
};

export async function unwrapEnvelope<T>(
  request: Promise<ApiResponse<FoodLoopEnvelope<T>>>,
): Promise<ApiResponse<T>> {
  const res = await request;

  if (!res.data) {
    return { error: res.error ?? "حدث خطأ غير متوقع", status: res.status };
  }

  if (!res.data.success) {
    const detail = res.data.errors.length
      ? res.data.errors.join("\n")
      : res.data.message;
    return {
      error: detail ?? "حدث خطأ غير متوقع",
      status: res.status,
    };
  }

  return { data: res.data.data, status: res.status };
}
