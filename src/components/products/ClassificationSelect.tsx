"use client";

import { CustomSelect, SelectOption } from "@/components/ui/custom-select";
import type { Category } from "@/app/products/api/types";

interface ClassificationSelectProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories?: Category[];
  isLoadingCategories?: boolean;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  { value: "11111111-1111-1111-1111-111111111111", label: "مخبوزات (Bakery)" },
  {
    value: "316c0d21-81e6-40e8-8048-f361361be68e",
    label: "ألبان وبيض (Dairy & Eggs)",
  },
  { value: "0542923b-c86b-40b5-ae58-0cf203ce0806", label: "حلويات (Desserts)" },
  {
    value: "ead9f5a4-dd64-4769-8368-2e354dbfbb1f",
    label: "خضروات وفواكه (Fruits & Vegetables)",
  },
  {
    value: "bad57d62-1391-4fe9-b2e4-8c79b4caed0e",
    label: "مواد غذائية (Groceries)",
  },
  {
    value: "e95d3d76-46b6-4b9f-96b4-effff14c7674",
    label: "وجبات جاهزة (Meals)",
  },
];

export function ClassificationSelect({
  selectedCategory,
  setSelectedCategory,
  categories = [],
  isLoadingCategories = false,
}: ClassificationSelectProps) {
  const options: SelectOption[] =
    categories.length > 0
      ? categories.map((cat) => ({
          value: cat.id,
          label: cat.nameAr ? `${cat.nameAr} (${cat.name})` : cat.name,
        }))
      : DEFAULT_OPTIONS;

  return (
    <div className="bg-light-green rounded-xl p-md border border-outline-variant/40 shadow-sm">
      <h3 className="text-label-caps text-primary font-bold uppercase mb-4">
        تصنيف المنتج
      </h3>
      <div>
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
        <CustomSelect
          id="product-category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={options}
          disabled={isLoadingCategories}
          placeholder="اختر فئة المنتج..."
        />
      </div>
    </div>
  );
}
