import { Endpoints } from "@/utils/endpoints";
import { withAuth } from "@/utils/api-client";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { getMany, updateOne, createOne } from "@/utils/server";

export interface AppNotification {
  id: string;
  title?: string;
  message?: string;
  body?: string;
  isRead: boolean;
  createdAt: string;
  type?: string;
  link?: string;
  referenceId?: string;
}

export async function getNotifications(lang: "ar" | "en" = "ar") {
  return withAuth(async (token) => {
    return unwrapEnvelope<AppNotification[]>(
      getMany<FoodLoopEnvelope<AppNotification[]>>(Endpoints.notifications.base, {
        token,
        headers: { "Accept-Language": lang },
      })
    );
  });
}

export async function markNotificationAsRead(id: string, lang: "ar" | "en" = "ar") {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>>(Endpoints.notifications.read(id), {}, {
        token,
        headers: { "Accept-Language": lang },
      })
    );
  });
}

export async function markAllNotificationsAsRead(lang: "ar" | "en" = "ar") {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      updateOne<FoodLoopEnvelope<void>>(Endpoints.notifications.readAll, {}, {
        token,
        headers: { "Accept-Language": lang },
      })
    );
  });
}

export async function registerDeviceToken(
  deviceToken: string,
  platform: string = "web",
  lang: "ar" | "en" = "ar"
) {
  return withAuth(async (token) => {
    return unwrapEnvelope<void>(
      createOne<FoodLoopEnvelope<void>>(
        Endpoints.notifications.deviceToken,
        { token: deviceToken, platform },
        {
          token,
          headers: { "Accept-Language": lang },
        }
      )
    );
  });
}
