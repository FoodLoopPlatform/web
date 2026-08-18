/**
 * A dispute raised against this store, scoped to the authenticated store
 * owner via GET /stores/me/disputes. Mirrors the shape of the admin-side
 * Dispute resource (src/app/admin/types/admin.types.ts) since both surface
 * the same backend entity, just filtered to the caller's own store.
 */
export interface Dispute {
  id: string;
  orderId?: string;
  productId?: string;
  productTitle?: string;
  reportedBy?: string;
  reporterName?: string;
  raisedByName: string;
  raisedByType?: "Consumer" | "Store" | "Charity";
  reason: string;
  details?: string;
  isResolved: boolean;
  adminNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface ResolveStoreDisputePayload {
  merchantNote: string;
  refundAmount?: number;
}
