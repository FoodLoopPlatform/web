"use client";

import Link from "next/link";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { ImageUpload } from "@/components/products/ImageUpload";
import { ClassificationSelect } from "@/components/products/ClassificationSelect";
import { ProductInfoForm } from "@/components/products/ProductInfoForm";
import { ExpiryDateSelector } from "@/components/products/ExpiryDateSelector";
import { useProductForm } from "./use-product-form";
import type { MerchantProduct } from "@/app/products/api/types";

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
  const formState = useProductForm({ mode, initialProduct, productId });

  const backUrl =
    mode === "edit" && productId ? `/product/${productId}` : "/inventory";
  const pageTitle = mode === "edit" ? "تعديل بيانات المنتج" : "إضافة منتج جديد";

  return (
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
      dir="rtl"
    >
      {/* Permanent SideNavBar on Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${
          formState.sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <MerchantSidebar
          isCollapsed={formState.sidebarCollapsed}
          onToggleCollapse={() =>
            formState.setSidebarCollapsed(!formState.sidebarCollapsed)
          }
        />
      </aside>

      {/* Mobile Drawer SideNavBar */}
      {formState.mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => formState.setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => formState.setMobileSidebarOpen(false)}
                className="p-1 rounded-full bg-light-green border border-outline-variant text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MerchantSidebar
              onClose={() => formState.setMobileSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${
          formState.sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
        }`}
      >
        {/* Header */}
        <header className="w-full h-16 sticky top-0 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-margin-mobile md:px-margin-desktop z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => formState.setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            <Link
              href={backUrl}
              className="flex items-center justify-center hover:bg-surface-container-highest p-2 rounded-full transition-colors cursor-pointer"
            >
              <Icon name="arrow_forward" className="h-5 w-5 text-primary" />
            </Link>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-gutter">
            <div className="hidden md:flex items-center bg-light-green px-4 py-2 rounded-full border border-outline-variant w-64">
              <Icon name="search" className="h-5 w-5 text-on-surface-variant" />
              <input
                className="bg-transparent border-none focus:ring-0 text-body-md w-full mr-2 outline-none font-sans"
                placeholder="البحث في الطلبات..."
                type="text"
              />
            </div>

            <div className="flex items-center gap-4 text-primary">
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon
                  name="notifications"
                  className="h-5 w-5 text-on-surface-variant"
                />
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon name="help" className="h-5 w-5 text-on-surface-variant" />
              </button>
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer">
                <Icon
                  name="language"
                  className="h-5 w-5 text-on-surface-variant"
                />
              </button>

              <div className="flex items-center gap-2 cursor-pointer mr-2">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border border-outline-variant">
                  <Image
                    className="w-full h-full object-cover"
                    alt="الملف الشخصي"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlGzOnf-OY5iX3UruQhQF-VbMthZ34BNrvQC242ReI5YVPIyMiVsKSJNLNgm_i3kJBrFK3heJTqkFd3JxL8EoQwX4flTwQ9YGh4A3lVPWrDb32pBi1kdvsd2ZZW1Ym9nv633gdXJUAcemP0QAWxBsQK6p4Nhlf8dMM8GpBpDmes_7HDUk8Lnjz5GH0P_PhukYA0nMdnzemjFK-y_N2yIjP1m9JEZFxylLfi4MS6UJagX2jxtLvl6LmeYFteKAnXfRHNHTUQsob5BY"
                    width={32}
                    height={32}
                    unoptimized
                  />
                </div>
                <span className="font-label-caps text-label-caps font-bold hidden lg:block text-on-surface-variant mr-1">
                  التاجر
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Form Container */}
        <section className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-lowest overflow-y-auto">
          <div className="max-w-4xl mx-auto flex flex-col gap-md">
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

            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
              {/* Left Column: Image & Category */}
              <div className="md:col-span-5 flex flex-col gap-md">
                <ImageUpload
                  images={formState.images}
                  onFilesAdded={formState.handleFilesAdded}
                  onMoveImage={formState.handleMoveImage}
                  onRemoveImage={formState.handleRemoveImage}
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
                  expiryTab={formState.expiryTab}
                  setExpiryTab={formState.setExpiryTab}
                  expiryDate={formState.expiryDate}
                  setExpiryDate={formState.setExpiryDate}
                  isScanning={formState.isScanning}
                  setIsScanning={formState.setIsScanning}
                  scanSuccess={formState.scanSuccess}
                  setScanSuccess={formState.setScanSuccess}
                  onSimulateScan={formState.handleSimulateScan}
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
                      <Icon name="check_circle" className="h-5 w-5 shrink-0" />
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
    </div>
  );
}
