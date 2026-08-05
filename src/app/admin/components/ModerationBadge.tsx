import React from "react";
import { ModerationFlagType } from "../types/admin.types";
import { AdminDictionary } from "../constants/dictionary";

interface ModerationConfidenceBadgeProps {
  confidence: number; // 0 to 100
  t: AdminDictionary;
}

export const ModerationConfidenceBadge: React.FC<ModerationConfidenceBadgeProps> = ({ confidence, t }) => {
  const confidenceText = t.aiConfidenceBadge.replace("{percent}", String(confidence));

  let colorClasses = "bg-tertiary-fixed/80 text-on-tertiary-fixed-variant border-tertiary-fixed-dim"; // Medium amber default
  if (confidence >= 75) {
    colorClasses = "bg-primary-fixed/80 text-on-primary-fixed-variant border-primary-fixed-dim";
  } else if (confidence < 50) {
    colorClasses = "bg-error-container/80 text-on-error-container border-error/30";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border backdrop-blur-xs shadow-2xs ${colorClasses}`}>
      {confidenceText}
    </span>
  );
};

interface ModerationFlagBadgeProps {
  flagType: ModerationFlagType;
  t: AdminDictionary;
}

export const ModerationFlagBadge: React.FC<ModerationFlagBadgeProps> = ({ flagType, t }) => {
  let label = "";
  let variantClasses = "bg-surface-container-high text-on-surface-variant border-outline-variant/60";

  switch (flagType) {
    case "user_report":
      label = t.flagUserReport;
      variantClasses = "bg-tertiary-container text-on-tertiary-container border-tertiary/40";
      break;
    case "unverified_origin":
      label = t.flagUnverifiedOrigin;
      variantClasses = "bg-surface-container-high text-on-surface-variant border-outline-variant/60";
      break;
    case "low_ai_confidence":
      label = t.flagLowAiConfidence;
      variantClasses = "bg-tertiary-container text-on-tertiary-container border-tertiary/40";
      break;
    case "duplicate_listing":
      label = t.flagDuplicateListing;
      variantClasses = "bg-surface-container-high text-on-surface-variant border-outline-variant/60";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${variantClasses}`}>
      {label}
    </span>
  );
};
