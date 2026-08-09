"use client";

import { use, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { Button } from "@/components/ui/button";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";
import { StoreProfileForm } from "./store-profile-form";
import { LocationForm } from "./location-form";
import { SettingsSkeleton } from "./settings-skeleton";
import { StoreVerificationSection } from "./store-verification-section";
import type { StoreProfileInput, LocationSettingsInput } from "../lib/schemas";
import { useAppStore } from "@/store/use-app-store";
import { getStoreResource } from "../api/store-resource";
import { businessCategoryToFormValue } from "../api/types";
import { parseOperatingHours } from "../lib/operating-hours";
import { withAuth } from "@/lib/auth/with-auth";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

type ProfileData = Omit<StoreProfileInput, "logoFile" | "coverFile"> & {
  lastUpdated?: string;
};

type LocationData = LocationSettingsInput & { lastUpdated?: string };

type SettingsContentProps = {
  initialProfile?: ProfileData;
  initialLocation?: LocationData;
};

function formatTimestamp(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SettingsContent({
  initialProfile,
  initialLocation,
}: SettingsContentProps) {
  const accessToken = useAppStore((state) => state.accessToken);

  const [activeTab, setActiveTab] = useState<"profile" | "location">("profile");
  const [toast, setToast] = useState<ToastState>(null);
  const [profileLastUpdated, setProfileLastUpdated] = useState<string>(
    initialProfile?.lastUpdated ?? "",
  );
  const [locationLastUpdated, setLocationLastUpdated] = useState<string>(
    initialLocation?.lastUpdated ?? "",
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeFormId =
    activeTab === "profile" ? "store-profile-form" : "location-settings-form";

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // withAuth guarantees a session by the time this renders; narrows the
  // store type for the use() call below.
  if (!accessToken) return null;

  // Real store record (GET /stores/me) layered over the mock/local profile
  // data — automation and delivery settings aren't part of the store
  // resource, so only those stay sourced from the mock/local profile here.
  const store = use(getStoreResource(accessToken));

  const mergedProfile = initialProfile
    ? {
        ...initialProfile,
        businessName: store.name || initialProfile.businessName,
        logoUrl: store.logo || initialProfile.logoUrl,
        coverUrl: store.coverPhoto || initialProfile.coverUrl,
        businessType:
          businessCategoryToFormValue[store.businessCategory] ??
          initialProfile.businessType,
        description: store.description || initialProfile.description,
        phone: store.phone || initialProfile.phone,
        email: store.email || initialProfile.email,
        operatingHours: store.openingHours
          ? parseOperatingHours(store.openingHours)
          : initialProfile.operatingHours,
      }
    : initialProfile;

  const mergedLocation = initialLocation
    ? {
        ...initialLocation,
        governorate: store.governorate || initialLocation.governorate,
        city: store.city || initialLocation.city,
        cityArea: store.neighborhood || initialLocation.cityArea,
        streetAddress: store.street || initialLocation.streetAddress,
        buildingDetails: store.buildingNo || initialLocation.buildingDetails,
        latitude: store.latitude ?? initialLocation.latitude,
        longitude: store.longitude ?? initialLocation.longitude,
      }
    : initialLocation;

  return (
    <div
      className="bg-surface-container-lowest text-on-surface min-h-screen flex font-sans w-full"
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
        className={`flex-grow min-h-screen flex flex-col transition-all duration-300 mr-0 ${sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"}`}
      >
        <div className="flex flex-1 flex-col min-h-full bg-surface">
          <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile py-4 md:px-margin-desktop">
            <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
              <div className="flex items-center gap-6 flex-1 max-w-lg">
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Icon name="menu" className="h-5 w-5 text-primary" />
                </button>

                <Heading
                  level="md"
                  className="text-primary font-bold shrink-0 hidden sm:block"
                >
                  بوابة التجار
                </Heading>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <button
                  className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-outline hover:text-on-surface"
                  aria-label="الإشعارات"
                >
                  <svg
                    className="h-5.5 w-5.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                <button
                  className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-outline hover:text-on-surface"
                  aria-label="الرسائل"
                >
                  <svg
                    className="h-5.5 w-5.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>

                <span className="h-6 w-px bg-outline-variant/30 hidden sm:inline" />

                <Button
                  type="submit"
                  form={activeFormId}
                  variant="primary"
                  className="bg-primary hover:bg-primary/90 !text-on-primary font-semibold text-label-md px-5 py-2 rounded-lg transition-colors shadow-sm"
                >
                  حفظ التغييرات
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl w-full mx-auto px-margin-mobile py-8 md:px-margin-desktop flex flex-col gap-8">
            <div className="flex flex-col gap-1.5 border-b border-outline-variant/30 pb-6">
              <Heading
                level="lg"
                className="text-primary font-black tracking-tight"
              >
                {activeTab === "profile"
                  ? "الملف التعريفي للمتجر"
                  : "موقع وعنوان المتجر"}
              </Heading>
              <Text variant="body-md" className="text-on-surface-variant">
                {activeTab === "profile"
                  ? "قم بتهيئة علامتك التجارية وساعات العمل وإعدادات الخصومات التلقائية للفائض."
                  : "إدارة العنوان الفعلي وموقع المتجر الجغرافي على الخريطة لحساب مسافات التوصيل للعملاء."}
              </Text>
            </div>

            <div className="flex border-b border-outline-variant/30 gap-6">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-3 px-1 text-body-md font-bold relative transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "text-primary"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                ملف المتجر والهوية
                {activeTab === "profile" && (
                  <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-full bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("location")}
                className={`py-3 px-1 text-body-md font-bold relative transition-colors cursor-pointer ${
                  activeTab === "location"
                    ? "text-primary"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                الموقع والعنوان
                {activeTab === "location" && (
                  <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-full bg-primary" />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {activeTab === "profile" && mergedProfile && (
                <div className="flex flex-col gap-6">
                  <StoreProfileForm
                    initialData={mergedProfile}
                    onSaveSuccess={setProfileLastUpdated}
                    showToast={showToast}
                  />
                  {profileLastUpdated && (
                    <div className="flex items-center gap-2 mt-2 text-label-md text-outline justify-end">
                      <InfoCircleIcon className="h-4 w-4" aria-hidden="true" />
                      <span>
                        آخر تحديث للملف: {formatTimestamp(profileLastUpdated)}
                      </span>
                    </div>
                  )}

                  <StoreVerificationSection
                    verificationStatus={store.verificationStatus}
                    documents={store.documents}
                  />
                </div>
              )}

              {activeTab === "location" && mergedLocation && (
                <div className="flex flex-col gap-6">
                  <LocationForm
                    initialData={mergedLocation}
                    onSaveSuccess={setLocationLastUpdated}
                    showToast={showToast}
                  />
                  {locationLastUpdated && (
                    <div className="flex items-center gap-2 mt-2 text-label-md text-outline justify-end">
                      <InfoCircleIcon className="h-4 w-4" aria-hidden="true" />
                      <span>
                        آخر تحديث للموقع: {formatTimestamp(locationLastUpdated)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-outline-variant/30 pt-6 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-outline-variant text-on-surface hover:bg-surface-container-low font-bold text-label-md px-6 py-2.5 rounded-lg transition-colors"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                form={activeFormId}
                variant="primary"
                className="bg-primary hover:bg-primary/90 !text-on-primary font-bold text-label-md px-8 py-2.5 rounded-lg transition-colors shadow-sm"
              >
                حفظ التغييرات
              </Button>
            </div>
          </main>

          {toast && (
            <div
              className={`fixed bottom-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:start-8 md:translate-x-0 ${
                toast.type === "success"
                  ? "bg-primary text-on-primary"
                  : "bg-error text-on-error"
              }`}
            >
              <InfoCircleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="text-body-md font-semibold">
                {toast.message}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const settingsLoadingFallback = (
  <div className="flex flex-1 flex-col min-h-full bg-surface px-margin-mobile py-8 md:px-margin-desktop">
    <SettingsSkeleton />
  </div>
);

export default withAuth(SettingsContent, {
  loadingFallback: settingsLoadingFallback,
  message: "يجب تسجيل الدخول لعرض بيانات المتجر",
});
