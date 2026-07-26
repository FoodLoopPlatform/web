import type { BusinessCategory } from "@/app/register/api/types";

export type StoreVerificationStatus = "Unverified" | "Verified" | "Rejected";

export type Store = {
  id: string;
  name: string;
  storeType: string;
  businessCategory: BusinessCategory;
  governorate: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  latitude: number | null;
  longitude: number | null;
  verificationStatus: StoreVerificationStatus;
  documents: unknown[];
};

export type UpdateStoreLocationPayload = {
  governorate: string;
  city: string;
  neighborhood: string;
  street: string;
  latitude: number | null;
  longitude: number | null;
};

/** Maps the API's BusinessCategory enum to the settings form's businessTypesList values. */
export const businessCategoryToFormValue: Record<BusinessCategory, string> = {
  Supermarket: "Supermarket",
  Restaurant: "Restaurant",
  Bakery: "Bakery",
  Cafe: "Café",
  Hotel: "Hotel",
  ConvenienceStore: "Convenience Store",
  GroceryChain: "Grocery Chain",
};
