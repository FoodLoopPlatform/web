"use client";

import { use } from "react";
import { Text } from "@/components/ui/text";
import { InfoCircleIcon } from "@/components/icons/info-circle-icon";
import { StoreSettings } from "./store-settings";
import type { StoreProfileInput, LocationSettingsInput } from "../lib/schemas";
import { useAppStore, getHydrationResource } from "@/store/use-app-store";

type ProfileData = Omit<StoreProfileInput, "logoFile" | "coverFile"> & {
  lastUpdated?: string;
};

type LocationData = LocationSettingsInput & { lastUpdated?: string };

type SettingsContentProps = {
  initialProfile?: ProfileData;
  initialLocation?: LocationData;
};

export function SettingsContent({
  initialProfile,
  initialLocation,
}: SettingsContentProps) {
  use(getHydrationResource());

  const accessToken = useAppStore((state) => state.accessToken);

  if (!accessToken) {
    return (
      <div className="flex flex-1 flex-col min-h-full bg-surface items-center justify-center px-margin-mobile py-8 md:px-margin-desktop">
        <div className="max-w-md w-full text-center flex flex-col items-center gap-3 p-6 rounded-xl border border-error-container/40 bg-error-container/20">
          <InfoCircleIcon className="h-6 w-6 text-error" aria-hidden="true" />
          <Text variant="body-md" className="text-error font-bold">
            يجب تسجيل الدخول لعرض بيانات المتجر
          </Text>
        </div>
      </div>
    );
  }

  return (
    <StoreSettings
      accessToken={accessToken}
      initialProfile={initialProfile}
      initialLocation={initialLocation}
    />
  );
}
