import {
  getMany,
  updateOne,
  deleteOne,
  createOne,
  type ApiResponse,
} from "@/utils/server";
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
  Dispute,
  RawDispute,
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
  RawBackendDispute,
  Dispute,
  RawDispute,
  ActivityLog,
  AnalyticsSummary,
  ModerationItem,
} from "../types/admin.types";
import {
  mockModerationStore,
  filterMockModerationItem,
  resetMockModerationStore,
} from "../mocks/moderation.mock";

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

function normalizeDisputeToTicket(raw: RawBackendDispute): SupportTicket {
  return {
    id: raw.id,
    userType: "Consumer",
    userName: raw.reporterName || "عميل",
    userEmail: undefined,
    subject: raw.productTitle
      ? `${raw.productTitle} (${raw.reason || "نزاع"})`
      : raw.reason || "نزاع حول منتج",
    description: raw.details || raw.reason || "",
    status: raw.isResolved ? "Closed" : "Open",
    priority:
      raw.reason?.toLowerCase().includes("expiry") ||
      raw.reason === "WrongExpiry"
        ? "High"
        : "Medium",
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.resolvedAt || undefined,
    replies: raw.adminNote
      ? [
          {
            id: `note-${raw.id}`,
            sender: "Admin",
            message: raw.adminNote,
            createdAt: raw.resolvedAt || raw.createdAt,
          },
        ]
      : [],
  };
}

// ─── Analytics Normalizer ────────────────────────────────────────────────────
// Maps the real backend nested fields to flat UI-friendly fields.

function normalizeAnalytics(raw: AnalyticsSummary): AnalyticsSummary {
  return {
    ...raw,
    totalConsumers: raw.users?.customers ?? raw.totalConsumers ?? 0,
    totalStores:
      raw.users?.merchants ?? raw.stores?.total ?? raw.totalStores ?? 0,
    pendingStoresCount:
      raw.organizations?.pending ?? raw.pendingStoresCount ?? 0,
    pendingCharitiesCount: 0,
    totalCharities: raw.users?.charities ?? raw.totalCharities ?? 0,
    totalProductsListed:
      raw.products?.total ??
      raw.listings?.total ??
      raw.totalProductsListed ??
      0,
    revenueSavedEGP: raw.totalRevenue ?? raw.revenueSavedEGP ?? 0,
    wasteReducedKg: raw.totalFoodSavings ?? raw.wasteReducedKg ?? 0,
  };
}

interface RawDoc {
  id: string;
  verificationType: string;
  documentUrl: string;
  status: string;
  reviewedAt?: string | null;
}

interface RawEntity {
  id: string;
  name?: string;
  fullName?: string;
  userName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  location?: string;
  verificationStatus?: string;
  status?: string;
  neighborhood?: string;
  city?: string;
  governorate?: string;
  street?: string;
  buildingNo?: string;
  documents?: RawDoc[];
  taxId?: string;
  registrationNumber?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  joinedDate?: string;
  lastActive?: string;
  description?: string;
  descriptionAr?: string;
  businessCategory?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  latitude?: number;
  longitude?: number;
}

