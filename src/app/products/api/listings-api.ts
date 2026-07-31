import { getMany, createOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  Category,
  CreateProductListingRequest,
  ProductListing,
  GetListingsQueryParams,
} from "./types";

/**
 * Fetch list of available food categories from GET /categories
 */
export function getCategories() {
  return unwrapEnvelope<Category[]>(
    getMany<FoodLoopEnvelope<Category[]>>(Endpoints.categories),
  );
}

/**
 * Create a new product listing via POST /stores/me/listings
 */
export function createProductListing(payload: CreateProductListingRequest) {
  return withAuth((token) =>
    unwrapEnvelope<ProductListing>(
      createOne<FoodLoopEnvelope<ProductListing>, CreateProductListingRequest>(
        Endpoints.stores.listings,
        payload,
        { token },
      ),
    ),
  );
}

/**
 * Fetch all merchant listings via GET /stores/me/listings
 */
export function getMerchantListings(params?: GetListingsQueryParams) {
  const queryParts: string[] = [];
  if (params?.pageNumber) queryParts.push(`pageNumber=${params.pageNumber}`);
  if (params?.pageSize) queryParts.push(`pageSize=${params.pageSize}`);
  if (params?.categoryId)
    queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
  if (params?.status)
    queryParts.push(`status=${encodeURIComponent(params.status)}`);
  if (params?.searchTerm)
    queryParts.push(`searchTerm=${encodeURIComponent(params.searchTerm)}`);

  const url =
    queryParts.length > 0
      ? `${Endpoints.stores.listings}?${queryParts.join("&")}`
      : Endpoints.stores.listings;

  return withAuth((token) =>
    unwrapEnvelope<ProductListing[]>(
      getMany<FoodLoopEnvelope<ProductListing[]>>(url, { token }),
    ),
  );
}

/**
 * Get a specific merchant listing by ID via GET /stores/me/listings/{id}
 */
export function getMerchantListingById(id: string) {
  return withAuth((token) =>
    unwrapEnvelope<ProductListing>(
      getMany<FoodLoopEnvelope<ProductListing>>(
        Endpoints.stores.listingById(id),
        { token },
      ),
    ),
  );
}
