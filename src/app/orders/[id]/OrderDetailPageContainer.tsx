"use client";

import { OrderDetailClient } from "../components/OrderDetailClient";
import { OrdersPageShell } from "../components/OrdersPageShell";
import { Order } from "../types/orders.types";

interface OrderDetailPageContainerProps {
  initialOrder?: Order | null;
  orderId: string;
}

export function OrderDetailPageContainer({
  initialOrder,
  orderId,
}: OrderDetailPageContainerProps) {
  return (
    <OrdersPageShell pageTitleKey="orderDetailsControl" showFeedbackIcons>
      {() => (
        <OrderDetailClient initialOrder={initialOrder} orderId={orderId} />
      )}
    </OrdersPageShell>
  );
}
