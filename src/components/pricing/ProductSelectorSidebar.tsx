import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PricingProductImage } from "./PricingProductImage";
import type { ProductPricingItem } from "@/app/pricing/api/types";
import type { AutomationMode } from "@/app/pricing/lib/mock-data";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

export type FilterMode = "all" | "discounted" | AutomationMode;

type ProductSelectorSidebarProps = {
  products: ProductPricingItem[];
  selectedProductId: string;
  onSelectProduct: (id: string) => void;
};

export function ProductSelectorSidebar({
  products,
  selectedProductId,
  onSelectProduct,
}: ProductSelectorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
        p.code.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (filterMode === "all") return true;
      if (filterMode === "discounted") return p.discountPercent > 0;
      return p.automationMode === filterMode;
    });
  }, [products, searchQuery, filterMode]);

  return (
    <div className="lg:col-span-4 bg-white border border-outline-variant/30 rounded-2xl p-5 flex flex-col gap-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="inventory_2" className="h-5 w-5 text-primary" />
          <h3 className="font-sans text-xl font-bold text-on-surface">
            قائمة المنتجات
          </h3>
        </div>
        <span className="bg-light-green text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
          {filteredProducts.length} من {products.length}
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Icon
          name="search"
          className="h-4 w-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full bg-[#ecefe8] border border-outline-variant/40 rounded-xl py-2 pr-10 pl-4 text-body-md text-on-surface outline-none focus:border-primary transition-colors text-sm"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
          >
            <Icon name="close" className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { key: "all", label: "الكل" },
          { key: "discounted", label: "مخفض" },
          { key: "Autonomous", label: "تلقائي" },
          { key: "Assisted", label: "بمساعدة" },
          { key: "Manual", label: "يدوي" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterMode(tab.key as FilterMode)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterMode === tab.key
                ? "bg-primary text-white"
                : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Scrollable List */}
      <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 px-4 flex flex-col items-center gap-2">
            <Icon
              name="search_off"
              className="h-8 w-8 text-on-surface-variant/40"
            />
            <p className="text-sm font-semibold text-on-surface">
              لا توجد نتائج مطابقة
            </p>
            <p className="text-xs text-on-surface-variant">
              جرب البحث بكلمات أخرى
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isSelected = selectedProductId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product.id)}
                className={`flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all border text-start ${
                  isSelected
                    ? "bg-light-green/90 border-primary shadow-xs ring-1 ring-primary/30"
                    : "bg-[#fafcf7] border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-lowest"
                }`}
              >
                <PricingProductImage
                  src={product.image}
                  alt={product.name}
                  sizes="52px"
                  containerClassName="h-13 w-13 rounded-lg overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative flex items-center justify-center"
                  iconClassName="h-6 w-6 text-primary/40"
                />

                <div className="flex flex-1 flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-on-surface truncate">
                      {product.name}
                    </span>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>

                  <span className="text-[11px] text-on-surface-variant truncate">
                    الرمز: {product.code}
                  </span>

                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-data-mono text-xs font-bold text-primary">
                        <bdi>{formatEGP(product.currentPrice)}</bdi>
                      </span>
                      {product.discountPercent > 0 && (
                        <span className="font-data-mono text-[10px] text-on-surface-variant line-through opacity-70">
                          <bdi>{formatEGP(product.originalPrice)}</bdi>
                        </span>
                      )}
                    </div>

                    {product.discountPercent > 0 ? (
                      <span className="bg-[#ffddb7] text-[#653e00] text-[10px] font-bold px-1.5 py-0.2 rounded">
                        <bdi>-{product.discountPercent}%</bdi>
                      </span>
                    ) : (
                      <span className="text-[10px] text-on-surface-variant bg-[#ecefe8] px-1.5 py-0.2 rounded">
                        أساسي
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
