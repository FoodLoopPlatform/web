import type { BusinessCategory } from "@/app/register/api/types";

export type StoreVerificationStatus = "Unverified" | "Verified" | "Rejected";

export type StoreDocumentStatus = "Pending" | "Verified" | "Rejected";

export type StoreDocument = {
  id: string;
  verificationType: string;
  documentUrl: string;
  status: StoreDocumentStatus;
};

export type Store = {
  id: string;
  name: string;
  nameAr: string | null;
  businessCategory: BusinessCategory;
  description: string | null;
  descriptionAr: string | null;
  logo: string | null;
  phone: string | null;
  email: string | null;
  openingHours: string | null;
  governorate: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  buildingNo: string | null;
  latitude: number | null;
  longitude: number | null;
  verificationStatus: StoreVerificationStatus;
  documents: StoreDocument[];
};

export type UpdateStoreLocationPayload = {
  governorate: string;
  city: string;
  neighborhood: string;
  street: string;
  buildingNo: string | null;
  latitude: number | null;
  longitude: number | null;
};

/** Request body for PATCH /stores/me — all fields optional. */
export type UpdateStoreProfilePayload = {
  name?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  businessCategory?: BusinessCategory;
  logo?: string | null;
  phone?: string;
  email?: string;
  openingHours?: string | null;
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

/** Maps the settings form's businessTypesList values back to the API's BusinessCategory enum. */
export const formValueToBusinessCategory: Record<
  string,
  BusinessCategory | undefined
> = {
  Supermarket: "Supermarket",
  Restaurant: "Restaurant",
  Bakery: "Bakery",
  Café: "Cafe",
  Hotel: "Hotel",
  "Convenience Store": "ConvenienceStore",
  "Grocery Chain": "GroceryChain",
  Other: undefined,
};
