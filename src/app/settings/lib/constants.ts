import type { LocationSettingsInput } from "./schemas";

export const emptyLocationSettings: LocationSettingsInput = {
  governorate: "",
  city: "",
  cityArea: "",
  streetAddress: "",
  buildingDetails: "",
  postalCode: "",
  latitude: 0,
  longitude: 0,
  deliveryRadius: 8,
};

export const EGYPTIAN_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "العريش",
  "القليوبية",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "الشرقية",
  "البحيرة",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
] as const;
