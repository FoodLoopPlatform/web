import { getMany, type ApiResponse } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withServerAuth } from "@/utils/server-api-client";
import type { UserDetail, UserActivityEntry } from "../types/admin.types";
import { RawDoc } from "./admin-normalizers";

type RawRecord = Record<string, unknown>;

export function getUserDetailServer(
  id: string,
): Promise<ApiResponse<UserDetail>> {
  return withServerAuth<UserDetail>(async (token) => {
    const userRes = await unwrapEnvelope<RawRecord>(
      getMany<FoodLoopEnvelope<RawRecord>>(Endpoints.admin.userById(id), {
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
      const storeRes = await unwrapEnvelope<RawRecord>(
        getMany<FoodLoopEnvelope<RawRecord>>(Endpoints.admin.storeById(id), {
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
    const result = await unwrapEnvelope<RawRecord[]>(
      getMany<FoodLoopEnvelope<RawRecord[]>>(
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
