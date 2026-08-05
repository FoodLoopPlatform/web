import { getMany, updateOne, deleteOne, createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";

// Re-export all domain types from the central types file
export type {
  Consumer,
  Store,
  Charity,
  Review,
  Product,
  TicketReply,
  SupportTicket,
  RawBackendTicket,
  ActivityLog,
  AnalyticsSummary,
  ModerationFlagType,
  ModerationItem,
} from "../types/admin.types";

import type {
  Consumer,
  Store,
  Charity,
  Review,
  Product,
  SupportTicket,
  RawBackendTicket,
  ActivityLog,
  AnalyticsSummary,
  ModerationFlagType,
  ModerationItem,
} from "../types/admin.types";

// ─── Schema Adapter ─────────────────────────────────────────────────────────
// Maps the raw backend ticket shape to the frontend SupportTicket interface.

const PRIORITY_MAP: Record<string, SupportTicket["priority"]> = {
  High: "High",
  Medium: "Medium",
  Low: "Low",
  Normal: "Medium",
  Urgent: "High",
  Critical: "High",
  minor: "Low",
};

const STATUS_MAP: Record<string, SupportTicket["status"]> = {
  Open: "Open",
  Pending: "Pending",
  Closed: "Closed",
  Resolved: "Closed",
  InProgress: "Pending",
  "In Progress": "Pending",
};

function normalizeSupportTicket(raw: RawBackendTicket): SupportTicket {
  return {
    id: raw.id,
    userType: (raw.userType as SupportTicket["userType"]) ?? "Consumer",
    userName: raw.userFullName ?? raw.userName ?? "Unknown User",
    userEmail: raw.userEmail,
    subject: raw.category ?? raw.subject ?? "Support Request",
    description: raw.description ?? raw.category ?? "",
    status: STATUS_MAP[raw.status ?? ""] ?? "Open",
    priority: PRIORITY_MAP[raw.priority ?? ""] ?? "Medium",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt,
    replies: raw.replies ?? [],
  };
}

// ─── Analytics Normalizer ────────────────────────────────────────────────────
// Maps the real backend nested fields to flat UI-friendly fields.

function normalizeAnalytics(raw: AnalyticsSummary): AnalyticsSummary {
  return {
    ...raw,
    totalConsumers: raw.users?.customers ?? raw.totalConsumers ?? 0,
    totalStores: raw.stores?.total ?? raw.totalStores ?? 0,
    pendingStoresCount: raw.stores?.pending ?? raw.pendingStoresCount ?? 0,
    totalCharities: raw.users?.charities ?? raw.totalCharities ?? 0,
    totalProductsListed: raw.listings?.total ?? raw.totalProductsListed ?? 0,
    revenueSavedEGP: raw.totalRevenue ?? raw.revenueSavedEGP ?? 0,
    wasteReducedKg: raw.totalFoodSavings ?? raw.wasteReducedKg ?? 0,
  };
}

function normalizeStore(raw: any): Store {
  const vStatus = raw.verificationStatus || raw.status || "Pending";
  const isVerified = vStatus === "Verified";
  const isPending = vStatus === "Pending" || vStatus === "Unverified";
  const isRejected = vStatus === "Rejected";

  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (isPending) status = "PENDING";
  else if (isRejected || vStatus === "Suspended" || vStatus === "Banned") status = "SUSPENDED";
  else status = "ACTIVE";

  const locationParts = [raw.neighborhood, raw.city, raw.governorate].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : (raw.location || "Cairo, Egypt");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://foodloop.runasp.net";
  const docs = Array.isArray(raw.documents)
    ? raw.documents.map((d: any) => ({
        id: d.id,
        verificationType: d.verificationType,
        documentUrl: d.documentUrl?.startsWith("http") ? d.documentUrl : `${baseUrl}${d.documentUrl}`,
        status: d.status,
        reviewedAt: d.reviewedAt,
      }))
    : [];

  return {
    id: raw.id,
    name: raw.name || raw.ownerName || "Store",
    email: raw.email || raw.ownerEmail || "",
    phone: raw.phone || raw.ownerPhone || "",
    location: locationStr,
    status,
    joinedDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : (raw.joinedDate || "Jan 2024"),
    lastActive: raw.updatedAt ? "Recently" : (raw.lastActive || "Recently"),
    verified: isVerified,
    documents: docs,
    description: raw.description || raw.descriptionAr || "",
    businessCategory: raw.businessCategory || "",
    ownerId: raw.ownerId || "",
    ownerName: raw.ownerName || "",
    ownerEmail: raw.ownerEmail || "",
    ownerPhone: raw.ownerPhone || "",
    governorate: raw.governorate || "",
    city: raw.city || "",
    neighborhood: raw.neighborhood || "",
    street: raw.street || "",
    buildingNo: raw.buildingNo || "",
    latitude: raw.latitude,
    longitude: raw.longitude,
  };
}

function normalizeCharity(raw: any): Charity {
  const vStatus = raw.verificationStatus || raw.status || "Pending";
  const isVerified = vStatus === "Verified";
  const isPending = vStatus === "Pending" || vStatus === "Unverified";
  const isRejected = vStatus === "Rejected";

  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (isPending) status = "PENDING";
  else if (isRejected || vStatus === "Suspended" || vStatus === "Banned") status = "SUSPENDED";
  else status = "ACTIVE";

  const locationParts = [raw.neighborhood, raw.city, raw.governorate].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : (raw.location || "Cairo, Egypt");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://foodloop.runasp.net";
  const docs = Array.isArray(raw.documents)
    ? raw.documents.map((d: any) => ({
        id: d.id,
        verificationType: d.verificationType,
        documentUrl: d.documentUrl?.startsWith("http") ? d.documentUrl : `${baseUrl}${d.documentUrl}`,
        status: d.status,
        reviewedAt: d.reviewedAt,
      }))
    : [];

  return {
    id: raw.id,
    name: raw.name || raw.ownerName || "Charity",
    email: raw.email || raw.ownerEmail || "",
    phone: raw.phone || raw.ownerPhone || "",
    location: locationStr,
    status,
    taxId: raw.taxId || raw.registrationNumber || "TX-0000",
    verified: isVerified,
    joinedDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : (raw.joinedDate || "Dec 2023"),
    lastActive: raw.updatedAt ? "Recently" : (raw.lastActive || "Recently"),
    documents: docs,
    description: raw.description || raw.descriptionAr || "",
    ownerId: raw.ownerId || "",
    ownerName: raw.ownerName || "",
    ownerEmail: raw.ownerEmail || "",
    ownerPhone: raw.ownerPhone || "",
    governorate: raw.governorate || "",
    city: raw.city || "",
    neighborhood: raw.neighborhood || "",
    street: raw.street || "",
    buildingNo: raw.buildingNo || "",
  };
}

function normalizeConsumer(raw: any): Consumer {
  const rawStatus = (raw.status || "Active").toString();
  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (rawStatus === "Suspended" || rawStatus === "Banned" || rawStatus === "SUSPENDED") status = "SUSPENDED";
  else if (rawStatus === "Pending" || rawStatus === "PENDING" || rawStatus === "Unverified") status = "PENDING";
  else status = "ACTIVE";

  return {
    id: raw.id,
    name: raw.fullName || raw.name || raw.userName || "Consumer",
    email: raw.email || "",
    phone: raw.phone || raw.phoneNumber || "",
    location: raw.city ? `${raw.city}, Egypt` : (raw.location || "Cairo, Egypt"),
    status,
    joinedDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : (raw.joinedDate || "Oct 2023"),
    lastActive: raw.updatedAt ? "Recently" : (raw.lastActive || "Recently"),
    governorate: raw.governorate || "",
    city: raw.city || "",
    neighborhood: raw.neighborhood || "",
    street: raw.street || "",
    buildingNo: raw.buildingNo || "",
  };
}

// ─── API Functions ───────────────────────────────────────────────────────────

/** GET /admin/stores */
export function getAdminStores() {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<any[]>(
      getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.stores, { token })
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeStore) };
    }
    return { ...res, data: res.data as any };
  });
}

