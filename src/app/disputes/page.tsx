"use client";

import { useMemo, Suspense } from "react";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { DisputesContent } from "@/components/disputes/DisputesContent";
import { DisputesSkeleton } from "@/components/disputes/DisputesSkeleton";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { getStoreDisputes } from "./api/disputes-api";

function DisputesPage() {
  const store = useStoreProfile();

  // Memoized promise fetched directly from GET /stores/me/disputes.
  // Resolved inside <DisputesContent> via React 19's use(promise) within <Suspense>.
  const disputesPromise = useMemo(() => getStoreDisputes(), []);

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-1 min-h-screen flex flex-col transition-all duration-300 mr-0 w-full min-w-0 max-w-full overflow-x-hidden ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
          />

          <section className="px-margin-mobile md:px-margin-desktop py-lg">
            <div className="flex flex-col gap-1 mb-lg">
              <h2 className="text-xl md:text-2xl lg:text-3xl text-primary font-bold">
                النزاعات
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant w-full max-w-2xl">
                راجع النزاعات المفتوحة من قِبل العملاء بخصوص طلباتك وتابع حالة
                حلها من قِبل فريق الإدارة.
              </p>
            </div>
          </section>

          <section className="px-margin-mobile md:px-margin-desktop pb-xl flex-1">
            <Suspense fallback={<DisputesSkeleton />}>
              <DisputesContent disputesPromise={disputesPromise} />
            </Suspense>
          </section>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(DisputesPage);
