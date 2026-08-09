"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventorySkeleton } from "@/components/inventory/InventorySkeleton";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import {
  getMerchantProducts,
  getCategories,
} from "@/app/products/api/products-api";

function InventoryPage() {
  const store = useStoreProfile();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
      dir="rtl"
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
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
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        {/* Top Header */}
        <header className="h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-light-green border-b border-outline-variant sticky top-0 z-40">
          <div className="flex items-center gap-md flex-1">
            {/* Hamburger menu to toggle sidebar drawer on mobile */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            {/* Search Input (Responsive layout) */}
            <div className="relative max-w-3xl w-full hidden md:block">
              <Icon
                name="search"
                className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <input
                className="w-full bg-surface-container-high border-none rounded-full py-2 pr-11 pl-4 font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all outline-none"
                placeholder="البحث في المخزون، أو الفئات..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors relative flex items-center justify-center cursor-pointer">
                <Icon
                  name="notifications"
                  className="h-5 w-5 text-on-surface-variant"
                />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
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
            </div>
            <div className="h-8 w-px bg-outline-variant"></div>

            {/* User Profile */}
            <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-highest p-1 pl-3 pr-1 rounded-full transition-all">
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="صورة التاجر"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4"
                width={32}
                height={32}
                unoptimized
              />
              <span className="font-label-caps text-label-caps text-primary font-bold hidden md:block">
                {store?.name || "متجري"}
              </span>
            </div>
          </div>
        </header>

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
    </div>
  );
}

export default withAuth(InventoryPage);
