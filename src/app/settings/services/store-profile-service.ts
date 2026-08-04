"use client";

import type { ApiResponse } from "@/utils/server";
import { updateMyStoreProfile } from "../api/stores-api";
import { invalidateStoreResource } from "../api/store-resource";
import { formValueToBusinessCategory } from "../api/types";
import {
  setStoredProfile,
  type ProfileSaveInput,
} from "../lib/profile-storage";
import { serializeOperatingHours } from "../lib/operating-hours";

/**
 * Saves the fields the backend owns via PATCH /stores/me — including the
 * operating hours, serialized into the `openingHours` string field — then
 * persists the rest of the form (automation, delivery — not part of the
 * store resource) to the local mock store so the UI keeps showing them.
 */
export async function updateStoreProfile(
  data: ProfileSaveInput,
): Promise<ApiResponse<{ success: true; lastUpdated: string }>> {
  const storeRes = await updateMyStoreProfile({
    name: data.businessName,
    businessCategory: formValueToBusinessCategory[data.businessType],
    description: data.description ?? "",
    openingHours: serializeOperatingHours(data.operatingHours),
  });

  if (storeRes.error) {
    return { error: storeRes.error };
  }

  invalidateStoreResource();

  const lastUpdated = new Date().toISOString();
  setStoredProfile({ ...data, lastUpdated });
  return { data: { success: true, lastUpdated } };
}
