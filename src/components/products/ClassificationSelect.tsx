"use client";

import { Icon } from "@/components/ui/icon";

interface ClassificationSelectProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export function ClassificationSelect({
  selectedCategory,
  setSelectedCategory,
}: ClassificationSelectProps) {
  return (
    <div className="bg-light-green rounded-xl p-md border border-outline-variant/40 shadow-sm">
      <h3 className="text-label-caps text-primary font-bold uppercase mb-4">
        تصنيف المنتج
      </h3>
      <div className="relative">
        <label
          htmlFor="product-category"
          className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
        >
          الفئة الرئيسية
        </label>
        <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus-within:border-primary transition-[border-color,box-shadow] relative">
          <select
            id="product-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none font-sans appearance-none pl-8 pr-2 cursor-pointer text-on-surface"
          >
            <option value="Produce">منتجات زراعية (Produce)</option>
            <option value="Dairy">منتجات الألبان (Dairy)</option>
            <option value="Bakery">مخبوزات (Bakery)</option>
            <option value="Pantry">المؤن والتموين (Pantry)</option>
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
