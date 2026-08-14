import { Endpoints } from "./endpoints";

export type SupportedLanguage = "ar" | "en";

export type ApiResponse<T> =
  | { data: T; error?: never; status?: number }
  | { data?: never; error: string; status?: number };

export type FetchOptions = {
  token?: string;
  headers?: HeadersInit;
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
  retries?: number;
  signal?: AbortSignal;
  lang?: SupportedLanguage | string;
};

export const DEFAULT_LANGUAGE: SupportedLanguage = "ar";
const SUPPORTED_LANGUAGES = new Set<string>(["ar", "en"]);
const STORAGE_KEYS = [
  "foodloop-language",
  "lang",
  "language",
  "locale",
] as const;

/**
 * Type guard to validate whether a given value is a supported ISO language code.
 */
function isValidSupportedLang(val?: string | null): val is SupportedLanguage {
  if (!val) return false;
  const normalized = val.toLowerCase().slice(0, 2);
  return SUPPORTED_LANGUAGES.has(normalized);
}

/**
 * Resolves the target Accept-Language header using a prioritized strategy pattern:
 * 1. Explicit request override
 * 2. Client LocalStorage entries
 * 3. Document DOM lang attribute
 * 4. Browser Navigator language preference
 * 5. Default Fallback ("ar")
 */
export function getAcceptLanguage(preferredLang?: string): SupportedLanguage {
  if (isValidSupportedLang(preferredLang)) {
    return preferredLang.toLowerCase().slice(0, 2) as SupportedLanguage;
  }

  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    // Strategy 1: Client LocalStorage keys
    for (const key of STORAGE_KEYS) {
      const val = localStorage.getItem(key);
      if (isValidSupportedLang(val)) {
        return val.toLowerCase().slice(0, 2) as SupportedLanguage;
      }
    }

    // Strategy 3: HTML Root Document lang attribute
    const docLang = document.documentElement.lang;
    if (isValidSupportedLang(docLang)) {
      return docLang.toLowerCase().slice(0, 2) as SupportedLanguage;
    }

    // Strategy 4: Navigator language (e.g. "ar-EG" -> "ar")
    const navLang = navigator.language;
    if (isValidSupportedLang(navLang)) {
      return navLang.toLowerCase().slice(0, 2) as SupportedLanguage;
    }
  } catch {
    // Protection against restricted storage / sandboxed contexts
  }

  return DEFAULT_LANGUAGE;
}

const buildHeaders = (
  token?: string,
  isFormData?: boolean,
  langOption?: string,
): HeadersInit => {
  const headers: Record<string, string> = {
    "Accept-Language": getAcceptLanguage(langOption),
  };

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
  const {
    token,
    cache,
    revalidate,
    tags,
    retries = 0,
    lang,
    ...rest
  } = options;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchUrl =
        typeof url === "string" && url.match(/^https?:\/\//i)
          ? url
          : Endpoints.baseUrl + url;

      const defaultHeaders = buildHeaders(
        token,
        rest.body instanceof FormData,
        lang,
      );

      const res = await fetch(fetchUrl, {
        ...rest,
        headers: {
          ...defaultHeaders,
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

export const putOne = <T, B = unknown>(
  url: string,
  body: B,
  options?: FetchOptions,
) => {
  return apiFetch<T>(url, {
    method: "PUT",
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
