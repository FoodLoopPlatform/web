import { getMyStore } from "./stores-api";
import type { Store } from "./types";

let cache: { token: string; promise: Promise<Store> } | null = null;

/**
 * Suspense-compatible cache around `getMyStore`. Keyed by access token so a
 * fresh login/session naturally invalidates it; `invalidateStoreResource`
 * covers manual invalidation after a mutation (e.g. saving the location).
 */
export function getStoreResource(accessToken: string): Promise<Store> {
  if (cache && cache.token === accessToken) {
    return cache.promise;
  }

  const promise = getMyStore().then((res) => {
    if (!res.data) {
      throw new Error(res.error ?? "تعذر تحميل بيانات المتجر");
    }
    return res.data;
  });

  cache = { token: accessToken, promise };
  return promise;
}

export function invalidateStoreResource() {
  cache = null;
}
