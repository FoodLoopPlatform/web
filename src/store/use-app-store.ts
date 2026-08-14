"use client";

import { useSyncExternalStore } from "react";
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

/**
 * True once zustand's persist middleware has rehydrated from localStorage.
 * Always false during SSR and the initial client render (so hydration
 * matches), flips to true right after — read persisted fields (accessToken,
 * user, ...) only once this is true.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (callback) => useAppStore.persist.onFinishHydration(callback),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
