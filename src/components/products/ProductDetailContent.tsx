"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { MerchantProduct } from "@/app/products/api/types";
import type { ApiResponse } from "@/utils/server";
import { extractProductImages } from "@/utils/image-utils";
import { isProductExpired } from "@/utils/date-utils";
import { deleteMerchantProduct } from "@/app/products/api/products-api";
import { DeleteConfirmationModal } from "@/components/products/DeleteConfirmationModal";

import { statusMap, expiryVerificationConfig } from "./product-detail-configs";
import { ProductNotFoundCard } from "./ProductNotFoundCard";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

interface ProductDetailContentProps {
  productPromise: Promise<ApiResponse<MerchantProduct>>;
}

export function ProductDetailContent({
  productPromise,
}: ProductDetailContentProps) {
  const router = useRouter();
  const res = use(productPromise);
  const product = res.data;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!product) {
    return <ProductNotFoundCard />;
  }

  const isExpired = isProductExpired(product.expirationDate);
  const rawStatus = (product.status || "").toLowerCase().trim();
  const statusStyle = statusMap[rawStatus] || {
    bg: "bg-primary-fixed text-primary border-primary/20",
    label: product.status || "نشط",
    text: "text-primary",
  };

  const verificationConfig = product.expiryVerificationState
    ? expiryVerificationConfig[product.expiryVerificationState]
    : undefined;

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

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteMerchantProduct(product.id);
      if (res.error) {
        setDeleteError(res.error);
        setIsDeleting(false);
        // DO NOT close modal on error
        return;
      }

      setIsDeleting(false);
      setDeleteModalOpen(false);
      router.push("/inventory");
    } catch (err: unknown) {
      setIsDeleting(false);
      setDeleteError(
        err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحذف",
      );
    }
  };

  return (
    <>
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

        {/* Expired Product Alert Banner */}
        {isExpired && (
          <div className="bg-error-container/80 border-2 border-error text-error p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-error text-white shrink-0">
                <Icon name="event_busy" className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-bold text-base sm:text-lg">
                  هذا المنتج منتهي الصلاحية!
                </h4>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                  انتهت صلاحية هذا المنتج بتاريخ{" "}
                  <span className="font-data-mono font-bold">
                    {new Date(product.expirationDate!).toLocaleDateString(
                      "ar-EG",
                    )}
                  </span>
                  . يرجى سحبه من المعروضات أو التخلص منه.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="px-4 py-2.5 bg-error text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-error/90 transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0 self-end sm:self-auto"
            >
              <Trash2 className="h-4 w-4 text-white" />
              <span>حذف المنتج المنتهي</span>
            </button>
          </div>
        )}

        {/* Main product card container */}
        <div
          className={`bg-light-green rounded-2xl border shadow-sm p-margin-mobile md:p-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-lg ${
            isExpired ? "border-2 border-error/50" : "border-outline-variant/60"
          }`}
        >
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
              {/* Category, Automation Mode & Status Badges (Right Aligned) */}
              <div className="flex items-center gap-2 flex-wrap mb-4 justify-start">
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
                {verificationConfig && (
                  <div className="relative group/tooltip inline-block">
                    <span
                      className={`font-bold text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 cursor-pointer ${verificationConfig.bg}`}
                    >
                      <span>{verificationConfig.label}</span>
                    </span>
                    <div className="absolute top-full mt-1.5 right-1/2 translate-x-1/2 hidden group-hover/tooltip:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap">
                      <div className="bg-inverse-surface text-inverse-on-surface text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md border border-outline/20">
                        {verificationConfig.tooltipText}
                      </div>
                      <div className="w-1.5 h-1.5 bg-inverse-surface rotate-45 -mt-1" />
                    </div>
                  </div>
                )}
                {isExpired ? (
                  <span className="font-bold text-xs px-3.5 py-1 rounded-full border shadow-sm bg-error text-white border-error/30 flex items-center gap-1">
                    <Icon name="event_busy" className="h-3.5 w-3.5" />
                    <span>منتهي الصلاحية</span>
                  </span>
                ) : (
                  <span
                    className={`font-bold text-xs px-3.5 py-1 rounded-full border shadow-sm ${statusStyle.bg}`}
                  >
                    {statusStyle.label}
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
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

              {/* Grid Stats: Top Aligned, Decreased Data Font Size & Wrapped */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                {/* Price Stat Card */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-start items-start gap-1.5 min-w-0">
                  <span className="text-sm sm:text-base font-bold text-on-surface-variant/90 block">
                    السعر بعد الخصم
                  </span>
                  <div className="flex items-baseline gap-2 flex-wrap break-words w-full">
                    <span className="font-data-mono font-bold text-base text-link break-all whitespace-normal">
                      {new Intl.NumberFormat("ar-EG", {
                        style: "currency",
                        currency: "EGP",
                      }).format(product.discountedPrice)}
                    </span>
                    {product.originalPrice > product.discountedPrice && (
                      <span className="font-data-mono text-xs text-on-surface-variant/60 line-through whitespace-nowrap">
                        {product.originalPrice} ج.م
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Stat Card */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/40 shadow-xs flex flex-col justify-start items-start gap-1.5 min-w-0">
                  <span className="text-sm sm:text-base font-bold text-on-surface-variant/90 block">
                    الكمية المتاحة
                  </span>
                  <span
                    className={`font-data-mono font-bold text-base break-words whitespace-normal max-w-full ${
                      isExpired || product.quantityAvailable === 0
                        ? "text-error"
                        : "text-primary"
                    }`}
                  >
                    {product.quantityAvailable} قطعة
                  </span>
                </div>

                {/* Expiry Stat Card */}
                <div
                  className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-start items-start gap-1.5 min-w-0 ${
                    isExpired
                      ? "bg-error-container/30 border-error/50"
                      : "bg-surface-container-lowest border-outline-variant/40"
                  }`}
                >
                  <span className="text-sm sm:text-base font-bold text-on-surface-variant/90 block">
                    تاريخ الانتهاء
                  </span>
                  <span
                    className={`font-data-mono font-bold text-base break-words whitespace-normal max-w-full ${
                      isExpired ? "text-error" : "text-on-surface"
                    }`}
                  >
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
                  {isExpired ? (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-error bg-error-container/60 px-2.5 py-1 rounded-full border border-error/30">
                      <Icon name="event_busy" className="h-3.5 w-3.5" />
                      <span>منتهي الصلاحية</span>
                    </span>
                  ) : (
                    verificationConfig && (
                      <div className="relative group/tooltip inline-block mt-1.5">
                        <span
                          className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border ${verificationConfig.bg}`}
                        >
                          <span>{verificationConfig.label}</span>
                        </span>
                        <div className="absolute bottom-full mb-1.5 right-1/2 translate-x-1/2 hidden group-hover/tooltip:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap">
                          <div className="bg-inverse-surface text-inverse-on-surface text-[10px] font-medium px-2 py-1 rounded shadow-md border border-outline/20">
                            {verificationConfig.tooltipText}
                          </div>
                          <div className="w-1.5 h-1.5 bg-inverse-surface rotate-45 -mt-1" />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Timestamps & Actions Footer */}
            <div className="pt-5 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-md">
              <div className="text-xs text-on-surface-variant/70">
                {product.createdAt && (
                  <span>
                    تاريخ الإضافة:{" "}
                    {new Date(product.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-md w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="py-3 px-5 bg-error/10 text-error border border-error/30 rounded-xl font-bold hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer group/del"
                >
                  <Trash2 className="h-5 w-5 text-error group-hover/del:text-white transition-colors" />
                  <span>حذف المنتج</span>
                </button>
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        productName={product.titleAr || product.title}
        isExpired={isExpired}
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onClose={() => {
          setDeleteError(null);
          setDeleteModalOpen(false);
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}
