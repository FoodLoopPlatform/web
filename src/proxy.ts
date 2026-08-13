import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Role strings (case-insensitive) that grant access to the /admin area. */
const ADMIN_ROLES = ["admin", "seniorcontroller"];

/** Default landing routes for each role domain. */
const ADMIN_HOME_ROUTE = "/admin";
const STORE_HOME_ROUTE = "/dashboard";
const LOGIN_ROUTE = "/login";

/**
 * Safely parses a JWT token payload without external dependencies.
 */
function parseJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonStr =
      typeof atob === "function"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf-8");

    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Extracts user roles from decoded JWT claims or session state objects.
 */
function extractRoles(payload: Record<string, unknown>): string[] {
  const rolesRaw =
    payload.roles ||
    payload.role ||
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  if (Array.isArray(rolesRaw)) {
    return rolesRaw.map((r) => String(r));
  }
  if (typeof rolesRaw === "string") {
    return [rolesRaw];
  }
  return [];
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("token")?.value ||
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("session")?.value ||
    request.cookies.get("foodloop_token")?.value;

  const authHeader = request.headers.get("authorization");
  if (!token && authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  let userRoles: string[] = [];
  let isValidToken = false;

  // 1. Check for persisted session store cookie (foodloop-store)
  const storeCookie = request.cookies.get("foodloop-store")?.value;
  if (storeCookie) {
    try {
      const decodedCookie = decodeURIComponent(storeCookie);
      const parsedStore = JSON.parse(decodedCookie);
      const state = parsedStore.state || parsedStore;
      if (state.accessToken) {
        token = token || state.accessToken;
      }
      if (state.user && Array.isArray(state.user.roles)) {
        userRoles = state.user.roles;
        isValidToken = !!token;
      }
    } catch {
      // Ignore JSON parse errors and proceed to token check
    }
  }

  // 2. Decode JWT payload if token exists and roles not resolved from store cookie
  if (token && userRoles.length === 0) {
    const payload = parseJwt(token);
    if (payload) {
      // Check expiration if exp claim is present
      if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
        isValidToken = false;
      } else {
        isValidToken = true;
        userRoles = extractRoles(payload);
      }
    } else if (token.length > 10) {
      // Non-JWT string token fallback
      isValidToken = true;
    }
  }

  const isAdmin = userRoles.some(
    (role) =>
      typeof role === "string" && ADMIN_ROLES.includes(role.toLowerCase()),
  );

  // Protection logic for /admin routes
  if (pathname.startsWith("/admin")) {
    if (!isValidToken) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }
    if (!isAdmin) {
      // Authenticated store/merchant/consumer role trying to access /admin -> redirect to merchant dashboard
      return NextResponse.redirect(new URL(STORE_HOME_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  // Protection logic for merchant portal routes (/dashboard, /inventory, /products, /settings)
  const merchantRoutes = ["/dashboard", "/inventory", "/products", "/settings"];
  const isMerchantRoute = merchantRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isMerchantRoute) {
    if (isValidToken && isAdmin) {
      // Admin account visiting merchant routes -> redirect to admin portal home
      return NextResponse.redirect(new URL(ADMIN_HOME_ROUTE, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard/:path*",
    "/inventory/:path*",
    "/products/:path*",
    "/settings/:path*",
  ],
};