/** GET /admin/stores/pending */
export function getPendingStores() {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<any[]>(
      getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.storesPending, { token })
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeStore) };
    }
    return { ...res, data: res.data as any };
  });
}

/** PATCH /admin/stores/{id}/verify */
export function verifyStore(id: string, action: "Approved" | "Rejected" = "Approved", note?: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, { action: string; note?: string }>(
        Endpoints.admin.verifyStore(id),
        { action, note },
        { token }
      )
    )
  );
}

/** PATCH /admin/charities/{id}/verify */
export function verifyCharity(id: string, action: "Approved" | "Rejected" = "Approved", note?: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<Charity>(
      updateOne<FoodLoopEnvelope<Charity>, { action: string; note?: string }>(
        Endpoints.admin.verifyCharity(id),
        { action, note },
        { token }
      )
    )
  );
}

import { updateMockUserStatus } from "./user-detail-api";

/** PATCH /admin/users/{id}/status or /users/{id} */
export function updateUserStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "PENDING", reason?: string) {
  const backendStatus = status === "SUSPENDED" ? "Suspended" : "Active";
  return withAuth(async (token) => {
    updateMockUserStatus(id, status);
    const res = await unwrapEnvelope<{ id: string; status: string }>(
      updateOne<FoodLoopEnvelope<{ id: string; status: string }>, { status: string; reason?: string; note?: string }>(
        Endpoints.admin.userStatus(id),
        { status: backendStatus, reason, note: reason },
        { token }
      )
    );
    if (res.error) {
      return unwrapEnvelope<{ id: string; status: string }>(
        updateOne<FoodLoopEnvelope<{ id: string; status: string }>, { status: string; reason?: string; note?: string }>(
          Endpoints.admin.userById(id),
          { status: backendStatus, reason, note: reason },
          { token }
        )
      );
    }
    return res;
  });
}

