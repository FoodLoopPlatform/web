"use client";

import { useState, useMemo, Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { ProductDetailContent } from "@/components/products/ProductDetailContent";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { getMerchantProductById } from "@/app/products/api/products-api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const store = useStoreProfile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Memoized product promise passed into Suspense boundary
  const productPromise = useMemo(() => getMerchantProductById(id), [id]);

  return (
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
      dir="rtl"
    >
      {/* Permanent SideNavBar on Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer SideNavBar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full bg-light-green border border-outline-variant text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MerchantSidebar onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${
          sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
        }`}
      >
        {/* Header */}
        <header className="w-full h-16 sticky top-0 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center px-margin-mobile md:px-margin-desktop z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            <Link
              href="/inventory"
              className="flex items-center justify-center hover:bg-surface-container-highest p-2 rounded-full transition-colors cursor-pointer"
            >
              <Icon name="arrow_forward" className="h-5 w-5 text-primary" />
            </Link>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
              تفاصيل المنتج
            </h2>
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
                  alt="صورة المتجر"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4"
                  width={32}
                  height={32}
                  unoptimized
                />
              </div>
              <span className="font-label-caps text-label-caps font-bold hidden lg:block text-on-surface-variant mr-1">
                {store?.name || "التاجر"}
              </span>
            </div>
          </div>
        </header>

        {/* Product Details Section with Suspense Boundary */}
        <section className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface-container-lowest overflow-y-auto">
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ProductDetailContent productPromise={productPromise} />
          </Suspense>
        </section>

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

export default withAuth(ProductDetailPage);
