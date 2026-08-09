// ─── Admin Portal Domain Types ─────────────────────────────────────────────

export interface Consumer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
}

export interface StoreDocument {
  id: string;
  verificationType:
    | "StoreFacilityPhoto"
    | "CommercialRegistration"
    | "TaxIdCertificate"
    | string;
  documentUrl: string;
  status: "Pending" | "Approved" | "Rejected" | string;
  reviewedAt?: string | null;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  verified?: boolean;
  documents?: StoreDocument[];
  description?: string;
  businessCategory?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
  latitude?: number;
  longitude?: number;
}

export interface Charity {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  taxId: string;
  verified: boolean;
  joinedDate: string;
  lastActive: string;
  avatar?: string;
  documents?: StoreDocument[];
  description?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
}

export type AdminUserItem = (Consumer | Store | Charity) & {
  automationMode?: string;
  verified?: boolean;
  taxId?: string;
  joinedDate?: string;
};

export interface Review {
  id: string;
  userName: string;
  storeName: string;
  rating: number;
  comment: string;
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  storeName: string;
  price: number;
  discountPrice: number;
  expiryDate: string;
  status: "Available" | "Sold" | "Expired";
}

export interface TicketReply {
  id: string;
  sender: "Admin" | "User" | "System";
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userType: "Consumer" | "Store" | "Charity";
  userName: string;
  userEmail?: string;
  subject: string;
  description: string;
  status: "Open" | "Pending" | "Closed";
  priority: "High" | "Medium" | "Low";
  createdAt: string;
  updatedAt?: string;
  replies: TicketReply[];
}

/** Raw shape returned by the backend — differs from SupportTicket */
export interface RawBackendTicket {
  id: string;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
  category?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  subject?: string;
  userName?: string;
  description?: string;
  userType?: string;
  replies?: TicketReply[];
}

/**
 * A genuine dispute record from GET /admin/disputes — a distinct backend
 * resource from SupportTicket (`/support-tickets`, `/admin/support-tickets`),
 * scoped to admin-only resolution via PATCH /admin/disputes/{id}/resolve.
 */