/** GET /admin/users/{id}/activity-log */
export function getUserActivityLog(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(Endpoints.admin.userActivityLog(id), { token })
    )
  );
}

/** GET /admin/analytics/summary */
export function getAnalyticsSummary() {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<AnalyticsSummary>(
      getMany<FoodLoopEnvelope<AnalyticsSummary>>(Endpoints.admin.analyticsSummary, { token })
    );
    if (result.data) {
      return { data: normalizeAnalytics(result.data) };
    }
    return result;
  });
}

/** GET /admin/charities */
export function getAdminCharities() {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<any[]>(
      getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.charities, { token })
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeCharity) };
    }
    return { ...res, data: res.data as any };
  });
}

/** GET /users?role=Customer */
export function getAdminConsumers() {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<any[]>(
      getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.consumers, { token })
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeConsumer) };
    }
    return { ...res, data: res.data as any };
  });
}

/** GET /admin/reviews?pageNumber=1&pageSize=10&storeId=... */
export function getAdminReviews(params?: { storeId?: string; rating?: number; pageNumber?: number; pageSize?: number }) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.reviews;
    const query = new URLSearchParams();
    if (params?.storeId) query.set("storeId", params.storeId);
    if (params?.rating) query.set("rating", String(params.rating));
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return unwrapEnvelope<Review[]>(
      getMany<FoodLoopEnvelope<Review[]>>(url, { token })
    );
  });
}

/** DELETE /admin/reviews/{id} */
export function deleteReview(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(Endpoints.admin.reviewById(id), undefined, { token })
    )
  );
}

/** GET /admin/products */
export function getAdminProducts() {
  return withAuth(async (token) =>
    unwrapEnvelope<Product[]>(
      getMany<FoodLoopEnvelope<Product[]>>(Endpoints.admin.products, { token })
    )
  );
}

/** DELETE /admin/products/{id} */
export function deleteProduct(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(Endpoints.admin.productById(id), undefined, { token })
    )
  );
}

/** GET /admin/support-tickets?pageNumber=1&pageSize=10&status=...&priority=... */
export function getSupportTickets(params?: {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.supportTickets;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.priority && params.priority !== "ALL") query.set("priority", params.priority);

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<RawBackendTicket[]>(
      getMany<FoodLoopEnvelope<RawBackendTicket[]>>(url, { token })
    );
    if (result.data && Array.isArray(result.data)) {
      return { data: result.data.map(normalizeSupportTicket) };
    }
    return { data: [] as SupportTicket[] };
  });
}

