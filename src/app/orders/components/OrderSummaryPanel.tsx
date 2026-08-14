import React from "react";
import { OrderSummaryData } from "../types/orders.types";
import { ordersDictionary } from "../constants/orders-dictionary";
import { SupportedLanguage } from "@/store/use-app-lang";

interface OrderSummaryPanelProps {
  summary: OrderSummaryData;
  lang?: SupportedLanguage;
}

export function OrderSummaryPanel({
  summary,
  lang = "ar",
}: OrderSummaryPanelProps) {
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  const formattedVolume = new Intl.NumberFormat(
    lang === "ar" ? "ar-EG" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  ).format(summary.totalPendingVolume);

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`fixed bottom-6 ${
        isRtl ? "left-6 sm:left-12" : "right-6 sm:right-12"
      } z-40 bg-[#0B3C26] text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-6 sm:gap-8 min-w-max shrink-0 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4`}
    >
      {/* Total Pending Volume */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/90 whitespace-nowrap">
          {t.totalPendingVolume}
        </span>
        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
          <span className="text-lg sm:text-xl font-black font-sans tracking-tight">
            {formattedVolume}
          </span>
          <span className="text-[11px] font-bold text-emerald-300 uppercase">
            {summary.currency}
          </span>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="w-px h-8 bg-white/20 shrink-0" />

      {/* Awaiting Confirmation */}
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200/90 whitespace-nowrap">
          {t.awaitingConfirmation}
        </span>
        <span className="text-lg sm:text-xl font-black font-sans whitespace-nowrap">
          {summary.awaitingConfirmationCount}
        </span>
      </div>
    </div>
  );
}
