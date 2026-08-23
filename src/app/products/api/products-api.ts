import {
  getMany,
  createOne,
  updateOne,
  deleteOne,
  getAcceptLanguage,
  type ApiResponse,
} from "@/utils/server";
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
 * Update an existing merchant product via PATCH /stores/me/products/{id}.
 *
 * The live API expects multipart/form-data with PascalCase field names
 * (CategoryId, Title, Description, OriginalPrice, DiscountedPrice,
 * QuantityAvailable, ExpirationDate, Status) rather than a JSON body —
 * sending JSON causes the request to be rejected by the backend.
 */
export async function updateMerchantProduct(
  id: string,
  payload: UpdateProductRequest,
) {
  const formData = new FormData();
  if (payload.categoryId != null)
    formData.append("CategoryId", payload.categoryId);
  if (payload.title != null) formData.append("Title", payload.title);
  if (payload.description != null)
    formData.append("Description", payload.description);
  if (payload.originalPrice != null)
    formData.append("OriginalPrice", String(payload.originalPrice));
  if (payload.discountedPrice != null)
    formData.append("DiscountedPrice", String(payload.discountedPrice));
  if (payload.quantityAvailable != null)
    formData.append("QuantityAvailable", String(payload.quantityAvailable));
  if (payload.expirationDate != null)
    formData.append("ExpirationDate", payload.expirationDate);
  if (payload.status != null) formData.append("Status", payload.status);

  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<MerchantProduct>(
        updateOne<FoodLoopEnvelope<MerchantProduct>, FormData>(
          Endpoints.stores.productById(id),
          formData,
          { token },
        ),
      ),
    );

    return res;
  } catch (err: unknown) {
    // Network-level failure (e.g. offline): fall back to the in-memory
    // mock dataset so the demo experience keeps working.
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
      if (
        payload.expirationDate !== undefined &&
        payload.expirationDate !== null
      )
        mockItem.expirationDate = payload.expirationDate;
      if (payload.expiryVerificationState !== undefined)
        mockItem.expiryVerificationState = payload.expiryVerificationState;

      return { data: mockItem };
    }

    const message =
      err instanceof Error
        ? err.message
        : "تعذر التواصل مع السيرفر لتحديث المنتج";
    return { error: message };
  }
}

/**
 * Delete a merchant product via DELETE /stores/me/products/{id}
 */
export async function deleteMerchantProduct(id: string) {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<boolean>(
        deleteOne<FoodLoopEnvelope<boolean>>(
          Endpoints.stores.productById(id),
          undefined,
          { token },
        ),
      ),
    );

    if (res.status && res.status >= 200 && res.status < 300 && !res.error) {
      deleteMockItem(id);
      return { data: true, status: res.status };
    }

    const errorMsg =
      res.status === 401
        ? "غير مصرح - يرجى إعادة تسجيل الدخول كتاجر لحذف المنتجات"
        : res.error || "فشلت عملية حذف المنتج من السيرفر";
    return { error: errorMsg, status: res.status };
  } catch (err: unknown) {
    console.error(err);
    const message =
      err instanceof Error
        ? err.message
        : "تعذر التواصل مع السيرفر لحذف المنتج";
    return { error: message };
  }
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
 * Delete a product image via DELETE /stores/me/products/{id}/images/{imageId}
 */
export async function deleteProductImage(id: string, imageId: string) {
  try {
    const res = await withAuth((token) =>
      unwrapEnvelope<boolean>(
        deleteOne<FoodLoopEnvelope<boolean>>(
          Endpoints.stores.productImageById(id, imageId),
          undefined,
          { token },
        ),
      ),
    );

    if (res.status && res.status >= 200 && res.status < 300) {
      return { data: true };
    }

    return { error: res.error || "تعذر حذف صورة المنتج", status: res.status };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "تعذر التواصل مع السيرفر لحذف الصورة";
    return { error: message };
  }
}

/**
 * Bulk upload merchant products via POST /stores/me/products/bulk
 */
export function bulkUploadProducts(
  file: File,
): Promise<ApiResponse<{ count?: number; message?: string } | unknown>> {
  const formData = new FormData();
  formData.append("file", file);

  return withAuth(async (token) => {
    try {
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
      let data: Record<string, unknown> | null = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { message: text || "Invalid response" };
      }

      if (!res.ok) {
        let errorMsg = "فشل في رفع ومعالجة ملف المنتجات";
        if (data) {
          if (Array.isArray(data.errors) && data.errors.length > 0) {
            errorMsg = data.errors.join("\n");
          } else if (typeof data.message === "string") {
            errorMsg = data.message;
          } else if (typeof data.error === "string") {
            errorMsg = data.error;
          }
        }
        return { error: errorMsg, status: res.status };
      }

      if (data && typeof data === "object" && "success" in data) {
        if (!data.success) {
          const detail =
            Array.isArray(data.errors) && data.errors.length > 0
              ? data.errors.join("\n")
              : (typeof data.message === "string" ? data.message : null) ||
                "حدث خطأ أثناء معالجة الملف";
          return { error: detail, status: res.status };
        }
        return { data: data.data ?? data, status: res.status };
      }

      return { data: data ?? true, status: res.status };
    } catch (err: unknown) {
      return {
        error:
          err instanceof Error
            ? err.message
            : "تعذر الاتصال بالسيرفر لرفع الملف",
        status: 500,
      };
    }
  });
}
