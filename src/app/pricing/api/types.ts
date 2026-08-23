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
  productImage?: string;
  history: PriceHistoryEntry[];
};

export type AiRecommendationRiskLevel =
  "Critical" | "High" | "Medium" | "Low" | string;

export type AiRecommendationStatus =
  "Pending" | "Approved" | "Rejected" | "Applied" | string;

/** Item shape returned by GET /stores/me/ai-recommendations. */
export type AiRecommendation = {
  id: string;
  productId: string;
  productName: string;
  productCode?: string;
  originalPrice: number;
  currentPrice: number;
  recommendedPrice: number;
  discountPercentage: number;
  discountAmount: number;
  quantityAvailable: number;
  expirationDate: string;
  daysRemaining: number;
  productImageUrl?: string;
  productImages?: string[];
  riskLevel: AiRecommendationRiskLevel;
  reason: string;
  confidence: number;
  actionRequirement?: string;
  actionReason?: string;
  status: AiRecommendationStatus;
  correlationId?: string;
  createdAt: string;
};

/** Shape returned by GET /stores/me/ai-recommendations/schedule. */
export type AiRecommendationsSchedule = {
  nextPricingBatchAt: string;
  nextMonitoringScanAt: string;
  pricingIntervalMinutes: number;
  isPricingBatchRunning: boolean;
  automationMode: AutomationMode | string;
};

/** Request payload for POST /stores/me/ai-recommendations/{id}/reject. */
export type RejectRecommendationPayload = {
  reason?: string;
};
