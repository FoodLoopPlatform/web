import type { StateCreator } from "zustand";
import type { AuthResult, AuthUser } from "@/utils/session";

export type AuthSlice = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  setSession: (session: AuthResult) => void;
  clearSession: () => void;
};

/**
 * Synchronizes session tokens and user state to document cookies.
 *
 * Why this is necessary:
 * Client session state lives in Zustand (persisted to localStorage). However, Next.js Server
 * Middleware runs on the server before page rendering and cannot access browser localStorage.
 * Writing `accessToken` and `foodloop-store` cookies allows server middleware to inspect
 * authentication status and user roles on page navigation (e.g., gating /admin routes).
 */
function syncAuthCookies(session: AuthResult | null) {
  if (typeof document === "undefined") return;

  if (session && session.accessToken) {
    const maxAge = 7 * 24 * 60 * 60; // 7 days
    document.cookie = `accessToken=${session.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`;

    const storePayload = encodeURIComponent(
      JSON.stringify({
        state: {
          user: session.user,
          accessToken: session.accessToken,
        },
      }),
    );
    document.cookie = `foodloop-store=${storePayload}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "foodloop-store=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set,
) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  setSession: (session) => {
    syncAuthCookies(session);
    set({
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      accessTokenExpiresAt: session.accessTokenExpiresAt,
    });
  },
  clearSession: () => {
    syncAuthCookies(null);
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      accessTokenExpiresAt: null,
    });
  },
});
