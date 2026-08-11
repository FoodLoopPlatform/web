"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { MerchantProduct } from "@/app/products/api/types";
import type { ApiResponse } from "@/utils/server";
import { extractProductImages } from "@/utils/image-utils";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

const statusMap: Record<string, { bg: string; text: string; label: string }> = {
  published: {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: "نشط (تم النشر)",
    text: "text-primary",
  },
  active: {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: "نشط",
    text: "text-primary",
  },
  pending: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20",
    label: "قيد المراجعة",
    text: "text-on-tertiary-fixed-variant",
  },
  draft: {
    bg: "bg-surface-container-highest text-on-surface-variant border-outline-variant/40",
    label: "مسودة",
    text: "text-on-surface-variant",
  },
  "out of stock": {
    bg: "bg-error-container text-error border-error/20",
    label: "نفد من المخزون",
    text: "text-error",
  },
  outofstock: {
    bg: "bg-error-container text-error border-error/20",
    label: "نفد من المخزون",
    text: "text-error",
  },
};

interface ProductDetailContentProps {
  productPromise: Promise<ApiResponse<MerchantProduct>>;
}

export function ProductDetailContent({
  productPromise,
}: ProductDetailContentProps) {
  const res = use(productPromise);
  const product = res.data;

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center bg-surface-container-high/20 rounded-2xl border-2 border-dashed border-outline-variant p-xl">
        <Icon
          name="error_outline"
          className="h-16 w-16 mb-4 text-error/60 mx-auto"
        />
        <h3 className="font-bold text-xl text-on-surface mb-2">
          لم يتم العثور على المنتج
        </h3>
        <p className="text-body-md text-on-surface-variant mb-6">
          المنتج الذي تبحث عنه غير موجود أو تم حذفه مؤخراً.
        </p>
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          <Icon name="arrow_forward" className="h-5 w-5" />
          <span>العودة إلى المخزون</span>
        </Link>
      </div>
    );
  }

  const rawStatus = (product.status || "").toLowerCase().trim();
  const statusStyle = statusMap[rawStatus] || {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: product.status || "نشط",
    text: "text-primary",
  };

  const validImages = extractProductImages(product);
  const imageSrc = validImages.length > 0 ? validImages[0] : PLACEHOLDER_IMAGE;

  const discountPercent =
    product.originalPrice > 0 && product.discountedPrice < product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.discountedPrice) /
            product.originalPrice) *
            100,
        )
      : 0;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-lg font-sans">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-bold text-sm"
        >
          <Icon name="arrow_forward" className="h-5 w-5" />
          <span>العودة للمخزون</span>
        </Link>

        <span className="font-data-mono text-xs text-on-surface-variant/70">
          معرف المنتج: PROD-{product.id.slice(0, 8).toUpperCase()}
        </span>
      </div>

      {/* Main product card container */}
      <div className="bg-light-green rounded-2xl border border-outline-variant/60 shadow-sm p-margin-mobile md:p-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-lg">
        {/* Product Image Column */}
        <div className="md:col-span-5 flex flex-col gap-md">
          <div className="aspect-square relative rounded-xl overflow-hidden bg-surface-container-high border border-outline-variant/40 shadow-inner">
            <Image
              src={imageSrc}
              alt={product.titleAr || product.title}
              fill
              className="object-cover"
              unoptimized
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-error text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                خصم {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails if available */}
          {validImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {validImages.map((img, i) => (
                <div
                  key={i}
                  className="w-16 h-16 relative rounded-lg overflow-hidden border border-outline-variant shrink-0"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="md:col-span-7 flex flex-col justify-between gap-md">
          <div>
            {/* Category, Automation Mode & Status Badges */}
            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <div className="flex items-center gap-2">
                <span className="bg-surface-container-high text-on-surface-variant font-bold text-xs px-3 py-1 rounded-full border border-outline-variant/40">
                  {product.categoryNameAr ||
                    product.categoryName ||
                    "تصنيف عام"}
                </span>
                {product.automationMode && (
                  <span className="bg-primary/10 text-primary font-bold text-xs px-3 py-1 rounded-full border border-primary/20">
                    أتمتة:{" "}
                    {product.automationMode === "Manual"
                      ? "يدوي"
                      : product.automationMode === "Autonomous"
                        ? "تلقائي بالكامل"
                        : "بمساعدة"}
                  </span>
                )}
              </div>
              <span
                className={`font-bold text-xs px-3.5 py-1 rounded-full border shadow-sm ${statusStyle.bg}`}
              >
                {statusStyle.label}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2">
              {product.titleAr || product.title}
            </h1>
            {product.titleAr && product.title !== product.titleAr && (
              <p className="text-sm text-on-surface-variant opacity-75 mb-4">
                {product.title}
              </p>
            )}

            {/* Description */}
            <p className="text-body-md text-on-surface-variant leading-relaxed bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 mb-6">
              {product.descriptionAr ||
                product.description ||
                "لا يوجد وصف إضافي محدد لهذا المنتج."}
            </p>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
              {/* Price stat */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block mb-1">
                  السعر بعد الخصم
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-data-mono font-bold text-lg text-link">
                    {new Intl.NumberFormat("ar-EG", {
                      style: "currency",
                      currency: "EGP",
                    }).format(product.discountedPrice)}
                  </span>
                  {product.originalPrice > product.discountedPrice && (
                    <span className="font-data-mono text-xs text-on-surface-variant/60 line-through">
                      {product.originalPrice} ج.م
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity stat */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30">
                <span className="text-xs text-on-surface-variant block mb-1">
                  الكمية المتاحة
                </span>
                <span className="font-data-mono font-bold text-lg text-primary">
                  {product.quantityAvailable} قطعة
                </span>
              </div>

              {/* Expiry stat */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 col-span-2 sm:col-span-1">
                <span className="text-xs text-on-surface-variant block mb-1">
                  تاريخ الانتهاء
                </span>
                <span className="font-data-mono font-bold text-sm text-on-surface">
                  {product.expirationDate
                    ? new Date(product.expirationDate).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "غير محدد"}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps & Actions Footer */}
          <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-md">
            <div className="text-xs text-on-surface-variant/70">
              {product.createdAt && (
                <span>
                  تاريخ الإضافة:{" "}
                  {new Date(product.createdAt).toLocaleDateString("ar-EG")}
                </span>
              )}
            </div>

            <div className="flex items-center gap-md w-full sm:w-auto">
              <Link
                href={`/products/${product.id}/edit`}
                className="flex-1 sm:flex-initial text-center py-3 px-6 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20"
              >
                تعديل البيانات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
