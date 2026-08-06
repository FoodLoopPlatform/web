import React from "react";
import { SparklesIcon } from "@/components/icons";

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
    <div className="bg-primary-container text-on-primary p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-elevation-2 relative overflow-hidden">
      <div
        className={`flex gap-4 items-start z-10 ${
          isRtl ? "flex-row text-right" : "flex-row-reverse text-left"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <SparklesIcon className="w-5 h-5 text-primary-fixed" />
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-extrabold tracking-tight font-brand text-primary-fixed">
            {title}
          </h4>
          <h3 className="text-base font-bold leading-snug mt-1">{heading}</h3>
          <p className="text-xs text-outline-variant leading-relaxed mt-2">
            {bodyText}
          </p>
        </div>
      </div>

      <button
        onClick={onActionClick}
        className={`mt-6 bg-white hover:bg-surface text-primary-container font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer active:scale-95 z-10 ${
          isRtl ? "self-start" : "self-end"
        }`}
      >
        {actionLabel}
      </button>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5 border border-white/5 pointer-events-none" />
    </div>
  );
};
