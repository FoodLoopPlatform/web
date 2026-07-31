export const Endpoints = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://foodloop.runasp.net",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },

  categories: "/categories",

  stores: {
    me: "/stores/me",
    location: "/stores/me/location",
    documents: "/stores/me/documents",
    listings: "/stores/me/listings",
    listingById: (id: string) => `/stores/me/listings/${id}`,
  },

  charities: {
    me: "/charities/me",
    documents: "/charities/me/documents",
  },
};
