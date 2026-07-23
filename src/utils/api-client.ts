import type { ApiResponse } from "./server";
import { useAppStore } from "@/store/use-app-store";
import { refreshSession } from "@/app/register/api/auth-api";

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  const { refreshToken, setSession, clearSession } = useAppStore.getState();
  if (!refreshToken) return Promise.resolve(null);

  refreshPromise = refreshSession(refreshToken)
    .then((res) => {
      if (res.data) {
        setSession(res.data);
        return res.data.accessToken;
      }
      clearSession();
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

/**
 * Runs an authenticated request with the current access token. On a 401,
 * refreshes the session once (de-duped across concurrent callers) and
 * retries the request with the new token before giving up.
 */
export async function withAuth<T>(
  request: (accessToken: string | undefined) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> {
  const accessToken = useAppStore.getState().accessToken ?? undefined;
  const res = await request(accessToken);

  if (res.status !== 401) {
    return res;
  }

  const newToken = await refreshAccessToken();
  if (!newToken) {
    return res;
  }

  return request(newToken);
}
