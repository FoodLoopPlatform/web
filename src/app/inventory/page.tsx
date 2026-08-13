"use client";

import { useState, useMemo, Suspense } from "react";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventorySkeleton } from "@/components/inventory/InventorySkeleton";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import {
  getMerchantProducts,
  getCategories,
} from "@/app/products/api/products-api";

function InventoryPage() {
  const store = useStoreProfile();
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Create memoized categories promise fetched directly from GET /categories
  const categoriesPromise = useMemo(() => getCategories(), []);

  // Create a memoized products promise based on current filter states.
  // Passed to <InventoryGrid> which resolves it using React 19's use(promise) within <Suspense>.
  const productsPromise = useMemo(
    () =>
      getMerchantProducts({
        status: statusFilter !== "All" ? statusFilter : undefined,
        categoryId: categoryFilter !== "All" ? categoryFilter : undefined,
        searchTerm: searchQuery.trim() || undefined,
      }),
    [statusFilter, categoryFilter, searchQuery],
  );

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
          />

          {/* Live Inventory Content */}
          <section className="px-margin-mobile md:px-margin-desktop py-lg">
            <InventoryHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <Suspense
              fallback={
                <div className="h-10 animate-pulse bg-surface-container-high/40 rounded-full mt-4 w-full" />
              }
            >
              <InventoryFilters
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categoriesPromise={categoriesPromise}
              />
            </Suspense>
          </section>

          {/* Product Grid Section with Suspense Boundary */}
          <section className="px-margin-mobile md:px-margin-desktop pb-xl flex-1">
            <Suspense fallback={<InventorySkeleton />}>
              <InventoryGrid productsPromise={productsPromise} />
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

export default withAuth(InventoryPage);
