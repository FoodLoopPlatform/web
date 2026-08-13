"use client";

import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { Icon } from "@/components/ui/icon";
import { DonationHeroSection } from "@/components/donate/DonationHeroSection";
import { UnsoldInventoryList } from "@/components/donate/UnsoldInventoryList";
import { VerifiedCharitiesList } from "@/components/donate/VerifiedCharitiesList";
import { ConfirmDonationButton } from "@/components/donate/ConfirmDonationButton";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";

function DonatePage() {
  const store = useStoreProfile();

  return (
    <MerchantShell>
      {({ sidebarCollapsed, setMobileSidebarOpen }) => (
        <main
          className={`flex-1 min-h-screen min-w-0 flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
        >
          <MerchantTopHeader
            onMenuClick={() => setMobileSidebarOpen(true)}
            storeName={store?.name}
            avatarUrl={resolveImageUrl(store?.logo)}
            left={
              <div className="relative max-w-112 w-full hidden md:block">
                <Icon
                  name="search"
                  className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  className="w-full bg-surface-container-high border-none rounded-full py-2 pr-11 pl-4 font-body-md text-body-md focus:ring-2 focus:ring-primary transition-all outline-none"
                  placeholder="ابحث عن منتجات، طلبات..."
                  type="text"
                />
              </div>
            }
          />

          {/* Donation Content */}
          <div className="px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
              <h1 className="font-sans text-3xl font-bold text-primary">
                التبرع وأثر المجتمع
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                حوّل مخزونك غير المباع إلى شريان حياة للأسر المحتاجة بدلاً من
                الهدر.
              </p>
            </div>

            <DonationHeroSection />
            <UnsoldInventoryList />
            <VerifiedCharitiesList />
            <ConfirmDonationButton />
          </div>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(DonatePage);
