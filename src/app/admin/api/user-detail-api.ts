import {
  getMany,
  createOne,
  updateOne,
  type ApiResponse,
} from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { Store, Charity, Consumer } from "./admin-api";
import {
  StoreDocument,
  type UserDetail,
  type UserActivityEntry,
  type AdminNote,
} from "../types/admin.types";
import {
  MOCK_NOTES,
  MOCK_USER_DETAILS,
  MOCK_ACTIVITY,
} from "../mocks/user-detail.mock";

export type { StoreDocument, UserDetail, UserActivityEntry, AdminNote };

export function updateMockUserStatus(
  id: string,
  status: "ACTIVE" | "SUSPENDED" | "PENDING",
) {
  if (MOCK_USER_DETAILS[id]) {
    MOCK_USER_DETAILS[id].status = status;
  }
}

type RawUserObj = Record<string, unknown>;

function extractStoreStats(raw: RawUserObj) {
  const stats = raw.stats as Record<string, unknown> | undefined;
  if (stats) {
    const ts = stats.totalSales;
    const fr = stats.fulfillmentRate;
    const ad = stats.activeDisputes;
    return {
      totalSales:
        typeof ts === "number"
          ? `EGP ${ts.toLocaleString()}`
          : ts
            ? ts.toString().startsWith("EGP")
              ? String(ts)
              : `EGP ${ts}`
            : "EGP 0",
      fulfillmentRate:
        typeof fr === "number" ? fr : parseFloat(String(fr)) || 0,
      activeDisputes: typeof ad === "number" ? ad : parseInt(String(ad)) || 0,
    };
  }

  const salesVal =
    raw.totalSales ?? raw.sales ?? raw.revenue ?? raw.totalRevenue;
  let totalSales = "EGP 0";
  if (typeof salesVal === "number") {
    totalSales = `EGP ${salesVal.toLocaleString()}`;
  } else if (typeof salesVal === "string" && salesVal.trim() !== "") {
    totalSales = salesVal.startsWith("EGP") ? salesVal : `EGP ${salesVal}`;
  }

  const rateVal =
    raw.fulfillmentRate ??
    raw.fulfillmentPercentage ??
    raw.orderFulfillmentRate;
  const fulfillmentRate =
    typeof rateVal === "number"
      ? Math.min(100, Math.max(0, rateVal))
      : parseFloat(String(rateVal)) || 0;

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes =
    typeof disputesVal === "number"
      ? disputesVal
      : parseInt(String(disputesVal)) || 0;

  return { totalSales, fulfillmentRate, activeDisputes };
}

function extractCharityStats(raw: RawUserObj) {
  const stats = raw.stats as Record<string, unknown> | undefined;
  if (stats) {
    const dr = stats.donationsReceived;
    const sa = stats.savedAmount;
    const ad = stats.activeDisputes;
    return {
      donationsReceived:
        typeof dr === "number" ? dr : parseInt(String(dr)) || 0,
      savedAmount:
        typeof sa === "number"
          ? `EGP ${sa.toLocaleString()}`
          : sa
            ? sa.toString().startsWith("EGP")
              ? String(sa)
              : `EGP ${sa}`
            : "EGP 0",
      activeDisputes: typeof ad === "number" ? ad : parseInt(String(ad)) || 0,
    };
  }

  const donVal = raw.donationsReceived ?? raw.donationsCount ?? raw.donations;
  const donationsReceived =
    typeof donVal === "number" ? donVal : parseInt(String(donVal)) || 0;

  const savedVal = raw.savedAmount ?? raw.valueSaved ?? raw.totalSavings;
  let savedAmount = "EGP 0";
  if (typeof savedVal === "number") {
    savedAmount = `EGP ${savedVal.toLocaleString()}`;
  } else if (typeof savedVal === "string" && savedVal.trim() !== "") {
    savedAmount = savedVal.startsWith("EGP") ? savedVal : `EGP ${savedVal}`;
  }

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes =
    typeof disputesVal === "number"
      ? disputesVal
      : parseInt(String(disputesVal)) || 0;

  return { donationsReceived, savedAmount, activeDisputes };
}

