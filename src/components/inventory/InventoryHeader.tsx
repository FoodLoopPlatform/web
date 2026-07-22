"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function InventoryHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-lg mb-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div className="w-full md:flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-[#00381a] font-bold mb-2">
            المخزون الحالي
          </h2>
          <p className="font-body-md text-body-md text-[#404940] w-full">
            إدارة كتالوج المنتجات، ومستويات توفر المخزون، والأسعار. يتم نشر
            التحديثات فوراً في تطبيق المستهلكين فور النشر والاعتماد.
          </p>
        </div>

        {/* Add Product Dropdown */}
        <div className="relative inline-block text-right shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-[#00381a] text-white px-lg py-3 rounded-xl flex items-center gap-sm font-bold text-label-md hover:bg-[#1a6b3c] transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Icon name="add" className="h-4 w-4" />
            <span>إضافة منتج</span>
          </button>

          {dropdownOpen && (
            <>
              <div
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-10"
              />
              <div className="absolute left-0 right-auto mt-2 w-56 rounded-xl bg-white border border-[#bfc9be] shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/products/add"
                  className="flex items-center gap-sm px-md py-4 hover:bg-[#f2f5ee] transition-colors text-[#1c1c18] group"
                >
                  <Icon name="edit_note" className="h-5 w-5 text-[#00381a]" />
                  <div>
                    <p className="font-bold text-sm">إدخال يدوي</p>
                    <p className="text-[10px] text-[#404940] opacity-75 mt-0.5">
                      إضافة منتج فردي للكتالوج
                    </p>
                  </div>
                </Link>
                <div className="h-px bg-[#bfc9be]/50" />
                <Link
                  href="#"
                  className="flex items-center gap-sm px-md py-4 hover:bg-[#f2f5ee] transition-colors text-[#1c1c18] group"
                >
                  <Icon
                    name="cloud_upload"
                    className="h-5 w-5 text-[#00381a]"
                  />
                  <div>
                    <p className="font-bold text-sm">تحميل جماعي</p>
                    <p className="text-[10px] text-[#404940] opacity-75 mt-0.5">
                      استيراد ملف Excel أو CSV
                    </p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search bar inside content area */}
      <div className="relative w-full max-w-md">
        <Icon
          name="search"
          className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-[#404940]"
        />
        <input
          className="w-full bg-white border border-[#bfc9be] rounded-xl py-3 pr-11 pl-4 font-sans text-body-md focus:border-[#00381a] focus:ring-1 focus:ring-[#00381a] transition-all outline-none"
          placeholder="البحث عن منتج، SKU، أو الفئة..."
          type="text"
        />
      </div>
    </div>
  );
}
