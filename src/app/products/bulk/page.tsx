"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchantShell,
  MerchantTopHeader,
} from "@/components/layout/merchant-shell";
import { withAuth } from "@/lib/auth/with-auth";
import { useStoreProfile } from "@/hooks/use-store-profile";
import { resolveImageUrl } from "@/utils/image-utils";
import { BulkProductUploadModal } from "@/components/products/BulkProductUploadModal";

function BulkProductsPage() {
  const router = useRouter();
  const store = useStoreProfile();
  const [modalOpen, setModalOpen] = useState(true);

  const handleClose = () => {
    setModalOpen(false);
    router.push("/inventory");
  };

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
          />

          <div className="flex-1 flex items-center justify-center p-6">
            <BulkProductUploadModal
              isOpen={modalOpen}
              onClose={handleClose}
              onSuccess={() => {
                router.push("/inventory");
              }}
            />
          </div>
        </main>
      )}
    </MerchantShell>
  );
}

export default withAuth(BulkProductsPage);
