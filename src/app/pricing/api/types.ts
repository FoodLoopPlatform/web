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

/** Product pricing item shape returned by or mapped from /stores/me/products/pricing. */
export type ProductPricingItem = {
  id: string;
  code: string;
  name: string;
  nameAr?: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  cycleCountdownLabel: string;
  cycleUrgent: boolean;
  automationMode: AutomationMode;
  expirationDate?: string;
  categoryId?: string;
  categoryName?: string;
  status?: string;
  quantityAvailable?: number;
};

/** Aggregated pricing stats. */
export type PricingStatsData = {
  activeListingsCount: number;
  activeListingsDelta: number;
  averageDiscountPercent: number;
  nextCycleCountdownLabel: string;
  nextCycleProgressPercent: number;
};

/** Historical price entry for /stores/me/products/{id}/price-history. */
export type PriceHistoryEntry = {
  id: string;
  productId?: string;
  oldPrice: number;
  newPrice: number;
  discountPercent: number;
  changeReason?: string;
  changedAt: string;
  automationMode?: AutomationMode | string;
  appliedBy?: string;
};

/** Full response / state for a product's price history. */
export type ProductPriceHistoryData = {
  productId: string;
  productTitle?: string;
  productCode?: string;
  currentPrice?: number;
  originalPrice?: number;
  history: PriceHistoryEntry[];
};
