import { getMany, updateOne, createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import {
  Order,
  OrderItem,
  OrderTab,
  RefundOrderPayload,
} from "../types/orders.types";

/**
 * Normalizes raw order responses from GET /stores/me/orders into the UI Order interface.
 */
function normalizeOrder(raw: Record<string, unknown>): Order {
  if (!raw || typeof raw !== "object") {
    return {
      id: "ORD-0000",
      customerName: "عميل",
      itemCount: 0,
      time: "",
      fulfillmentType: "Delivery",
      totalAmount: 0,
      currency: "EGP",
      status: "PENDING",
    };
  }

  // Payment Status
  const paymentStatus = (raw.paymentStatus as string) || "Pending";
  const refundedAmount = Number(raw.refundedAmount || 0);

  // Handle orderStatus mapping (e.g. "Pending" -> "PENDING", "Completed" -> "DELIVERED")
  const rawStatusStr = String(
    raw.orderStatus || raw.status || "PENDING",
  ).trim();
  let status: OrderTab = "PENDING";

  const upperStatus = rawStatusStr.toUpperCase();
  if (upperStatus === "PENDING") {
    status = "PENDING";
  } else if (upperStatus === "CONFIRMED") {
    status = "CONFIRMED";
  } else if (upperStatus === "PREPARING") {
    status = "PREPARING";
  } else if (upperStatus === "COMPLETED" || upperStatus === "DELIVERED") {
    status = "DELIVERED";
  } else if (upperStatus === "CANCELLED" || upperStatus === "CANCELED") {
    status = "CANCELLED";
  }

  // Unique ID for route navigation
  const fullId = String(raw.id || raw._id || "ORD-0000");

  // Customer Name
  const rawCustomer = raw.customer as Record<string, unknown> | undefined;
  const rawUser = raw.user as Record<string, unknown> | undefined;
  const customerName =
    raw.userFullName && raw.userFullName !== "string"
      ? String(raw.userFullName)
      : String(
          raw.customerName || rawCustomer?.name || rawUser?.name || "عميل جديد",
        );

  // Items mapping (Backend uses productTitle, unitPrice, quantity, productId)
  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.orderItems)
      ? raw.orderItems
      : [];

  const items: OrderItem[] = rawItems.map((itItem: unknown, idx: number) => {
    const it = (itItem && typeof itItem === "object" ? itItem : {}) as Record<
      string,
      unknown
    >;
    return {
      productId: String(it.productId || it._id || it.id || `prod-${idx}`),
      name: String(
        it.productTitle || it.title || it.name || it.productName || "منتج",
      ),
      quantity: Number(it.quantity || it.qty || 1),
      price: Number(it.unitPrice || it.price || 0),
      sku: String(it.sku || `SKU-${idx}`),
      image:
        it.image || it.imageUrl ? String(it.image || it.imageUrl) : undefined,
    };
  });

  const itemCount =
    items.reduce((acc, item) => acc + (item.quantity || 1), 0) ||
    items.length ||
    1;

  const totalAmount = Number(
    raw.totalAmount ?? raw.total ?? raw.amount ?? raw.totalPrice ?? 0,
  );

  const createdAtDate = raw.createdAt
    ? new Date(String(raw.createdAt))
    : raw.date
      ? new Date(String(raw.date))
      : new Date();

  const time = createdAtDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = createdAtDate.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const custDetail = (
    raw.customerDetail && typeof raw.customerDetail === "object"
      ? raw.customerDetail
      : {}
  ) as Record<string, unknown>;

  return {
    id: fullId,
    customerName: customerName === "string" ? "عميل" : customerName,
    itemCount,
    items,
    time,
    date,
    fulfillmentType:
      raw.fulfillmentType === "Pickup" || raw.type === "Pickup"
        ? "Pickup"
        : "Delivery",
    totalAmount,
    subtotal: Number(raw.subtotal ?? totalAmount),
    deliveryFee: Number(raw.deliveryFee ?? 0),
    currency: String(raw.currency || "ج.م"),
    status,
    displayStatusTag: status,
    paymentStatus,
    refundedAmount,
    accentVariant:
      status === "CONFIRMED"
        ? "confirmed"
        : status === "PREPARING"
          ? "preparing"
          : status === "DELIVERED"
            ? "delivered"
            : status === "CANCELLED"
              ? "cancelled"
              : "pending",
    customerDetail: {
      name: customerName === "string" ? "عميل" : customerName,
      customerSince: String(
        custDetail.customerSince || raw.customerSince || "2024",
      ),
      fulfillmentType: (raw.fulfillmentType || "Delivery") as
        "Delivery" | "Pickup",
      address: String(
        custDetail.address ||
          raw.address ||
          raw.shippingAddress ||
          rawCustomer?.address ||
          "عنوان التوصيل الرئيسي",
      ),
      notes: String(custDetail.notes || raw.notes || raw.orderNotes || ""),
      phone: String(
        custDetail.phone ||
          raw.phone ||
          raw.customerPhone ||
          rawCustomer?.phone ||
          "",
      ),
    },
  };
}

