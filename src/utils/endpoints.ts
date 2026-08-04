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
    products: "/stores/me/products",
    productById: (id: string) => `/stores/me/products/${id}`,
    productImages: (id: string) => `/stores/me/products/${id}/images`,
    productsBulk: "/stores/me/products/bulk",
  },

  admin: {
    products: "/admin/products",
    productById: (id: string) => `/admin/products/${id}`,
  },

  charities: {
    me: "/charities/me",
    documents: "/charities/me/documents",
  },
};