function normalizeStore(raw: RawEntity): Store {
  const vStatus = raw.verificationStatus || raw.status || "Pending";
  const isVerified = vStatus === "Verified";
  const isPending = vStatus === "Pending" || vStatus === "Unverified";
  const isRejected = vStatus === "Rejected";

  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (isPending) status = "PENDING";
  else if (isRejected || vStatus === "Suspended" || vStatus === "Banned")
    status = "SUSPENDED";
  else status = "ACTIVE";

  const locationParts = [raw.neighborhood, raw.city, raw.governorate].filter(
    Boolean,
  );
  const locationStr =
    locationParts.length > 0
      ? locationParts.join(", ")
      : raw.location || "Cairo, Egypt";

  const baseUrl = Endpoints.baseUrl;
  const docs = Array.isArray(raw.documents)
    ? raw.documents.map((d: RawDoc) => ({
        id: d.id,
        verificationType: d.verificationType,
        documentUrl: d.documentUrl?.startsWith("http")
          ? d.documentUrl
          : `${baseUrl}${d.documentUrl}`,
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
    joinedDate: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : raw.joinedDate || "Jan 2024",
    lastActive: raw.updatedAt ? "Recently" : raw.lastActive || "Recently",
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

function normalizeCharity(raw: RawEntity): Charity {
  const vStatus = raw.verificationStatus || raw.status || "Pending";
  const isVerified = vStatus === "Verified";
  const isPending = vStatus === "Pending" || vStatus === "Unverified";
  const isRejected = vStatus === "Rejected";

  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (isPending) status = "PENDING";
  else if (isRejected || vStatus === "Suspended" || vStatus === "Banned")
    status = "SUSPENDED";
  else status = "ACTIVE";

  const locationParts = [raw.neighborhood, raw.city, raw.governorate].filter(
    Boolean,
  );
  const locationStr =
    locationParts.length > 0
      ? locationParts.join(", ")
      : raw.location || "Cairo, Egypt";

  const baseUrl = Endpoints.baseUrl;
  const docs = Array.isArray(raw.documents)
    ? raw.documents.map((d: RawDoc) => ({
        id: d.id,
        verificationType: d.verificationType,
        documentUrl: d.documentUrl?.startsWith("http")
          ? d.documentUrl
          : `${baseUrl}${d.documentUrl}`,
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
    joinedDate: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : raw.joinedDate || "Dec 2023",
    lastActive: raw.updatedAt ? "Recently" : raw.lastActive || "Recently",
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

function normalizeConsumer(raw: RawEntity): Consumer {
  const rawStatus = (raw.status || "Active").toString();
  let status: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
  if (
    rawStatus === "Suspended" ||
    rawStatus === "Banned" ||
    rawStatus === "SUSPENDED"
  )
    status = "SUSPENDED";
  else if (
    rawStatus === "Pending" ||
    rawStatus === "PENDING" ||
    rawStatus === "Unverified"
  )
    status = "PENDING";
  else status = "ACTIVE";

  return {
    id: raw.id,
    name: raw.fullName || raw.name || raw.userName || "Consumer",
    email: raw.email || "",
    phone: raw.phone || raw.phoneNumber || "",
    location: raw.city ? `${raw.city}, Egypt` : raw.location || "Cairo, Egypt",
    status,
    joinedDate: raw.createdAt
      ? new Date(raw.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : raw.joinedDate || "Oct 2023",
    lastActive: raw.updatedAt ? "Recently" : raw.lastActive || "Recently",
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
  return withAuth<Store[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.stores,
        { token },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeStore) };
    }
    return { status: res.status, data: [] };
  });
}

/** GET /admin/stores/pending */
export function getPendingStores() {
  return withAuth<Store[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[]>(
      getMany<FoodLoopEnvelope<RawEntity[]>>(Endpoints.admin.storesPending, {
        token,
      }),
    );
    if (res.data && Array.isArray(res.data)) {
      return { ...res, data: res.data.map(normalizeStore) };
    }
    return res as unknown as ApiResponse<Store[]>;
  });
}

/** PATCH /admin/stores/{id}/verify */
export function verifyStore(
  id: string,
  action: "Approved" | "Rejected" = "Approved",
  note?: string,
) {
  return withAuth(async (token) =>
    unwrapEnvelope<Store>(
      updateOne<FoodLoopEnvelope<Store>, { action: string; note?: string }>(
        Endpoints.admin.verifyStore(id),
        { action, note },
        { token },
      ),
    ),
  );
}

/** PATCH /admin/charities/{id}/verify */
export function verifyCharity(
  id: string,
  action: "Approved" | "Rejected" = "Approved",
  note?: string,
) {
  return withAuth(async (token) =>
    unwrapEnvelope<Charity>(
      updateOne<FoodLoopEnvelope<Charity>, { action: string; note?: string }>(
        Endpoints.admin.verifyCharity(id),
        { action, note },
        { token },
      ),
    ),
  );
}

/** PATCH /admin/users/{id}/status or /users/{id} */
export function updateUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING",
  reason?: string,
) {
  const backendStatus = status === "SUSPENDED" ? "Suspended" : "Active";
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<{ id: string; status: string }>(
      updateOne<
        FoodLoopEnvelope<{ id: string; status: string }>,
        { status: string; reason?: string; note?: string }
      >(
        Endpoints.admin.userStatus(id),
        { status: backendStatus, reason, note: reason },
        { token },
      ),
    );
    if (res.error) {
      return unwrapEnvelope<{ id: string; status: string }>(
        updateOne<
          FoodLoopEnvelope<{ id: string; status: string }>,
          { status: string; reason?: string; note?: string }
        >(
          Endpoints.admin.userById(id),
          { status: backendStatus, reason, note: reason },
          { token },
        ),
      );
    }
    return res;
  });
}

/** GET /admin/users/{id}/activity-log */
export function getUserActivityLog(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.userActivityLog(id),
        { token },
      ),
    );
    if (!res.error && res.data && res.data.length > 0) return res;

    const storeRes = await unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.storeActivityLog(id),
        { token },
      ),
    );
    if (!storeRes.error && storeRes.data && storeRes.data.length > 0)
      return storeRes;

    return unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.charityActivityLog(id),
        { token },
      ),
    );
  });
}

