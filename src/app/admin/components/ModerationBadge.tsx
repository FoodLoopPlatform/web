import React from "react";
import { AdminDictionary } from "../constants/dictionary";

interface ModerationConfidenceBadgeProps {
  confidence: number; // 0 to 100
  t: AdminDictionary;
}

export const ModerationConfidenceBadge: React.FC<
  ModerationConfidenceBadgeProps
> = ({ confidence, t }) => {
  const confidenceText = t.aiConfidenceBadge.replace(
    "{percent}",
    String(confidence),
  );

  let colorClasses =
    "bg-tertiary-fixed/80 text-on-tertiary-fixed-variant border-tertiary-fixed-dim"; // Medium amber default
  if (confidence >= 75) {
    colorClasses =
      "bg-primary-fixed/80 text-on-primary-fixed-variant border-primary-fixed-dim";
  } else if (confidence < 50) {
    colorClasses =
      "bg-error-container/80 text-on-error-container border-error/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border backdrop-blur-xs shadow-2xs ${colorClasses}`}
    >
      {confidenceText}
    </span>
  );
};

export { ModerationFlagBadge } from "./ModerationFlagBadge";
