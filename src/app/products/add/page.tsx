"use client";

import { ProductForm } from "@/components/products/ProductForm";
import { withAuth } from "@/lib/auth/with-auth";

function AddProductPage() {
  return <ProductForm mode="add" />;
}

export default withAuth(AddProductPage);
