import { RISK_LEVEL_LABELS, type RiskLevel } from "../lib/risk-analysis";

const RISK_LEVEL_BADGE_STYLES: Record<RiskLevel, string> = {
  high: "bg-error-container text-on-error-container",
  medium: "bg-tertiary-container text-on-tertiary-container",
  low: "bg-secondary-container text-on-secondary-container",
};

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${RISK_LEVEL_BADGE_STYLES[level]}`}
    >
      {RISK_LEVEL_LABELS[level]}
    </span>
  );
}
