"use client";

import type { ComponentType, ReactNode } from "react";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
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
    const accessToken = useAppStore((state) => state.accessToken);
    const hasHydrated = useHasHydrated();

    if (!hasHydrated) return <>{loadingFallback}</>;
    if (!accessToken) return <UnauthenticatedNotice message={message} />;

    return <Component {...props} />;
  }

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName ?? Component.name ?? "Component"})`;

  return AuthenticatedComponent;
}
