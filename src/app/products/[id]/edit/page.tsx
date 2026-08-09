"use client";

import { useMemo, Suspense, use } from "react";
import { withAuth } from "@/lib/auth/with-auth";
import { getMerchantProductById } from "@/app/products/api/products-api";
import { ProductDetailSkeleton } from "@/components/products/ProductDetailSkeleton";
import { EditProductFormContent } from "@/components/products/EditProductFormContent";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const productPromise = useMemo(() => getMerchantProductById(id), [id]);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <EditProductFormContent productId={id} productPromise={productPromise} />
    </Suspense>
  );
}

export default withAuth(EditProductPage);
