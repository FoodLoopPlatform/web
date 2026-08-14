"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { extractProductImages } from "@/utils/image-utils";
import { isProductExpired } from "@/utils/date-utils";
import { deleteMerchantProduct } from "@/app/products/api/products-api";
import { DeleteConfirmationModal } from "@/components/products/DeleteConfirmationModal";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number | null;
  price: number;
  status: string;
  automationMode?: string | null;
  expiryVerificationState?: string | null;
  expirationDate?: string | null;
  image?: string | null;
  images?: string[] | null;
}

interface ProductCardProps {
  product: Product;
  onDelete?: (id: string) => void;
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

const expiryVerificationConfig: Record<
  string,
  { bg: string; label: string; tooltipText: string }
> = {
  AiVerified: {
    bg: "bg-primary text-white shadow-xs",
    label: "مُحقق بالذكاء الاصطناعي",
    tooltipText:
      "AiVerified: تم التحقق من تاريخ الصلاحية بدقة بالذكاء الاصطناعي",
  },
  AiLowConfidence: {
    bg: "bg-tertiary-fixed text-on-tertiary-fixed-variant shadow-xs",
    label: "ذكاء اصطناعي (ثقة منخفضة)",
    tooltipText: "AiLowConfidence: استخراج تاريخ الصلاحية ثقته منخفضة",
  },
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isExpired = isProductExpired(product.expirationDate);
  const rawStatus = (product.status || "").toLowerCase().trim();
  const statusStyle = statusMap[rawStatus] || {
    bg: "bg-primary-fixed text-primary",
    label: product.status || "نشط",
    text: "text-primary",
  };
  const isOutOfStock =
    rawStatus === "out of stock" || rawStatus === "outofstock";

  const verificationConfig = product.expiryVerificationState
    ? expiryVerificationConfig[product.expiryVerificationState]
    : undefined;

  const extractedImages = extractProductImages(product);
  const imageSrc =
    extractedImages.length > 0 ? extractedImages[0] : PLACEHOLDER_IMAGE;

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await deleteMerchantProduct(product.id);
      if (res.error) {
        setDeleteError(res.error);
        setIsDeleting(false);
        // DO NOT close modal on error!
        return;
      }

      setIsDeleting(false);
      setDeleteModalOpen(false);
      onDelete?.(product.id);
    } catch (err: unknown) {
      setIsDeleting(false);
      setDeleteError(
        err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحذف",
      );
    }
  };

  return (
    <>
      <Link
        href={`/product/${product.id}`}
        className={`relative bg-light-green rounded-xl border transition-[border-color,box-shadow,filter] duration-300 group overflow-hidden cursor-pointer flex flex-col justify-between focus-visible:ring-2 focus-visible:ring-primary outline-none ${
          isExpired
            ? "border-2 border-error shadow-sm bg-error-container/10"
            : "border-outline-variant/50 hover:border-outline-variant hover:shadow-md"
        } ${isOutOfStock && !isExpired ? "grayscale-[0.4]" : ""}`}
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

          {/* Top Left: Trash Bin Delete Button */}
          <div className="absolute top-3 left-3 z-20">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDeleteModalOpen(true);
              }}
              className="p-2 rounded-full bg-white/95 text-error hover:bg-error hover:text-white backdrop-blur-sm shadow-md transition-all cursor-pointer flex items-center justify-center border border-error/20 hover:border-error"
              title="حذف المنتج"
            >
              <Trash2 className="h-4 w-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Top Right Badges: Right Aligned */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 items-start z-10 text-right">
            {isExpired ? (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold shadow-md bg-error text-white flex items-center gap-1">
                <Icon name="event_busy" className="h-3 w-3" />
                <span>منتهي الصلاحية</span>
              </span>
            ) : (
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ${statusStyle.bg}`}
              >
                {statusStyle.label}
              </span>
            )}

            {product.automationMode && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-primary backdrop-blur-sm shadow-xs">
                {product.automationMode === "Manual"
                  ? "يدوي"
                  : product.automationMode === "Autonomous"
                    ? "تلقائي"
                    : "بمساعدة"}
              </span>
            )}
            {verificationConfig && (
              <div className="relative group/tooltip inline-block mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold backdrop-blur-sm flex items-center gap-1 border border-white/20 ${verificationConfig.bg}`}
                >
                  <span>{verificationConfig.label}</span>
                </span>
                <div className="absolute bottom-full mb-1.5 right-0 hidden group-hover/tooltip:flex flex-col items-end z-30 pointer-events-none whitespace-nowrap">
                  <div className="bg-inverse-surface text-inverse-on-surface text-[10px] font-medium px-2 py-1 rounded shadow-md border border-outline/20">
                    {verificationConfig.tooltipText}
                  </div>
                  <div className="w-1.5 h-1.5 bg-inverse-surface rotate-45 -mt-1 mr-2" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="p-sm flex flex-col gap-base flex-grow justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h3
                className={`font-bold text-body-md leading-tight group-hover:text-primary transition-colors ${
                  isExpired ? "text-error" : "text-on-surface"
                }`}
              >
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
                  isOutOfStock || isExpired ? "text-error" : "text-primary"
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        productName={product.name}
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
