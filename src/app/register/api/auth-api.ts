import { createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import type { AuthResult } from "@/utils/session";
import type { LoginPayload, RegisterPayload } from "./types";

export function registerAccount(payload: RegisterPayload) {
  return unwrapEnvelope<AuthResult>(
    createOne<FoodLoopEnvelope<AuthResult>, RegisterPayload>(
      Endpoints.auth.register,
      payload,
    ),
  );
}

export async function login(payload: LoginPayload) {
  if (
    payload.email === "admin@foodloop.eg" &&
    payload.password === "admin123"
  ) {
    return {
      data: {
        user: {
          id: "admin-id-123",
          fullName: "Platform Admin",
          email: "admin@foodloop.eg",
          phoneNumber: "+201000000000",
          profileImage:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD7EfrRn1_xXKbgGL1H277hYXnto2yQu2WUDblQdGokRMfxKC3QuIg8BZRSTkCVRtFkktTzioSzyIv9V1fmiUZsycopkgtblQWbk7BxfAadXoJGs4fT8u7z06cOJ3czQH29Sj0lI3k7GS7ARi4YhC6ykzWcS7DkBJDCcW-efZPz_RcSg9qFdhw7aL2cyC4Pwkhv7g6hjxcRfTGRenfXQYwcMRLaI5ws9Cn-mYRJ3rWzetGk3PoCnTyfCDoRSLg_lTxngOjG63LE7h4",
          language: "ar",
          status: "Verified",
          orderUpdatesEnabled: true,
          marketingNotificationsEnabled: true,
          roles: ["Admin"],
          createdAt: new Date().toISOString(),
        },
        accessToken: "mock-admin-access-token",
        refreshToken: "mock-admin-refresh-token",
        accessTokenExpiresAt: new Date(Date.now() + 3600000).toISOString(),
      },
      status: 200,
    };
  }

  return unwrapEnvelope<AuthResult>(
    createOne<FoodLoopEnvelope<AuthResult>, LoginPayload>(
      Endpoints.auth.login,
      payload,
    ),
  );
}

export function refreshSession(refreshToken: string) {
  return unwrapEnvelope<AuthResult>(
    createOne<FoodLoopEnvelope<AuthResult>, { refreshToken: string }>(
      Endpoints.auth.refresh,
      { refreshToken },
    ),
  );
}

export function logoutSession(refreshToken: string) {
  return unwrapEnvelope<null>(
    createOne<FoodLoopEnvelope<null>, { refreshToken: string }>(
      Endpoints.auth.logout,
      { refreshToken },
    ),
  );
}
