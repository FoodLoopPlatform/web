"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
import { isAdminUser, ADMIN_HOME_ROUTE, STORE_HOME_ROUTE } from "@/utils/roles";
import LandingPage from "./landing/page";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const accessToken = useAppStore((state) => state.accessToken);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!hasHydrated) return;
    if (accessToken) {
      if (isAdminUser(user)) {
        router.replace(ADMIN_HOME_ROUTE);
      } else {
        router.replace(STORE_HOME_ROUTE);
      }
    }
  }, [hasHydrated, accessToken, user, router]);

  // Show landing page while hydrating or if unauthenticated
  if (!hasHydrated || !accessToken) {
    return <LandingPage />;
  }

  return null;
}
