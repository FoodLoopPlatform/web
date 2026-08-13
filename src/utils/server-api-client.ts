import { cookies } from "next/headers";
import type { ApiResponse } from "./server";

/**
 * Server-only helper to read the current auth access token from cookies.
 * Works inside Next.js Server Components, Server Actions, and Route Handlers.
 */
export async function getServerAccessToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (token) return token;

    const storeCookie = cookieStore.get("foodloop-store")?.value;
    if (storeCookie) {
      const decoded = decodeURIComponent(storeCookie);
      const parsed = JSON.parse(decoded);
      if (parsed?.state?.accessToken) {
        return parsed.state.accessToken;
      }
    }
  } catch {
    // If called outside request context, fail gracefully
  }
  return undefined;
}

/**
 * Runs an authenticated API request on the server using cookies for token retrieval.
 * Does NOT import Zustand or any browser-only store modules.
 */
export async function withServerAuth<T>(
  request: (accessToken: string | undefined) => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> {
  const accessToken = await getServerAccessToken();
  return request(accessToken);
}
