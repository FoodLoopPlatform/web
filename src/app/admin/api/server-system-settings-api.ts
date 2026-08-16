import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import { GlobalAutomationDefaults } from "../types/admin.types";

export function getAutomationDefaultsServer(): Promise<
  ApiResponse<GlobalAutomationDefaults>
> {
  return withServerAuth<GlobalAutomationDefaults>(async (token) => {
    try {
      const res = await unwrapEnvelope<unknown>(
        getMany<FoodLoopEnvelope<unknown>>(Endpoints.admin.systemSettings, {
          token,
        }),
      );

      const resData = res.data as Record<string, unknown>;
      if (resData) {
        return {
          data: {
            maxDiscountPerCycle: Number(
              resData.maxDiscountPerCyclePercent ?? 15,
            ),
            defaultPriceFloorPolicy: (resData.defaultPriceFloorPolicy ??
              "DYNAMIC_AI") as
              "DYNAMIC_AI" | "FIXED_PERCENTAGE" | "COMPETITOR_MATCH",
            newBusinessDefaultMode: (resData.newBusinessDefaultAutomationMode ??
              "Manual") as "Manual" | "Shadow" | "Autonomous",
            autoVerifyStores: !!resData.autoVerifyPartnerStores,
            bulkUploads: !!resData.bulkProductUploadEnabled,
          } as GlobalAutomationDefaults,
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