/** GET /admin/support-tickets/{id} */
export function getSupportTicketById(id: string) {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<RawBackendTicket>(
      getMany<FoodLoopEnvelope<RawBackendTicket>>(Endpoints.admin.supportTicketById(id), { token })
    );
    if (result.data) {
      return { data: normalizeSupportTicket(result.data) };
    }
    return { data: null as SupportTicket | null };
  });
}

/** POST /admin/support-tickets/{id}/reply */
export function replyToSupportTicket(id: string, message: string) {
  return withAuth(async (token) => {
    // Try sending raw string body as required by OpenAPI spec
    let res = await unwrapEnvelope<RawBackendTicket>(
      createOne<FoodLoopEnvelope<RawBackendTicket>, string>(
        Endpoints.admin.replySupportTicket(id),
        message,
        { token }
      )
    );
    if (res.error) {
      // Fallback to object payload { message }
      res = await unwrapEnvelope<RawBackendTicket>(
        createOne<FoodLoopEnvelope<RawBackendTicket>, { message: string }>(
          Endpoints.admin.replySupportTicket(id),
          { message },
          { token }
        )
      );
    }
    if (res.data) {
      return { data: normalizeSupportTicket(res.data) };
    }
    return { error: res.error || "Failed to post reply" };
  });
}

/** PATCH /admin/support-tickets/{id}/close */
export function closeSupportTicket(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<SupportTicket>(
      updateOne<FoodLoopEnvelope<SupportTicket>, Record<string, never>>(
        Endpoints.admin.closeSupportTicket(id),
        {},
        { token }
      )
    )
  );
}

// ─── Moderation Queue Mock API ───────────────────────────────────────────────

const SAMPLE_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: "mod-1",
    productNameAr: "عسل الجبل البري الذهبي",
    productNameEn: "Wildflower Gold Honey",
    storeNameAr: "مزرعة المروج الخضراء",
    storeNameEn: "Sun-Drenched Meadows Farm",
    imageUrl: "https://images.pexels.com/photos/33260/honey-sweet-glass-jar.jpg?auto=compress&cs=tinysrgb&w=600",
    aiConfidence: 65,
    flags: ["user_report", "unverified_origin"],
    flagReasonQuoteAr: "أبلغ أحد المستخدمين عن احتمال وجود معلومات مضللة بشأن حالة شهادة العضوية.",
    flagReasonQuoteEn: "User reported possible misleading labeling regarding organic certification status.",
    createdAt: "2026-08-05T10:15:00Z",
  },
  {
    id: "mod-2",
    productNameAr: "خبز التخمير الطبيعي اليدوي",
    productNameEn: "Artisan Heritage Sourdough",
    storeNameAr: "مخبز الحقل والفرن",
    storeNameEn: "Hearth & Soil Bakery",
    imageUrl: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiConfidence: 32,
    flags: ["low_ai_confidence", "duplicate_listing"],
    flagReasonQuoteAr: "رصد الذكاء الاصطناعي تشابهاً عالياً مع القائمة رقم #4928 من نفس البائع. احتمال محتوى مكرر.",
    flagReasonQuoteEn: "AI flagged high similarity to listing #4928 from the same vendor. Possible spam.",
    createdAt: "2026-08-05T11:00:00Z",
  },
  {
    id: "mod-3",
    productNameAr: "فراولة طازجة عضوية ممتاز",
    productNameEn: "Fresh Organic Strawberries",
    storeNameAr: "عضويات وادي النيل",
    storeNameEn: "Nile Valley Organics",
    imageUrl: "https://images.pexels.com/photos/89778/strawberries-frisch-ripe-sweet-89778.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiConfidence: 89,
    flags: ["low_ai_confidence"],
    flagReasonQuoteAr: "سعر الكيلو أقل بنسبة 40٪ من متوسط سعر السوق لفراولة الدرجة العضوية.",
    flagReasonQuoteEn: "Price per kg is 40% below market average for organic grade strawberries.",
    createdAt: "2026-08-05T12:30:00Z",
  },
  {
    id: "mod-4",
    productNameAr: "جبن ماعز بالأعشاب الريفية",
    productNameEn: "Herbed Goat Cheese",
    storeNameAr: "أجبان الفيوم الريفية",
    storeNameEn: "Fayoum Dairy Artisans",
    imageUrl: "https://images.pexels.com/photos/773253/pexels-photo-773253.jpeg?auto=compress&cs=tinysrgb&w=600",
    aiConfidence: 71,
    flags: ["user_report", "duplicate_listing"],
    flagReasonQuoteAr: "تبدو صورة الغلاف مستخدمة سابقاً في قائمة منتهية الصلاحية.",
    flagReasonQuoteEn: "Packaging photo appears reused from a previous expired listing.",
    createdAt: "2026-08-05T13:45:00Z",
  },
];

