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

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export async function getAutomationDefaults(): Promise<
  ApiResponse<GlobalAutomationDefaults>
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { ...initialAutomationDefaults }, error: null });
    }, 150);
  });
}

export async function updateAutomationDefaults(
  defaults: GlobalAutomationDefaults,
): Promise<ApiResponse<GlobalAutomationDefaults>> {
  const clampedDefaults = {
    ...defaults,
    maxDiscountPerCycle: Math.min(
      15,
      Math.max(1, defaults.maxDiscountPerCycle),
    ),
  };
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: clampedDefaults, error: null });
    }, 200);
  });
}

export async function getGuidelineDocuments(): Promise<
  ApiResponse<GuidelineDocument[]>
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...initialGuidelineDocuments], error: null });
    }, 150);
  });
}

export async function uploadGuidelineDocument(
  doc: Omit<GuidelineDocument, "id" | "lastUpdated" | "status">,
): Promise<ApiResponse<GuidelineDocument>> {
  const newDoc: GuidelineDocument = {
    ...doc,
    id: `DOC-${Date.now().toString().slice(-4)}`,
    lastUpdated: new Date().toISOString().split("T")[0],
    status: "Draft",
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: newDoc, error: null });
    }, 300);
  });
}

export async function toggleDocumentStatus(
  id: string,
  newStatus: "Draft" | "Published",
): Promise<
  ApiResponse<{
    id: string;
    status: "Draft" | "Published";
    lastRagIndexedAt?: string;
  }>
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          id,
          status: newStatus,
          lastRagIndexedAt:
            newStatus === "Published"
              ? new Date().toISOString().replace("T", " ").slice(0, 16)
              : undefined,
        },
        error: null,
      });
    }, 200);
  });
}

export async function getPlatformAdmins(): Promise<
  ApiResponse<PlatformAdmin[]>
> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [...initialPlatformAdmins], error: null });
    }, 150);
  });
}

export async function updateAdminPermissions(
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
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: { id, permissions, roleTitle }, error: null });
    }, 200);
  });
}

export async function updateSecuritySettings(
  settings: SecuritySettings,
): Promise<ApiResponse<SecuritySettings>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: settings, error: null });
    }, 200);
  });
}

export async function updateAiObservabilitySettings(
  settings: AiObservabilitySettings,
): Promise<ApiResponse<AiObservabilitySettings>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: settings, error: null });
    }, 200);
  });
}
