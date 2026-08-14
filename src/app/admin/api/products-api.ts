import { getMany, deleteOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type { Product } from "../types/admin.types";

/** GET /admin/products */
export function getAdminProducts() {
  return withAuth(async (token) =>
    unwrapEnvelope<Product[]>(
      getMany<FoodLoopEnvelope<Product[]>>(Endpoints.admin.products, { token }),
    ),
  );
}

/** DELETE /admin/products/{id} */
export function deleteProduct(id: string) {
  return withAuth(async (token) =>
    unwrapEnvelope<void>(
      deleteOne<FoodLoopEnvelope<void>>(
        Endpoints.admin.productById(id),
        undefined,
        { token },
      ),
    ),
  );
}
