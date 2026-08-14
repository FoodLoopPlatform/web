import React from "react";
import Image from "next/image";
import { OrderItem } from "../types/orders.types";
import { ordersDictionary } from "../constants/orders-dictionary";
import { SupportedLanguage } from "@/store/use-app-lang";

interface OrderItemsCardProps {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  lang?: SupportedLanguage;
}

export function OrderItemsCard({
  items,
  subtotal,
  deliveryFee,
  totalAmount,
  currency,
  lang = "ar",
}: OrderItemsCardProps) {
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const formatMoney = (val: number) =>
    new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-white rounded-2xl border border-card-border p-6 shadow-xs flex flex-col justify-between w-full"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-surface-container pb-4 mb-4">
        <h3 className="text-lg font-extrabold text-on-surface font-sans">
          {t.orderItems}
        </h3>
        <span className="text-xs font-bold bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
          {totalCount} {t.itemsTotal}
        </span>
      </div>

      {/* Items List */}
      <div className="divide-y divide-surface-container mb-6">
        {items.map((item, idx) => {
          const itemKey = item.productId || item.sku || `item-${idx}`;
          return (
            <div
              key={itemKey}
              className="py-4 flex items-center justify-between gap-4"
            >
              {/* Image & Product Info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-surface border border-card-border overflow-hidden shrink-0 relative flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || "Product"}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-primary">FL</span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <h4 className="font-extrabold text-sm text-on-surface truncate">
                    {item.name}
                  </h4>
                  {item.sku && (
                    <span className="text-[11px] font-mono text-outline uppercase mt-0.5">
                      SKU: {item.sku}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Item Price */}
              <div className="flex flex-col items-end shrink-0 text-right">
                <span className="text-xs font-extrabold text-on-surface font-sans">
                  x{item.quantity} {item.unit || ""}
                </span>
                <span className="text-xs font-extrabold text-primary font-sans mt-0.5">
                  {currency} {formatMoney(item.price || 0)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Summary Section */}
      <div className="border-t border-surface-container pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-bold text-outline">
          <span>{t.subtotal}</span>
          <span className="font-sans text-on-surface">
            {currency} {formatMoney(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs font-bold text-outline">
          <span>{t.deliveryFee}</span>
          <span className="font-sans text-on-surface">
            {currency} {formatMoney(deliveryFee)}
          </span>
        </div>

        <div className="flex justify-between items-baseline pt-3 mt-2 border-t border-surface-container-high">
          <span className="text-base font-extrabold text-on-surface font-sans">
            {t.totalAmount}
          </span>
          <span className="text-2xl font-black text-primary font-sans">
            {currency} {formatMoney(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
