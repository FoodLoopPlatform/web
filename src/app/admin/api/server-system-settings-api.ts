import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import {
  GlobalAutomationDefaults,
  RawBackendSystemSettings,
} from "../types/admin.types";

export function getAutomationDefaultsServer(): Promise<
  ApiResponse<GlobalAutomationDefaults>
> {
  return withServerAuth<GlobalAutomationDefaults>(async (token) => {
    try {
      const res = await unwrapEnvelope<RawBackendSystemSettings>(
        getMany<FoodLoopEnvelope<RawBackendSystemSettings>>(
          Endpoints.admin.systemSettings,
          { token },
        ),
      );

      const resData = res.data;
      if (resData) {
        return {
          data: {
            maxDiscountPerCycle: Number(
              resData.maxDiscountPerCyclePercent ?? 10,
            ),
            defaultPriceFloorPolicy:
              resData.defaultPriceFloorPolicy ?? "DynamicAi",
            newBusinessDefaultMode:
              resData.newBusinessDefaultAutomationMode ?? "Assisted",
            autoVerifyStores: !!resData.autoVerifyPartnerStores,
            bulkUploads: !!resData.bulkProductUploadEnabled,
            platformCommissionPercent: Number(
              resData.platformCommissionPercent ?? 10,
            ),
            apiRequestRateLimitPerMinute: Number(
              resData.apiRequestRateLimitPerMinute ?? 10000,
            ),
            lastUpdatedAt: resData.lastUpdatedAt,
          },
        };
      }
      return { error: "Failed to load automation defaults." };
    } catch (e: unknown) {
      const msg =
        e instanceof Error ? e.message : "Failed to load automation defaults.";
      return { error: msg };
    }
  });
}
