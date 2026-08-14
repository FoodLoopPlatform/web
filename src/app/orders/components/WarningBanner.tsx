import React from "react";
import { Icon } from "@/components/ui/icon";

interface WarningBannerProps {
  message: string;
}

export function WarningBanner({ message }: WarningBannerProps) {
  if (!message) return null;

  return (
    <div className="bg-[#FDF0EE] border border-rose-200 text-rose-900 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-2xs w-full animate-in fade-in slide-in-from-top-1">
      <div className="p-1 rounded-lg bg-rose-200/60 text-rose-800 shrink-0 mt-0.5">
        <Icon name="warning" className="w-5 h-5 text-rose-700" />
      </div>
      <p className="text-xs sm:text-sm font-bold font-sans leading-relaxed text-rose-900">
        {message}
      </p>
    </div>
  );
}
