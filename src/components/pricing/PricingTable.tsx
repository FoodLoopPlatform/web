"use client";

import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import { PricingProductImage } from "./PricingProductImage";
import type { ProductPricingItem } from "@/app/pricing/api/types";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

type PricingTableProps = {
  items?: ProductPricingItem[];
  isLoading?: boolean;
  onViewHistory?: (productId: string) => void;
};

const ITEMS_PER_PAGE = 6;

export function PricingTable({
  items = [],
  isLoading = false,
  onViewHistory,
}: PricingTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredListings = useMemo(() => {
    return items.filter((listing) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (listing.nameAr &&
          listing.nameAr.toLowerCase().includes(searchQuery.toLowerCase())) ||
        listing.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [items, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / ITEMS_PER_PAGE),
  );
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, currentPage]);

  return (
    <section className="bg-white border border-outline-variant/30 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Filter Header */}
      <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-6 py-5 flex-wrap">
        <div className="flex items-center gap-3">
          <h3 className="font-sans text-2xl font-semibold text-primary">
            بث الأسعار المباشر
          </h3>
          <span className="bg-light-green text-primary text-xs font-bold px-2.5 py-1 rounded-full">
            {items.length} منتج
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Search */}
          <div className="relative">
            <Icon
              name="search"
              className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="ابحث بالاسم أو الرمز..."
              className="bg-[#ecefe8] border border-outline-variant rounded-lg py-1.5 pr-9 pl-3 text-body-md text-on-surface outline-none focus:border-primary transition-colors text-sm w-48 sm:w-64"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 border-collapse">
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
              <th className="border-b border-outline-variant/20 px-6 py-4 text-center text-sm tracking-wide text-on-surface-variant font-normal">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [1, 2, 3, 4].map((idx) => (
                <tr
                  key={idx}
                  className="border-t border-outline-variant/10 animate-pulse"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-outline-variant/30 shrink-0" />
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-outline-variant/30 rounded" />
                        <div className="h-3 w-20 bg-outline-variant/20 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <div className="h-4 w-16 bg-outline-variant/30 rounded ms-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 bg-outline-variant/30 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-24 bg-outline-variant/30 rounded-full" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="h-8 w-24 bg-outline-variant/30 rounded mx-auto" />
                  </td>
                </tr>
              ))
            ) : paginatedListings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 px-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Icon
                      name="search_off"
                      className="h-10 w-10 text-on-surface-variant/40"
                    />
                    <p className="text-body-md font-bold text-on-surface">
                      لم يتم العثور على منتجات مطابقة
                    </p>
                    <p className="text-sm text-on-surface-variant">
                      جرب البحث باسم أو رمز آخر
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedListings.map((listing) => {
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
                    className="border-t border-outline-variant/10 first:border-t-0 hover:bg-surface-container-lowest/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <PricingProductImage
                          src={listing.image}
                          alt={listing.name}
                          sizes="48px"
                          containerClassName="h-12 w-12 rounded-lg overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative flex items-center justify-center"
                          iconClassName="h-6 w-6 text-primary/40"
                        />
                        <div className="flex flex-col">
                          <span className="text-body-md font-medium text-on-surface">
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
                      <div className="flex items-center gap-3">
                        <span
                          dir="ltr"
                          className="font-data-mono text-body-md font-bold text-primary"
                        >
                          {formatEGP(listing.currentPrice)}
                        </span>
                        <span
                          dir="ltr"
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold shrink-0 ${discountBadgeClassName}`}
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
                          className={`rounded-full px-3 py-1 text-label-md whitespace-nowrap ${cyclePillClassName}`}
                        >
                          {listing.cycleCountdownLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => onViewHistory?.(listing.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:bg-light-green px-3 py-1.5 rounded-lg border border-primary/20 transition-all cursor-pointer hover:shadow-xs"
                      >
                        <Icon name="history" className="h-3.5 w-3.5" />
                        سجل الأسعار
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-light-green/50 px-6 py-4">
        <span className="text-xs tracking-wide text-on-surface-variant">
          عرض{" "}
          {filteredListings.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1}{" "}
          - {Math.min(currentPage * ITEMS_PER_PAGE, filteredListings.length)} من
          أصل {items.length} منتج
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1 || isLoading}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            aria-label="الصفحة السابقة"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:border-primary transition-colors cursor-pointer"
          >
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
            disabled={currentPage === totalPages || isLoading}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            aria-label="الصفحة التالية"
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="chevron_left" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
