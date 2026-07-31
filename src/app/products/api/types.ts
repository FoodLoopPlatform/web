export interface Category {
  id: string;
  name: string;
  nameAr?: string | null;
  icon?: string | null;
}

export interface CreateProductListingRequest {
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

export interface UpdateProductListingRequest {
  title?: string;
  titleAr?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  originalPrice?: number;
  discountedPrice?: number;
  quantityAvailable?: number;
  expirationDate?: string;
  status?: string;
}

export interface ProductListing {
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

export interface GetListingsQueryParams {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
  status?: string;
  searchTerm?: string;
}