export interface Dispute {
  id: string;
  orderId?: string;
  raisedByName: string;
  raisedByType?: "Consumer" | "Store" | "Charity";
  reason: string;
  isResolved: boolean;
  adminNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

/**
 * Raw shape returned by GET /admin/disputes — the Swagger spec documents
 * `200: OK` with no response schema, so field names are inferred
 * defensively (same hedge as RawBackendTicket above).
 */
export interface RawDispute {
  id: string;
  orderId?: string;
  userId?: string;
  userName?: string;
  userFullName?: string;
  raisedByName?: string;
  userType?: string;
  reason?: string;
  description?: string;
  message?: string;
  isResolved?: boolean;
  status?: string;
  adminNote?: string;
  note?: string;
  createdAt?: string;
  resolvedAt?: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface AnalyticsSummary {
  /** Nested groups from the real backend response */
  users?: {
    total: number;
    customers: number;
    merchants: number;
    charities: number;
    admins: number;
  };
  stores?: {
    total: number;
    unverified: number;
    pending: number;
    verified: number;
    rejected: number;
  };
  organizations?: {
    pending?: number;
  };
  products?: {
    total?: number;
  };
  listings?: {
    total: number;
    active: number;
    soldOut: number;
    expired: number;
  };
  orders?: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  totalRevenue?: number;
  totalFoodSavings?: number;

  /** Flattened UI-friendly fields derived from backend */
  totalConsumers?: number;
  consumersTrend?: string;
  activeConsumersNow?: number;
  newSignups24h?: number;
  suspendedAccountsCount?: number;

  totalStores?: number;
  storesTrend?: string;
  activeStoresNow?: number;
  pendingStoresCount?: number;

  totalCharities?: number;
  charitiesTrend?: string;
  activeCharitiesNow?: number;
  pendingCharitiesCount?: number;

  totalDisputes?: number;
  openDisputesCount?: number;
  resolvedDisputesCount?: number;

  totalProductsListed?: number;
  wasteReducedKg?: number;
  co2SavedKg?: number;
  revenueSavedEGP?: number;
}

export type ModerationFlagType =
  | "user_report"
  | "unverified_origin"
  | "low_ai_confidence"
  | "duplicate_listing";

export interface ModerationItem {
  id: string;
  productNameAr: string;
  productNameEn: string;
  storeNameAr: string;
  storeNameEn: string;
  imageUrl: string;
  aiConfidence: number; // 0 to 100
  flags: ModerationFlagType[];
  flagReasonQuoteAr: string;
  flagReasonQuoteEn: string;
  createdAt: string;
  productName?: string;
  storeName?: string;
  flagReasonQuote?: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  lastActive: string;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  role: "Consumer" | "Store" | "Charity";
  avatar?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  taxId?: string;
  businessCategory?: string;
  description?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
  documents?: StoreDocument[];
  stats: {
    totalOrders?: number;
    savedAmount?: string;
    activeDisputes?: number;
    totalSales?: string;
    fulfillmentRate?: number;
    donationsReceived?: number;
  };
}

export interface UserActivityEntry {
  id: string;
  type:
    | "order"
    | "dispute"
    | "listing"
    | "verified"
    | "created"
    | "suspended"
    | "reactivated";
  title: string;
  description: string;
  timestamp: string;
}

export interface AdminNote {
  userId: string;
  note: string;
  savedAt: string;
  savedBy: string;
}

export interface TabOption<T extends string = string> {
  id: T;
  label: string;
  badge?: number;
}

export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
}

// ─── Audit Log Domain Types ────────────────────────────────────────────────

export type AuditActionType =
  "Pricing Change" | "Listing Moderation" | "Donation Decision";

export type AuditSeverity = "Low" | "Med" | "High";

export interface AuditLogItem {
  id: string;
  actionType: AuditActionType;
  actorName: string;
  actorRole: "System AI" | "Admin" | "Moderator";
  actorAvatar?: string;
  timestamp: string;
  isoDate: string;
  detailsEn: string;
  detailsAr: string;
  severity: AuditSeverity;
  targetId?: string;
  targetName?: string;
}

export interface AuditLogFilterParams {
  search?: string;
  actionType?: "ALL" | AuditActionType;
  dateRange?: "ALL" | "TODAY" | "7DAYS" | "30DAYS";
  startDate?: string;
  endDate?: string;
  severity?: "ALL" | AuditSeverity;
  page?: number;
  pageSize?: number;
}

export interface AuditLogFetchResult {
  items: AuditLogItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: {
    activeSessions: number;
    aiDecisions24h: number;
    flaggedEvents: number;
    systemHealthStatus: string;
  };
}

// ─── System Settings Domain Types ──────────────────────────────────────────

export interface GlobalAutomationDefaults {
  maxDiscountPerCycle: number; // Hard-clamped 1-15%
  defaultPriceFloorPolicy: "DYNAMIC_AI" | "FIXED_30" | "FIXED_50";
  newBusinessDefaultMode: "Manual" | "Assisted" | "Autonomous";
  autoVerifyStores: boolean;
  bulkUploads: boolean;
}

export type DocumentCategory =
  | "Egyptian Food Safety & Regulations"
  | "Food Handling & Eligibility"
  | "Sales & Demand Patterns"
  | "Partner Inventory Info"
  | "Store & Customer Location Data";

export interface GuidelineDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  version: string;
  lastUpdated: string;
  fileSize: string;
  status: "Draft" | "Published";
  lastRagIndexedAt?: string;
  fileUrl?: string;
}

export type AdminPermission =
  | "can_resolve_disputes"
  | "can_edit_system_caps"
  | "can_ban_users"
  | "can_manage_roles"
  | "can_manage_rag_docs"
  | "can_view_analytics";

export interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  roleTitle: string; // Generic, admin-configurable role title
  status: "ACTIVE" | "INACTIVE";
  lastActive: string;
  permissions: AdminPermission[];
  avatar?: string;
}

export interface SecuritySettings {
  auditLogRetentionDays: 90 | 180 | 365 | -1;
  sessionTimeoutMinutes: number;
}

export interface AiObservabilitySettings {
  promptCacheTtlMinutes: number;
  requestBatchingWindowMs: number;
  sentryAlertThresholdLatencyMs: number;
  sentryErrorRateThresholdPercent: number;
  monthlyApiCostCapEgp: number;
  sentryStatus: "Healthy" | "Degraded" | "Offline";
}
