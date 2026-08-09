import { getMany, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  Store,
  UpdateStoreLocationPayload,
  UpdateStoreProfilePayload,
} from "./types";

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

export function updateMyStoreProfile(payload: UpdateStoreProfilePayload) {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append("Name", payload.name);
  if (payload.description !== undefined) {
    formData.append("Description", payload.description);
  }
  if (payload.businessCategory !== undefined) {
    formData.append("BusinessCategory", payload.businessCategory);
  }
  if (payload.phone !== undefined) formData.append("Phone", payload.phone);
  if (payload.email !== undefined) formData.append("Email", payload.email);
  if (payload.openingHours != null) {
    formData.append("OpeningHours", payload.openingHours);
  }
  if (payload.logoFile) formData.append("Logo", payload.logoFile);
  if (payload.coverFile) formData.append("CoverPhoto", payload.coverFile);

  return withAuth((token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, FormData>(
        Endpoints.stores.me,
        formData,
        { token },
      ),
    ),
  );
}
