import { SupportedLanguage } from "@/store/use-app-lang";

export interface OrdersDictionary {
  pageTitle: string;
  orderDetailsControlTitle: string;
  manageActiveOrders: string;
  realtimeTracking: string;
  filter: string;
  export: string;
  searchPlaceholder: string;
  viewDetails: string;
  confirmOrder: string;
  orderConfirmedToast: string;
  items: string;
  item: string;
  delivery: string;
  pickup: string;
  totalPendingVolume: string;
  awaitingConfirmation: string;
  wasteAuditReport: string;
  order: string;
  placedOn: string;
  urgentFulfillment: string;
  orderItems: string;
  itemsTotal: string;
  subtotal: string;
  deliveryFee: string;
  totalAmount: string;
  customerInfo: string;
  customerSince: string;
  fulfillmentType: string;
  address: string;
  contactCustomer: string;
  orderNotes: string;
  itemsVerified: string;
  printInvoice: string;
  cancelOrder: string;
  confirmCancelTitle: string;
  confirmCancelDesc: string;
  keepOrder: string;
  startPreparing: string;
  markDelivered: string;
  statusUpdatedToast: string;
  tabs: {
    pending: string;
    confirmed: string;
    preparing: string;
    delivered: string;
    cancelled: string;
  };
  tags: {
    pending: string;
    rush: string;
    pendingAudit: string;
    confirmed: string;
    preparing: string;
    delivered: string;
    cancelled: string;
    urgentFulfillment: string;
  };
}

export const ordersDictionary: Record<SupportedLanguage, OrdersDictionary> = {
  ar: {
    pageTitle: "الطلبات",
    orderDetailsControlTitle: "تفاصيل الطلب والتحكم بالتنفيذ",
    manageActiveOrders: "إدارة الطلبات النشطة",
    realtimeTracking: "متابعة مباشرة لتنفيذ الطلبات لـ GreenGrocer Central.",
    filter: "تصفية",
    export: "تصدير",
    searchPlaceholder: "البحث برقم الطلب، اسم العميل، أو التاريخ...",
    viewDetails: "عرض التفاصيل",
    confirmOrder: "تأكيد الطلب",
    orderConfirmedToast: "تم تأكيد الطلب بنجاح",
    items: "منتجات",
    item: "منتج",
    delivery: "توصيل",
    pickup: "استلام",
    totalPendingVolume: "إجمالي الطلبات المعلقة",
    awaitingConfirmation: "في انتظار التأكيد",
    wasteAuditReport: "تقرير هدر الطعام",
    order: "الطلب",
    placedOn: "تم الطلب بتاريخ",
    urgentFulfillment: "تنفيذ عاجل جداً",
    orderItems: "منتجات الطلب",
    itemsTotal: "إجمالي المنتجات",
    subtotal: "المجموع الفرعي",
    deliveryFee: "رسوم التوصيل",
    totalAmount: "المبلغ الإجمالي",
    customerInfo: "بيانات العميل",
    customerSince: "عميل منذ",
    fulfillmentType: "نوع التنفيذ",
    address: "عنوان التوصيل",
    contactCustomer: "التواصل مع العميل",
    orderNotes: "ملاحظات الطلب",
    itemsVerified: "تم التحقق من المنتجات",
    printInvoice: "طباعة الفاتورة",
    cancelOrder: "إلغاء الطلب",
    confirmCancelTitle: "تأكيد إلغاء الطلب",
    confirmCancelDesc:
      "هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.",
    keepOrder: "الاحتفاظ بالطلب",
    startPreparing: "بدء التحضير",
    markDelivered: "تحديد كـ تم التوصيل",
    statusUpdatedToast: "تم تحديث حالة الطلب بنجاح",
    tabs: {
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      preparing: "جاري التحضير",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
    },
    tags: {
      pending: "قيد الانتظار",
      rush: "عاجل جداً",
      pendingAudit: "مراجعة معلقة",
      confirmed: "مؤكد",
      preparing: "جاري التحضير",
      delivered: "تم التوصيل",
      cancelled: "ملغي",
      urgentFulfillment: "تنفيذ عاجل",
    },
  },
  en: {
    pageTitle: "Orders",
    orderDetailsControlTitle: "Order Details & Fulfillment Control",
    manageActiveOrders: "Manage Active Orders",
    realtimeTracking: "Real-time fulfillment tracking for GreenGrocer Central.",
    filter: "Filter",
    export: "Export",
    searchPlaceholder: "Search order ID, customer, or date...",
    viewDetails: "View Details",
    confirmOrder: "Confirm Order",
    orderConfirmedToast: "Order confirmed successfully",
    items: "items",
    item: "item",
    delivery: "Delivery",
    pickup: "Pickup",
    totalPendingVolume: "TOTAL PENDING VOLUME",
    awaitingConfirmation: "AWAITING CONF.",
    wasteAuditReport: "Waste Audit Report",
    order: "Order",
    placedOn: "Placed on",
    urgentFulfillment: "URGENT FULFILLMENT",
    orderItems: "Order Items",
    itemsTotal: "Items Total",
    subtotal: "Subtotal",
    deliveryFee: "Delivery Fee",
    totalAmount: "Total Amount",
    customerInfo: "Customer Info",
    customerSince: "Customer since",
    fulfillmentType: "FULFILLMENT TYPE",
    address: "ADDRESS",
    contactCustomer: "Contact Customer",
    orderNotes: "ORDER NOTES",
    itemsVerified: "Items verified",
    printInvoice: "Print Invoice",
    cancelOrder: "Cancel Order",
    confirmCancelTitle: "Confirm Order Cancellation",
    confirmCancelDesc:
      "Are you sure you want to cancel this order? This action cannot be undone.",
    keepOrder: "Keep Order",
    startPreparing: "Start Preparing",
    markDelivered: "Mark as Delivered",
    statusUpdatedToast: "Order status updated successfully",
    tabs: {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    tags: {
      pending: "PENDING",
      rush: "RUSH",
      pendingAudit: "PENDING AUDIT",
      confirmed: "CONFIRMED",
      preparing: "PREPARING",
      delivered: "DELIVERED",
      cancelled: "CANCELLED",
      urgentFulfillment: "URGENT FULFILLMENT",
    },
  },
};
