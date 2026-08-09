import {
  getMany,
  createOne,
  updateOne,
  deleteOne,
  getAcceptLanguage,
} from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import type {
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  MerchantProduct,
  GetProductsQueryParams,
} from "./types";

/**
 * Fetch list of available food categories via GET /categories
 */
export function getCategories() {
  return unwrapEnvelope<Category[]>(
    getMany<FoodLoopEnvelope<Category[]>>(Endpoints.categories),
  );
}

/**
 * Create a new merchant product via POST /stores/me/products
 */
export function createMerchantProduct(payload: CreateProductRequest) {
  return withAuth((token) =>
    unwrapEnvelope<MerchantProduct>(
      createOne<FoodLoopEnvelope<MerchantProduct>, CreateProductRequest>(
        Endpoints.stores.products,
        payload,
        { token },
      ),
    ),
  );
}

/**
 * Fetch all merchant products via GET /stores/me/products
 */
export function getMerchantProducts(params?: GetProductsQueryParams) {
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
      ? `${Endpoints.stores.products}?${queryParts.join("&")}`
      : Endpoints.stores.products;

  return withAuth((token) =>
    unwrapEnvelope<MerchantProduct[]>(
      getMany<FoodLoopEnvelope<MerchantProduct[]>>(url, { token }),
    ),
  );
}

/**
 * Fetch a specific merchant product by ID via GET /stores/me/products/{id}
 */
export function getMerchantProductById(id: string) {
  return withAuth((token) =>
    unwrapEnvelope<MerchantProduct>(
      getMany<FoodLoopEnvelope<MerchantProduct>>(
        Endpoints.stores.productById(id),
        { token },
      ),
    ),
  );
}

/**
 * Update an existing merchant product via PATCH /stores/me/products/{id}
 */
export function updateMerchantProduct(
  id: string,
  payload: UpdateProductRequest,
) {
  return withAuth((token) =>
    unwrapEnvelope<MerchantProduct>(
      updateOne<FoodLoopEnvelope<MerchantProduct>, UpdateProductRequest>(
        Endpoints.stores.productById(id),
        payload,
        { token },
      ),
    ),
  );
}

/**
 * Delete a merchant product via DELETE /stores/me/products/{id}
 */
export function deleteMerchantProduct(id: string) {
  return withAuth((token) =>
    unwrapEnvelope<boolean>(
      deleteOne<FoodLoopEnvelope<boolean>>(Endpoints.stores.productById(id), {
        token,
      }),
    ),
  );
}

/**
 * Upload an image for a merchant product via POST /stores/me/products/{id}/images
 */
export function uploadProductImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return withAuth((token) =>
    unwrapEnvelope<unknown>(
      createOne<FoodLoopEnvelope<unknown>, FormData>(
        Endpoints.stores.productImages(id),
        formData,
        { token },
      ),
    ),
  );
}

/**
 * Bulk upload merchant products via POST /stores/me/products/bulk
 */
export function bulkUploadProducts(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return withAuth(async (token) => {
    const res = await fetch(
      `${Endpoints.baseUrl}${Endpoints.stores.productsBulk}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": getAcceptLanguage(),
        },
        body: formData,
      },
    );
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text || "Invalid response" };
    }
    return data;
  });
}
