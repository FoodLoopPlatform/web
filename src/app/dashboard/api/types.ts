export type AnalyticsPeriod = "today" | "week" | "month" | "all";

export type TopProduct = {
  id: string;
  title: string;
  quantitySold: number;
  revenueGenerated: number;
};

/** Response shape of GET /stores/me/analytics. */
export type StoreAnalytics = {
  period: AnalyticsPeriod;
  revenue: number;
  ordersCount: number;
  savingsImpact: number;
  topProducts: TopProduct[];
};
