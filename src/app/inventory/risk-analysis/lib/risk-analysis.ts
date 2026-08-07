import type { MerchantProduct } from "@/app/products/api/types";

export type RiskLevel = "high" | "medium" | "low";

export interface RiskAnalysisItem {
  product: MerchantProduct;
  daysUntilExpiry: number;
  demandScore: number;
  riskLevel: RiskLevel;
  valueAtRisk: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Whole calendar days between today and the product's expiration date (negative if already expired). */
export function getDaysUntilExpiry(
  expirationDate: string,
  now: Date = new Date(),
): number {
  const expiry = new Date(expirationDate);
  if (Number.isNaN(expiry.getTime())) return Infinity;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfExpiry = new Date(expiry);
  startOfExpiry.setHours(0, 0, 0, 0);

  return Math.round(
    (startOfExpiry.getTime() - startOfToday.getTime()) / MS_PER_DAY,
  );
}

/**
 * Estimated 0-100 sell-through likelihood before expiry: penalizes large
 * remaining quantities (harder to move in time) and short expiry windows.
 * A grounded stand-in for a real demand-forecasting model.
 */
export function computeDemandScore(
  product: MerchantProduct,
  daysUntilExpiry: number,
): number {
  const quantity = product.quantityAvailable ?? 0;
  const overstockPenalty = Math.min(60, quantity / 3);
  const urgencyPenalty =
    daysUntilExpiry <= 0 ? 40 : Math.max(0, 40 - daysUntilExpiry * 4);
  const score = 100 - overstockPenalty - urgencyPenalty;
  return Math.max(4, Math.min(100, Math.round(score)));
}

export function computeRiskLevel(
  daysUntilExpiry: number,
  demandScore: number,
): RiskLevel {
  if (daysUntilExpiry <= 2 || demandScore < 30) return "high";
  if (daysUntilExpiry <= 7 || demandScore < 60) return "medium";
  return "low";
}

export function buildRiskAnalysis(
  products: MerchantProduct[],
): RiskAnalysisItem[] {
  return products.map((product) => {
    const daysUntilExpiry = getDaysUntilExpiry(product.expirationDate);
    const demandScore = computeDemandScore(product, daysUntilExpiry);
    const riskLevel = computeRiskLevel(daysUntilExpiry, demandScore);
    const unitPrice = product.discountedPrice ?? product.originalPrice ?? 0;
    const valueAtRisk =
      riskLevel !== "low" ? unitPrice * (product.quantityAvailable ?? 0) : 0;

    return { product, daysUntilExpiry, demandScore, riskLevel, valueAtRisk };
  });
}

export function formatExpiryLabel(daysUntilExpiry: number): string {
  if (!Number.isFinite(daysUntilExpiry)) return "بلا تاريخ انتهاء";
  if (daysUntilExpiry < 0) return "منتهي الصلاحية";
  if (daysUntilExpiry === 0) return "ينتهي اليوم";
  if (daysUntilExpiry === 1) return "ينتهي خلال يوم واحد";
  if (daysUntilExpiry === 2) return "ينتهي خلال يومين";
  return `ينتهي خلال ${daysUntilExpiry} أيام`;
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  high: "مخاطر عالية",
  medium: "مخاطر متوسطة",
  low: "مخاطر منخفضة",
};

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}
