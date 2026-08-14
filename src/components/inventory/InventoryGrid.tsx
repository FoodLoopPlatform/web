"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { ProductCard, Product } from "@/components/inventory/ProductCard";
import type { MerchantProduct } from "@/app/products/api/types";
import type { ApiResponse } from "@/utils/server";
import { extractProductImages } from "@/utils/image-utils";

interface InventoryGridProps {
  productsPromise: Promise<ApiResponse<MerchantProduct[]>>;
}

export function InventoryGrid({ productsPromise }: InventoryGridProps) {
  const res = use(productsPromise);
  const initialProducts = res.data ?? [];
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const products = initialProducts.filter(
    (item) => !deletedIds.includes(item.id),
  );

  if (products.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-md">
        <div className="py-16 text-center bg-surface-container-high/20 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-xl">
          <Icon
            name="inventory_2"
            className="h-14 w-14 mb-3 text-on-surface-variant/40"
          />
          <p className="font-bold text-lg text-on-surface">
            لا توجد منتجات في المخزون حالياً
          </p>
          <p className="text-xs text-on-surface-variant mt-1.5 mb-6">
            لم يتم العثور على منتجات مطابقة لخيارات الفلترة أو أن المخزون فارغ.
            يمكنك إدخال منتج جديد ونشره فوراً.
          </p>
          <Link
            href="/products/add"
            className="py-3 px-6 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-primary/20"
          >
            <Icon name="add" className="h-5 w-5" />
            <span>إضافة منتج جديد للكتالوج</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
      {products.map((item, idx) => {
        const extractedImages = extractProductImages(item);
        const product: Product = {
          id: item.id || String(idx + 1),
          sku: `PROD-${item.id ? item.id.slice(0, 5).toUpperCase() : idx + 100}`,
          name: item.titleAr || item.title,
          category: item.categoryName || item.categoryNameAr || "عام",
          quantity: item.quantityAvailable,
          price: item.discountedPrice ?? item.originalPrice,
          status: item.status || "Published",
          automationMode: item.automationMode,
          expiryVerificationState: item.expiryVerificationState,
          expirationDate: item.expirationDate,
          images: extractedImages,
          image: extractedImages.length > 0 ? extractedImages[0] : undefined,
        };

        return (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={(id) => setDeletedIds((prev) => [...prev, id])}
          />
        );
      })}

      {/* Add New Product Card */}
      <Link
        href="/products/add"
        className="bg-surface-container-high/30 rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-lg text-on-surface-variant hover:border-primary hover:bg-light-green transition-all cursor-pointer group min-h-[300px] text-center"
      >
        <Icon
          name="add_circle"
          className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform text-primary"
        />
        <p className="font-bold text-body-md">إضافة منتج جديد للكتالوج</p>
        <p className="text-xs text-on-surface-variant opacity-75 mt-1">
          تعبئة البيانات والأسعار يدوياً
        </p>
      </Link>
    </div>
  );
}
