export const Endpoints = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://foodloop.runasp.net",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },

  stores: {
    me: "/stores/me",
    location: "/stores/me/location",
    documents: "/stores/me/documents",
  },

  charities: {
    me: "/charities/me",
    documents: "/charities/me/documents",
  },
};
