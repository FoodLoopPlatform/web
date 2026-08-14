/**
 * A dispute raised against this store, scoped to the authenticated store
 * owner via GET /stores/me/disputes. Mirrors the shape of the admin-side
 * Dispute resource (src/app/admin/types/admin.types.ts) since both surface
 * the same backend entity, just filtered to the caller's own store.
 */
export interface Dispute {
  id: string;
  orderId?: string;
  raisedByName: string;
  raisedByType?: "Consumer" | "Store" | "Charity";
  reason: string;
  isResolved: boolean;
  adminNote?: string;
  createdAt: string;
  resolvedAt?: string;
}
