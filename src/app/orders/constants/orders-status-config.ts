import { OrderTab } from "../types/orders.types";

export interface StatusConfigItem {
  key: OrderTab;
  labelKey: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  icon: string;
  badgeBg: string;
  badgeText: string;
  borderClass: string;
  stepOrder: number;
}

export const ORDER_STATUS_CONFIG: Record<OrderTab, StatusConfigItem> = {
  PENDING: {
    key: "PENDING",
    labelKey: "pending",
    icon: "check_circle",
    badgeBg: "bg-amber-100/80",
    badgeText: "text-amber-900",
    borderClass: "border-l-amber-500",
    stepOrder: 0,
  },
  CONFIRMED: {
    key: "CONFIRMED",
    labelKey: "confirmed",
    icon: "tune",
    badgeBg: "bg-emerald-100/80",
    badgeText: "text-emerald-900",
    borderClass: "border-l-emerald-600",
    stepOrder: 1,
  },
  PREPARING: {
    key: "PREPARING",
    labelKey: "preparing",
    icon: "shopping_bag",
    badgeBg: "bg-blue-100/80",
    badgeText: "text-blue-900",
    borderClass: "border-l-blue-500",
    stepOrder: 2,
  },
  DELIVERED: {
    key: "DELIVERED",
    labelKey: "delivered",
    icon: "local_shipping",
    badgeBg: "bg-slate-100/80",
    badgeText: "text-slate-800",
    borderClass: "border-l-slate-400",
    stepOrder: 3,
  },
  CANCELLED: {
    key: "CANCELLED",
    labelKey: "cancelled",
    icon: "cancel",
    badgeBg: "bg-rose-100/80",
    badgeText: "text-rose-900",
    borderClass: "border-l-rose-500",
    stepOrder: -1,
  },
};
