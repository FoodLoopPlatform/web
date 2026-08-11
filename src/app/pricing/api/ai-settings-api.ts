import { getMany, updateOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { AiSettings, UpdateAiSettingsPayload } from "./types";

export function getMyStoreAiSettings() {
  return withAuth((token) =>
    unwrapEnvelope<AiSettings>(
      getMany<FoodLoopEnvelope<AiSettings>>(Endpoints.stores.aiSettings, {
        token,
      }),
    ),
  );
}

export function updateMyStoreAiSettings(payload: UpdateAiSettingsPayload) {
  return withAuth((token) =>
    unwrapEnvelope<AiSettings>(
      updateOne<FoodLoopEnvelope<AiSettings>, UpdateAiSettingsPayload>(
        Endpoints.stores.aiSettings,
        payload,
        { token },
      ),
    ),
  );
}
