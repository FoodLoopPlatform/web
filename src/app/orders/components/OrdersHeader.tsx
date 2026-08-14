import React from "react";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { SupportedLanguage } from "@/store/use-app-lang";
import { ExportOrdersButton } from "./ExportOrdersButton";

interface OrdersHeaderProps {
  lang?: SupportedLanguage;
  onFilterClick?: () => void;
  onExportClick?: () => void;
}

export function OrdersHeader({
  lang = "ar",
  onFilterClick,
  onExportClick,
}: OrdersHeaderProps) {
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4"
    >
      {/* Title & Subtitle */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-sans">
          {t.manageActiveOrders}
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-1 font-medium">
          {t.realtimeTracking}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-outline-variant/60 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Icon name="filter_list" className="w-4 h-4 text-outline" />
            <span>{t.filter}</span>
          </button>
        )}

        <ExportOrdersButton label={t.export} onClick={onExportClick} />
      </div>
    </div>
  );
}