function extractConsumerStats(raw: RawUserObj) {
  const stats = raw.stats as Record<string, unknown> | undefined;
  if (stats) {
    const to = stats.totalOrders;
    const sa = stats.savedAmount;
    const ad = stats.activeDisputes;
    return {
      totalOrders: typeof to === "number" ? to : parseInt(String(to)) || 0,
      savedAmount:
        typeof sa === "number"
          ? `EGP ${sa.toLocaleString()}`
          : sa
            ? sa.toString().startsWith("EGP")
              ? String(sa)
              : `EGP ${sa}`
            : "EGP 0",
      activeDisputes: typeof ad === "number" ? ad : parseInt(String(ad)) || 0,
    };
  }

  const ordersVal = raw.totalOrders ?? raw.ordersCount ?? raw.orders;
  const totalOrders =
    typeof ordersVal === "number"
      ? ordersVal
      : parseInt(String(ordersVal)) || 0;

  const savedVal = raw.savedAmount ?? raw.amountSaved ?? raw.totalSavings;
  let savedAmount = "EGP 0";
  if (typeof savedVal === "number") {
    savedAmount = `EGP ${savedVal.toLocaleString()}`;
  } else if (typeof savedVal === "string" && savedVal.trim() !== "") {
    savedAmount = savedVal.startsWith("EGP") ? savedVal : `EGP ${savedVal}`;
  }

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes =
    typeof disputesVal === "number"
      ? disputesVal
      : parseInt(String(disputesVal)) || 0;

  return { totalOrders, savedAmount, activeDisputes };
}

