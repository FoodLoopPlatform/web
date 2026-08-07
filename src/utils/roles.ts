import type { AuthUser } from "./session";

/** Role strings (case-insensitive) that grant access to the /admin area. */
const ADMIN_ROLES = ["admin", "seniorcontroller"];

/** The route each role lands on when it strays onto the other role's pages. */
export const ADMIN_HOME_ROUTE = "/admin";
export const STORE_HOME_ROUTE = "/dashboard";

export function isAdminUser(user: AuthUser | null | undefined): boolean {
  return (
    user?.roles?.some((role) => ADMIN_ROLES.includes(role.toLowerCase())) ??
    false
  );
}
