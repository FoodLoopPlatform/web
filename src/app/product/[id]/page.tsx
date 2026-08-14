"use client";

import { useMemo, Suspense, use } from "react";
import Link from "next/link";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { ProductDetailContent } from "@/components/products/ProductDetailContent";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { getMerchantProductById } from "@/app/products/api/products-api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const store = useStoreProfile();

  // Memoized product promise passed into Suspense boundary
  const productPromise = useMemo(() => getMerchantProductById(id), [id]);

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
                  href="/inventory"
                  className="flex items-center justify-center hover:bg-surface-container-highest p-2 rounded-full transition-colors cursor-pointer"
                >
                  <Icon name="arrow_forward" className="h-5 w-5 text-primary" />
                </Link>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">
                  تفاصيل المنتج
                </h2>
              </>
            }
          />

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
      )}
    </MerchantShell>
  );
}

export default withAuth(ProductDetailPage);
