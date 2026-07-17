import { Endpoints } from "./endpoints";

export type ApiResponse<T> =
  | { data: T; error?: never; status?: number }
  | { data?: never; error: string; status?: number };

type FetchOptions = {
  token?: string;
  headers?: HeadersInit;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  retries?: number;
  signal?: AbortSignal;
};

const buildHeaders = (token?: string, isFormData?: boolean): HeadersInit => {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

async function apiFetch<T>(
  url: string,
  options: RequestInit & FetchOptions = {},
): Promise<ApiResponse<T>> {
  const { token, cache, revalidate, tags, retries = 0, ...rest } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchUrl =
        typeof url === "string" && url.match(/^https?:\/\//i)
          ? url
          : Endpoints.baseUrl + url;

      const res = await fetch(fetchUrl, {
        ...rest,
        headers: {
          ...buildHeaders(token, rest.body instanceof FormData),
          ...(rest.headers || {}),
        },
        credentials: "include",
        cache: cache ?? "no-store",
        next: {
          revalidate,
          tags,
        },
      });

      if (!res.ok) {
        const errorData = await safeJson(res);
        return {
          error: errorData?.message || res.statusText,
          status: res.status,
        };
      }

      const data = await safeJson(res);
      return { data, status: res.status };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error("Unknown error");

      // Don't retry on non-network errors
      if (!(err instanceof Error) || !err.message.includes("fetch")) {
        break;
      }

      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 1000),
        );
      }
    }
  }

  return {
    error: lastError?.message || "Something went wrong",
  };
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const getMany = <T>(url: string, options?: FetchOptions) => {
  return apiFetch<T>(url, {
    method: "GET",
    ...options,
    cache: options?.cache ?? "no-store",
  });
};

export const createOne = <T, B = unknown>(
  url: string,
  body: B,
  options?: FetchOptions,
) => {
  return apiFetch<T>(url, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
};

export const updateOne = <T, B = unknown>(
  url: string,
  body: B,
  options?: FetchOptions,
) => {
  return apiFetch<T>(url, {
    method: "PATCH",
    body: body instanceof FormData ? body : JSON.stringify(body),
    ...options,
  });
};

export const deleteOne = <T = void, B = unknown>(
  url: string,
  body?: B,
  options?: FetchOptions,
) => {
  return apiFetch<T>(url, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};
