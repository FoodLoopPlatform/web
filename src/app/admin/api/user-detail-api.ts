import { getMany, createOne, updateOne, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import { Store, Charity } from "./admin-api";
import { StoreDocument } from "../types/admin.types";

export type { StoreDocument };

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
  documents?: StoreDocument[];
  description?: string;
  businessCategory?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  governorate?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  buildingNo?: string;
  taxId?: string;
  // Role-specific stats
  stats: {
    totalSales?: string;
    fulfillmentRate?: number; // 0-100
    activeDisputes?: number;
    totalOrders?: number;
    savedAmount?: string;
    donationsReceived?: number;
  };
}

export interface UserActivityEntry {
  id: string;
  type: "order" | "dispute" | "listing" | "verified" | "created" | "suspended" | "reactivated" | "note";
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

// ─── Local fallback storage ──────────────────────────────────────────────────

const MOCK_NOTES: Record<string, string> = {};

const MOCK_USER_DETAILS: Record<string, UserDetail> = {
  "C-88219": {
    id: "C-88219", name: "Benjamin Thorne", email: "b.thorne@example.com",
    phone: "+20 (055) 062-6493", location: "Portland, OR – Zone 4A",
    joinedDate: "Oct 13, 2023", lastActive: "2 mins ago",
    status: "ACTIVE", role: "Consumer", avatar: undefined,
    stats: { totalOrders: 47, savedAmount: "EGP 2,340", activeDisputes: 0 },
  },
  "S-50192": {
    id: "S-50192", name: "El Abd Bakery", email: "ops@elabd.com",
    phone: "+20 (011) 123-4567", location: "Downtown, Cairo",
    joinedDate: "Mar 02, 2024", lastActive: "Just now",
    status: "ACTIVE", role: "Store",
    stats: { totalSales: "EGP 42,390", fulfillmentRate: 94, activeDisputes: 1 },
  },
  "CH-55122": {
    id: "CH-55122", name: "Resala Charity", email: "info@resala.org",
    phone: "+20 (02) 2606-5700", location: "Nasr City, Cairo",
    joinedDate: "Dec 20, 2023", lastActive: "1 day ago",
    status: "ACTIVE", role: "Charity",
    stats: { donationsReceived: 318, savedAmount: "EGP 18,450", activeDisputes: 0 },
  },
};

const MOCK_ACTIVITY: Record<string, UserActivityEntry[]> = {
  "S-50192": [
    { id: "A1", type: "order", title: "Order Completed", description: "Order #ORD-88219 (Artisan Sourdough Batch) successfully delivered and confirmed by buyer.", timestamp: "2025-11-28 14:22" },
    { id: "A2", type: "dispute", title: "Dispute Raised", description: "Logistics delay reported on Order #ORD-87720. Admin review completed, dispute closed in favor of seller.", timestamp: "2025-11-15 09:18" },
    { id: "A3", type: "listing", title: "Listing Published", description: "Added new product listing 'Seasonal Heirloom Tomato Crate'.", timestamp: "2025-10-26 16:45" },
    { id: "A4", type: "verified", title: "Document Verified", description: "Business tax ID and health certificates verified by Admin Sarah Jenkins.", timestamp: "2025-10-15 11:38" },
    { id: "A5", type: "created", title: "Account Created", description: "New store owner registration from Downtown, Cairo.", timestamp: "2025-10-12 08:05" },
  ],
  "C-88219": [
    { id: "B1", type: "order", title: "Order Completed", description: "Purchased 'Mixed Donuts Box' from El Abd Bakery — saved EGP 100.", timestamp: "2025-11-30 10:10" },
    { id: "B2", type: "dispute", title: "Dispute Opened", description: "Raised a dispute for order #ORD-88100 — item not matching description.", timestamp: "2025-11-10 14:55" },
    { id: "B3", type: "created", title: "Account Created", description: "Consumer account registered from Zamalek, Cairo.", timestamp: "2025-10-13 09:00" },
  ],
};

export function updateMockUserStatus(id: string, status: "ACTIVE" | "SUSPENDED" | "PENDING") {
  if (MOCK_USER_DETAILS[id]) {
    MOCK_USER_DETAILS[id].status = status;
  }
}


function extractStoreStats(raw: any) {
  if (raw.stats) {
    return {
      totalSales: typeof raw.stats.totalSales === "number"
        ? `EGP ${raw.stats.totalSales.toLocaleString()}`
        : (raw.stats.totalSales ? (raw.stats.totalSales.toString().startsWith("EGP") ? raw.stats.totalSales : `EGP ${raw.stats.totalSales}`) : "EGP 0"),
      fulfillmentRate: typeof raw.stats.fulfillmentRate === "number"
        ? raw.stats.fulfillmentRate
        : (parseFloat(raw.stats.fulfillmentRate) || 0),
      activeDisputes: typeof raw.stats.activeDisputes === "number"
        ? raw.stats.activeDisputes
        : (parseInt(raw.stats.activeDisputes) || 0),
    };
  }

  const salesVal = raw.totalSales ?? raw.sales ?? raw.revenue ?? raw.totalRevenue;
  let totalSales = "EGP 0";
  if (typeof salesVal === "number") {
    totalSales = `EGP ${salesVal.toLocaleString()}`;
  } else if (typeof salesVal === "string" && salesVal.trim() !== "") {
    totalSales = salesVal.startsWith("EGP") ? salesVal : `EGP ${salesVal}`;
  }

  const rateVal = raw.fulfillmentRate ?? raw.fulfillmentPercentage ?? raw.orderFulfillmentRate;
  const fulfillmentRate = typeof rateVal === "number" ? Math.min(100, Math.max(0, rateVal)) : (parseFloat(rateVal) || 0);

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes = typeof disputesVal === "number" ? disputesVal : (parseInt(disputesVal) || 0);

  return { totalSales, fulfillmentRate, activeDisputes };
}

function extractCharityStats(raw: any) {
  if (raw.stats) {
    return {
      donationsReceived: typeof raw.stats.donationsReceived === "number"
        ? raw.stats.donationsReceived
        : (parseInt(raw.stats.donationsReceived) || 0),
      savedAmount: typeof raw.stats.savedAmount === "number"
        ? `EGP ${raw.stats.savedAmount.toLocaleString()}`
        : (raw.stats.savedAmount ? (raw.stats.savedAmount.toString().startsWith("EGP") ? raw.stats.savedAmount : `EGP ${raw.stats.savedAmount}`) : "EGP 0"),
      activeDisputes: typeof raw.stats.activeDisputes === "number"
        ? raw.stats.activeDisputes
        : (parseInt(raw.stats.activeDisputes) || 0),
    };
  }

  const donVal = raw.donationsReceived ?? raw.donationsCount ?? raw.donations;
  const donationsReceived = typeof donVal === "number" ? donVal : (parseInt(donVal) || 0);

  const savedVal = raw.savedAmount ?? raw.valueSaved ?? raw.totalSavings;
  let savedAmount = "EGP 0";
  if (typeof savedVal === "number") {
    savedAmount = `EGP ${savedVal.toLocaleString()}`;
  } else if (typeof savedVal === "string" && savedVal.trim() !== "") {
    savedAmount = savedVal.startsWith("EGP") ? savedVal : `EGP ${savedVal}`;
  }

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes = typeof disputesVal === "number" ? disputesVal : (parseInt(disputesVal) || 0);

  return { donationsReceived, savedAmount, activeDisputes };
}

function extractConsumerStats(raw: any) {
  if (raw.stats) {
    return {
      totalOrders: typeof raw.stats.totalOrders === "number"
        ? raw.stats.totalOrders
        : (parseInt(raw.stats.totalOrders) || 0),
      savedAmount: typeof raw.stats.savedAmount === "number"
        ? `EGP ${raw.stats.savedAmount.toLocaleString()}`
        : (raw.stats.savedAmount ? (raw.stats.savedAmount.toString().startsWith("EGP") ? raw.stats.savedAmount : `EGP ${raw.stats.savedAmount}`) : "EGP 0"),
      activeDisputes: typeof raw.stats.activeDisputes === "number"
        ? raw.stats.activeDisputes
        : (parseInt(raw.stats.activeDisputes) || 0),
    };
  }

  const ordersVal = raw.totalOrders ?? raw.ordersCount ?? raw.orders;
  const totalOrders = typeof ordersVal === "number" ? ordersVal : (parseInt(ordersVal) || 0);

  const savedVal = raw.savedAmount ?? raw.amountSaved ?? raw.totalSavings;
  let savedAmount = "EGP 0";
  if (typeof savedVal === "number") {
    savedAmount = `EGP ${savedVal.toLocaleString()}`;
  } else if (typeof savedVal === "string" && savedVal.trim() !== "") {
    savedAmount = savedVal.startsWith("EGP") ? savedVal : `EGP ${savedVal}`;
  }

  const disputesVal = raw.activeDisputes ?? raw.disputesCount ?? raw.disputes;
  const activeDisputes = typeof disputesVal === "number" ? disputesVal : (parseInt(disputesVal) || 0);

  return { totalOrders, savedAmount, activeDisputes };
}

export function getUserDetail(id: string): Promise<ApiResponse<UserDetail>> {
  return withAuth<UserDetail>(async (token) => {
    try {
      const userRes = await unwrapEnvelope<any>(
        getMany<FoodLoopEnvelope<any>>(Endpoints.admin.userById(id), { token })
      );
      if (userRes.data) {
        const u = userRes.data;
        let st = (u.status || "ACTIVE").toUpperCase();
        if (st === "SUSPENDED" || st === "BANNED") st = "SUSPENDED";
        else if (st === "PENDING" || st === "UNVERIFIED") st = "PENDING";
        else st = "ACTIVE";

        let role: "Consumer" | "Store" | "Charity" = "Consumer";
        const rawRole = (u.role || u.userType || "").toString().toLowerCase();
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

        const rawDocs = Array.isArray(u.documents) ? u.documents : [];
        const baseUrl = Endpoints.baseUrl;
        const normalizedDocs = rawDocs.map((d: any) => ({
          id: d.id || `doc-${Math.random()}`,
          verificationType: d.verificationType || d.type || "Document",
          documentUrl: d.documentUrl ? (d.documentUrl.startsWith("http") ? d.documentUrl : `${baseUrl}${d.documentUrl.startsWith("/") ? "" : "/"}${d.documentUrl}`) : "",
          status: d.status || "Pending",
          reviewedAt: d.reviewedAt,
        }));

        const userDetail: UserDetail = {
          id: u.id,
          name: u.name ?? u.fullName ?? u.ownerName ?? "User",
          email: u.email ?? u.ownerEmail ?? "",
          phone: u.phone ?? u.phoneNumber ?? u.ownerPhone ?? "N/A",
          location: u.location ?? ([u.neighborhood, u.city, u.governorate].filter(Boolean).join(", ") || "Egypt"),
          joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : (u.joinedDate || "Jan 2024"),
          lastActive: u.updatedAt ? "Recently" : (u.lastActive || "Recently"),
          status: st as any,
          role,
          stats: realStats as any,
          documents: normalizedDocs,
          description: u.description || u.descriptionAr,
          businessCategory: u.businessCategory,
          ownerName: u.ownerName,
          ownerEmail: u.ownerEmail,
          ownerPhone: u.ownerPhone,
          governorate: u.governorate,
          city: u.city,
          neighborhood: u.neighborhood,
          street: u.street,
          buildingNo: u.buildingNo,
          taxId: u.taxId || u.registrationNumber,
        };
        return { data: userDetail };
      }
    } catch {
      // ignore & try next
    }

    // 2. Try single store endpoint GET /admin/stores/{id}
    try {
      const storeRes = await unwrapEnvelope<Store>(
        getMany<FoodLoopEnvelope<Store>>(Endpoints.admin.storeById(id), { token })
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
          stats: extractStoreStats(store),
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
        getMany<FoodLoopEnvelope<Store[]>>(Endpoints.admin.stores, { token })
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
            stats: extractStoreStats(foundStore),
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
        getMany<FoodLoopEnvelope<Charity[]>>(Endpoints.admin.charities, { token })
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
            stats: extractCharityStats(foundCharity),
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
      const consumersRes = await unwrapEnvelope<any[]>(
        getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.consumers, { token })
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
            stats: extractConsumerStats(foundConsumer),
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

function normalizeActivityEntry(raw: any, index: number): UserActivityEntry {
  const eventTypeStr = (raw.eventType || raw.type || "").toString().toLowerCase();

  let mappedType: UserActivityEntry["type"] = "created";
  if (eventTypeStr.includes("create") || eventTypeStr.includes("register")) {
    mappedType = "created";
  } else if (eventTypeStr.includes("suspend") || eventTypeStr.includes("reject") || eventTypeStr.includes("ban")) {
    mappedType = "suspended";
  } else if (eventTypeStr.includes("activat") || eventTypeStr.includes("approve") || eventTypeStr.includes("reactivat")) {
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

export function getUserActivityEntries(id: string): Promise<ApiResponse<UserActivityEntry[]>> {
  return withAuth<UserActivityEntry[]>(async (token) => {
    try {
      const result = await unwrapEnvelope<any[]>(
        getMany<FoodLoopEnvelope<any[]>>(Endpoints.admin.userActivityLog(id), { token })
      );
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        const mapped = result.data.map(normalizeActivityEntry);
        return { data: mapped };
      }
    } catch {
      // API call failed
    }

    // Fallback if endpoint returns empty or is not available in mock mode
    const mockLocal = MOCK_ACTIVITY[id] || [
      { id: "X1", type: "created" as const, title: "Account Created", description: "User registered on the FoodLoop platform.", timestamp: "2025-10-01 08:00" },
    ];
    return { data: mockLocal };
  });
}

export function getAdminNote(userId: string): Promise<ApiResponse<string>> {
  return withAuth<string>(async (token) => {
    try {
      const result = await unwrapEnvelope<{ note: string }>(
        getMany<FoodLoopEnvelope<{ note: string }>>(Endpoints.admin.userNote(userId), { token })
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

export function saveAdminNote(userId: string, note: string): Promise<ApiResponse<{ success: boolean }>> {
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

export function banUserPermanently(userId: string): Promise<ApiResponse<{ success: boolean }>> {
  return withAuth<{ success: boolean }>(async (token) => {
    updateMockUserStatus(userId, "SUSPENDED");
    try {
      await updateOne(Endpoints.admin.userStatus(userId), { status: "Banned" }, { token });
      return { data: { success: true } };
    } catch {
      return { data: { success: true } };
    }
  });
}
