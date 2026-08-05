import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  accentClass?: string;
  isRtl?: boolean;
  textColorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  accentClass = "bg-[#005129]/20",
  isRtl = false,
  textColorClass = "text-[#00381a]",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#e0e6df] p-5 sm:p-6 shadow-sm relative overflow-hidden ${
        isRtl ? "text-right" : "text-left"
      }`}
    >
      <span className="text-[10px] sm:text-xs font-semibold text-[#707a70] uppercase block">
        {label}
      </span>
      <span
        className={`text-2xl sm:text-3xl font-extrabold mt-2 sm:mt-3 block font-brand ${textColorClass}`}
      >
        {value}
      </span>
      <div
        className={`absolute top-0 ${
          isRtl ? "left-0" : "right-0"
        } w-1.5 h-full ${accentClass}`}
      />
    </div>
  );
};
