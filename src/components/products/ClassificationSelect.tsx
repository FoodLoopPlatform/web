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
    <div className="bg-[#f2f5ee] rounded-xl p-md border border-[#bfc9be]/40 shadow-sm">
      <h3 className="text-label-caps text-[#00381a] font-bold uppercase mb-4">
        تصنيف المنتج
      </h3>
      <div className="relative">
        <label className="block text-xs font-bold text-[#404940] mb-1.5 uppercase">
          الفئة الرئيسية
        </label>
        <div className="flex items-center border border-[#bfc9be] rounded-xl px-4 py-3 bg-[#fdf9f2] focus-within:border-[#00381a] transition-all relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-transparent border-none focus:ring-0 w-full text-body-md outline-none font-sans appearance-none pl-8 pr-2 cursor-pointer text-[#1c1c18]"
          >
            <option value="Produce">منتجات زراعية (Produce)</option>
            <option value="Dairy">منتجات الألبان (Dairy)</option>
            <option value="Bakery">مخبوزات (Bakery)</option>
            <option value="Pantry">المؤن والتموين (Pantry)</option>
          </select>
          <Icon
            name="expand_more"
            className="h-5 w-5 text-[#404940] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        {/* Category Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-[#98f3b0] text-[#0b723c] px-3 py-1 rounded-full font-bold text-[11px] uppercase">
            منتجات ألبان
          </span>
          <span className="bg-[#98f3b0] text-[#0b723c] px-3 py-1 rounded-full font-bold text-[11px] uppercase">
            منتجات عضوية
          </span>
          <span className="bg-[#e6e9e3] text-[#404940] hover:bg-[#bfc9be] transition-colors px-3 py-1 rounded-full font-bold text-[11px] cursor-pointer">
            + إضافة وسم
          </span>
        </div>
      </div>
    </div>
  );
}
