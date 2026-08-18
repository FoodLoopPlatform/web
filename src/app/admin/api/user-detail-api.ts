import { getMany, updateOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  UserDetail,
  UserActivityEntry,
  StoreDocument,
} from "../types/admin.types";

export type { UserDetail, UserActivityEntry };

interface RawUserObj {
  id?: string;
  name?: string;
  fullName?: string;
  ownerName?: string;
  email?: string;
  ownerEmail?: string;
  phone?: string;
  phoneNumber?: string;
  ownerPhone?: string;
  location?: string;
  status?: string;
  role?: string;
  userType?: string;
  avatar?: string;
  logo?: string;
  logoUrl?: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  imageUrl?: string;
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
  joinedDate?: string;
  lastActive?: string;
  documents?: Record<string, unknown>[];
  description?: string;
  descriptionAr?: string;
  businessCategory?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
  taxId?: string;
  registrationNumber?: string;
  totalOrders?: number;
  ordersCount?: number;
  totalSpent?: number | string;
  savedAmount?: number | string;
  activeDisputes?: number;
  disputesCount?: number;
  totalSales?: number | string;
  fulfillmentRate?: number;
  donationsReceived?: number;
  donationsCount?: number;
  revenue?: number | string;
  totalRevenue?: number | string;
  orders?: number;
  purchasesCount?: number;
}

function extractStoreStats(u: RawUserObj) {
  const sales = u.totalSales ?? u.totalRevenue ?? u.revenue;
  return {
    totalSales: sales !== undefined ? String(sales) : "EGP 0",
    fulfillmentRate: u.fulfillmentRate ?? 100,
    activeDisputes: u.activeDisputes ?? u.disputesCount ?? 0,
  };
}

function extractCharityStats(u: RawUserObj) {
  return {
    donationsReceived: u.donationsReceived ?? u.donationsCount ?? 0,
    activeDisputes: u.activeDisputes ?? u.disputesCount ?? 0,
  };
}

function extractConsumerStats(u: RawUserObj) {
  return {
    totalOrders: u.totalOrders ?? u.ordersCount ?? u.orders ?? u.purchasesCount ?? 0,
    savedAmount:
      u.savedAmount !== undefined
        ? String(u.savedAmount)
        : u.totalSpent !== undefined
          ? String(u.totalSpent)
          : "EGP 0",
    activeDisputes: u.activeDisputes ?? u.disputesCount ?? 0,
  };
}