/** GET /admin/stores/{id}/activity-log */
export function getStoreActivityLog(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.storeActivityLog(id),
        { token },
      ),
    ),
  );
}

/** GET /admin/charities/{id}/activity-log */
export function getCharityActivityLog(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<ActivityLog[]>(
      getMany<FoodLoopEnvelope<ActivityLog[]>>(
        Endpoints.admin.charityActivityLog(id),
        { token },
      ),
    ),
  );
}

/** GET /admin/analytics/summary */
export function getAnalyticsSummary() {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<AnalyticsSummary>(
      getMany<FoodLoopEnvelope<AnalyticsSummary>>(
        Endpoints.admin.analyticsSummary,
        { token },
      ),
    );
    if (result.data) {
      return { data: normalizeAnalytics(result.data) };
    }
    return result;
  });
}

/** GET /admin/charities */
export function getAdminCharities() {
  return withAuth<Charity[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.charities,
        {
          token,
        },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeCharity) };
    }
    return { status: res.status, data: [] };
  });
}

/** GET /users?role=Customer */
export function getAdminConsumers() {
  return withAuth<Consumer[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.consumers,
        {
          token,
        },
      ),
    );
    const list = Array.isArray(res.data)
      ? res.data
      : (res.data as unknown as { items?: RawEntity[] })?.items;

    if (Array.isArray(list)) {
      return { status: res.status, data: list.map(normalizeConsumer) };
    }
    return { status: res.status, data: [] };
  });
}

export function getAdminReviews(params?: {
  storeId?: string;
  rating?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
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

    const result = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, { token }),
    );

    const rawList = Array.isArray(result.data)
      ? result.data
      : (result.data as Record<string, unknown>)?.items ||
        (result.data as Record<string, unknown>)?.data ||
        (result.data as Record<string, unknown>)?.reviews;

    if (Array.isArray(rawList)) {
      return { data: rawList as Review[] };
    }

    return { data: [] as Review[] };
  });
}

/** DELETE /admin/reviews/{id} */
export function deleteReview(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(
        Endpoints.admin.reviewById(id),
        undefined,
        { token },
      ),
    ),
  );
}

/** GET /admin/products */
export function getAdminProducts() {
  return withAuth(async (token) =>
    unwrapEnvelope<Product[]>(
      getMany<FoodLoopEnvelope<Product[]>>(Endpoints.admin.products, { token }),
    ),
  );
}

/** DELETE /admin/products/{id} */
export function deleteProduct(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(
        Endpoints.admin.productById(id),
        undefined,
        { token },
      ),
    ),
  );
}

/** GET /admin/disputes?pageNumber=1&pageSize=10&isResolved=... */
export function getAdminDisputes(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.disputes;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.isResolved !== undefined)
      query.set("isResolved", String(params.isResolved));

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<RawBackendDispute[]>(
      getMany<FoodLoopEnvelope<RawBackendDispute[]>>(url, { token }),
    );
    if (result.data && Array.isArray(result.data)) {
      return { data: result.data.map(normalizeDisputeToTicket) };
    }
    return { data: [] as SupportTicket[] };
  });
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
    if (params?.status && params.status !== "ALL")
      query.set("status", params.status);
    if (params?.priority && params.priority !== "ALL")
      query.set("priority", params.priority);

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, { token }),
    );

    const rawList = Array.isArray(result.data)
      ? result.data
      : (result.data as Record<string, unknown>)?.items ||
        (result.data as Record<string, unknown>)?.data ||
        (result.data as Record<string, unknown>)?.tickets;

    if (Array.isArray(rawList)) {
      return {
        data: rawList.map((t) => normalizeSupportTicket(t as RawBackendTicket)),
      };
    }

    return { data: [] as SupportTicket[] };
  });
}

