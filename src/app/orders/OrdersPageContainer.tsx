"use client";

import { OrdersDashboardClient } from "./components/OrdersDashboardClient";
import { OrdersPageShell } from "./components/OrdersPageShell";
import { Order } from "./types/orders.types";

interface OrdersPageContainerProps {
  initialOrders: Order[];
}

export function OrdersPageContainer({
  initialOrders,
}: OrdersPageContainerProps) {
  return (
    <OrdersPageShell defaultTitle="Orders">
      {(searchQuery) => (
        <OrdersDashboardClient
          initialOrders={initialOrders}
          searchQuery={searchQuery}
        />
      )}
    </OrdersPageShell>
  );
}
