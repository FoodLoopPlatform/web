import { cache } from "react";
import { getMany, updateOne, type ApiResponse } from "@/utils/server";
import type { StoreProfileInput, LocationSettingsInput } from "../lib/schemas";

const LATENCY_MS = 600;

type ProfileSaveInput = Omit<StoreProfileInput, "logoFile" | "coverFile">;

function delay(ms: number) {
  if (process.env.NODE_ENV === "production") return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PROFILE_STORAGE_KEY = "foodloop_mock_profile";
const LOCATION_STORAGE_KEY = "foodloop_mock_location";

const defaultProfile: ProfileSaveInput & { lastUpdated?: string } = {
  businessName: "سوبرماركت النيل",
  logoUrl: "",
  coverUrl: "",
  businessType: "Supermarket",
  description:
    "نعمل على تقليل الهدر الغذائي وتوفير المنتجات الطازجة بأسعار مناسبة لأهالي المعادي.",
  phone: "01098765432",
  email: "contact@nilesupermarket.com",
  preferredLanguage: "ar",
  operatingHours: {
    saturday: { openTime: "08:00", closeTime: "23:00", closed: false },
    sunday: { openTime: "08:00", closeTime: "23:00", closed: false },
    monday: { openTime: "08:00", closeTime: "23:00", closed: false },
    tuesday: { openTime: "08:00", closeTime: "23:00", closed: false },
    wednesday: { openTime: "08:00", closeTime: "23:00", closed: false },
    thursday: { openTime: "08:00", closeTime: "23:00", closed: false },
    friday: { openTime: "13:00", closeTime: "23:00", closed: false },
  },
  disableAutomation: false,
  automationMode: "assisted",
  maxDiscount: 15,
  priceFloorRule: "cost",
  customFloorPercent: 50,
  suggestDonation: true,
  arrangeDelivery: false,
  deliveryNotes: "",
  lastUpdated: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
};

const defaultLocation: LocationSettingsInput & { lastUpdated?: string } = {
  governorate: "القاهرة",
  cityArea: "المعادي",
  streetAddress: "شارع 9، أمام محطة مترو المعادي",
  buildingDetails: "برج الزهور، الدور الأرضي، محل رقم 3",
  postalCode: "11728",
  latitude: 29.9602,
  longitude: 31.2569,
  deliveryRadius: 8,
  lastUpdated: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
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

function getStoredLocation(): LocationSettingsInput & { lastUpdated?: string } {
  if (typeof window === "undefined") return defaultLocation;
  const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(defaultLocation));
    return defaultLocation;
  }
  return JSON.parse(stored);
}

function setStoredLocation(
  data: LocationSettingsInput & { lastUpdated?: string },
) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data));
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

export const getLocationSettings = cache(
  async (): Promise<
    ApiResponse<LocationSettingsInput & { lastUpdated?: string }>
  > => {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      try {
        const res = await getMany<
          LocationSettingsInput & { lastUpdated?: string }
        >("/business/location");
        if (res.data) {
          return { data: res.data };
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "production") {
          const errMsg =
            error instanceof Error
              ? error.message
              : "فشل تحميل إعدادات الموقع الجغرافي من الخادم";
          return {
            error: errMsg,
          };
        }
      }
    }

    return { data: getStoredLocation() };
  },
);

export async function updateLocationSettings(
  data: LocationSettingsInput,
): Promise<ApiResponse<{ success: true; lastUpdated: string }>> {
  if (
    data.latitude < 22 ||
    data.latitude > 32 ||
    data.longitude < 25 ||
    data.longitude > 37
  ) {
    return { error: "الإحداثيات يجب أن تكون ضمن الحدود الجغرافية لمصر" };
  }

  try {
    const res = await updateOne<{ success: true; lastUpdated: string }>(
      "/business/location",
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
          : "فشل حفظ إعدادات الموقع الجغرافي على الخادم";
      return {
        error: errMsg,
      };
    }
  }

  await delay(LATENCY_MS);
  const lastUpdated = new Date().toISOString();
  setStoredLocation({ ...data, lastUpdated });
  return { data: { success: true, lastUpdated } };
}
