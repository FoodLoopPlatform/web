"use client";

import { use } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import type { MerchantProduct } from "@/app/products/api/types";
import type { ApiResponse } from "@/utils/server";

interface EditProductFormContentProps {
  productId: string;
  productPromise: Promise<ApiResponse<MerchantProduct>>;
}

export function EditProductFormContent({
  productId,
  productPromise,
}: EditProductFormContentProps) {
  const res = use(productPromise);
  const initialProduct = res.data ?? null;

  return (
    <ProductForm
      mode="edit"
      productId={productId}
      initialProduct={initialProduct}
    />
  );
}
