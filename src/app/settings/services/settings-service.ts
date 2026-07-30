import { cache } from "react";
import { getMany, type ApiResponse } from "@/utils/server";
import {
  getStoredProfile,
  type ProfileSaveInput,
} from "../lib/profile-storage";

export const getStoreProfile = cache(
  async (): Promise<
    ApiResponse<ProfileSaveInput & { lastUpdated?: string }>
  > => {
    if (process.env.NEXT_PUBLIC_USE_REAL_API === "true") {
      try {
        const res = await getMany<ProfileSaveInput & { lastUpdated?: string }>(
          "/business/profile",
        );
        if (res.data) {
          return { data: res.data };
        }
      } catch (error: unknown) {
        if (process.env.NODE_ENV === "production") {
          const errMsg =
            error instanceof Error
              ? error.message
              : "فشل الاتصال بالخادم، يرجى التحقق من اتصال الشبكة";
          return {
            error: errMsg,
          };
        }
      }
    }

    return { data: getStoredProfile() };
  },
);