/** GET /admin/support-tickets/{id} */
export function getSupportTicketById(id: string) {
  return withAuth(async (token) => {
    const result = await unwrapEnvelope<RawBackendTicket>(
      getMany<FoodLoopEnvelope<RawBackendTicket>>(
        Endpoints.admin.supportTicketById(id),
        { token },
      ),
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
    // 1. Try sending raw string body as required by OpenAPI spec
    let res = await unwrapEnvelope<RawBackendTicket>(
      createOne<FoodLoopEnvelope<RawBackendTicket>, string>(
        Endpoints.admin.replySupportTicket(id),
        message,
        { token },
      ),
    );
    if (res.error) {
      // 2. Fallback to object payload { message }
      res = await unwrapEnvelope<RawBackendTicket>(
        createOne<FoodLoopEnvelope<RawBackendTicket>, { message: string }>(
          Endpoints.admin.replySupportTicket(id),
          { message },
          { token },
        ),
      );
    }
    if (res.data) {
      return { data: normalizeSupportTicket(res.data) };
    }
    return { error: res.error || "Failed to post reply" };
  });
}

/** PATCH /admin/support-tickets/{id}/close */
export function closeSupportTicket(id: string, adminNote?: string) {
  return withAuth(async (token) => {
    return unwrapEnvelope<SupportTicket>(
      updateOne<
        FoodLoopEnvelope<SupportTicket>,
        { note?: string; adminNote?: string }
      >(
        Endpoints.admin.closeSupportTicket(id),
        adminNote ? { note: adminNote, adminNote } : {},
        { token },
      ),
    );
  });
}

function normalizeProductToModerationItem(
  raw: Record<string, unknown>,
): ModerationItem {
  const id = String(
    raw.id ?? `mod-${Math.random().toString(36).substring(2, 9)}`,
  );
  const productNameAr = String(
    raw.nameAr ?? raw.name ?? raw.titleAr ?? raw.title ?? "منتج تحت المراجعة",
  );
  const productNameEn = String(
    raw.nameEn ?? raw.name ?? raw.titleEn ?? raw.title ?? "Pending Product",
  );
  const storeNameAr = String(
    raw.storeNameAr ?? raw.storeName ?? raw.vendorName ?? "متجر شركاء الطعام",
  );
  const storeNameEn = String(
    raw.storeNameEn ?? raw.storeName ?? raw.vendorName ?? "Partner Store",
  );
  const imageUrl = String(
    raw.imageUrl ??
      raw.image ??
      raw.coverImageUrl ??
      "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=600&auto=format&fit=crop",
  );
  const aiConfidence = Number(
    raw.confidenceScore ?? raw.aiConfidence ?? raw.confidenceThreshold ?? 75,
  );

  let flags: ModerationItem["flags"] = ["low_ai_confidence"];
  if (Array.isArray(raw.flags) && raw.flags.length > 0) {
    flags = raw.flags as ModerationItem["flags"];
  } else if (aiConfidence < 50) {
    flags = ["low_ai_confidence", "unverified_origin"];
  } else {
    flags = ["user_report"];
  }

  const flagReasonQuoteAr = String(
    raw.flagReasonAr ??
      raw.reasonAr ??
      raw.aiNote ??
      "مراجعة جودة المنتج وتفاصيل الإدراج بواسطة الذكاء الاصطناعي",
  );
  const flagReasonQuoteEn = String(
    raw.flagReasonEn ??
      raw.reasonEn ??
      raw.aiNote ??
      "AI quality and listing detail review pending",
  );
  const createdAt = String(raw.createdAt ?? new Date().toISOString());

  return {
    id,
    productNameAr,
    productNameEn,
    storeNameAr,
    storeNameEn,
    imageUrl,
    aiConfidence,
    flags,
    flagReasonQuoteAr,
    flagReasonQuoteEn,
    createdAt,
  };
}

// ─── Disputes ───────────────────────────────────────────────────────────────
// A genuine backend resource (/admin/disputes), distinct from SupportTicket.
// Admin-only — there is no non-admin dispute endpoint in the API.

function normalizeDispute(raw: Record<string, unknown>): Dispute {
  const getStr = (val: unknown) =>
    typeof val === "string" || typeof val === "number"
      ? String(val)
      : undefined;
  const id =
    getStr(raw.id) ||
    getStr(raw._id) ||
    `disp-${Math.random().toString(36).substring(2, 7)}`;
  const orderId = getStr(raw.orderId) || getStr(raw.productId);
  const raisedByName =
    getStr(raw.raisedByName) ||
    getStr(raw.reporterName) ||
    getStr(raw.userFullName) ||
    getStr(raw.userName) ||
    getStr(raw.reportedBy) ||
    getStr(raw.userEmail) ||
    "عميل نود";
  const raisedByType =
    (raw.userType as Dispute["raisedByType"]) ||
    (raw.raisedByType as Dispute["raisedByType"]) ||
    "Consumer";
  const reason =
    getStr(raw.reason) ||
    getStr(raw.details) ||
    getStr(raw.description) ||
    getStr(raw.message) ||
    getStr(raw.productTitle) ||
    "طلب مراجعة أو تظلم بشأن طلب";
  const isResolved = Boolean(
    raw.isResolved ?? (raw.status === "Resolved" || raw.status === "Closed"),
  );
  const adminNote = getStr(raw.adminNote) || getStr(raw.note);
  const createdAt = getStr(raw.createdAt) || new Date().toISOString();
  const resolvedAt = getStr(raw.resolvedAt);

  return {
    id,
    orderId,
    raisedByName,
    raisedByType,
    reason,
    isResolved,
    adminNote,
    createdAt,
    resolvedAt,
  };
}

/** GET /admin/disputes?pageNumber=&pageSize=&isResolved= */
export function getDisputes(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withAuth(async (token) => {
    let url = Endpoints.admin.disputes;
    const query = new URLSearchParams();
    if (params?.pageNumber) query.set("pageNumber", String(params.pageNumber));
    if (params?.pageSize) query.set("pageSize", String(params.pageSize));
    if (params?.isResolved !== undefined) {
      query.set("isResolved", String(params.isResolved));
    }

    const queryString = query.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const result = await unwrapEnvelope<unknown>(
      getMany<FoodLoopEnvelope<unknown>>(url, { token }),
    );

    const dataObj = (result.data || {}) as Record<string, unknown>;
    const rawList = Array.isArray(result.data)
      ? result.data
      : Array.isArray(dataObj.items)
        ? dataObj.items
        : Array.isArray(dataObj.data)
          ? dataObj.data
          : Array.isArray(dataObj.disputes)
            ? dataObj.disputes
            : Array.isArray(dataObj.results)
              ? dataObj.results
              : null;

    if (Array.isArray(rawList)) {
      return {
        data: rawList.map((item) =>
          normalizeDispute(item as Record<string, unknown>),
        ),
      };
    }

    return { data: [] as Dispute[] };
  });
}

/** PATCH /admin/disputes/{id}/resolve */
export function resolveDispute(id: string, adminNote: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<RawDispute>(
      updateOne<FoodLoopEnvelope<RawDispute>, { adminNote: string }>(
        Endpoints.admin.resolveDispute(id),
        { adminNote },
        { token },
      ),
    ),
  );
}
export function getModerationQueue(params?: {
  search?: string;
  flagType?: string;
  minConfidence?: number;
  maxConfidence?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withAuth(async (token) => {
    const pendingQuery = new URLSearchParams();
    pendingQuery.set("pageNumber", String(params?.pageNumber ?? 1));
    pendingQuery.set("pageSize", String(params?.pageSize ?? 50));
    if (params?.minConfidence !== undefined) {
      pendingQuery.set(
        "confidenceThreshold",
        String(params.minConfidence / 100),
      );
    }

    const aiRes = await unwrapEnvelope<Record<string, unknown>[]>(
      getMany<FoodLoopEnvelope<Record<string, unknown>[]>>(
        `${Endpoints.admin.productsPendingAi}?${pendingQuery.toString()}`,
        { token },
      ),
    );

    if (aiRes.data && Array.isArray(aiRes.data)) {
      let items = aiRes.data.map(normalizeProductToModerationItem);
      if (params?.flagType && params.flagType !== "ALL") {
        items = items.filter((item) =>
          item.flags.includes(
            params.flagType as ModerationItem["flags"][number],
          ),
        );
      }
      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.productNameAr.toLowerCase().includes(q) ||
            item.productNameEn.toLowerCase().includes(q) ||
            item.storeNameAr.toLowerCase().includes(q) ||
            item.storeNameEn.toLowerCase().includes(q),
        );
      }
      return { data: items };
    }

    return {
      error: aiRes.error || "Failed to fetch moderation queue",
      status: aiRes.status,
    };
  });
}

/** POST /admin/products/{id}/approve */
export function approveModerationItem(id: string) {
  return withAuth(async (token) => {
    const res = await unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>, Record<string, never>>(
        Endpoints.admin.approveProduct(id),
        {},
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

/** PATCH /admin/products/{id}/reject */
export function rejectModerationItem(id: string, reason?: string) {
  return withAuth(async (token) => {
    const noteText = reason || "Rejected by admin";
    const res = await unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>, { note: string }>(
        Endpoints.admin.rejectProduct(id),
        { note: noteText },
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

/** PATCH /admin/products/{id}/request-changes */
export function requestChangesModerationItem(id: string, notes?: string) {
  return withAuth(async (token) => {
    const noteText = notes || "Requested changes by admin";
    const res = await unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>, { note: string }>(
        Endpoints.admin.requestChangesProduct(id),
        { note: noteText },
        { token },
      ),
    );
    if (res.error) {
      return { error: res.error, status: res.status };
    }
    return { data: undefined };
  });
}

export function resetModerationQueue() {
  return getModerationQueue();
}
