"use client";

import Link from "next/link";
import Image from "next/image";
import { extractProductImages } from "@/utils/image-utils";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number | null;
  price: number;
  status: string;
  image?: string | null;
  images?: string[] | null;
}

interface ProductCardProps {
  product: Product;
}

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  published: {
    bg: "bg-primary-fixed text-primary",
    label: "نشط (تم النشر)",
    text: "text-primary",
  },
  active: {
    bg: "bg-primary-fixed text-primary",
    label: "نشط",
    text: "text-primary",
  },
  pending: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    label: "قيد المراجعة",
    text: "text-on-tertiary-fixed-variant",
  },
  draft: {
    bg: "bg-surface-container-highest text-on-surface-variant",
    label: "مسودة",
    text: "text-on-surface-variant",
  },
  "out of stock": {
    bg: "bg-error-container text-error",
    label: "نفد من المخزون",
    text: "text-error",
  },
  outofstock: {
    bg: "bg-error-container text-error",
    label: "نفد من المخزون",
    text: "text-error",
  },
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

export function ProductCard({ product }: ProductCardProps) {
  const rawStatus = (product.status || "").toLowerCase().trim();
  const statusStyle = statusMap[rawStatus] || {
    bg: "bg-primary-fixed text-primary",
    label: product.status || "نشط",
    text: "text-primary",
  };
  const isOutOfStock =
    rawStatus === "out of stock" || rawStatus === "outofstock";

  const extractedImages = extractProductImages(product);
  const imageSrc =
    extractedImages.length > 0 ? extractedImages[0] : PLACEHOLDER_IMAGE;

  return (
    <Link
      href={`/product/${product.id}`}
      className={`bg-light-green rounded-xl border border-outline-variant/50 hover:border-outline-variant hover:shadow-md transition-[border-color,box-shadow,filter] duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-primary outline-none ${
        isOutOfStock ? "grayscale-[0.4]" : ""
      }`}
    >
      {/* Card Image */}
      <div className="aspect-square relative overflow-hidden bg-surface-container-high">
        <Image
          src={imageSrc}
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
            <h3 className="font-bold text-body-md text-on-surface leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
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
    </Link>
  );
}
