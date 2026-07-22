"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: "Produce" | "Dairy" | "Bakery" | "Pantry";
  quantity: number | null;
  price: number;
  status: "Published" | "Pending" | "Draft" | "Out of Stock";
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  Published: {
    bg: "bg-[#98f3b0] text-[#00381a]",
    label: "نشط (تم النشر)",
    text: "text-[#00381a]",
  },
  Pending: {
    bg: "bg-[#ffddb7] text-[#633d00]",
    label: "قيد المراجعة",
    text: "text-[#633d00]",
  },
  Draft: {
    bg: "bg-[#e0e3dd] text-[#404940]",
    label: "مسودة",
    text: "text-[#404940]",
  },
  "Out of Stock": {
    bg: "bg-[#ffdad6] text-[#ba1a1a]",
    label: "نفد من المخزون",
    text: "text-[#ba1a1a]",
  },
};

export function ProductCard({ product }: ProductCardProps) {
  const statusStyle = statusMap[product.status];
  const isOutOfStock = product.status === "Out of Stock";

  return (
    <div
      className={`bg-[#f2f5ee] rounded-xl border border-[#bfc9be]/50 hover:border-[#bfc9be] hover:shadow-md transition-all group overflow-hidden cursor-pointer flex flex-col justify-between ${
        isOutOfStock ? "grayscale-[0.4]" : ""
      }`}
    >
      {/* Card Image */}
      <div className="aspect-square relative overflow-hidden bg-[#e6e9e3]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${statusStyle.bg}`}
          >
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-sm flex flex-col gap-base flex-grow justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-body-md text-[#1c1c18] leading-tight group-hover:text-[#00381a]">
              {product.name}
            </h3>
            <button className="p-1 text-[#404940] hover:text-[#00381a] transition-colors flex items-center justify-center cursor-pointer">
              <Icon name="more_vert" className="h-5 w-5" />
            </button>
          </div>
          <p className="font-data-mono text-[11px] text-[#404940] opacity-70 mt-1">
            {product.sku}
          </p>
        </div>

        <div className="mt-sm flex justify-between items-end border-t border-[#bfc9be]/20 pt-3">
          <div>
            <p className="text-xs text-[#404940]">الكمية المتوفرة</p>
            <p
              className={`font-data-mono text-sm font-bold ${
                isOutOfStock ? "text-[#ba1a1a]" : "text-[#00381a]"
              }`}
            >
              {product.quantity !== null
                ? `${product.quantity} وحدة`
                : "-- وحدة"}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-[#404940] text-left">السعر المقترح</p>
            <p className="font-data-mono text-sm text-[#006d38] font-bold font-sans">
              {product.price.toFixed(2)} ج.م
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
