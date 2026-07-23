import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAuthSlice, type AuthSlice } from "./slices/auth-slice";

export type AppState = AuthSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "foodloop-store",
    },
  ),
);

const resolvedHydration = Promise.resolve();
let hydrationPromise: Promise<void> | null = null;

/**
 * A stable promise resolving once zustand's persist middleware has
 * rehydrated from localStorage. Meant for `use()` inside a Suspense
 * boundary so components never render against a not-yet-hydrated store.
 */
export function getHydrationResource(): Promise<void> {
  if (typeof window === "undefined") {
    // No localStorage on the server, so "hydrated" is meaningless there —
    // stay pending forever so SSR/prerendering renders the Suspense
    // fallback; the client re-suspends fresh once it actually hydrates.
    return new Promise<void>(() => {});
  }

  if (useAppStore.persist.hasHydrated()) {
    return resolvedHydration;
  }
  if (!hydrationPromise) {
    hydrationPromise = new Promise((resolve) => {
      useAppStore.persist.onFinishHydration(() => resolve());
    });
  }
  return hydrationPromise;
}