export function getUserDetail(id: string): Promise<ApiResponse<UserDetail>> {
  return withAuth<UserDetail>(async (token) => {
    try {
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
        const normalizedDocs = rawDocs.map((d) => ({
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
    } catch {
      // ignore & try next
    }

    // 2. Try single store endpoint GET /admin/stores/{id}
    try {
      const storeRes = await unwrapEnvelope<Store>(
        getMany<FoodLoopEnvelope<Store>>(Endpoints.admin.storeById(id), {
          token,
        }),
      );
      if (storeRes.data) {
        const store = storeRes.data;
        const userDetail: UserDetail = {
          id: store.id,
          name: store.name,
          email: store.email || store.ownerEmail || "",
          phone: store.phone || store.ownerPhone || "N/A",
          location: store.location,
          joinedDate: store.joinedDate || "Jan 2024",
          lastActive: store.lastActive || "Recently",
          status: store.status,
          role: "Store",
          stats: extractStoreStats(store as unknown as RawUserObj),
          documents: store.documents,
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
    } catch {
      // ignore & try next
    }

    // 3. Try fetching all stores and search by ID
    try {
      const storesRes = await unwrapEnvelope<Store[]>(
        getMany<FoodLoopEnvelope<Store[]>>(Endpoints.admin.stores, { token }),
      );
      const foundStore = storesRes.data?.find((s) => s.id === id);
      if (foundStore) {
        return {
          data: {
            id: foundStore.id,
            name: foundStore.name,
            email: foundStore.email || foundStore.ownerEmail || "",
            phone: foundStore.phone || foundStore.ownerPhone || "N/A",
            location: foundStore.location,
            joinedDate: foundStore.joinedDate || "Jan 2024",
            lastActive: foundStore.lastActive || "Recently",
            status: foundStore.status,
            role: "Store",
            stats: extractStoreStats(foundStore as unknown as RawUserObj),
            documents: foundStore.documents,
            description: foundStore.description,
            businessCategory: foundStore.businessCategory,
            ownerName: foundStore.ownerName,
            ownerEmail: foundStore.ownerEmail,
            ownerPhone: foundStore.ownerPhone,
            governorate: foundStore.governorate,
            city: foundStore.city,
            neighborhood: foundStore.neighborhood,
            street: foundStore.street,
            buildingNo: foundStore.buildingNo,
          },
        };
      }
    } catch {
      // ignore
    }

    // 4. Try fetching all charities and search by ID
    try {
      const charitiesRes = await unwrapEnvelope<Charity[]>(
        getMany<FoodLoopEnvelope<Charity[]>>(Endpoints.admin.charities, {
          token,
        }),
      );
      const foundCharity = charitiesRes.data?.find((c) => c.id === id);
      if (foundCharity) {
        return {
          data: {
            id: foundCharity.id,
            name: foundCharity.name,
            email: foundCharity.email || foundCharity.ownerEmail || "",
            phone: foundCharity.phone || foundCharity.ownerPhone || "N/A",
            location: foundCharity.location,
            joinedDate: foundCharity.joinedDate || "Dec 2023",
            lastActive: foundCharity.lastActive || "Recently",
            status: foundCharity.status,
            role: "Charity",
            stats: extractCharityStats(foundCharity as unknown as RawUserObj),
            documents: foundCharity.documents,
            description: foundCharity.description,
            ownerName: foundCharity.ownerName,
            ownerEmail: foundCharity.ownerEmail,
            ownerPhone: foundCharity.ownerPhone,
            governorate: foundCharity.governorate,
            city: foundCharity.city,
            neighborhood: foundCharity.neighborhood,
            street: foundCharity.street,
            buildingNo: foundCharity.buildingNo,
            taxId: foundCharity.taxId,
          },
        };
      }
    } catch {
      // ignore
    }

    // 5. Try fetching all consumers and search by ID
    try {
      const consumersRes = await unwrapEnvelope<Consumer[]>(
        getMany<FoodLoopEnvelope<Consumer[]>>(Endpoints.admin.consumers, {
          token,
        }),
      );
      const foundConsumer = consumersRes.data?.find((c) => c.id === id);
      if (foundConsumer) {
        return {
          data: {
            id: foundConsumer.id,
            name: foundConsumer.name,
            email: foundConsumer.email,
            phone: "+20 (010) 000-0000",
            location: foundConsumer.location,
            joinedDate: foundConsumer.joinedDate || "Oct 2023",
            lastActive: foundConsumer.lastActive || "Recently",
            status: foundConsumer.status,
            role: "Consumer",
            stats: extractConsumerStats(foundConsumer as unknown as RawUserObj),
          },
        };
      }
    } catch {
      // ignore
    }

    // Fallback to local mock data
    const found = MOCK_USER_DETAILS[id] ?? null;
    return { data: found ?? undefined };
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
): Promise<ApiResponse<UserActivityEntry[]>> {
  return withAuth<UserActivityEntry[]>(async (token) => {
    // 1. Try /admin/users/{id}/activity-log
    try {
      const result = await unwrapEnvelope<RawActivityEntry[]>(
        getMany<FoodLoopEnvelope<RawActivityEntry[]>>(
          Endpoints.admin.userActivityLog(id),
          { token },
        ),
      );
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const mapped = result.data.map(normalizeActivityEntry);
        return { data: mapped };
      }
    } catch {
      // API call failed
    }

    // 2. Try /admin/stores/{id}/activity-log
    try {
      const storeRes = await unwrapEnvelope<RawActivityEntry[]>(
        getMany<FoodLoopEnvelope<RawActivityEntry[]>>(
          Endpoints.admin.storeActivityLog(id),
          { token },
        ),
      );
      if (
        storeRes.data &&
        Array.isArray(storeRes.data) &&
        storeRes.data.length > 0
      ) {
        const mapped = storeRes.data.map(normalizeActivityEntry);
        return { data: mapped };
      }
    } catch {
      // API call failed
    }

    // 3. Try /admin/charities/{id}/activity-log
    try {
      const charityRes = await unwrapEnvelope<RawActivityEntry[]>(
        getMany<FoodLoopEnvelope<RawActivityEntry[]>>(
          Endpoints.admin.charityActivityLog(id),
          { token },
        ),
      );
      if (
        charityRes.data &&
        Array.isArray(charityRes.data) &&
        charityRes.data.length > 0
      ) {
        const mapped = charityRes.data.map(normalizeActivityEntry);
        return { data: mapped };
      }
    } catch {
      // API call failed
    }

    // Fallback if endpoint returns empty or is not available in mock mode
    const mockLocal = MOCK_ACTIVITY[id] || [
      {
        id: "X1",
        type: "created" as const,
        title: "Account Created",
        description: "User registered on the FoodLoop platform.",
        timestamp: "2025-10-01 08:00",
      },
    ];
    return { data: mockLocal };
  });
}

export function getAdminNote(userId: string): Promise<ApiResponse<string>> {
  return withAuth<string>(async (token) => {
    try {
      const result = await unwrapEnvelope<{ note: string }>(
        getMany<FoodLoopEnvelope<{ note: string }>>(
          Endpoints.admin.userNote(userId),
          { token },
        ),
      );
      if (result.data?.note) {
        return { data: result.data.note };
      }
    } catch {
      // API call failed
    }

    return { data: MOCK_NOTES[userId] ?? "" };
  });
}

export function saveAdminNote(
  userId: string,
  note: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return withAuth<{ success: boolean }>(async (token) => {
    try {
      await createOne(Endpoints.admin.userNote(userId), { note }, { token });
      MOCK_NOTES[userId] = note;
      return { data: { success: true } };
    } catch {
      MOCK_NOTES[userId] = note;
      return { data: { success: true } };
    }
  });
}

export function banUserPermanently(
  userId: string,
): Promise<ApiResponse<{ success: boolean }>> {
  return withAuth<{ success: boolean }>(async (token) => {
    updateMockUserStatus(userId, "SUSPENDED");
    try {
      await updateOne(
        Endpoints.admin.userStatus(userId),
        { status: "Banned" },
        { token },
      );
      return { data: { success: true } };
    } catch {
      return { data: { success: true } };
    }
  });
}
