"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Order, OrderTab, OrderSummaryData } from "../types/orders.types";
import { updateOrderStatus } from "../api/orders-api";
import { OrdersHeader } from "./OrdersHeader";
import { OrderStatusTabs } from "./OrderStatusTabs";
import { OrderCard } from "./OrderCard";
import { OrderSummaryPanel } from "./OrderSummaryPanel";
import { OrdersEmptyState } from "./OrdersEmptyState";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";
import { Icon } from "@/components/ui/icon";

interface OrdersDashboardClientProps {
  initialOrders: Order[];
  initialSummary?: OrderSummaryData;
  searchQuery: string;
}

const VALID_TABS: OrderTab[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "DELIVERED",
  "CANCELLED",
];

export function OrdersDashboardClient({
  initialOrders,
  initialSummary,
  searchQuery,
}: OrdersDashboardClientProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const searchParams = useSearchParams();
  const router = useRouter();

  // Active tab synced with URL search params (e.g. ?tab=pending)
  const activeTab: OrderTab = useMemo(() => {
    const rawTab = searchParams.get("tab")?.toUpperCase();
    if (rawTab && VALID_TABS.includes(rawTab as OrderTab)) {
      return rawTab as OrderTab;
    }
    return "PENDING";
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tab: OrderTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab.toLowerCase());
      router.replace(`/orders?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  // Initialized directly from server-fetched initialOrders (No client mount useEffect)
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute live summary from real orders array
  const summary = useMemo<OrderSummaryData>(() => {
    if (initialSummary && initialSummary.totalPendingVolume > 0) {
      return initialSummary;
    }

    let pendingVolume = 0;
    let awaitingCount = 0;
    let currency = "EGP";

    orders.forEach((ord) => {
      if (ord.currency) currency = ord.currency;
      if (ord.status === "PENDING") {
        pendingVolume += ord.totalAmount || 0;
        awaitingCount += 1;
      }
    });

    return {
      totalPendingVolume: pendingVolume,
      currency,
      awaitingConfirmationCount: awaitingCount,
    };
  }, [orders, initialSummary]);

  // Compute live tab counts based on current orders array
  const orderCounts = useMemo(() => {
    const counts: Record<OrderTab, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      PREPARING: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orders.forEach((ord) => {
      if (counts[ord.status] !== undefined) {
        counts[ord.status] += 1;
      }
    });

    return counts;
  }, [orders]);

  // Filter orders by active tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesTab = ord.status === activeTab;
      if (!matchesTab) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        ord.id.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        (ord.displayStatusTag && ord.displayStatusTag.toLowerCase().includes(q))
      );
    });
  }, [orders, activeTab, searchQuery]);

  // Action: Confirm Order with backend validation & rollback
  const handleConfirmOrder = useCallback(
    async (orderId: string) => {
      const previousOrders = [...orders];

      // Apply change optimistically
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              status: "CONFIRMED",
              displayStatusTag: "CONFIRMED",
              accentVariant: "confirmed",
            };
          }
          return ord;
        }),
      );

      const res = await updateOrderStatus(orderId, "CONFIRMED", lang);

      if (res.success) {
        setToastMessage(`${t.orderConfirmedToast} (#${orderId})`);
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        // Roll back on failure
        setOrders(previousOrders);
        setToastMessage(
          res.error || "Failed to confirm order. Please try again.",
        );
        setTimeout(() => setToastMessage(null), 4000);
      }
    },
    [orders, lang, t],
  );

  // Action: Export orders list as CSV (Excel Compatible)
  const handleExport = useCallback(() => {
    if (!orders || orders.length === 0) return;

    const headers = [
      "رقم الطلب (Order ID)",
      "اسم العميل (Customer Name)",
      "عدد المنتجات (Items Count)",
      "تاريخ الطلب (Date)",
      "وقت الطلب (Time)",
      "نوع التنفيذ (Fulfillment)",
      "حالة الطلب (Status)",
      "المبلغ الإجمالي (Total Amount)",
      "العملة (Currency)",
    ];

    const rows = orders.map((ord) => [
      `"${ord.id}"`,
      `"${ord.customerName.replace(/"/g, '""')}"`,
      ord.itemCount,
      `"${ord.date || ""}"`,
      `"${ord.time || ""}"`,
      `"${ord.fulfillmentType === "Delivery" ? "توصيل" : "استلام"}"`,
      `"${ord.status}"`,
      ord.totalAmount,
      `"${ord.currency || "EGP"}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute(
      "download",
      `orders-report-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  }, [orders]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-28">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] bg-[#0B3C26] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto"
        >
          <Icon
            name="check_circle"
            className="w-5 h-5 text-emerald-400 shrink-0"
          />
          <span className="leading-snug">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="mr-2 text-emerald-200 hover:text-white transition-colors cursor-pointer"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Page Header */}
      <OrdersHeader lang={lang} onExportClick={handleExport} />

      {/* Status Tabs Bar */}
      <OrderStatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        orderCounts={orderCounts}
      />

      {/* Orders Grid */}
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {filteredOrders.map((ord) => (
            <OrderCard
              key={ord.id}
              order={ord}
              lang={lang}
              onConfirmOrder={handleConfirmOrder}
            />
          ))}
        </div>
      ) : (
        <OrdersEmptyState isRtl={isRtl} />
      )}

      {/* Floating Summary Panel */}
      <OrderSummaryPanel summary={summary} lang={lang} />
    </div>
  );
}
