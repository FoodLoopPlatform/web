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
  averageOrderValue: number;
  refundedAmount: number;
  donatedValue: number;
  pendingOrdersCount: number;
  confirmedOrdersCount: number;
  preparingOrdersCount: number;
  readyForPickupOrdersCount: number;
  completedOrdersCount: number;
  cancelledOrdersCount: number;
  totalProductsCount: number;
  outOfStockProductsCount: number;
  expiringSoonProductsCount: number;
  totalDisputesCount: number;
  unresolvedDisputesCount: number;
  resolvedDisputesCount: number;
  topProducts: TopProduct[];
};
