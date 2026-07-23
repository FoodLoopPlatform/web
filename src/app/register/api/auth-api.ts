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

export function login(payload: LoginPayload) {
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
