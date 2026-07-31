"use client";

import { Icon } from "@/components/ui/icon";
import type { Category } from "@/app/products/api/types";

interface ClassificationSelectProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories?: Category[];
  isLoadingCategories?: boolean;
}

export function ClassificationSelect({
  selectedCategory,
  setSelectedCategory,
  categories = [],
  isLoadingCategories = false,
}: ClassificationSelectProps) {
  return (
    <div className="bg-light-green rounded-xl p-md border border-outline-variant/40 shadow-sm">
      <h3 className="text-label-caps text-primary font-bold uppercase mb-4">
        تصنيف المنتج
      </h3>
      <div className="relative">
        <label
          htmlFor="product-category"
          className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase flex justify-between items-center"
        >
          <span>الفئة الرئيسية</span>
          {isLoadingCategories && (
            <span className="text-[10px] text-primary animate-pulse font-normal">
              جاري التحميل...
            </span>
          )}
        </label>
        <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus-within:border-primary transition-[border-color,box-shadow] relative">
          <select
            id="product-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isLoadingCategories}
            className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none font-sans appearance-none pl-8 pr-2 cursor-pointer text-on-surface disabled:opacity-50"
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAr ? `${cat.nameAr} (${cat.name})` : cat.name}
                </option>
              ))
            ) : (
              <>
                <option value="11111111-1111-1111-1111-111111111111">
                  مخبوزات (Bakery)
                </option>
                <option value="316c0d21-81e6-40e8-8048-f361361be68e">
                  ألبان وبيض (Dairy & Eggs)
                </option>
                <option value="0542923b-c86b-40b5-ae58-0cf203ce0806">
                  حلويات (Desserts)
                </option>
                <option value="ead9f5a4-dd64-4769-8368-2e354dbfbb1f">
                  خضروات وفواكه (Fruits & Vegetables)
                </option>
                <option value="bad57d62-1391-4fe9-b2e4-8c79b4caed0e">
                  مواد غذائية (Groceries)
                </option>
                <option value="e95d3d76-46b6-4b9f-96b4-effff14c7674">
                  وجبات جاهزة (Meals)
                </option>
              </>
            )}
          </select>
          <Icon
            name="expand_more"
            className="h-5 w-5 text-on-surface-variant absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Category Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-primary-fixed text-link px-3 py-1 rounded-full font-bold text-[11px] uppercase">
            منتجات ألبان
          </span>
          <span className="bg-primary-fixed text-link px-3 py-1 rounded-full font-bold text-[11px] uppercase">
            منتجات عضوية
          </span>
          <button
            type="button"
            className="bg-surface-container-high text-on-surface-variant hover:bg-outline-variant/50 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-colors px-3 py-1 rounded-full font-bold text-[11px] cursor-pointer"
          >
            + إضافة وسم
          </button>
        </div>
      </div>
    </div>
  );
}
