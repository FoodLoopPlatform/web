import React from "react";
import { AuditActionType } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface AuditActionBadgeProps {
  actionType: AuditActionType;
  t: AdminDictionary;
  isRtl?: boolean;
}

function formatCamelCase(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}

export const AuditActionBadge: React.FC<AuditActionBadgeProps> = ({
  actionType,
  t,
  isRtl = true,
}) => {
  const rawStr = String(actionType || "").trim();
  const lowerStr = rawStr.toLowerCase();

  let label = "";
  let badgeStyle = "bg-slate-100 text-slate-900 border-slate-300";
  let dotColor = "bg-slate-500";

  if (
    lowerStr.includes("review") &&
    (lowerStr.includes("remove") || lowerStr.includes("delete"))
  ) {
    label = isRtl ? "حذف تقييم عميل" : "Review Removed";
    badgeStyle = "bg-rose-100 text-rose-950 border-rose-300 font-extrabold";
    dotColor = "bg-rose-600";
  } else if (
    lowerStr.includes("userstatusupdated") ||
    lowerStr.includes("user account status") ||
    (lowerStr.includes("user") && lowerStr.includes("status"))
  ) {
    label = isRtl ? "تحديث حالة حساب" : "User Status Updated";
    badgeStyle =
      "bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold";
    dotColor = "bg-emerald-600";
  } else if (
    lowerStr.includes("store") ||
    lowerStr.includes("organization") ||
    lowerStr.includes("merchant") ||
    lowerStr.includes("charity")
  ) {
    label = isRtl ? "توثيق/تحديث مؤسسة" : "Store / Org Event";
    badgeStyle = "bg-blue-100 text-blue-950 border-blue-300 font-extrabold";
    dotColor = "bg-blue-600";
  } else if (lowerStr.includes("pricing")) {
    label = t.pricingChange || (isRtl ? "تغيير الأسعار" : "Pricing Change");
    badgeStyle = "bg-cyan-100 text-cyan-950 border-cyan-300 font-extrabold";
    dotColor = "bg-cyan-600";
  } else if (lowerStr.includes("dispute") || lowerStr.includes("ticket")) {
    label = isRtl ? "مراجعة نزاع" : "Dispute Event";
    badgeStyle =
      "bg-purple-100 text-purple-950 border-purple-300 font-extrabold";
    dotColor = "bg-purple-600";
  } else if (
    lowerStr.includes("product") ||
    lowerStr.includes("moderation") ||
    rawStr === "Listing Moderation"
  ) {
    label =
      t.listingModeration || (isRtl ? "إشراف المنتجات" : "Product Moderation");
    badgeStyle = "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";
    dotColor = "bg-amber-600";
  } else if (lowerStr.includes("donation")) {
    label = t.donationDecision || (isRtl ? "قرار التبرع" : "Donation Decision");
    badgeStyle = "bg-teal-100 text-teal-950 border-teal-300 font-extrabold";
    dotColor = "bg-teal-600";
  } else if (lowerStr.includes("user") || lowerStr.includes("account")) {
    label = isRtl ? "إجراء مستخدم" : "User Event";
    badgeStyle =
      "bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold";
    dotColor = "bg-emerald-600";
  } else {
    label =
      formatCamelCase(rawStr) ||
      rawStr ||
      (isRtl ? "إجراء نظام" : "System Action");
    badgeStyle = "bg-slate-100 text-slate-900 border-slate-300 font-extrabold";
    dotColor = "bg-slate-600";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] border shadow-2xs whitespace-nowrap leading-none ${badgeStyle}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{label}</span>
    </span>
  );
};
