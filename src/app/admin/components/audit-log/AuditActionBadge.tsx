import React from "react";
import { AuditActionType } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";

interface AuditActionBadgeProps {
  actionType: AuditActionType;
  t: AdminDictionary;
}

export const AuditActionBadge: React.FC<AuditActionBadgeProps> = ({
  actionType,
  t,
}) => {
  let label = "";
  let variantClasses =
    "bg-surface-container-high text-on-surface-variant border-outline-variant/60";

  switch (actionType) {
    case "Pricing Change":
      label = t.pricingChange;
      variantClasses =
        "bg-tertiary-container text-on-tertiary-container border-tertiary-fixed-dim/50";
      break;
    case "Listing Moderation":
      label = t.listingModeration;
      variantClasses =
        "bg-primary-container text-on-primary-container border-primary-fixed-dim/50";
      break;
    case "Donation Decision":
      label = t.donationDecision;
      variantClasses =
        "bg-secondary-container text-on-secondary-container border-secondary-fixed-dim/50";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold border uppercase tracking-wider whitespace-nowrap shadow-2xs ${variantClasses}`}
    >
      {label}
    </span>
  );
};
