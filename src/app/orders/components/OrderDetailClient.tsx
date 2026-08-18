"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Order, OrderTab } from "../types/orders.types";
import { updateOrderStatus } from "../api/orders-api";
import { Icon } from "@/components/ui/icon";
import { OrderStatusStepper } from "./OrderStatusStepper";
import { WarningBanner } from "./WarningBanner";
import { OrderItemsCard } from "./OrderItemsCard";
import { CustomerInfoCard } from "./CustomerInfoCard";
import { OrderFooterBar } from "./OrderFooterBar";
import { CancelOrderModal } from "./CancelOrderModal";
import { RefundOrderModal } from "./RefundOrderModal";
import { PrintableInvoice } from "./PrintableInvoice";
import { ordersDictionary } from "../constants/orders-dictionary";
import { useAppLang } from "@/store/use-app-lang";

interface OrderDetailClientProps {
  initialOrder?: Order | null;
  orderId: string;
}

export function OrderDetailClient({
  initialOrder,
  orderId,
}: OrderDetailClientProps) {
  const { lang } = useAppLang();
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  // Initialized directly from server-fetched initialOrder (No client mount useEffect)
  const [order, setOrder] = useState<Order | null>(initialOrder || null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const displayId =
    orderId.length > 8 ? `ORD-${orderId.slice(0, 4).toUpperCase()}` : orderId;

  // Not Found State
  if (!order) {
    return (
      <div
        className="bg-white rounded-2xl border border-card-border p-8 sm:p-12 w-full min-h-[320px] text-center py-16 block select-none"
        style={{ width: "100%", boxSizing: "border-box" }}
      >
        <div
          className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4 mx-auto"
          style={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <Icon name="error" className="w-6 h-6 text-amber-600" />
        </div>

        <h2
          className="text-xl font-extrabold text-on-surface mb-2 font-sans text-center w-full block"
          style={{ width: "100%", display: "block", textAlign: "center" }}
        >
          {isRtl ? "الطلب غير موجود" : "Order Not Found"}
        </h2>

        <p
          className="text-xs text-outline mb-6 font-sans font-medium text-center max-w-md mx-auto block w-full"
          style={{
            width: "100%",
            maxWidth: "28rem",
            marginLeft: "auto",
            marginRight: "auto",
            display: "block",
            textAlign: "center",
          }}
        >
          {isRtl
            ? `لم نتمكن من العثور على تفاصيل الطلب رقم #${displayId}`
            : `Could not load order details for #${displayId}`}
        </p>

        <div className="flex justify-center w-full">
          <Link
            href="/orders"
            className="inline-block bg-[#0B3C26] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs hover:bg-primary transition-all active:scale-95 text-center"
          >
            {isRtl ? "العودة لقائمة الطلبات" : "Back to Orders"}
          </Link>
        </div>
      </div>
    );
  }

  // Status transition handler with backend validation & rollback
  const handleStatusChange = async (newStatus: OrderTab) => {
    const previousOrder = { ...order };

    // Apply change optimistically
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            displayStatusTag:
              newStatus === "CONFIRMED" ? "CONFIRMED" : prev.displayStatusTag,
          }
        : null,
    );

    const res = await updateOrderStatus(order.id, newStatus, lang);

    if (res.success) {
      setToastMessage(
        `${t.statusUpdatedToast} -> ${
          t.tabs[newStatus.toLowerCase() as keyof typeof t.tabs]
        }`,
      );
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      // Roll back on failure
      setOrder(previousOrder);
      setToastMessage(
        res.error || "Failed to update status. Please try again.",
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleAdvanceStatus = () => {
    const sequence: Record<OrderTab, OrderTab> = {
      PENDING: "CONFIRMED",
      CONFIRMED: "PREPARING",
      PREPARING: "DELIVERED",
      DELIVERED: "DELIVERED",
      CANCELLED: "CANCELLED",
    };

    const next = sequence[order.status] || "PREPARING";
    handleStatusChange(next);
  };

  const handleConfirmCancel = async () => {
    const previousOrder = { ...order };
    setCancelModalOpen(false);

    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: "CANCELLED",
            displayStatusTag: "CANCELLED",
            accentVariant: "cancelled",
          }
        : null,
    );

    const res = await updateOrderStatus(order.id, "CANCELLED", lang);

    if (res.success) {
      setToastMessage(t.confirmCancelTitle);
      setTimeout(() => setToastMessage(null), 3500);
    } else {
      setOrder(previousOrder);
      setToastMessage(res.error || "Failed to cancel order. Please try again.");
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handlePrintInvoice = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const orderHeaderDisplayId =
    order.id.length > 8
      ? `ORD-${order.id.slice(0, 4).toUpperCase()}`
      : order.id;

  const handleRefundSuccess = (amount: number) => {
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            paymentStatus: "Refunded",
            refundedAmount: amount,
          }
        : null,
    );
    setToastMessage(
      isRtl
        ? `تم استرداد ${amount} ج.م بنجاح.`
        : `Successfully refunded ${amount} EGP.`,
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      {/* Isolated Printable Sales Invoice Component */}
      <PrintableInvoice
        order={order}
        isRtl={isRtl}
        displayId={orderHeaderDisplayId}
      />

      {/* STANDARD WEB INTERFACE */}
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 select-none"
      >
        {/* Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0B3C26] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-emerald-400/30 animate-in fade-in slide-in-from-top-2">
            <Icon name="check_circle" className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Row matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <Link
              href="/orders"
              className="w-10 h-10 rounded-full bg-white border border-card-border hover:bg-surface-container-low flex items-center justify-center text-primary transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Back to Orders"
            >
              <Icon
                name={isRtl ? "arrow_forward" : "arrow_back"}
                className="w-5 h-5"
              />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-sans">
                  {t.order} #{orderHeaderDisplayId}
                </h1>
                {order.paymentStatus === "Refunded" && (
                  <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {isRtl ? "مسترد" : "Refunded"}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-outline mt-0.5 font-medium">
                {t.placedOn} {order.date || "14/08/2026"} · {order.time}
              </p>
            </div>
          </div>

          {/* Urgent Fulfillment Status Badge on Top Right */}
          {order.isUrgent && (
            <span className="self-start sm:self-auto bg-amber-900 text-amber-200 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-amber-700 shadow-2xs">
              {t.urgentFulfillment}
            </span>
          )}
        </div>

        {/* Horizontal Fulfillment Status Stepper */}
        <OrderStatusStepper
          currentStatus={order.status}
          onStatusChange={handleStatusChange}
        />

        {/* Conditional Warning Banner (Low Stock Alert) */}
        {order.warningMessage && (
          <WarningBanner message={order.warningMessage} />
        )}

        {/* Two-Column Responsive Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Order Items & Pricing Breakdown */}
          <div className="lg:col-span-2">
            <OrderItemsCard
              items={order.items || []}
              subtotal={order.subtotal || order.totalAmount}
              deliveryFee={order.deliveryFee || 0}
              totalAmount={order.totalAmount}
              currency={order.currency || "EGP"}
              lang={lang}
            />
          </div>

          {/* Right Column: Customer Info & Notes */}
          <div className="lg:col-span-1">
            <CustomerInfoCard customer={order.customerDetail} lang={lang} />
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <OrderFooterBar
          currentStatus={order.status}
          itemsVerified={order.itemsVerified}
          isRefunded={order.paymentStatus === "Refunded"}
          onPrintInvoice={handlePrintInvoice}
          onOpenCancelModal={() => setCancelModalOpen(true)}
          onOpenRefundModal={() => setRefundModalOpen(true)}
          onAdvanceStatus={handleAdvanceStatus}
        />

        {/* Destructive Cancel Order Modal */}
        <CancelOrderModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirmCancel={handleConfirmCancel}
          orderId={order.id}
        />

        {/* Refund Order Modal */}
        <RefundOrderModal
          isOpen={refundModalOpen}
          onClose={() => setRefundModalOpen(false)}
          orderId={order.id}
          maxAmount={order.totalAmount}
          currency={order.currency || "EGP"}
          onRefundSuccess={handleRefundSuccess}
        />
      </div>
    </>
  );
}
