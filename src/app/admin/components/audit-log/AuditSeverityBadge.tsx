import React from "react";
import { AuditSeverity } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface AuditSeverityBadgeProps {
  severity: AuditSeverity;
  t: AdminDictionary;
}

export const AuditSeverityBadge: React.FC<AuditSeverityBadgeProps> = ({
  severity,
  t,
}) => {
  let label = t.severityMed || "متوسط";
  let variantClasses =
    "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";

  if (severity === "Low") {
    label = t.severityLow || "منخفض";
    variantClasses =
      "bg-slate-100 text-slate-900 border-slate-300 font-extrabold";
  } else if (severity === "High") {
    label = t.severityHigh || "عالي";
    variantClasses = "bg-rose-100 text-rose-950 border-rose-300 font-extrabold";
  } else {
    label = t.severityMed || "متوسط";
    variantClasses =
      "bg-amber-100 text-amber-950 border-amber-300 font-extrabold";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border shadow-2xs whitespace-nowrap leading-none ${variantClasses}`}
    >
      {label}
    </span>
  );
};
