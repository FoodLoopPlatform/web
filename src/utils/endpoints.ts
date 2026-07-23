export const Endpoints = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://foodloop-api.fly.dev",

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },

  stores: {
    me: "/stores/me",
    location: "/stores/me/location",
  },
};
