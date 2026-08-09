"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
import { isAdminUser, ADMIN_HOME_ROUTE, STORE_HOME_ROUTE } from "@/utils/roles";

/**
 * "/" is not a real page — it only decides where to send the visitor:
 * /login when signed out, /admin for admin accounts, /dashboard otherwise.
 * Session state lives in localStorage (zustand persist), so this has to be
 * a client-side gate rather than middleware, same constraint as withAuth.
 */
export default function Home() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const accessToken = useAppStore((state) => state.accessToken);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      router.replace("/login");
    } else if (isAdminUser(user)) {
      router.replace(ADMIN_HOME_ROUTE);
    } else {
      router.replace(STORE_HOME_ROUTE);
    }
  }, [hasHydrated, accessToken, user, router]);

  return null;
}
