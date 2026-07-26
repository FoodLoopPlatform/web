"use client";

import { use, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { Button } from "@/components/ui/button";
import { StoreProfileForm } from "./store-profile-form";
import { LocationForm } from "./location-form";
import type { StoreProfileInput, LocationSettingsInput } from "../lib/schemas";
import { getStoreResource } from "../api/store-resource";
import { businessCategoryToFormValue } from "../api/types";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

type ProfileData = Omit<StoreProfileInput, "logoFile" | "coverFile"> & {
  lastUpdated?: string;
};

type LocationData = LocationSettingsInput & { lastUpdated?: string };

type StoreSettingsProps = {
  accessToken: string;
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

export function StoreSettings({
  accessToken,
  initialProfile,
  initialLocation,
}: StoreSettingsProps) {
  const store = use(getStoreResource(accessToken));

  const [activeTab, setActiveTab] = useState<"profile" | "location">("profile");
  const [toast, setToast] = useState<ToastState>(null);
  const [profileLastUpdated, setProfileLastUpdated] = useState<string>(
    initialProfile?.lastUpdated ?? "",
  );
  const [locationLastUpdated, setLocationLastUpdated] = useState<string>(
    initialLocation?.lastUpdated ?? "",
  );

  const activeFormId =
    activeTab === "profile" ? "store-profile-form" : "location-settings-form";

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const mergedProfile = initialProfile
    ? {
        ...initialProfile,
        businessName: store.name || initialProfile.businessName,
        businessType:
          businessCategoryToFormValue[store.businessCategory] ??
          initialProfile.businessType,
      }
    : initialProfile;

  const mergedLocation = initialLocation
    ? {
        ...initialLocation,
        governorate: store.governorate || initialLocation.governorate,
        city: store.city || initialLocation.city,
        cityArea: store.neighborhood || initialLocation.cityArea,
        streetAddress: store.street || initialLocation.streetAddress,
        latitude: store.latitude ?? initialLocation.latitude,
        longitude: store.longitude ?? initialLocation.longitude,
      }
    : initialLocation;

  return (
    <div className="flex flex-1 flex-col min-h-full bg-surface" dir="rtl">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile py-4 md:px-margin-desktop">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
          <div className="flex items-center gap-6 flex-1 max-w-lg">
            <Heading
              level="md"
              className="text-primary font-bold shrink-0 hidden sm:block"
            >
              بوابة التجار
            </Heading>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                className="w-full h-10 rounded-lg border border-outline-variant bg-surface-container-low ps-10 pe-4 text-body-md text-on-surface outline-none focus:border-primary transition-colors"
              />
              <svg
                className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-outline"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
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
          <span className="text-body-md font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