export function getUserDetail(id: string): Promise<ApiResponse<UserDetail>> {
  return withAuth<UserDetail>(async (token) => {
    // Single lookup: GET /users/{id}
    const userRes = await unwrapEnvelope<RawUserObj>(
      getMany<FoodLoopEnvelope<RawUserObj>>(Endpoints.admin.userById(id), {
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

      const realStats =
        role === "Store"
          ? extractStoreStats(u)
          : role === "Charity"
            ? extractCharityStats(u)
            : extractConsumerStats(u);

      const rawDocs = Array.isArray(u.documents)
        ? (u.documents as Record<string, unknown>[])
        : [];
      const baseUrl = Endpoints.baseUrl;
      const normalizedDocs: StoreDocument[] = rawDocs.map((d) => ({
        id: String(d.id || `doc-${Math.random()}`),
        verificationType: String(d.verificationType || d.type || "Document"),
        documentUrl: d.documentUrl
          ? String(d.documentUrl).startsWith("http")
            ? String(d.documentUrl)
            : `${baseUrl}${String(d.documentUrl).startsWith("/") ? "" : "/"}${d.documentUrl}`
          : "",
        status: String(d.status || "Pending"),
        reviewedAt: d.reviewedAt ? String(d.reviewedAt) : undefined,
      }));

      const rawAvatar =
        u.avatar ??
        u.logo ??
        u.logoUrl ??
        u.avatarUrl ??
        u.profileImageUrl ??
        u.imageUrl ??
        u.picture;
      let avatar: string | undefined = undefined;
      if (
        rawAvatar &&
        typeof rawAvatar === "string" &&
        rawAvatar.trim() !== ""
      ) {
        avatar = rawAvatar.startsWith("http")
          ? rawAvatar
          : `${baseUrl}${rawAvatar.startsWith("/") ? "" : "/"}${rawAvatar}`;
      }

      const userDetail: UserDetail = {
        id: String(u.id || id),
        name: String(u.name ?? u.fullName ?? u.ownerName ?? "User"),
        email: String(u.email ?? u.ownerEmail ?? ""),
        phone: String(u.phone ?? u.phoneNumber ?? u.ownerPhone ?? "N/A"),
        location: String(
          u.location ??
            ([u.neighborhood, u.city, u.governorate]
              .filter(Boolean)
              .join(", ") ||
              "Egypt"),
        ),
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
        avatar,
        stats: realStats,
        documents: normalizedDocs,
        description: u.description
          ? String(u.description)
          : u.descriptionAr
            ? String(u.descriptionAr)
            : undefined,
        businessCategory: u.businessCategory
          ? String(u.businessCategory)
          : undefined,
        ownerName: u.ownerName ? String(u.ownerName) : undefined,
        ownerEmail: u.ownerEmail ? String(u.ownerEmail) : undefined,
        ownerPhone: u.ownerPhone ? String(u.ownerPhone) : undefined,
        governorate: u.governorate ? String(u.governorate) : undefined,
        city: u.city ? String(u.city) : undefined,
        neighborhood: u.neighborhood ? String(u.neighborhood) : undefined,
        street: u.street ? String(u.street) : undefined,
        buildingNo: u.buildingNo ? String(u.buildingNo) : undefined,
        taxId: u.taxId
          ? String(u.taxId)
          : u.registrationNumber
            ? String(u.registrationNumber)
            : undefined,
      };
      return { data: userDetail };
    }

    // Secondary explicit lookup: if 404, check store endpoint directly
    if (userRes.status === 404) {
      const storeRes = await unwrapEnvelope<RawUserObj>(
        getMany<FoodLoopEnvelope<RawUserObj>>(Endpoints.admin.storeById(id), {
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
          stats: extractStoreStats(store),
          documents: store.documents as StoreDocument[] | undefined,
          description: store.description,
          businessCategory: store.businessCategory,
          ownerName: store.ownerName,
          ownerEmail: store.ownerEmail,
          ownerPhone: store.ownerPhone,
          governorate: store.governorate,
          city: store.city,
          neighborhood: store.neighborhood,
          street: store.street,
          buildingNo: store.buildingNo,
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

interface RawActivityEntry {
  id?: string;
  eventId?: string;
  eventType?: string;
  type?: string;
  title?: string;
  description?: string;
  message?: string;
  occurredAt?: string;
  timestamp?: string;
  createdAt?: string;
  date?: string;
}

function normalizeActivityEntry(
  raw: RawActivityEntry,
  index: number,
): UserActivityEntry {
  const eventTypeStr = (raw.eventType || raw.type || "")
    .toString()
    .toLowerCase();

  let mappedType: UserActivityEntry["type"] = "created";
  if (eventTypeStr.includes("create") || eventTypeStr.includes("register")) {
    mappedType = "created";
  } else if (
    eventTypeStr.includes("suspend") ||
    eventTypeStr.includes("reject") ||
    eventTypeStr.includes("ban")
  ) {
    mappedType = "suspended";
  } else if (
    eventTypeStr.includes("activat") ||
    eventTypeStr.includes("approve") ||
    eventTypeStr.includes("reactivat")
  ) {
    mappedType = "reactivated";
  } else if (eventTypeStr.includes("verif")) {
    mappedType = "verified";
  } else if (eventTypeStr.includes("order")) {
    mappedType = "order";
  } else if (eventTypeStr.includes("dispute")) {
    mappedType = "dispute";
  } else if (eventTypeStr.includes("list")) {
    mappedType = "listing";
  }

  const rawDate = raw.occurredAt || raw.timestamp || raw.createdAt || raw.date;
  let formattedTime = "Recently";
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) {
        formattedTime = d.toISOString().replace("T", " ").slice(0, 16);
      } else {
        formattedTime = String(rawDate);
      }
    } catch {
      formattedTime = String(rawDate);
    }
  }

  return {
    id: raw.id || raw.eventId || `act-${index}-${Date.now()}`,
    type: mappedType,
    title: raw.title || raw.eventType || "Activity Logged",
    description: raw.description || raw.message || raw.title || "",
    timestamp: formattedTime,
  };
}

export function getUserActivityEntries(
  id: string,
  role: string = "Consumer",
): Promise<ApiResponse<UserActivityEntry[]>> {
  return withAuth<UserActivityEntry[]>(async (token) => {
    let endpoint = Endpoints.admin.userActivityLog(id);
    if (role === "Store") {
      endpoint = Endpoints.admin.storeActivityLog(id);
    } else if (role === "Charity") {
      endpoint = Endpoints.admin.charityActivityLog(id);
    }

    const result = await unwrapEnvelope<RawActivityEntry[]>(
      getMany<FoodLoopEnvelope<RawActivityEntry[]>>(endpoint, { token }),
    );
    if (result.data && Array.isArray(result.data)) {
      return { data: result.data.map(normalizeActivityEntry) };
    }
    return {
      error: result.error || "Failed to load user activity entries",
      status: result.status,
    };
  });
}

export function banUserPermanently(
  userId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return withAuth<{ success: boolean }>(async (token) => {
    const result = await unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>, { status: string }>(
        Endpoints.admin.userStatus(userId),
        { status: "Banned" },
        { token },
      ),
    );
    if (result.error) {
      return { error: result.error, status: result.status };
    }
    return { data: { success: true } };
  });
}
