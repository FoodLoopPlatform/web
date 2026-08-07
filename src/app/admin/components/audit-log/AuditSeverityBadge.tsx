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
  let label = "";
  let variantClasses =
    "bg-surface-container-high text-on-surface-variant border-outline-variant/60";

  switch (severity) {
    case "Low":
      label = t.severityLow;
      variantClasses =
        "bg-secondary-container/80 text-on-secondary-container border-secondary-fixed-dim/40";
      break;
    case "Med":
      label = t.severityMed;
      variantClasses =
        "bg-tertiary-container/80 text-on-tertiary-container border-tertiary-fixed-dim/40";
      break;
    case "High":
      label = t.severityHigh;
      variantClasses =
        "bg-error-container/80 text-on-error-container border-error/40";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold font-mono border uppercase tracking-wider ${variantClasses}`}
    >
      {label}
    </span>
  );
};
