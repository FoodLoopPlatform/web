"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number | null;
  price: number;
  status: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  Published: {
    bg: "bg-primary-fixed text-primary",
    label: "نشط (تم النشر)",
    text: "text-primary",
  },
  Pending: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    label: "قيد المراجعة",
    text: "text-on-tertiary-fixed-variant",
  },
  Draft: {
    bg: "bg-surface-container-highest text-on-surface-variant",
    label: "مسودة",
    text: "text-on-surface-variant",
  },
  "Out of Stock": {
    bg: "bg-error-container text-error",
    label: "نفد من المخزون",
    text: "text-error",
  },
};

export function ProductCard({ product }: ProductCardProps) {
  const statusStyle = statusMap[product.status];
  const isOutOfStock = product.status === "Out of Stock";

  return (
    <div
      className={`bg-light-green rounded-xl border border-outline-variant/50 hover:border-outline-variant hover:shadow-md transition-[border-color,box-shadow,filter] duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-primary outline-none ${
        isOutOfStock ? "grayscale-[0.4]" : ""
      }`}
    >
      {/* Card Image */}
      <div className="aspect-square relative overflow-hidden bg-surface-container-high">
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
            <h3 className="font-bold text-body-md text-on-surface leading-tight group-hover:text-primary">
              {product.name}
            </h3>
            <button
              aria-label="المزيد من خيارات المنتج"
              className="p-1 text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-primary rounded-lg outline-none"
            >
              <Icon name="more_vert" className="h-5 w-5" />
            </button>
          </div>
          <p className="font-data-mono text-[11px] text-on-surface-variant opacity-70 mt-1">
            {product.sku}
          </p>
        </div>

        <div className="mt-sm flex justify-between items-end border-t border-outline-variant/20 pt-3">
          <div>
            <p className="text-xs text-on-surface-variant">الكمية المتوفرة</p>
            <p
              className={`font-data-mono text-sm font-bold ${
                isOutOfStock ? "text-error" : "text-primary"
              }`}
            >
              {product.quantity !== null
                ? `${product.quantity} وحدة`
                : "-- وحدة"}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-on-surface-variant text-left">
              السعر المقترح
            </p>
            <p className="font-data-mono text-sm text-link font-bold font-sans">
              {new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "EGP",
              }).format(product.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
