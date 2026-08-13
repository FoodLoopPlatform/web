import {
  GlobalAutomationDefaults,
  GuidelineDocument,
  PlatformAdmin,
  SecuritySettings,
  AiObservabilitySettings,
} from "../types/admin.types";
import {
  initialAutomationDefaults,
  initialGuidelineDocuments,
  initialPlatformAdmins,
} from "../mocks/system-settings.mock";
import { withAuth } from "@/utils/api-client";
import type { ApiResponse } from "@/utils/server";

export function getAutomationDefaults(): Promise<
  ApiResponse<GlobalAutomationDefaults>
> {
  return withAuth(async () => {
    return { data: { ...initialAutomationDefaults } };
  });
}

export function updateAutomationDefaults(
  defaults: GlobalAutomationDefaults,
): Promise<ApiResponse<GlobalAutomationDefaults>> {
  return withAuth(async () => {
    const clampedDefaults = {
      ...defaults,
      maxDiscountPerCycle: Math.min(
        15,
        Math.max(1, defaults.maxDiscountPerCycle),
      ),
    };
    return { data: clampedDefaults };
  });
}

export function getGuidelineDocuments(): Promise<
  ApiResponse<GuidelineDocument[]>
> {
  return withAuth(async () => {
    return { data: [...initialGuidelineDocuments] };
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

export function getPlatformAdmins(): Promise<ApiResponse<PlatformAdmin[]>> {
  return withAuth(async () => {
    return { data: [...initialPlatformAdmins] };
  });
}

export function updateAdminPermissions(
  id: string,
  permissions: PlatformAdmin["permissions"],
  roleTitle: string,
): Promise<
  ApiResponse<{
    id: string;
    permissions: PlatformAdmin["permissions"];
    roleTitle: string;
  }>
> {
  return withAuth(async () => {
    return { data: { id, permissions, roleTitle } };
  });
}

export function updateSecuritySettings(
  settings: SecuritySettings,
): Promise<ApiResponse<SecuritySettings>> {
  return withAuth(async () => {
    return { data: settings };
  });
}

export function updateAiObservabilitySettings(
  settings: AiObservabilitySettings,
): Promise<ApiResponse<AiObservabilitySettings>> {
  return withAuth(async () => {
    return { data: settings };
  });
}
