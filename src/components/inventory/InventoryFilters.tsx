"use client";

import { use } from "react";
import type { Category } from "@/app/products/api/types";
import type { ApiResponse } from "@/utils/server";

interface InventoryFiltersProps {
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  categoriesPromise: Promise<ApiResponse<Category[]>>;
}

export function InventoryFilters({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categoriesPromise,
}: InventoryFiltersProps) {
  const categoriesRes = use(categoriesPromise);
  const categories = categoriesRes.data ?? [];

  return (
    <div className="flex flex-col gap-md border-t border-outline-variant/40 pt-6">
      {/* Status Filter Buttons */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-xs flex-nowrap pb-2 min-w-max">
          <span className="font-bold text-xs text-on-surface-variant ml-2 shrink-0">
            الحالة:
          </span>
          {[
            { key: "All", label: "جميع المنتجات" },
            { key: "Published", label: "تم النشر" },
            { key: "Pending", label: "قيد المراجعة" },
            { key: "Draft", label: "مسودة" },
            { key: "Out of Stock", label: "نفد من المخزون" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
                statusFilter === filter.key
                  ? "bg-primary-fixed text-primary border-primary"
                  : "bg-white border-outline-variant text-on-surface-variant hover:border-primary"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Buttons Dynamic from API */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-xs flex-nowrap pb-2 min-w-max">
          <span className="font-bold text-xs text-on-surface-variant ml-2 shrink-0">
            الفئة:
          </span>
          <button
            onClick={() => setCategoryFilter("All")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
              categoryFilter === "All"
                ? "bg-primary-fixed text-primary border-primary"
                : "bg-white border-outline-variant text-on-surface-variant hover:border-primary"
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
                categoryFilter === cat.id
                  ? "bg-primary-fixed text-primary border-primary"
                  : "bg-white border-outline-variant text-on-surface-variant hover:border-primary"
              }`}
            >
              {cat.nameAr || cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
