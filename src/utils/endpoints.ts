export const Endpoints = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api",

  // Example endpoints
  users: "/users",
  userById: (id: string) => `/users/${id}`,
};
