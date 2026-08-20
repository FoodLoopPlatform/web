import { Endpoints } from "@/utils/endpoints";
import { withAuth } from "@/utils/api-client";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { getMany, updateOne, createOne } from "@/utils/server";

export type NotificationType =
  | "SupportTicketReply"
  | "SupportTicketCreated"
  | "DisputeCreated"
  | "DisputeFiled"
  | "ComplaintCreated"
  | "ComplaintFiled"
  | "AdminWarning"
  | "AdminUrgent"
  | "AdminNotice"
  | "OrderPlaced"
  | "OrderReceived"
  | "OrderConfirmed"
  | "OrderPreparing"
  | "OrderReadyForPickup"
  | "OrderCompleted"
  | "OrderCancelled";

/** Exact Data Contract matching backend C# NotificationDto */
export interface NotificationDto {
  /** Unique notification identifier (UUID v4 format) */
  id: string;
  /** Display title for the banner or notification center */
  title: string;
  /** Body message content */
  body: string;
  /** Business event type */
  type: NotificationType | string;
  /** Indicates whether the notification has been read by the user */
  isRead: boolean;
  /** Creation timestamp in ISO 8601 UTC format */
  createdAt: string;
}

/** Extended frontend AppNotification type preserving legacy API fallbacks */
export interface AppNotification extends Partial<NotificationDto> {
  id: string;
  title?: string;
  body?: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
  type?: NotificationType | string;
  link?: string;
  referenceId?: string;
}

/**
 * Section 6: Out of Scope Events
 * The frontend must NOT process AI Recommendation or Donation notification types.
 */
export function isOutOfScopeNotification(type?: string): boolean {
  if (!type) return false;
  const lower = type.toLowerCase();
  return (
    lower.includes("airecommendation") ||
    lower.includes("ai_recommendation") ||
    lower.includes("donation")
  );
}

/**
 * Returns user-friendly UI icon and theme styling based on NotificationDto type
 */
export function getNotificationMeta(type?: string, isRtl: boolean = true) {
  const t = (type || "").toLowerCase();

  if (
    t.includes("support") ||
    t.includes("ticket") ||
    t.includes("dispute") ||
    t.includes("complaint") ||
    t.includes("shakwa") ||
    t.includes("issue") ||
    t.includes("report")
  ) {
    return {
      icon: "report_problem",
      colorClass: "bg-rose-50 text-rose-800 border-rose-200",
      badgeColor: "bg-rose-600",
      categoryAr: "شكوى / تذكرة دعم",
      categoryEn: "Complaint / Support",
    };
  }
  if (
    t.includes("adminwarning") ||
    t.includes("admin_warning") ||
    t === "warning"
  ) {
    return {
      icon: "warning",
      colorClass: "bg-amber-50 text-amber-800 border-amber-200",
      badgeColor: "bg-amber-600",
      categoryAr: "تحذير الإدارة",
      categoryEn: "Admin Warning",
    };
  }
  if (
    t.includes("adminurgent") ||
    t.includes("admin_urgent") ||
    t === "urgent"
  ) {
    return {
      icon: "error",
      colorClass: "bg-red-50 text-red-800 border-red-200",
      badgeColor: "bg-red-600",
      categoryAr: "تنبيه عاجل",
      categoryEn: "Urgent Notice",
    };
  }
  if (
    t.includes("adminnotice") ||
    t.includes("admin_notice") ||
    t.includes("admin")
  ) {
    return {
      icon: "campaign",
      colorClass: "bg-purple-50 text-purple-800 border-purple-200",
      badgeColor: "bg-purple-600",
      categoryAr: "إشعار إداري",
      categoryEn: "Admin Notice",
    };
  }
  if (
    t.includes("orderplaced") ||
    t.includes("orderreceived") ||
    t.includes("order_received") ||
    t.includes("order_placed")
  ) {
    return {
      icon: "shopping_bag",
      colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      badgeColor: "bg-emerald-600",
      categoryAr: "طلب جديد",
      categoryEn: "New Order",
    };
  }
  if (
    t.includes("orderconfirmed") ||
    t.includes("orderpreparing") ||
    t.includes("order_confirmed") ||
    t.includes("order_preparing")
  ) {
    return {
      icon: "restaurant",
      colorClass: "bg-teal-50 text-teal-800 border-teal-200",
      badgeColor: "bg-teal-600",
      categoryAr: "تحديث الطلب",
      categoryEn: "Order Update",
    };
  }
  if (t.includes("readyforpickup") || t.includes("ready_for_pickup")) {
    return {
      icon: "local_shipping",
      colorClass: "bg-indigo-50 text-indigo-800 border-indigo-200",
      badgeColor: "bg-indigo-600",
      categoryAr: "جاهز للاستلام",
      categoryEn: "Ready for Pickup",
    };
  }
  if (
    t.includes("ordercompleted") ||
    t.includes("order_completed") ||
    t.includes("completed")
  ) {
    return {
      icon: "check_circle",
      colorClass: "bg-green-50 text-green-800 border-green-200",
      badgeColor: "bg-green-600",
      categoryAr: "مكتمل",
      categoryEn: "Order Completed",
    };
  }
  if (
    t.includes("ordercancelled") ||
    t.includes("order_cancelled") ||
    t.includes("cancelled")
  ) {
    return {
      icon: "cancel",
      colorClass: "bg-rose-50 text-rose-800 border-rose-200",
      badgeColor: "bg-rose-600",
      categoryAr: "ملغى",
      categoryEn: "Order Cancelled",
    };
  }
  if (t.includes("order")) {
    return {
      icon: "shopping_bag",
      colorClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      badgeColor: "bg-emerald-600",
      categoryAr: "طلب",
      categoryEn: "Order",
    };
  }

  return {
    icon: "notifications",
    colorClass: "bg-gray-50 text-gray-800 border-gray-200",
    badgeColor: "bg-primary",
    categoryAr: isRtl ? "إشعار" : "Notification",
    categoryEn: "Notification",
  };
}

