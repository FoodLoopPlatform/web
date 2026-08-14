import React from "react";
import { Icon } from "@/components/ui/icon";

interface OrdersEmptyStateProps {
  isRtl: boolean;
  title?: string;
  description?: string;
}

export function OrdersEmptyState({
  isRtl,
  title,
  description,
}: OrdersEmptyStateProps) {
  const defaultTitle = isRtl
    ? "لا يوجد طلبات في هذه الفئة"
    : "No orders found in this status";

  const defaultDescription = isRtl
    ? "لم نجد طلبات تطابق الفلتر أو كلمة البحث الحالية."
    : "No orders match the selected filter tab or current search query.";

  return (
    <div
      className="bg-white rounded-2xl border border-card-border p-8 sm:p-12 w-full min-h-[280px] text-center py-16 block"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      {/* Centered Icon Circle */}
      <div
        className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-4 mx-auto"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <Icon name="shopping_cart" className="w-6 h-6" />
      </div>

      {/* Main Title */}
      <h4
        className="text-base font-bold text-on-surface mb-2 font-sans text-center w-full block"
        style={{ width: "100%", display: "block", textAlign: "center" }}
      >
        {title || defaultTitle}
      </h4>

      {/* Description Paragraph */}
      <p
        className="text-xs text-outline leading-relaxed font-sans font-medium text-center max-w-md mx-auto block w-full"
        style={{
          width: "100%",
          maxWidth: "28rem",
          marginLeft: "auto",
          marginRight: "auto",
          display: "block",
          textAlign: "center",
        }}
      >
        {description || defaultDescription}
      </p>
    </div>
  );
}
