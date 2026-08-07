import React from "react";

interface ModerationStatItemProps {
  label: string;
  value: React.ReactNode;
  isRtl?: boolean;
}

export const ModerationStatItem: React.FC<ModerationStatItemProps> = ({
  label,
  value,
  isRtl = false,
}) => {
  return (
    <div
      className={`flex flex-col gap-0.5 ${isRtl ? "text-right" : "text-left"}`}
    >
      <span className="text-[11px] font-medium text-outline">{label}</span>
      <div className="text-xs font-black text-on-surface">{value}</div>
    </div>
  );
};
