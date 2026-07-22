"use client";

interface InventoryFiltersProps {
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
}

export function InventoryFilters({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
}: InventoryFiltersProps) {
  return (
    <div className="flex flex-col gap-md border-t border-[#bfc9be]/40 pt-6">
      {/* Status Filter Buttons */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-xs flex-nowrap pb-2 min-w-max">
          <span className="font-bold text-xs text-[#404940] ml-2 shrink-0">
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
                  ? "bg-[#98f3b0] text-[#00381a] border-[#00381a]"
                  : "bg-white border-[#bfc9be] text-[#404940] hover:border-[#00381a]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-xs flex-nowrap pb-2 min-w-max">
          <span className="font-bold text-xs text-[#404940] ml-2 shrink-0">
            الفئة:
          </span>
          {[
            { key: "All", label: "الكل" },
            { key: "Produce", label: "منتجات زراعية" },
            { key: "Dairy", label: "الألبان" },
            { key: "Bakery", label: "مخبوزات" },
            { key: "Pantry", label: "المؤن" },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer shrink-0 ${
                categoryFilter === cat.key
                  ? "bg-[#98f3b0] text-[#00381a] border-[#00381a]"
                  : "bg-white border-[#bfc9be] text-[#404940] hover:border-[#00381a]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
