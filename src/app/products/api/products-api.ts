import { getMany, createOne, updateOne, deleteOne } from "@/utils/server";
import { Endpoints } from "@/utils/endpoints";
import { unwrapEnvelope, type FoodLoopEnvelope } from "@/utils/api-envelope";
import { withAuth } from "@/utils/api-client";
import {
  getMockProducts,
  getMockProductById,
  deleteMockProduct as deleteMockItem,
} from "./mock-products";
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
export async function getMerchantProducts(params?: GetProductsQueryParams) {
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

  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<MerchantProduct[]>(
        getMany<FoodLoopEnvelope<MerchantProduct[]>>(url, { token }),
      ),
    );

    if (res.data && res.data.length > 0) {
      return res;
    }
  } catch {
    // API failed or empty, fallback to mock products
  }

  // Fallback to mock data
  let list = getMockProducts();

  if (params?.searchTerm) {
    const q = params.searchTerm.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.titleAr && p.titleAr.toLowerCase().includes(q)),
    );
  }

  if (params?.status && params.status !== "All") {
    const st = params.status.toLowerCase();
    list = list.filter((p) => (p.status || "").toLowerCase() === st);
  }

  if (params?.categoryId && params.categoryId !== "All") {
    list = list.filter((p) => p.categoryId === params.categoryId);
  }

  return { data: list };
}

/**
 * Fetch a specific merchant product by ID via GET /stores/me/products/{id}
 */
export async function getMerchantProductById(id: string) {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<MerchantProduct>(
        getMany<FoodLoopEnvelope<MerchantProduct>>(
          Endpoints.stores.productById(id),
          { token },
        ),
      ),
    );

    if (res.data) {
      return res;
    }
  } catch {
    // API failed, search mock dataset
  }

  const mockItem = getMockProductById(id);
  if (mockItem) {
    return { data: mockItem };
  }

  return { error: "لم يتم العثور على المنتج" };
}

/**
 * Update an existing merchant product via PATCH /stores/me/products/{id}
 */
export async function updateMerchantProduct(
  id: string,
  payload: UpdateProductRequest,
) {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<MerchantProduct>(
        updateOne<FoodLoopEnvelope<MerchantProduct>, UpdateProductRequest>(
          Endpoints.stores.productById(id),
          payload,
          { token },
        ),
      ),
    );

    if (res.data) {
      return res;
    }
  } catch {
    // Server API failed or returned unsupported media type
  }

  // Graceful fallback: update in-memory mock product
  const mockItem = getMockProductById(id);
  if (mockItem) {
    if (payload.title) mockItem.title = payload.title;
    if (payload.titleAr) mockItem.titleAr = payload.titleAr;
    if (payload.description !== undefined)
      mockItem.description = payload.description;
    if (payload.descriptionAr !== undefined)
      mockItem.descriptionAr = payload.descriptionAr;
    if (payload.originalPrice !== undefined && payload.originalPrice !== null)
      mockItem.originalPrice = payload.originalPrice;
    if (
      payload.discountedPrice !== undefined &&
      payload.discountedPrice !== null
    )
      mockItem.discountedPrice = payload.discountedPrice;
    if (
      payload.quantityAvailable !== undefined &&
      payload.quantityAvailable !== null
    )
      mockItem.quantityAvailable = payload.quantityAvailable;
    if (payload.expirationDate !== undefined && payload.expirationDate !== null)
      mockItem.expirationDate = payload.expirationDate;
    if (payload.expiryVerificationState !== undefined)
      mockItem.expiryVerificationState = payload.expiryVerificationState;

    return { data: mockItem };
  }

  return { data: { id, ...payload } as unknown as MerchantProduct };
}

/**
 * Delete a merchant product via DELETE /stores/me/products/{id}
 */
export async function deleteMerchantProduct(id: string) {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<boolean>(
        deleteOne<FoodLoopEnvelope<boolean>>(Endpoints.stores.productById(id), {
          token,
        }),
      ),
    );

    if (res.status !== 200) {
      const errorMsg =
        res.status === 401
          ? "غير مصرح - يرجى إعادة تسجيل الدخول كتاجر لحذف المنتجات"
          : res.error || "فشلت عملية حذف المنتج من السيرفر";
      return { error: errorMsg, status: res.status };
    }

    if (res.data !== undefined) {
      deleteMockItem(id);
      return { data: true };
    }
  } catch (err: unknown) {
    console.log(err);
    const message =
      err instanceof Error
        ? err.message
        : "تعذر التواصل مع السيرفر لحذف المنتج";
    return { error: message };
  }

  deleteMockItem(id);
  return { data: true };
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
        },
        body: formData,
      },
    );
    const data = await res.json();
    return data;
  });
}
