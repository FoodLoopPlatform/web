"use client";

import React from "react";
import { OrderTab } from "../types/orders.types";
import { ORDER_STATUS_CONFIG } from "../constants/orders-status-config";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";

interface OrderStatusTabsProps {
  activeTab: OrderTab;
  onTabChange: (tab: OrderTab) => void;
  orderCounts: Record<OrderTab, number>;
}

const ORDER_TABS: OrderTab[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusTabs({
  activeTab,
  onTabChange,
  orderCounts,
}: OrderStatusTabsProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex items-center gap-2 sm:gap-6 border-b border-outline-variant/40 pb-1 pt-2 overflow-x-auto scrollbar-none w-full select-none"
    >
      {ORDER_TABS.map((key) => {
        const config = ORDER_STATUS_CONFIG[key];
        const isActive = activeTab === key;
        const count = orderCounts[key] ?? 0;
        const label = t.tabs[config.labelKey];

        return (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={`group relative flex items-center gap-2 px-3 py-2 text-sm font-bold transition-all cursor-pointer whitespace-nowrap outline-none ${
              isActive
                ? "text-primary font-extrabold"
                : "text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-low/50 rounded-lg"
            }`}
          >
            <span>{label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${
                isActive
                  ? "bg-[#0B3C26] text-white"
                  : "bg-surface-container-high text-on-surface-variant group-hover:bg-surface-container-highest"
              }`}
            >
              {count}
            </span>

            {/* Underline Indicator for Active Tab */}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.75 bg-primary rounded-t-full transition-all" />
            )}
          </button>
        );
      })}
    </div>
  );
}
