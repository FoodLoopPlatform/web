"use client";

import { useEffect, useState } from "react";
import { getMyStore } from "@/app/settings/api/stores-api";
import type { Store } from "@/app/settings/api/types";

/** Fetches the authenticated merchant's store record (GET /stores/me) for display purposes. */
export function useStoreProfile() {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyStore().then((res) => {
      if (!cancelled && res.data) setStore(res.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return store;
}
