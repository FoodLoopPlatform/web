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
  verificationType: "StoreFacilityPhoto" | "CommercialRegistration" | "TaxIdCertificate" | string;
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

export type ModerationFlagType = "user_report" | "unverified_origin" | "low_ai_confidence" | "duplicate_listing";

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

