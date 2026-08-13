import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";

import type {
  Consumer,
  Store,
  Charity,
  Review,
  SupportTicket,
  RawBackendTicket,
  Dispute,
  AnalyticsSummary,
  ModerationItem,
  AuditLogFilterParams,
  AuditLogFetchResult,
  UserDetail,
  UserActivityEntry,
} from "../types/admin.types";

// ─── Normalizers ─────────────────────────────────────────────────────────────

type RawEntity = Record<string, unknown>;
type RawDoc = {
  id: string;
  verificationType: string;
  documentUrl?: string;
  status: string;
  reviewedAt?: string;
};

function normalizeAnalytics(raw: Partial<AnalyticsSummary>): AnalyticsSummary {
  return {
    wasteReducedKg: raw.wasteReducedKg ?? 8520,
    co2SavedKg: raw.co2SavedKg ?? 18400,
    revenueSavedEGP: raw.revenueSavedEGP ?? 250000,
    activeStoresNow: raw.activeStoresNow ?? 142,
    activeConsumersNow: raw.activeConsumersNow ?? 3890,
    activeCharitiesNow: raw.activeCharitiesNow ?? 28,
  };
}

function normalizeStore(raw: RawEntity): Store {
  const vStatus = raw.verificationStatus || raw.status || "Pending";
  const isVerified = vStatus === "Verified" || vStatus === "Approved";
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
      : (raw.location as string) || "Cairo, Egypt";

  const baseUrl = Endpoints.baseUrl;
  const docs = Array.isArray(raw.documents)
    ? (raw.documents as RawDoc[]).map((d: RawDoc) => ({
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
    id: String(raw.id),
    name: String(raw.name || raw.ownerName || "Store"),
    email: String(raw.email || raw.ownerEmail || ""),
    phone: String(raw.phone || raw.ownerPhone || ""),
    location: locationStr,
    status,
    joinedDate: raw.createdAt
      ? new Date(String(raw.createdAt)).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : String(raw.joinedDate || "Jan 2024"),
    lastActive: raw.updatedAt
      ? "Recently"
      : String(raw.lastActive || "Recently"),
    verified: isVerified,
    documents: docs,
    description: String(raw.description || raw.descriptionAr || ""),
    businessCategory: String(raw.businessCategory || ""),
    ownerId: String(raw.ownerId || ""),
    ownerName: String(raw.ownerName || ""),
    ownerEmail: String(raw.ownerEmail || ""),
    ownerPhone: String(raw.ownerPhone || ""),
    governorate: String(raw.governorate || ""),
    city: String(raw.city || ""),
    neighborhood: String(raw.neighborhood || ""),
    street: String(raw.street || ""),
    buildingNo: String(raw.buildingNo || ""),
    latitude: raw.latitude as number | undefined,
    longitude: raw.longitude as number | undefined,
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
      : String(raw.location || "Cairo, Egypt");

  const baseUrl = Endpoints.baseUrl;
  const docs = Array.isArray(raw.documents)
    ? (raw.documents as RawDoc[]).map((d: RawDoc) => ({
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
    id: String(raw.id),
    name: String(raw.name || raw.ownerName || "Charity"),
    email: String(raw.email || raw.ownerEmail || ""),
    phone: String(raw.phone || raw.ownerPhone || ""),
    location: locationStr,
    status,
    taxId: String(raw.taxId || raw.registrationNumber || "TX-0000"),
    verified: isVerified,
    joinedDate: raw.createdAt
      ? new Date(String(raw.createdAt)).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : String(raw.joinedDate || "Dec 2023"),
    lastActive: raw.updatedAt
      ? "Recently"
      : String(raw.lastActive || "Recently"),
    documents: docs,
    description: String(raw.description || raw.descriptionAr || ""),
    ownerId: String(raw.ownerId || ""),
    ownerName: String(raw.ownerName || ""),
    ownerEmail: String(raw.ownerEmail || ""),
    ownerPhone: String(raw.ownerPhone || ""),
    governorate: String(raw.governorate || ""),
    city: String(raw.city || ""),
    neighborhood: String(raw.neighborhood || ""),
    street: String(raw.street || ""),
    buildingNo: String(raw.buildingNo || ""),
  };
}

function normalizeConsumer(raw: RawEntity): Consumer {
  const rawStatus = String(raw.status || "Active");
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
    id: String(raw.id),
    name: String(raw.fullName || raw.name || raw.userName || "Consumer"),
    email: String(raw.email || ""),
    phone: String(raw.phone || raw.phoneNumber || ""),
    location: raw.city
      ? `${raw.city}, Egypt`
      : String(raw.location || "Cairo, Egypt"),
    status,
    joinedDate: raw.createdAt
      ? new Date(String(raw.createdAt)).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : String(raw.joinedDate || "Oct 2023"),
    lastActive: raw.updatedAt
      ? "Recently"
      : String(raw.lastActive || "Recently"),
    governorate: String(raw.governorate || ""),
    city: String(raw.city || ""),
    neighborhood: String(raw.neighborhood || ""),
    street: String(raw.street || ""),
    buildingNo: String(raw.buildingNo || ""),
  };
}

function normalizeSupportTicket(raw: RawBackendTicket): SupportTicket {
  const PRIORITY_MAP: Record<string, SupportTicket["priority"]> = {
    High: "High",
    Medium: "Medium",
    Low: "Low",
    Normal: "Medium",
    Urgent: "High",
    Critical: "High",
  };

  const STATUS_MAP: Record<string, SupportTicket["status"]> = {
    Pending: "Pending",
    Closed: "Closed",
    Open: "Pending",
    Resolved: "Closed",
  };

  const rawPriority = raw.priority || "Medium";
  const rawStatus = raw.status || "Pending";

  let userType: SupportTicket["userType"] = "Consumer";
  if (raw.userType === "Store" || raw.userType === "Charity") {
    userType = raw.userType;
  }

  const replies = Array.isArray(raw.replies)
    ? raw.replies.map((r) => ({
        id: r.id,
        sender: r.sender === "Admin" ? ("Admin" as const) : ("User" as const),
        message: r.message,
        createdAt: r.createdAt,
      }))
    : [];

  return {
    id: raw.id,
    userType,
    userName: raw.userName || raw.userEmail || "مستخدم منصة فودلوب",
    userEmail: raw.userEmail || "",
    subject: raw.subject || "طلب دعم ومتابعة",
    description: raw.description || raw.subject || "",
    status: STATUS_MAP[rawStatus] || "Pending",
    priority: PRIORITY_MAP[rawPriority] || "Medium",
    createdAt: raw.createdAt || new Date().toISOString(),
    replies,
  };
}

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

// ─── Server Data-Fetching Functions ─────────────────────────────────────────

export function getAnalyticsSummaryServer() {
  return withServerAuth(async (token) => {
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

export function getAdminStoresServer() {
  return withServerAuth<Store[]>(async (token) => {
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

export function getAdminCharitiesServer() {
  return withServerAuth<Charity[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.charities,
        { token },
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

export function getAdminConsumersServer() {
  return withServerAuth<Consumer[]>(async (token) => {
    const res = await unwrapEnvelope<RawEntity[] | { items: RawEntity[] }>(
      getMany<FoodLoopEnvelope<RawEntity[] | { items: RawEntity[] }>>(
        Endpoints.admin.consumers,
        { token },
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

export function getAdminReviewsServer(params?: {
  storeId?: string;
  rating?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withServerAuth(async (token) => {
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

export function getDisputesServer(params?: {
  pageNumber?: number;
  pageSize?: number;
  isResolved?: boolean;
}) {
  return withServerAuth(async (token) => {
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

export function getSupportTicketsServer(params?: {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
}) {
  return withServerAuth(async (token) => {
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

export function getModerationQueueServer(params?: {
  search?: string;
  flagType?: string;
  minConfidence?: number;
  maxConfidence?: number;
  pageNumber?: number;
  pageSize?: number;
}) {
  return withServerAuth(async (token) => {
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
      error: aiRes.error || "Failed to load moderation queue",
      status: aiRes.status,
    };
  });
}

export async function getAuditLogsServer(
  params: AuditLogFilterParams = {},
): Promise<AuditLogFetchResult> {
  return withServerAuth(async (token) => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));

    const res = await unwrapEnvelope<AuditLogFetchResult>(
      getMany<FoodLoopEnvelope<AuditLogFetchResult>>(
        `${Endpoints.admin.userActivityLog("all")}?${query.toString()}`,
        { token },
      ),
    );

    if (res.data) return { data: res.data };
    return {
      data: {
        items: [],
        total: 0,
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 5,
        totalPages: 0,
        stats: {
          activeSessions: 0,
          aiDecisions24h: 0,
          flaggedEvents: 0,
          systemHealthStatus: "Unavailable",
        },
      },
    };
  }).then((res) => res.data!);
}

export function getUserDetailServer(
  id: string,
): Promise<ApiResponse<UserDetail>> {
  return withServerAuth<UserDetail>(async (token) => {
    const userRes = await unwrapEnvelope<RawEntity>(
      getMany<FoodLoopEnvelope<RawEntity>>(Endpoints.admin.userById(id), {
        token,
      }),
    );

    if (userRes.data) {
      const u = userRes.data;
      let st: "ACTIVE" | "SUSPENDED" | "PENDING" = "ACTIVE";
      const rawSt = String(u.status || "ACTIVE").toUpperCase();
      if (rawSt === "SUSPENDED" || rawSt === "BANNED") st = "SUSPENDED";
      else if (rawSt === "PENDING" || rawSt === "UNVERIFIED") st = "PENDING";
      else st = "ACTIVE";

      let role: "Consumer" | "Store" | "Charity" = "Consumer";
      const rawRole = String(u.role || u.userType || "").toLowerCase();
      if (rawRole.includes("store") || rawRole.includes("merchant")) {
        role = "Store";
      } else if (rawRole.includes("charity")) {
        role = "Charity";
      } else {
        role = "Consumer";
      }

      const rawDocs = Array.isArray(u.documents)
        ? (u.documents as RawDoc[])
        : [];
      const baseUrl = Endpoints.baseUrl;
      const normalizedDocs = rawDocs.map((d) => ({
        id: String(d.id || `doc-${Math.random()}`),
        verificationType: String(d.verificationType || "Document"),
        documentUrl: d.documentUrl
          ? String(d.documentUrl).startsWith("http")
            ? String(d.documentUrl)
            : `${baseUrl}${String(d.documentUrl).startsWith("/") ? "" : "/"}${d.documentUrl}`
          : "",
        status: String(d.status || "Pending"),
        reviewedAt: d.reviewedAt ? String(d.reviewedAt) : undefined,
      }));

      const userDetail: UserDetail = {
        id: String(u.id || id),
        name: String(u.name ?? u.fullName ?? u.ownerName ?? "User"),
        email: String(u.email ?? u.ownerEmail ?? ""),
        phone: String(u.phone ?? u.phoneNumber ?? u.ownerPhone ?? "N/A"),
        location: String(u.location ?? "Egypt"),
        joinedDate: u.createdAt
          ? new Date(String(u.createdAt)).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })
          : String(u.joinedDate || "Jan 2024"),
        lastActive: u.updatedAt
          ? "Recently"
          : String(u.lastActive || "Recently"),
        status: st,
        role,
        documents: normalizedDocs,
        stats: {
          totalOrders: 0,
          savedAmount: "EGP 0",
          activeDisputes: 0,
        },
      };
      return { data: userDetail };
    }

    if (userRes.status === 404) {
      const storeRes = await unwrapEnvelope<RawEntity>(
        getMany<FoodLoopEnvelope<RawEntity>>(Endpoints.admin.storeById(id), {
          token,
        }),
      );
      if (storeRes.data) {
        const store = storeRes.data;
        const userDetail: UserDetail = {
          id: String(store.id || id),
          name: String(store.name || store.ownerName || "Store"),
          email: String(store.email || store.ownerEmail || ""),
          phone: String(store.phone || store.ownerPhone || "N/A"),
          location: String(store.location || "Egypt"),
          joinedDate: String(store.joinedDate || "Jan 2024"),
          lastActive: String(store.lastActive || "Recently"),
          status: (store.status as UserDetail["status"]) || "ACTIVE",
          role: "Store",
          stats: {
            totalOrders: 0,
            savedAmount: "EGP 0",
            activeDisputes: 0,
          },
        };
        return { data: userDetail };
      }
    }

    return {
      error: userRes.error || "User not found",
      status: userRes.status || 404,
    };
  });
}

export function getUserActivityEntriesServer(
  id: string,
): Promise<ApiResponse<UserActivityEntry[]>> {
  return withServerAuth<UserActivityEntry[]>(async (token) => {
    const result = await unwrapEnvelope<RawEntity[]>(
      getMany<FoodLoopEnvelope<RawEntity[]>>(
        Endpoints.admin.userActivityLog(id),
        { token },
      ),
    );
    if (result.data && Array.isArray(result.data)) {
      return {
        data: result.data.map((raw, idx) => ({
          id: String(raw.id || `act-${idx}`),
          type: "created",
          title: String(raw.title || "Activity"),
          description: String(raw.description || ""),
          timestamp: String(raw.timestamp || "Recently"),
        })),
      };
    }
    return {
      error: result.error || "Failed to load user activity log",
      status: result.status,
    };
  });
}

export function getAdminNoteServer(
  userId: string,
): Promise<ApiResponse<string>> {
  return withServerAuth<string>(async (token) => {
    const result = await unwrapEnvelope<{ note: string }>(
      getMany<FoodLoopEnvelope<{ note: string }>>(
        Endpoints.admin.userNote(userId),
        { token },
      ),
    );
    if (result.data?.note) {
      return { data: result.data.note };
    }
    if (result.status === 404) {
      return { data: "" };
    }
    return {
      error: result.error || "Failed to load admin note",
      status: result.status,
    };
  });
}
