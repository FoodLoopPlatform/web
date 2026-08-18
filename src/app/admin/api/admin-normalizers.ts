import { Endpoints } from "@/utils/endpoints";
import type {
  Consumer,
  Store,
  Charity,
  SupportTicket,
  RawBackendTicket,
  RawBackendDispute,
  Dispute,
  AnalyticsSummary,
  ModerationItem,
  RawActivityLog,
  AuditLogItem,
  AuditSeverity,
  AuditActionType,
} from "../types/admin.types";

export function normalizeActivityLog(raw: RawActivityLog): AuditLogItem {
  const actorRole =
    raw.actorType === "Admin"
      ? "Admin"
      : raw.actorType === "System"
        ? "System AI"
        : "Moderator";

  const rawSev = String(raw.severity || "").toLowerCase();
  let severity: AuditSeverity = "Med";
  if (rawSev.includes("high") || rawSev.includes("critical")) {
    severity = "High";
  } else if (rawSev.includes("low")) {
    severity = "Low";
  } else {
    severity = "Med";
  }

  const isoDate = raw.occurredAt || new Date().toISOString();
  let timestamp = "Recently";
  try {
    const d = new Date(isoDate);
    if (!isNaN(d.getTime())) {
      timestamp = d.toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch {
    timestamp = isoDate;
  }

  const actionTypeStr = raw.title || raw.eventType || "Activity Log";

  return {
    id: String(raw.id || `act-${Math.random()}`),
    actionType: actionTypeStr as AuditActionType,
    actorName: raw.userName || raw.actorType || "System",
    actorRole,
    timestamp,
    isoDate,
    detailsEn: raw.description || raw.title || "",
    detailsAr: raw.description || raw.title || "",
    severity,
    targetId: raw.userId || raw.organizationId || undefined,
    targetName: raw.userName || raw.organizationName || undefined,
  };
}

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

export function normalizeSupportTicket(raw: RawBackendTicket): SupportTicket {
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
    replies: raw.replies ?? (raw as any).messages ?? (raw as any).history ?? [],
  };
}

export function normalizeDisputeToTicket(
  raw: RawBackendDispute,
): SupportTicket {
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

export function normalizeAnalytics(raw: AnalyticsSummary): AnalyticsSummary {
  return {
    ...raw,
    foodWastePreventedKg: raw.foodWastePreventedKg ?? raw.wasteReducedKg ?? 0,
    co2EmissionsSavedKg: raw.co2EmissionsSavedKg ?? raw.co2SavedKg ?? 0,
    financialValueRecovered:
      raw.financialValueRecovered ??
      raw.totalFoodSavings ??
      raw.revenueSavedEGP ??
      0,
    totalConsumers: raw.users?.customers ?? raw.totalConsumers ?? 0,
    totalStores:
      raw.users?.merchants ?? raw.organizations?.total ?? raw.totalStores ?? 0,
    pendingStoresCount:
      raw.organizations?.pending ?? raw.pendingStoresCount ?? 0,
    pendingCharitiesCount: 0,
    totalCharities: raw.users?.charities ?? raw.totalCharities ?? 0,
    totalProductsListed: raw.products?.total ?? raw.totalProductsListed ?? 0,
    revenueSavedEGP:
      raw.totalRevenue ??
      raw.financialValueRecovered ??
      raw.revenueSavedEGP ??
      0,
    wasteReducedKg:
      raw.foodWastePreventedKg ??
      raw.totalFoodSavings ??
      raw.wasteReducedKg ??
      0,
    co2SavedKg: raw.co2EmissionsSavedKg ?? raw.co2SavedKg ?? 0,
  };
}

export interface RawDoc {
  id: string;
  verificationType: string;
  documentUrl: string;
  status: string;
  reviewedAt?: string | null;
}

export interface RawEntity {
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

export function normalizeStore(raw: RawEntity): Store {
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

export function normalizeCharity(raw: RawEntity): Charity {
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

export function normalizeConsumer(raw: RawEntity): Consumer {
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

export function normalizeDispute(raw: Record<string, unknown>): Dispute {
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

export function normalizeProductToModerationItem(
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
    raw.aiConfidenceScore ?? raw.confidenceScore ?? raw.aiConfidence ?? raw.confidenceThreshold ?? raw.confidence ?? raw.aiScore ?? raw.score ?? 75,
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
