"use client";

import React, { use, useState } from "react";
import type { Dispute } from "@/app/disputes/types";
import { Icon } from "@/components/ui/icon";
import { DisputeTable } from "./DisputeTable";
import { DisputeCardList } from "./DisputeCardList";
import { DisputeDetailDrawer } from "./DisputeDetailDrawer";

const PAGE_SIZE = 5;

interface DisputesContentProps {
  disputesPromise: Promise<{ data?: Dispute[]; error?: string }>;
}

export function DisputesContent({ disputesPromise }: DisputesContentProps) {
  const res = use(disputesPromise);
  const disputes = res.data ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null,
  );

  const q = searchQuery.toLowerCase().trim();
  const filteredDisputes = disputes.filter((d) => {
    if (!q) return true;
    return (
      (d.reason ?? "").toLowerCase().includes(q) ||
      (d.raisedByName ?? "").toLowerCase().includes(q) ||
      (d.id ?? "").toLowerCase().includes(q) ||
      (d.orderId ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredDisputes.length / PAGE_SIZE) || 1;
  const page = Math.min(currentPage, totalPages);
  const paginatedDisputes = filteredDisputes.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const openCount = disputes.filter((d) => !d.isResolved).length;
  const resolvedCount = disputes.filter((d) => d.isResolved).length;

  const selectedDispute =
    disputes.find((d) => d.id === selectedDisputeId) ?? null;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const startItem =
    filteredDisputes.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, filteredDisputes.length);

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-card-border p-5 sm:p-6 shadow-sm relative overflow-hidden text-right">
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase block">
            إجمالي النزاعات
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold mt-2 sm:mt-3 block font-sans text-primary">
            {disputes.length}
          </span>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
        </div>
        <div className="bg-white rounded-2xl border border-card-border p-5 sm:p-6 shadow-sm relative overflow-hidden text-right">
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase block">
            نزاعات قيد المراجعة
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold mt-2 sm:mt-3 block font-sans text-red-900">
            {openCount}
          </span>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
        </div>
        <div className="bg-white rounded-2xl border border-card-border p-5 sm:p-6 shadow-sm relative overflow-hidden text-right">
          <span className="text-[10px] sm:text-xs font-semibold text-outline uppercase block">
            نزاعات محلولة
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold mt-2 sm:mt-3 block font-sans text-green-900">
            {resolvedCount}
          </span>
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500" />
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="relative w-full sm:w-[300px]">
        <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-outline">
          <Icon name="search" className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="ابحث بالسبب، العميل، أو رقم الطلب..."
          className="w-full py-2 text-xs rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-surface text-on-surface pr-10 pl-4 text-right"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-w-0">
        <DisputeCardList
          disputes={paginatedDisputes}
          onOpenDispute={setSelectedDisputeId}
        />
        <div className="hidden md:block overflow-x-auto w-full">
          <DisputeTable
            disputes={paginatedDisputes}
            onOpenDispute={setSelectedDisputeId}
          />
        </div>

        {/* Pagination */}
        {filteredDisputes.length > 0 && (
          <div
            dir="rtl"
            className="px-4 py-3 bg-surface border-t border-card-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-outline"
          >
            <div className="font-medium">
              عرض{" "}
              <span className="font-extrabold text-on-surface">
                {startItem}
              </span>{" "}
              -{" "}
              <span className="font-extrabold text-on-surface">{endItem}</span>{" "}
              من إجمالي{" "}
              <span className="font-extrabold text-on-surface">
                {filteredDisputes.length}
              </span>{" "}
              عنصر
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <Icon name="chevron_right" className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">السابق</span>
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center ${
                          p === page
                            ? "bg-primary text-white shadow-xs scale-105"
                            : "bg-white text-on-surface-variant border border-surface-container hover:bg-surface-container"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={page === totalPages}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer text-xs flex items-center gap-1.5 shadow-2xs active:scale-95"
                >
                  <span className="hidden sm:inline">التالي</span>
                  <Icon name="chevron_left" className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <DisputeDetailDrawer
        dispute={selectedDispute}
        onCloseDrawer={() => setSelectedDisputeId(null)}
      />
    </div>
  );
}
