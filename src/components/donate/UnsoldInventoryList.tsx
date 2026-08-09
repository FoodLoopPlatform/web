"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { donationInventoryItems } from "@/app/donate/lib/mock-data";

export function UnsoldInventoryList() {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    new Set(donationInventoryItems.map((item) => item.id)),
  );

  const allSelected = selectedItemIds.size === donationInventoryItems.length;

  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedItemIds(
      allSelected
        ? new Set()
        : new Set(donationInventoryItems.map((item) => item.id)),
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-sans text-2xl font-semibold text-primary">
          المخزون غير المباع
        </h3>
        <Badge
          variant="status"
          className="bg-error-container text-on-error-container"
        >
          قريب الانتهاء
        </Badge>
      </div>
      <div className="w-full bg-white border border-outline-variant/30 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant/20 px-6 py-4">
          <span className="text-xs font-bold tracking-wide text-on-surface">
            {selectedItemIds.size} عناصر محددة
          </span>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs font-bold tracking-wide text-link cursor-pointer hover:opacity-80 transition-opacity"
          >
            {allSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 border-collapse">
            <thead>
              <tr className="bg-light-green">
                <th className="border-b border-outline-variant/20 px-6 py-4 w-12" />
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  المنتج
                </th>
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  الكمية
                </th>
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  الوقت المتبقي
                </th>
              </tr>
            </thead>
            <tbody>
              {donationInventoryItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-outline-variant/10 first:border-t-0"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItemIds.has(item.id)}
                      onChange={() => toggleItem(item.id)}
                      className="h-5 w-5 rounded accent-primary cursor-pointer shrink-0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-lg object-cover bg-surface-container-high shrink-0"
                      />
                      <span className="text-body-md font-bold text-on-surface">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-body-md text-on-surface-variant">
                      {item.quantityLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      dir="ltr"
                      className="font-data-mono text-sm text-on-surface-variant"
                    >
                      {item.daysLeftLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
