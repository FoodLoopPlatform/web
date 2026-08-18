export type OrderTab =
  "PENDING" | "CONFIRMED" | "PREPARING" | "DELIVERED" | "CANCELLED";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERED"
  | "CANCELLED"
  | "RUSH"
  | "PENDING_AUDIT";

export type FulfillmentType = "Delivery" | "Pickup";

export interface OrderItem {
  productId: string;
  name?: string;
  sku?: string;
  quantity: number;
  unit?: string;
  price?: number;
  image?: string;
}

export interface CustomerDetail {
  name: string;
  avatarInitials?: string;
  customerSince?: string;
  fulfillmentType: string;
  address?: string;
  notes?: string;
  phone?: string;
}

export interface Order {
  id: string; // e.g. "GH-9021" or "FL-1024"
  customerName: string;
  itemCount: number;
  items?: OrderItem[];
  time: string; // e.g. "11:42 AM"
  date?: string; // e.g. "October 24, 2023"
  fulfillmentType: FulfillmentType;
  totalAmount: number;
  subtotal?: number;
  deliveryFee?: number;
  currency: string;
  status: OrderTab;
  displayStatusTag?:
    | "PENDING"
    | "RUSH"
    | "PENDING AUDIT"
    | "CONFIRMED"
    | "PREPARING"
    | "DELIVERED"
    | "CANCELLED"
    | "URGENT FULFILLMENT";
  accentVariant?:
    | "pending"
    | "rush"
    | "audit"
    | "confirmed"
    | "preparing"
    | "delivered"
    | "cancelled";
  isUrgent?: boolean;
  warningMessage?: string;
  customerDetail?: CustomerDetail;
  itemsVerified?: boolean;
  paymentStatus?: "Pending" | "Paid" | "Refunded" | string;
  refundedAmount?: number;
}

export interface RefundOrderPayload {
  amount: number;
  reason: string;
}

export interface OrderSummaryData {
  totalPendingVolume: number;
  awaitingConfirmationCount: number;
  currency: string;
}

export interface OrderStatusConfigItem {
  key: OrderTab;
  labelEn: string;
  labelAr: string;
  badgeBg: string;
  badgeText: string;
  leftBorderClass: string;
  rightBorderClass: string;
}
