export interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  icon?: string | null;
}

export interface CreateProductRequest {
  categoryId: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  originalPrice: number;
  discountedPrice: number;
  quantityAvailable: number;
  expirationDate: string;
}

export interface UpdateProductRequest {
  categoryId?: string | null;
  title?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  originalPrice?: number | null;
  discountedPrice?: number | null;
  quantityAvailable?: number | null;
  expirationDate?: string | null;
  status?: string | null;
}

export interface MerchantProduct {
  id: string;
  storeId?: string;
  categoryId: string;
  categoryName?: string;
  categoryNameAr?: string;
  title: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  originalPrice: number;
  discountedPrice: number;
  quantityAvailable: number;
  expirationDate: string;
  status?: string;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetProductsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
  status?: string;
  searchTerm?: string;
}