/**
 * Automatically translates common backend notification titles/bodies to Arabic when Arabic language is active.
 */
export function getLocalizedNotificationText(
  title?: string,
  body?: string,
  isRtl: boolean = true,
): { title: string; body: string } {
  let finalTitle = title || (isRtl ? "إشعار جديد" : "New Notification");
  const finalBody = body || "";

  if (!isRtl) return { title: finalTitle, body: finalBody };

  const lowerTitle = finalTitle.toLowerCase();
  if (
    lowerTitle.includes("dispute") ||
    lowerTitle.includes("complaint") ||
    lowerTitle.includes("shakwa") ||
    lowerTitle.includes("issue") ||
    lowerTitle.includes("report")
  ) {
    finalTitle = "شكوى جديدة من العميل";
  } else if (
    lowerTitle.includes("new order") ||
    lowerTitle.includes("order received")
  ) {
    finalTitle = "طلب جديد وارد";
  } else if (lowerTitle.includes("order confirmed")) {
    finalTitle = "تم تأكيد الطلب";
  } else if (lowerTitle.includes("order preparing")) {
    finalTitle = "جاري تجهيز الطلب";
  } else if (lowerTitle.includes("ready for pickup")) {
    finalTitle = "الطلب جاهز للاستلام";
  } else if (lowerTitle.includes("order completed")) {
    finalTitle = "تم إكمال الطلب بنجاح";
  } else if (lowerTitle.includes("order cancelled")) {
    finalTitle = "تم إلغاء الطلب";
  } else if (
    lowerTitle.includes("support ticket") ||
    lowerTitle.includes("ticket reply") ||
    lowerTitle.includes("ticket created")
  ) {
    finalTitle = "تذكرة دعم جديدة / رد جديد";
  } else if (lowerTitle.includes("admin warning")) {
    finalTitle = "تحذير إداري من المنصة";
  } else if (
    lowerTitle.includes("admin notice") ||
    lowerTitle.includes("admin alert")
  ) {
    finalTitle = "إشعار إداري جديد";
  }

  return { title: finalTitle, body: finalBody };
}

/**
 * Determines the target frontend route when a user clicks a notification
 */
export function getNotificationTargetRoute(
  notif: Partial<AppNotification>,
  isAdmin: boolean = false,
): string | null {
  if (notif.link) return notif.link;

  const type = notif.type || "";
  const refId = (notif as AppNotification).referenceId;

  if (
    type.includes("Ticket") ||
    type.includes("Support") ||
    type.includes("Dispute") ||
    type.includes("Complaint") ||
    type.includes("Issue") ||
    type.includes("Report")
  ) {
    return isAdmin
      ? refId
        ? `/admin/disputes?id=${encodeURIComponent(refId)}`
        : "/admin/disputes"
      : refId
        ? `/disputes?id=${encodeURIComponent(refId)}`
        : "/disputes";
  }

  if (type.startsWith("Order")) {
    return refId ? `/orders?id=${encodeURIComponent(refId)}` : "/orders";
  }

  if (type.startsWith("Admin")) {
    return isAdmin ? "/admin" : "/settings";
  }

  return null;
}

export async function getNotifications(lang: "ar" | "en" = "ar") {
  return withAuth(async (token) => {
    return unwrapEnvelope<AppNotification[]>(
      getMany<FoodLoopEnvelope<AppNotification[]>>(
        Endpoints.notifications.base,
        {
          token,
          headers: { "Accept-Language": lang },
        },
      ),
    );
  });
}

export async function markNotificationAsRead(
  id: string,
  lang: "ar" | "en" = "ar",
) {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>>(
        Endpoints.notifications.read(id),
        {},
        {
          token,
          headers: { "Accept-Language": lang },
        },
      ),
    );
  });
}

export async function markAllNotificationsAsRead(lang: "ar" | "en" = "ar") {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>>(
        Endpoints.notifications.readAll,
        {},
        {
          token,
          headers: { "Accept-Language": lang },
        },
      ),
    );
  });
}

export async function registerDeviceToken(
  deviceToken: string,
  platform: string = "web",
  lang: "ar" | "en" = "ar",
) {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>>(
        Endpoints.notifications.deviceToken,
        { token: deviceToken, platform },
        {
          token,
          headers: { "Accept-Language": lang },
        },
      ),
    );
  });
}
