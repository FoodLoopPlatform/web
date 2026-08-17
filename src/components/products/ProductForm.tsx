"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { ImageUpload } from "@/components/products/ImageUpload";
import { ClassificationSelect } from "@/components/products/ClassificationSelect";
import { ProductInfoForm } from "@/components/products/ProductInfoForm";
import { ExpiryDateSelector } from "@/components/products/ExpiryDateSelector";
import { BulkProductUploadModal } from "@/components/products/BulkProductUploadModal";
import { useProductForm } from "./use-product-form";
import type { MerchantProduct } from "@/app/products/api/types";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";

interface ProductFormProps {
  mode: "add" | "edit";
  initialProduct?: MerchantProduct | null;
  productId?: string;
}

export function ProductForm({
  mode,
  initialProduct,
  productId,
}: ProductFormProps) {
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const formState = useProductForm({ mode, initialProduct, productId });
  const store = useStoreProfile();

  const backUrl =
    mode === "edit" && productId ? `/product/${productId}` : "/inventory";
  const pageTitle = mode === "edit" ? "تعديل بيانات المنتج" : "إضافة منتج جديد";

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${
            sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
          }`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
            left={
              <>
                <Link
                  href={backUrl}
                  className="flex items-center justify-center hover:bg-surface-container-highest p-2 rounded-full transition-colors cursor-pointer"
                >
                  <Icon name="arrow_forward" className="h-5 w-5 text-primary" />
                </Link>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
                  {pageTitle}
                </h2>
              </>
            }
          />

          {/* Form Container */}
          <section className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-lowest overflow-y-auto">
            <div className="max-w-4xl mx-auto flex flex-col gap-md">
              {mode === "add" && (
                <div className="p-4 rounded-2xl bg-light-green border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon name="cloud_upload" className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface">
                        هل ترغب في إضافة عدة منتجات دفعة واحدة؟
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        استخدم خاصية رفع كشوف الإكسل (Excel / CSV) وتنزيل
                        النموذج المعتمد.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBulkModalOpen(true)}
                    className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Icon name="upload_file" className="h-4 w-4" />
                    <span>رفع ملف إكسل</span>
                  </button>
                </div>
              )}

              {formState.submitError && (
                <div className="p-4 bg-error-container/20 border border-error/30 rounded-xl text-error text-body-md flex items-center gap-3">
                  <Icon name="error" className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-bold">
                      {mode === "edit"
                        ? "تعذر إكمال طلب تعديل المنتج"
                        : "تعذر إكمال طلب إضافة المنتج"}
                    </p>
                    <p className="text-xs opacity-90 mt-0.5">
                      {formState.submitError}
                    </p>
                  </div>
                </div>
              )}

              <BulkProductUploadModal
                isOpen={bulkModalOpen}
                onClose={() => setBulkModalOpen(false)}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
                {/* Left Column: Image & Category */}
                <div className="md:col-span-5 flex flex-col gap-md">
                  <ImageUpload
                    images={formState.images}
                    onFilesAdded={formState.handleFilesAdded}
                    onMoveImage={formState.handleMoveImage}
                    onRemoveImage={formState.handleRemoveImage}
                    deletingImageIds={formState.deletingImageIds}
                    disabled={formState.isSubmitting}
                  />
                  <ClassificationSelect
                    selectedCategory={formState.selectedCategory}
                    setSelectedCategory={formState.setSelectedCategory}
                    categories={formState.categories}
                    isLoadingCategories={formState.isLoadingCategories}
                  />
                </div>

                {/* Right Column: Details & Expiry */}
                <div className="md:col-span-7 flex flex-col gap-md">
                  <ProductInfoForm
                    productName={formState.productName}
                    setProductName={formState.setProductName}
                    description={formState.description}
                    setDescription={formState.setDescription}
                    price={formState.price}
                    setPrice={formState.setPrice}
                    discountedPrice={formState.discountedPrice}
                    setDiscountedPrice={formState.setDiscountedPrice}
                    quantity={formState.quantity}
                    setQuantity={formState.setQuantity}
                  />

                  <ExpiryDateSelector
                    expiryDate={formState.expiryDate}
                    setExpiryDate={formState.setExpiryDate}
                  />

                  {/* Form Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-md pt-2">
                    <Link
                      href={backUrl}
                      className="w-full sm:flex-1 py-4 px-6 border-2 border-outline-variant rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-[background-color,transform] active:scale-95 text-label-md font-sans cursor-pointer text-center focus-visible:ring-2 focus-visible:ring-primary outline-none"
                    >
                      إلغاء
                    </Link>
                    <button
                      type="button"
                      onClick={formState.handleSubmit}
                      disabled={formState.isSubmitting}
                      className="w-full sm:flex-[2] py-4 px-6 bg-primary text-white rounded-xl font-bold hover:opacity-90 shadow-md shadow-primary/20 transition-[opacity,transform] active:scale-95 text-label-md flex items-center justify-center gap-2 font-sans cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none disabled:opacity-50"
                    >
                      {formState.isSubmitting ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <Icon
                          name="check_circle"
                          className="h-5 w-5 shrink-0"
                        />
                      )}
                      <span>
                        {formState.isSubmitting
                          ? formState.uploadProgressStatus ||
                            (mode === "edit"
                              ? "جاري حفظ التعديلات..."
                              : "جاري الحفظ والنشر...")
                          : mode === "edit"
                            ? "حفظ التعديلات"
                            : "نشر واعتماد المنتج فوراً"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Toast Notification */}
          {formState.toast && (
            <div
              className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
                formState.toast.type === "success"
                  ? "bg-primary text-white border-primary-fixed/30 shadow-primary/25"
                  : "bg-error text-white border-error/30 shadow-error/25"
              }`}
            >
              <Icon
                name={
                  formState.toast.type === "success" ? "check_circle" : "error"
                }
                className="h-6 w-6 shrink-0"
              />
              <span className="font-bold text-sm font-sans">
                {formState.toast.message}
              </span>
            </div>
          )}

          {/* Decorative Watermark logo */}
          <div className="fixed bottom-0 left-0 p-margin-desktop opacity-5 pointer-events-none select-none">
            <span className="font-display-lg text-display-lg text-primary -rotate-12 block">
              FoodLoop
            </span>
          </div>
        </main>
      )}
    </MerchantShell>
  );
}
