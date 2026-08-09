import { getMyStore } from "./stores-api";
import type { Store } from "./types";

let cache: { token: string; promise: Promise<Store> } | null = null;

/**
 * Suspense-compatible cache around `getMyStore`. Keyed by access token so a
 * fresh login/session naturally invalidates it; `invalidateStoreResource`
 * covers manual invalidation after a mutation (e.g. saving the location).
 */
export function getStoreResource(accessToken: string): Promise<Store> {
  console.log(
    "[DEBUG getStoreResource]",
    "cache?",
    !!cache,
    "cache.token===accessToken?",
    cache?.token === accessToken,
    "accessToken",
    accessToken?.slice(0, 12),
  );
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

/**
 * Seeds the cache with an already-resolved Store — e.g. the object a
 * successful PATCH just returned — so the next `use(getStoreResource(...))`
 * read resolves synchronously instead of suspending. Prefer this over
 * `invalidateStoreResource` after a save: nulling the cache makes the next
 * read re-suspend, and since /settings has a route-level loading.tsx, that
 * re-suspension surfaces as the whole page flashing back to its skeleton.
 */
export function setStoreResource(accessToken: string, store: Store) {
  console.log(
    "[DEBUG setStoreResource]",
    "accessToken",
    accessToken?.slice(0, 12),
  );
  cache = { token: accessToken, promise: Promise.resolve(store) };
}
