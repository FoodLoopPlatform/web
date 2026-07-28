"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import {
  pricingListings,
  totalActiveListings,
  type AutomationMode,
} from "@/app/pricing/lib/mock-data";

const modeFilters: { key: AutomationMode | "all"; label: string }[] = [
  { key: "all", label: "جميع الأوضاع" },
  { key: "autonomous", label: "تلقائي بالكامل" },
  { key: "assisted", label: "بمساعدة" },
  { key: "manual", label: "يدوي" },
];

const automationModeMeta: Record<
  AutomationMode,
  { label: string; className: string; dotClassName?: string }
> = {
  autonomous: {
    label: "تلقائي بالكامل",
    className: "bg-[#98f3b0] border border-[#006d38]/20 text-[#0b723c]",
    dotClassName: "bg-[#006d38]",
  },
  assisted: {
    label: "بمساعدة",
    className:
      "bg-[#e6e9e3] border border-outline-variant/30 text-on-surface-variant",
  },
  manual: {
    label: "يدوي",
    className:
      "bg-[#e6e9e3] border border-outline-variant/30 text-on-surface-variant",
  },
};

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

export function PricingTable() {
  const [modeFilter, setModeFilter] = useState<AutomationMode | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredListings = pricingListings.filter(
    (listing) => modeFilter === "all" || listing.automationMode === modeFilter,
  );

  return (
    <section className="bg-white border border-outline-variant/30 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Filter Header */}
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-6 py-5 flex-wrap">
        <h3 className="font-sans text-2xl font-semibold text-primary">
          بث الأسعار المباشر
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-xs tracking-wide text-on-surface-variant whitespace-nowrap">
            تصفية حسب الوضع:
          </span>
          <div className="relative">
            <select
              value={modeFilter}
              onChange={(event) =>
                setModeFilter(event.target.value as AutomationMode | "all")
              }
              className="appearance-none bg-[#ecefe8] border border-outline-variant rounded-lg py-2 ps-4 pe-9 text-body-md text-on-surface cursor-pointer outline-none focus:border-primary transition-colors"
            >
              {modeFilters.map((filter) => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </select>
            <Icon
              name="expand_more"
              className="h-3.5 w-3.5 text-on-surface-variant absolute inset-s-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>
          <button
            type="button"
            aria-label="خيارات تصفية إضافية"
            className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
          >
            <Icon name="tune" className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 border-collapse">
          <thead>
            <tr className="bg-light-green">
              <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                المنتج
              </th>
              <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-end">
                السعر الأصلي
              </th>
              <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                السعر الحالي
              </th>
              <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                العد التنازلي للدورة
              </th>
              <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                وضع الأتمتة
              </th>
              <th className="border-b border-outline-variant/20 px-6 py-4 w-22" />
            </tr>
          </thead>
          <tbody>
            {filteredListings.map((listing) => {
              const mode = automationModeMeta[listing.automationMode];
              const discountBadgeClassName =
                listing.discountPercent > 0
                  ? "bg-[#ffddb7] border border-[#633d00]/20 text-[#653e00]"
                  : "bg-[#ecefe8] border border-outline-variant/20 text-on-surface-variant";
              const cyclePillClassName = listing.cycleUrgent
                ? "bg-error-container text-on-error-container"
                : "bg-[#ecefe8] text-on-surface-variant";

              return (
                <tr
                  key={listing.id}
                  className="border-t border-outline-variant/10 first:border-t-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative">
                        <Image
                          src={listing.image}
                          alt={listing.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-body-md text-on-surface">
                          {listing.name}
                        </span>
                        <span className="text-xs tracking-wide text-on-surface-variant">
                          الرمز: {listing.code}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <span
                      dir="ltr"
                      className="font-data-mono text-body-md text-on-surface-variant"
                    >
                      {formatEGP(listing.originalPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span
                        dir="ltr"
                        className="font-data-mono text-body-md font-bold text-primary"
                      >
                        {formatEGP(listing.currentPrice)}
                      </span>
                      <span
                        dir="ltr"
                        className={`rounded-full px-2.5 py-1 text-[11px] shrink-0 ${discountBadgeClassName}`}
                      >
                        {listing.discountPercent > 0
                          ? `-${listing.discountPercent}%`
                          : "0%"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon
                        name="schedule"
                        className={`h-3 w-3 shrink-0 ${
                          listing.cycleUrgent
                            ? "text-on-error-container"
                            : "text-on-surface-variant"
                        }`}
                      />
                      <span
                        className={`rounded-full px-4 py-1 text-label-md whitespace-nowrap ${cyclePillClassName}`}
                      >
                        {listing.cycleCountdownLabel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs tracking-[-0.03em] uppercase shrink-0 ${mode.className}`}
                    >
                      {mode.dotClassName && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${mode.dotClassName}`}
                        />
                      )}
                      {mode.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      aria-label="خيارات إضافية للمنتج"
                      className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
                    >
                      <Icon name="more_vert" className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-light-green/50 px-6 py-4">
        <span className="text-xs tracking-wide text-on-surface-variant">
          عرض {filteredListings.length} من أصل {totalActiveListings} قائمة نشطة
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            aria-label="الصفحة السابقة"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-primary transition-colors cursor-pointer"
          >
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg text-label-md transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "border border-outline-variant text-on-surface-variant hover:border-primary"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(3, page + 1))}
            aria-label="الصفحة التالية"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary transition-colors cursor-pointer"
          >
            <Icon name="chevron_left" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
