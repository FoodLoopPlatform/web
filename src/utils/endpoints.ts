const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
if (!baseUrl) {
  throw new Error(
    "Configuration Error: NEXT_PUBLIC_BASE_URL environment variable is missing.",
  );
}

export const Endpoints = {
  baseUrl,

  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    resendVerification: "/auth/resend-verification",
  },

  categories: "/categories",

  stores: {
    me: "/stores/me",
    location: "/stores/me/location",
    documents: "/stores/me/documents",
    products: "/stores/me/products",
    productById: (id: string) => `/stores/me/products/${id}`,
    productImages: (id: string) => `/stores/me/products/${id}/images`,
    productImageById: (id: string, imageId: string) =>
      `/stores/me/products/${id}/images/${imageId}`,
    productsBulk: "/stores/me/products/bulk",
    analytics: "/stores/me/analytics",
    aiSettings: "/stores/me/ai-settings",
  },

  admin: {
    products: "/admin/products",
    productById: (id: string) => `/admin/products/${id}`,
    disputes: "/admin/disputes",
    disputeResolve: (id: string) => `/admin/disputes/${id}/resolve`,
    resolveDispute: (id: string) => `/admin/disputes/${id}/resolve`,
    storesPending: "/admin/stores/pending",
    storeById: (id: string) => `/admin/stores/${id}`,
    userById: (id: string) => `/users/${id}`,
    verifyStore: (id: string) => `/admin/stores/${id}/verify`,
    verifyCharity: (id: string) => `/admin/charities/${id}/verify`,
    userStatus: (id: string) => `/admin/users/${id}/status`,
    userActivityLog: (id: string) => `/admin/users/${id}/activity-log`,
    storeActivityLog: (id: string) => `/admin/stores/${id}/activity-log`,
    charityActivityLog: (id: string) => `/admin/charities/${id}/activity-log`,
    userNote: (id: string) => `/admin/users/${id}/note`,
    banUser: (id: string) => `/admin/users/${id}/ban`,
    analyticsSummary: "/admin/analytics/summary",
    consumers: "/users?role=Customer",
    stores: "/admin/stores",
    charities: "/admin/charities",
    reviews: "/admin/reviews",
    reviewById: (id: string) => `/admin/reviews/${id}`,
    supportTickets: "/admin/support-tickets",
    supportTicketById: (id: string) => `/admin/support-tickets/${id}`,
    replySupportTicket: (id: string) => `/admin/support-tickets/${id}/reply`,
    closeSupportTicket: (id: string) => `/admin/support-tickets/${id}/close`,
    productsPendingAi: "/admin/products/pending-ai",
    approveProduct: (id: string) => `/admin/products/${id}/approve`,
    rejectProduct: (id: string) => `/admin/products/${id}/reject`,
    requestChangesProduct: (id: string) =>
      `/admin/products/${id}/request-changes`,
    activityLogs: "/admin/activity-logs",
    activityLogById: (id: string) => `/admin/activity-logs/${id}`,
  },

  charities: {
    me: "/charities/me",
    documents: "/charities/me/documents",
  },

  // Non-admin "SupportTickets" tag from the live Swagger spec — scoped to
  // the authenticated account, distinct from the /admin/support-tickets
  // moderation endpoints above.
  supportTickets: {
    base: "/support-tickets",
    byId: (id: string) => `/support-tickets/${id}`,
    reply: (id: string) => `/support-tickets/${id}/reply`,
  },
};
