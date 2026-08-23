import { getMany, createOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import {
  GlobalAutomationDefaults,
  RawBackendSystemSettings,
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
  return withAuth<GlobalAutomationDefaults>(async (token) => {
    const clampedMaxDiscount = Math.min(
      15,
      Math.max(1, defaults.maxDiscountPerCycle),
    );
    const payload = {
      maxDiscountPerCyclePercent: clampedMaxDiscount,
      defaultPriceFloorPolicy: defaults.defaultPriceFloorPolicy || "DynamicAi",
      newBusinessDefaultAutomationMode:
        defaults.newBusinessDefaultMode || "Assisted",
      autoVerifyPartnerStores: defaults.autoVerifyStores,
      bulkProductUploadEnabled: defaults.bulkUploads,
      platformCommissionPercent: defaults.platformCommissionPercent ?? 10,
      apiRequestRateLimitPerMinute:
        defaults.apiRequestRateLimitPerMinute ?? 10000,
    };

    try {
      const res = await unwrapEnvelope<RawBackendSystemSettings>(
        createOne<FoodLoopEnvelope<RawBackendSystemSettings>, typeof payload>(
          Endpoints.admin.systemSettings,
          payload,
          { token },
        ),
      );

      if (res.data) {
        return {
          data: {
            maxDiscountPerCycle: Number(
              res.data.maxDiscountPerCyclePercent ?? clampedMaxDiscount,
            ),
            defaultPriceFloorPolicy:
              res.data.defaultPriceFloorPolicy ??
              payload.defaultPriceFloorPolicy,
            newBusinessDefaultMode:
              res.data.newBusinessDefaultAutomationMode ??
              payload.newBusinessDefaultAutomationMode,
            autoVerifyStores:
              res.data.autoVerifyPartnerStores ??
              payload.autoVerifyPartnerStores,
            bulkUploads:
              res.data.bulkProductUploadEnabled ??
              payload.bulkProductUploadEnabled,
            platformCommissionPercent: Number(
              res.data.platformCommissionPercent ??
                payload.platformCommissionPercent,
            ),
            apiRequestRateLimitPerMinute: Number(
              res.data.apiRequestRateLimitPerMinute ??
                payload.apiRequestRateLimitPerMinute,
            ),
            lastUpdatedAt: res.data.lastUpdatedAt,
          },
        };
      }
      return { data: { ...defaults, maxDiscountPerCycle: clampedMaxDiscount } };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update settings";
      return { error: msg };
    }
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
