"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import {
  getMerchantProducts,
  getCategories,
} from "@/app/products/api/products-api";
import { RiskAnalysisBoard } from "./components/RiskAnalysisBoard";
import { RiskAnalysisSkeleton } from "./components/RiskAnalysisSkeleton";

function InventoryRiskAnalysisPage() {
  const store = useStoreProfile();

  const categoriesPromise = useMemo(() => getCategories(), []);

  // A large pageSize pulls the full merchant catalog so the risk model can
  // analyze it client-side, mirroring the "fetch everything" pattern used
  // for admin audit-log analysis (see app/admin/api/audit-log-api.ts).
  const productsPromise = useMemo(
    () => getMerchantProducts({ pageSize: 500 }),
    [],
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

          <section className="px-margin-mobile md:px-margin-desktop py-lg flex-1">
            {/* Breadcrumb back to inventory */}
            <Link
              href="/inventory"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors mb-4"
            >
              <Icon name="arrow_forward" className="h-3.5 w-3.5" />
              <span>العودة إلى المخزون</span>
            </Link>

            <Suspense fallback={<RiskAnalysisSkeleton />}>
              <RiskAnalysisBoard
                productsPromise={productsPromise}
                categoriesPromise={categoriesPromise}
              />
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

export default withAuth(InventoryRiskAnalysisPage);
