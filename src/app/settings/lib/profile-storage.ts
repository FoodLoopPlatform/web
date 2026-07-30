import type { StoreProfileInput } from "./schemas";
import { defaultOperatingHours } from "./operating-hours";

export type ProfileSaveInput = Omit<
  StoreProfileInput,
  "logoFile" | "coverFile"
>;

const PROFILE_STORAGE_KEY = "foodloop_mock_profile";

export const defaultProfile: ProfileSaveInput & { lastUpdated?: string } = {
  businessName: "",
  logoUrl: "",
  coverUrl: "",
  businessType: "",
  description: "",
  phone: "",
  email: "",
  preferredLanguage: "ar",
  operatingHours: defaultOperatingHours,
  disableAutomation: false,
  automationMode: "assisted",
  priceFloorRule: "cost",
  suggestDonation: false,
  arrangeDelivery: false,
  deliveryNotes: "",
};

export function getStoredProfile(): ProfileSaveInput & {
  lastUpdated?: string;
} {
  if (typeof window === "undefined") return defaultProfile;
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  // Merge over defaults so records saved before a field (e.g. operatingHours)
  // existed don't come back missing it.
  return { ...defaultProfile, ...JSON.parse(stored) };
}

export function setStoredProfile(
  data: ProfileSaveInput & { lastUpdated?: string },
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}
