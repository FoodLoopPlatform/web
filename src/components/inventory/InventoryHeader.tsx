"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

interface InventoryHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function InventoryHeader({
  searchQuery,
  setSearchQuery,
}: InventoryHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-lg mb-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div className="w-full md:flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-bold mb-2">
            المخزون الحالي
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant w-full">
            إدارة كتالوج المنتجات، ومستويات توفر المخزون، والأسعار. يتم نشر
            التحديثات فوراً في تطبيق المستهلكين فور النشر والاعتماد.
          </p>
        </div>

        {/* Add Product Dropdown */}
        <div className="relative inline-block text-right shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-primary text-white px-lg py-3 rounded-xl flex items-center gap-sm font-bold text-label-md hover:opacity-90 transition-all active:scale-95 shadow-sm cursor-pointer"
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
              <div className="absolute left-0 right-auto mt-2 w-56 rounded-xl bg-white border border-outline-variant shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <Link
                  href="/products/add"
                  className="flex items-center gap-sm px-md py-4 hover:bg-light-green transition-colors text-on-surface group"
                >
                  <Icon name="edit_note" className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-sm">إدخال يدوي</p>
                    <p className="text-[10px] text-on-surface-variant opacity-75 mt-0.5">
                      إضافة منتج فردي للكتالوج
                    </p>
                  </div>
                </Link>
                <div className="h-px bg-outline-variant/50" />
                <Link
                  href="#"
                  className="flex items-center gap-sm px-md py-4 hover:bg-light-green transition-colors text-on-surface group"
                >
                  <Icon name="cloud_upload" className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold text-sm">تحميل جماعي</p>
                    <p className="text-[10px] text-on-surface-variant opacity-75 mt-0.5">
                      استيراد ملف Excel أو CSV
                    </p>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search bar inside content area. Explicit min-width prevents input collapsing into a circle in RTL/flexbox layout. */}
      <div className="relative w-full max-w-md min-w-[280px] sm:min-w-[320px]">
        <Icon
          name="search"
          className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          className="w-full bg-white border border-outline-variant rounded-xl py-3 pr-11 pl-4 font-sans text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
          placeholder="البحث عن منتج، SKU، أو الفئة..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
