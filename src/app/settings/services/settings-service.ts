import { cache } from "react";
import { getMany, updateOne, type ApiResponse } from "@/utils/server";
import type { StoreProfileInput } from "../lib/schemas";

const LATENCY_MS = 600;

type ProfileSaveInput = Omit<StoreProfileInput, "logoFile" | "coverFile">;

function delay(ms: number) {
  if (process.env.NODE_ENV === "production") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PROFILE_STORAGE_KEY = "foodloop_mock_profile";

const defaultProfile: ProfileSaveInput & { lastUpdated?: string } = {
  businessName: "",
  logoUrl: "",
  coverUrl: "",
  businessType: "",
  description: "",
  phone: "",
  email: "",
  preferredLanguage: "ar",
  operatingHours: {
    saturday: { openTime: "", closeTime: "", closed: true },
    sunday: { openTime: "", closeTime: "", closed: true },
    monday: { openTime: "", closeTime: "", closed: true },
    tuesday: { openTime: "", closeTime: "", closed: true },
    wednesday: { openTime: "", closeTime: "", closed: true },
    thursday: { openTime: "", closeTime: "", closed: true },
    friday: { openTime: "", closeTime: "", closed: true },
  },
  disableAutomation: false,
  automationMode: "assisted",
  maxDiscount: 0,
  priceFloorRule: "cost",
  customFloorPercent: 0,
  suggestDonation: false,
  arrangeDelivery: false,
  deliveryNotes: "",
};

function getStoredProfile(): ProfileSaveInput & { lastUpdated?: string } {
  if (typeof window === "undefined") return defaultProfile;
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }
  return JSON.parse(stored);
}

function setStoredProfile(data: ProfileSaveInput & { lastUpdated?: string }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
}

export const getStoreProfile = cache(
  async (): Promise<
    ApiResponse<ProfileSaveInput & { lastUpdated?: string }>
  > => {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      try {
        const res = await getMany<ProfileSaveInput & { lastUpdated?: string }>(
          "/business/profile",
        );
        if (res.data) {
          return { data: res.data };
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "production") {
          const errMsg =
            error instanceof Error
              ? error.message
              : "فشل الاتصال بالخادم، يرجى التحقق من اتصال الشبكة";
          return {
            error: errMsg,
          };
        }
      }
    }

    return { data: getStoredProfile() };
  },
);

export async function updateStoreProfile(
  data: ProfileSaveInput,
): Promise<ApiResponse<{ success: true; lastUpdated: string }>> {
  if (data.maxDiscount > 15) {
    return {
      error: "الحد الأقصى للخصم المسموح به هو 15% (قيد مفروض من الخادم)",
    };
  }

  try {
    const res = await updateOne<{ success: true; lastUpdated: string }>(
      "/business/profile",
      data,
    );
    if (res.data) {
      return { data: res.data };
    }
  } catch (error: unknown) {
    if (process.env.NODE_ENV === "production") {
      const errMsg =
        error instanceof Error
          ? error.message
          : "فشل حفظ إعدادات المتجر على الخادم";
      return {
        error: errMsg,
      };
    }
  }

  await delay(LATENCY_MS);
  const lastUpdated = new Date().toISOString();
  setStoredProfile({ ...data, lastUpdated });
  return { data: { success: true, lastUpdated } };
}
