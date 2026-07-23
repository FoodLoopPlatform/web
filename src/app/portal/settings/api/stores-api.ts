import { getMany, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { Store, UpdateStoreLocationPayload } from "./types";

export function getMyStore() {
  return withAuth((token) =>
    unwrapEnvelope<Store>(
      getMany<FoodLoopEnvelope<Store>>(Endpoints.stores.me, { token }),
    ),
  );
}

export function updateMyStoreLocation(payload: UpdateStoreLocationPayload) {
  return withAuth((token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, UpdateStoreLocationPayload>(
        Endpoints.stores.location,
        payload,
        { token },
      ),
    ),
  );
}
