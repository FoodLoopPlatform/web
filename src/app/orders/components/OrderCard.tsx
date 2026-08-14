import React from "react";
import Link from "next/link";
import { Order } from "../types/orders.types";
import { ORDER_STATUS_CONFIG } from "../constants/orders-status-config";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { SupportedLanguage } from "@/store/use-app-lang";
import { ConfirmOrderButton } from "./ConfirmOrderButton";

interface OrderCardProps {
  order: Order;
  lang?: SupportedLanguage;
  onConfirmOrder?: (id: string) => void;
}

export function OrderCard({
  order,
  lang = "ar",
  onConfirmOrder,
}: OrderCardProps) {
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const statusConfig =
    ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.PENDING;

  // Determine left (LTR) / right (RTL) border accent class from status config or custom accent
  const getBorderAccentClass = () => {
    const variant = order.accentVariant;
    if (variant === "rush") {
      return isRtl
        ? "border-r-4 border-r-amber-600"
        : "border-l-4 border-l-amber-600";
    }
    if (variant === "audit") {
      return isRtl
        ? "border-r-4 border-r-slate-400"
        : "border-l-4 border-l-slate-400";
    }
    return isRtl
      ? `border-r-4 ${statusConfig.borderClass.replace("border-l-", "border-r-")}`
      : `border-l-4 ${statusConfig.borderClass}`;
  };

  const getTagBadgeStyle = () => {
    const tag = order.displayStatusTag;
    if (tag === "RUSH") {
      return "bg-amber-200 text-amber-900 border border-amber-300 font-black";
    }
    if (tag === "PENDING AUDIT") {
      return "bg-slate-200 text-slate-800 border border-slate-300 font-bold";
    }
    return `${statusConfig.badgeBg} ${statusConfig.badgeText} border border-surface-container-highest font-bold`;
  };

  const formattedPrice = new Intl.NumberFormat(
    lang === "ar" ? "ar-EG" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(order.totalAmount);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`bg-white rounded-2xl border border-card-border p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${getBorderAccentClass()}`}
    >
      {/* Top Header Row: Order ID + Status Tag Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-extrabold text-sm md:text-base text-primary font-sans dir-ltr">
          #
          {order.id.length > 8
            ? `ORD-${order.id.slice(0, 4).toUpperCase()}`
            : order.id}
        </span>
        <span
          className={`text-[10px] sm:text-xs uppercase px-2.5 py-0.5 rounded-md font-sans tracking-wide ${getTagBadgeStyle()}`}
        >
          {order.displayStatusTag
            ? t.tags[
                order.displayStatusTag
                  .toLowerCase()
                  .replace(" ", "") as keyof typeof t.tags
              ] || order.displayStatusTag
            : t.tags[statusConfig.labelKey]}
        </span>
      </div>

      {/* Customer Name */}
      <h3 className="text-lg md:text-xl font-bold text-on-surface mb-3 line-clamp-1">
        {order.customerName}
      </h3>

      {/* Metadata Info Row: Items, Time, Fulfillment Type */}
      <div className="flex items-center gap-4 text-xs text-on-surface-variant mb-5 flex-wrap">
        <div className="flex items-center gap-1.5 font-medium">
          <Icon name="shopping_bag" className="w-4 h-4 text-outline" />
          <span>
            {order.itemCount} {order.itemCount === 1 ? t.item : t.items}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <Icon name="schedule" className="w-4 h-4 text-outline" />
          <span>{order.time}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-on-surface">
          <Icon
            name={
              order.fulfillmentType === "Delivery"
                ? "local_shipping"
                : "storefront"
            }
            className="w-4 h-4 text-primary"
          />
          <span>
            {order.fulfillmentType === "Delivery" ? t.delivery : t.pickup}
          </span>
        </div>
      </div>

      {/* Footer Row: Price + Action Buttons */}
      <div className="flex items-end justify-between gap-4 pt-3 border-t border-surface-container">
        {/* Price display */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-black text-on-surface font-sans">
            {formattedPrice}
          </span>
          <span className="text-xs font-bold text-outline uppercase">
            {order.currency || "EGP"}
          </span>
        </div>

        {/* Buttons Column */}
        <div className="flex flex-col gap-2 shrink-0 w-32 sm:w-36">
          <Link
            href={`/orders/${order.id}`}
            className="w-full text-center py-2 px-3 rounded-xl border border-primary text-primary hover:bg-light-green font-bold text-xs transition-colors cursor-pointer active:scale-95"
          >
            {t.viewDetails}
          </Link>

          {order.status === "PENDING" && (
            <ConfirmOrderButton
              orderId={order.id}
              label={t.confirmOrder}
              onConfirmOrder={onConfirmOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
