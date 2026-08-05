import React from "react";

interface SmartInsightCardProps {
  title: string;
  heading: string;
  bodyText: string;
  actionLabel: string;
  onActionClick: () => void;
  isRtl?: boolean;
}

export const SmartInsightCard: React.FC<SmartInsightCardProps> = ({
  title,
  heading,
  bodyText,
  actionLabel,
  onActionClick,
  isRtl = false,
}) => {
  return (
    <div className="bg-[#005129] text-white p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-elevation-2 relative overflow-hidden">
      <div
        className={`flex gap-4 items-start z-10 ${
          isRtl ? "flex-row text-right" : "flex-row-reverse text-left"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#7dc390]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-extrabold tracking-tight font-brand text-[#7dc390]">
            {title}
          </h4>
          <h3 className="text-base font-bold leading-snug mt-1">
            {heading}
          </h3>
          <p className="text-xs text-[#bfc9be] leading-relaxed mt-2">
            {bodyText}
          </p>
        </div>
      </div>

      <button
        onClick={onActionClick}
        className={`mt-6 bg-white hover:bg-[#fafaf4] text-[#005129] font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 ${
          isRtl ? "self-start" : "self-end"
        }`}
      >
        {actionLabel}
      </button>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
    </div>
  );
};
