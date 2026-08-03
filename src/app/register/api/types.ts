export type AccountType = "User" | "Merchant" | "Charity";

export type BusinessCategory =
  | "Supermarket"
  | "Restaurant"
  | "Bakery"
  | "Cafe"
  | "Hotel"
  | "ConvenienceStore"
  | "GroceryChain";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: AccountType;
  businessName: string;
  businessCategory?: BusinessCategory;
};

export type LoginPayload = {
  email: string;
  password: string;
};

/** Maps the register form's business-type values to the API's BusinessCategory enum. */
export const businessCategoryMap: Record<string, BusinessCategory | undefined> =
  {
    supermarket: "Supermarket",
    restaurant: "Restaurant",
    cafe: "Cafe",
    hotel: "Hotel",
    other: undefined,
  };