let mockModerationStore: ModerationItem[] = [...SAMPLE_MODERATION_ITEMS];

/** GET /admin/moderation */
export function getModerationQueue(params?: {
  search?: string;
  flagType?: string;
  minConfidence?: number;
  maxConfidence?: number;
}) {
  return withAuth(async (token) => {
    // Attempt real API call first
    let url = Endpoints.admin.moderation;
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.flagType && params.flagType !== "ALL") query.set("flagType", params.flagType);

    const queryString = query.toString();
    if (queryString) url += `?${queryString}`;

    const res = await unwrapEnvelope<ModerationItem[]>(
      getMany<FoodLoopEnvelope<ModerationItem[]>>(url, { token })
    );

    if (res.data && Array.isArray(res.data)) {
      return { data: res.data };
    }

    // Fallback to in-memory mock store
    let filtered = [...mockModerationStore];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productNameAr.toLowerCase().includes(q) ||
          item.productNameEn.toLowerCase().includes(q) ||
          item.storeNameAr.toLowerCase().includes(q) ||
          item.storeNameEn.toLowerCase().includes(q) ||
          item.flagReasonQuoteAr.toLowerCase().includes(q) ||
          item.flagReasonQuoteEn.toLowerCase().includes(q) ||
          (item.productName && item.productName.toLowerCase().includes(q))
      );
    }
    if (params?.flagType && params.flagType !== "ALL") {
      filtered = filtered.filter((item) => item.flags.includes(params.flagType as ModerationFlagType));
    }
    if (params?.minConfidence !== undefined) {
      filtered = filtered.filter((item) => item.aiConfidence >= (params.minConfidence ?? 0));
    }
    if (params?.maxConfidence !== undefined) {
      filtered = filtered.filter((item) => item.aiConfidence <= (params.maxConfidence ?? 100));
    }

    return { data: filtered };
  });
}

/** POST /admin/moderation/{id}/approve */
export function approveModerationItem(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>, Record<string, never>>(
        Endpoints.admin.moderationApprove(id),
        {},
        { token }
      )
    );
    // Optimistic / mock update
    mockModerationStore = mockModerationStore.filter((item) => item.id !== id);
    return res.error ? { data: undefined } : res;
  });
}

/** POST /admin/moderation/{id}/reject */
export function rejectModerationItem(id: string, reason?: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>, { reason?: string }>(
        Endpoints.admin.moderationReject(id),
        { reason },
        { token }
      )
    );
    // Optimistic / mock update
    mockModerationStore = mockModerationStore.filter((item) => item.id !== id);
    return res.error ? { data: undefined } : res;
  });
}

/** POST /admin/moderation/{id}/request-changes */
export function requestChangesModerationItem(id: string, notes?: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>, { notes?: string }>(
        Endpoints.admin.moderationRequestChanges(id),
        { notes },
        { token }
      )
    );
    // Optimistic / mock update
    mockModerationStore = mockModerationStore.filter((item) => item.id !== id);
    return res.error ? { data: undefined } : res;
  });
}

/** Reset mock queue for testing / refresh CTA */
export function resetModerationQueue() {
  mockModerationStore = [...SAMPLE_MODERATION_ITEMS];
  return { data: mockModerationStore };
}

