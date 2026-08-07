"use client";

import { useEffect, type ComponentType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
import { isAdminUser, ADMIN_HOME_ROUTE } from "@/utils/roles";
import { UnauthenticatedNotice } from "./unauthenticated-notice";

type WithAuthOptions = {
  /** Shown while the persisted session is still rehydrating from storage. */
  loadingFallback?: ReactNode;
  /** Shown when rehydration is done and there's no access token. */
  message?: string;
};

/**
 * Gates a merchant-portal page behind the persisted access token. Session
 * state lives client-side only (zustand persist -> localStorage), so this
 * has to be a client-side gate rather than proxy/middleware, which can't see
 * localStorage.
 *
 * Only wrap pages that require a session (dashboard, inventory, settings,
 * ...) — public routes like /login and /register simply never call this.
 *
 * Admin accounts (role "admin"/"seniorcontroller") are bounced to /admin —
 * the merchant portal and the admin portal are separate surfaces, and each
 * role only ever sees its own.
 */
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {},
) {
  const {
    loadingFallback = null,
    message = "يجب تسجيل الدخول لعرض هذه الصفحة",
  } = options;

  function AuthenticatedComponent(props: P) {
    const router = useRouter();
    const accessToken = useAppStore((state) => state.accessToken);
    const user = useAppStore((state) => state.user);
    const hasHydrated = useHasHydrated();
    const isAdmin = isAdminUser(user);

    useEffect(() => {
      if (hasHydrated && accessToken && isAdmin) {
        router.replace(ADMIN_HOME_ROUTE);
      }
    }, [hasHydrated, accessToken, isAdmin, router]);

    if (!hasHydrated) return <>{loadingFallback}</>;
    if (!accessToken) return <UnauthenticatedNotice message={message} />;
    // Admin accounts get redirected above; render nothing while that happens.
    if (isAdmin) return <>{loadingFallback}</>;

    return <Component {...props} />;
  }

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName ?? Component.name ?? "Component"})`;

  return AuthenticatedComponent;
}
