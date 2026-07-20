"use client";

import { useState, useEffect } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { Button } from "@/components/ui/button";
import { StoreProfileForm } from "./components/store-profile-form";
import { LocationForm } from "./components/location-form";
import {
  getStoreProfile,
  getLocationSettings,
} from "./services/settings-service";
import type { StoreProfileInput, LocationSettingsInput } from "./lib/schemas";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "location">("profile");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<
    | (Omit<StoreProfileInput, "logoFile" | "coverFile"> & {
        lastUpdated?: string;
      })
    | null
  >(null);
  const [locationData, setLocationData] = useState<
    (LocationSettingsInput & { lastUpdated?: string }) | null
  >(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [profileLastUpdated, setProfileLastUpdated] = useState<string>("");
  const [locationLastUpdated, setLocationLastUpdated] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [profileRes, locationRes] = await Promise.all([
        getStoreProfile(),
        getLocationSettings(),
      ]);

      if (profileRes.data) {
        setProfileData(profileRes.data);
        setProfileLastUpdated(profileRes.data.lastUpdated || "");
      }
      if (locationRes.data) {
        setLocationData(locationRes.data);
        setLocationLastUpdated(locationRes.data.lastUpdated || "");
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleProfileSaveSuccess = (lastUpdated: string) => {
    setProfileLastUpdated(lastUpdated);
  };

  const handleLocationSaveSuccess = (lastUpdated: string) => {
    setLocationLastUpdated(lastUpdated);
  };

  const formatTimestamp = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeFormId =
    activeTab === "profile" ? "store-profile-form" : "location-settings-form";

  return (
    <div className="flex flex-1 flex-col min-h-full bg-[#faf9f6]" dir="rtl">
      {/* Portal Header */}
      <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-outline-variant/30 px-margin-mobile py-4 md:px-margin-desktop">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
          {/* Right Side: Portal title & Search bar */}
          <div className="flex items-center gap-6 flex-1 max-w-lg">
            <Heading
              level="md"
              className="text-[#003820] font-bold shrink-0 hidden sm:block"
            >
              بوابة التجار
            </Heading>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="البحث في الطلبات..."
                className="w-full h-10 rounded-lg border border-outline-variant bg-[#f2f4f0] ps-10 pe-4 text-body-md text-on-surface outline-none focus-border-[#003820] transition-colors"
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

          {/* Left Side: Notification actions & Save changes */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Bell Icon */}
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

            {/* Mail Icon */}
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
              className="bg-[#003820] hover:bg-[#002716] !text-white font-semibold text-label-md px-5 py-2 rounded-lg transition-colors shadow-sm"
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </header>

      {/* Main Settings Panel */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-margin-mobile py-8 md:px-margin-desktop flex flex-col gap-8">
        {/* Title Block */}
        <div className="flex flex-col gap-1.5 border-b border-outline-variant/30 pb-6">
          <Heading
            level="lg"
            className="text-[#003820] font-black tracking-tight"
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

        {/* Tab switcher */}
        <div className="flex border-b border-outline-variant/30 gap-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-1 text-body-md font-bold relative transition-colors cursor-pointer ${
              activeTab === "profile"
                ? "text-[#003820]"
                : "text-outline hover:text-on-surface"
            }`}
          >
            ملف المتجر والهوية
            {activeTab === "profile" && (
              <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-full bg-[#003820]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`py-3 px-1 text-body-md font-bold relative transition-colors cursor-pointer ${
              activeTab === "location"
                ? "text-[#003820]"
                : "text-outline hover:text-on-surface"
            }`}
          >
            الموقع والعنوان
            {activeTab === "location" && (
              <span className="absolute bottom-0 inset-x-0 h-[3px] rounded-full bg-[#003820]" />
            )}
          </button>
        </div>

        {/* Form Container */}
        {loading ? (
          <div className="flex flex-col gap-8 animate-pulse">
            <div className="h-48 rounded-xl bg-surface-container-high/40" />
            <div className="h-64 rounded-xl bg-surface-container-high/40" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {activeTab === "profile" && profileData && (
              <div className="flex flex-col gap-6">
                <StoreProfileForm
                  initialData={profileData}
                  onSaveSuccess={handleProfileSaveSuccess}
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

            {activeTab === "location" && locationData && (
              <div className="flex flex-col gap-6">
                <LocationForm
                  initialData={locationData}
                  onSaveSuccess={handleLocationSaveSuccess}
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
        )}

        {/* Bottom Actions Bar */}
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
            className="bg-[#003820] hover:bg-[#002716] !text-white font-bold text-label-md px-8 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            حفظ التغييرات
          </Button>
        </div>
      </main>

      {/* Floating Animated Toast */}
      {toast && (
        <div
          className={`fixed bottom-8 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5 left-1/2 -translate-x-1/2 md:left-auto md:start-8 md:translate-x-0 ${
            toast.type === "success"
              ? "bg-[#003820] text-white"
              : "bg-error text-white"
          }`}
        >
          <InfoCircleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="text-body-md font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
