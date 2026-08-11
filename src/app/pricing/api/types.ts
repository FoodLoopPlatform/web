import type { AutomationMode } from "../lib/mock-data";

/** Resource shape for GET/PATCH /stores/me/ai-settings. */
export type AiSettings = {
  automationMode: AutomationMode;
  expiryBufferDays?: number;
  aiAutoDiscountDaysBeforeExpiry?: number;
  aiAutoDiscountPercent: number;
};

export type UpdateAiSettingsPayload = {
  automationMode?: AutomationMode;
  aiAutoDiscountDaysBeforeExpiry?: number;
  aiAutoDiscountPercent?: number;
};
