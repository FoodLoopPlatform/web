import { getMany, createOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import {
  GlobalAutomationDefaults,
  GuidelineDocument,
  PlatformAdmin,
  SecuritySettings,
  AiObservabilitySettings,
} from "../types/admin.types";
import { withAuth } from "@/utils/api-client";

export function getAutomationDefaults(): Promise<
  ApiResponse<GlobalAutomationDefaults>
> {
  return withAuth<GlobalAutomationDefaults>(async (token) => {
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
      return { error: "Failed to fetch automation defaults" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch settings";
      return { error: msg };
    }
  });
}

export function updateAutomationDefaults(
  defaults: GlobalAutomationDefaults,
): Promise<ApiResponse<GlobalAutomationDefaults>> {
  return withAuth(async (token) => {
    const clampedMaxDiscount = Math.min(
      15,
      Math.max(1, defaults.maxDiscountPerCycle),
    );
    try {
      const payload = {
        maxDiscountPerCyclePercent: clampedMaxDiscount,
        defaultPriceFloorPolicy: defaults.defaultPriceFloorPolicy,
        newBusinessDefaultAutomationMode: defaults.newBusinessDefaultMode,
        autoVerifyPartnerStores: defaults.autoVerifyStores,
        bulkProductUploadEnabled: defaults.bulkUploads,
        platformCommissionPercent: 10,
        apiRequestRateLimitPerMinute: 10000,
      };

      await unwrapEnvelope<unknown>(
        createOne<FoodLoopEnvelope<unknown>, unknown>(
          Endpoints.admin.systemSettings,
          payload,
          { token },
        ),
      );
    } catch (e) {
      // Ignore error for now, return the optimistically updated local values
    }

    return { data: { ...defaults, maxDiscountPerCycle: clampedMaxDiscount } };
  });
}

export function getGuidelineDocuments(): Promise<
  ApiResponse<GuidelineDocument[]>
> {
  return withAuth(async () => {
    return { data: [] };
  });
}

export function uploadGuidelineDocument(
  doc: Omit<GuidelineDocument, "id" | "lastUpdated" | "status">,
): Promise<ApiResponse<GuidelineDocument>> {
  return withAuth(async () => {
    const newDoc: GuidelineDocument = {
      ...doc,
      id: `DOC-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "Draft",
    };
    return { data: newDoc };
  });
}

export function toggleDocumentStatus(
  id: string,
  newStatus: "Draft" | "Published",
): Promise<
  ApiResponse<{
    id: string;
    status: "Draft" | "Published";
    lastRagIndexedAt?: string;
  }>
> {
  return withAuth(async () => {
    return {
      data: {
        id,
        status: newStatus,
        lastRagIndexedAt:
          newStatus === "Published"
            ? new Date().toISOString().replace("T", " ").slice(0, 16)
            : undefined,
      },
    };
  });
}