/**
 * Fetch active merchant orders from GET /stores/me/orders backend endpoint.
 */
export async function getOrders(
  lang = "ar",
  customToken?: string,
): Promise<{ data: Order[] | null; error: string | null }> {
  try {
    const res = customToken
      ? await unwrapEnvelope<Record<string, unknown>[]>(
          getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
            Endpoints.orders.base,
            {
              token: customToken,
              lang,
            },
          ),
        )
      : await withAuth((token) =>
          unwrapEnvelope<Record<string, unknown>[]>(
            getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
              Endpoints.orders.base,
              {
                token,
                lang,
              },
            ),
          ),
        );

    if (res.data && Array.isArray(res.data)) {
      const normalized = res.data.map(normalizeOrder);
      return { data: normalized, error: null };
    }

    return { data: null, error: res.error || "Failed to fetch active orders." };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : "Failed to fetch active orders.",
    };
  }
}

/**
 * Find order by ID from GET /stores/me/orders list.
 */
export async function getOrderById(
  id: string,
  lang = "ar",
  customToken?: string,
): Promise<{ data: Order | null; error: string | null }> {
  try {
    const { data: orders, error } = await getOrders(lang, customToken);
    if (!orders || orders.length === 0) {
      return { data: null, error: error || "Order not found." };
    }

    const cleanId = id.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === cleanId ||
        o.id.toLowerCase().replace(/-/g, "") === cleanId.replace(/-/g, "") ||
        o.id.toLowerCase().startsWith(cleanId) ||
        cleanId.startsWith(o.id.toLowerCase()),
    );

    if (found) {
      return { data: found, error: null };
    }

    return { data: null, error: "Order not found." };
  } catch (err) {
    return {
      data: null,
      error:
        err instanceof Error ? err.message : "Failed to load order details.",
    };
  }
}

/**
 * Update order status via PATCH /stores/me/orders/{id}
 */
export async function updateOrderStatus(
  id: string,
  status: OrderTab,
  lang = "ar",
  customToken?: string,
): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const titleCaseStatus =
      status === "PENDING"
        ? "Pending"
        : status === "CONFIRMED"
          ? "Confirmed"
          : status === "PREPARING"
            ? "Preparing"
            : status === "DELIVERED"
              ? "Completed"
              : "Cancelled";

    const bodyPayload = {
      status: titleCaseStatus,
      orderStatus: titleCaseStatus,
    };

    const res = customToken
      ? await unwrapEnvelope<Record<string, unknown>>(
          updateOne<
            FoodLoopEnvelope<Record<string, unknown>>,
            typeof bodyPayload
          >(Endpoints.orders.updateStatus(id), bodyPayload, {
            token: customToken,
            lang,
          }),
        )
      : await withAuth((token) =>
          unwrapEnvelope<Record<string, unknown>>(
            updateOne<
              FoodLoopEnvelope<Record<string, unknown>>,
              typeof bodyPayload
            >(Endpoints.orders.updateStatus(id), bodyPayload, { token, lang }),
          ),
        );

    if (res.data || res.status === 200 || res.status === 204) {
      return {
        success: true,
        data: res.data ? normalizeOrder(res.data) : undefined,
      };
    }

    return {
      success: false,
      error: res.error || "Failed to update order status",
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Network error updating order status",
    };
  }
}

/**
 * Refund an order via POST /stores/me/orders/{id}/refund
 */
export async function refundOrder(
  id: string,
  payload: RefundOrderPayload,
  lang = "ar",
  customToken?: string,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = customToken
      ? await unwrapEnvelope<unknown>(
          createOne<FoodLoopEnvelope<unknown>, RefundOrderPayload>(
            Endpoints.orders.refund(id),
            payload,
            { token: customToken, lang },
          ),
        )
      : await withAuth((token) =>
          unwrapEnvelope<unknown>(
            createOne<FoodLoopEnvelope<unknown>, RefundOrderPayload>(
              Endpoints.orders.refund(id),
              payload,
              { token, lang },
            ),
          ),
        );

    if (!res.error || res.status === 200 || res.status === 204) {
      return {
        success: true,
        data: res.data,
      };
    }

    return {
      success: false,
      error: res.error || "فشل استرداد مبلغ الطلب",
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "حدث خطأ غير متوقع أثناء استرداد الطلب",
    };
  }
}
