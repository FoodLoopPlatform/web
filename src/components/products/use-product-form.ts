"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createMerchantProduct,
  updateMerchantProduct,
} from "@/app/products/api/products-api";
import type {
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  MerchantProduct,
} from "@/app/products/api/types";

export interface UseProductFormProps {
  mode: "add" | "edit";
  initialProduct?: MerchantProduct | null;
  productId?: string;
}

export function useProductForm({
  mode,
  initialProduct,
  productId,
}: UseProductFormProps) {
  const [expiryTab, setExpiryTab] = useState<"manual" | "scan">("manual");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images[0]
      : null,
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    initialProduct?.categoryId || "",
  );
  const [productName, setProductName] = useState(
    initialProduct?.titleAr || initialProduct?.title || "",
  );
  const [description, setDescription] = useState(
    initialProduct?.descriptionAr || initialProduct?.description || "",
  );
  const [price, setPrice] = useState(
    initialProduct?.originalPrice !== undefined
      ? String(initialProduct.originalPrice)
      : "",
  );
  const [discountedPrice, setDiscountedPrice] = useState(
    initialProduct?.discountedPrice !== undefined
      ? String(initialProduct.discountedPrice)
      : "",
  );
  const [quantity, setQuantity] = useState(
    initialProduct?.quantityAvailable !== undefined
      ? String(initialProduct.quantityAvailable)
      : "1",
  );
  const [expiryDate, setExpiryDate] = useState(
    initialProduct?.expirationDate
      ? initialProduct.expirationDate.split("T")[0]
      : "",
  );

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);
      try {
        const res = await getCategories();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
          if (!selectedCategory) {
            setSelectedCategory(res.data[0].id);
          }
        } else if (!selectedCategory) {
          setSelectedCategory("11111111-1111-1111-1111-111111111111");
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    loadCategories();
  }, [selectedCategory]);

  const handleSimulateUpload = () => {
    const mockImages = [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEAnGLAbGf12zT2EtNl6h8RQbU1yyyOP9MPKft_V1MkKF61lagMFAN-a1DpqLJJCXtIv9NnQAnEL-B6xWG0Jzj9WXPxvoZeEJztOCU0NeO61FjlTkX0hkXY8_ZmiEkmXzhCf3m_ILlrosvwBytYAxXMaq-50lBwunlMxtGTVqHqPDUsSz9vhXSzNKr8wn0rs3Dm04YdvSZGLFj72k3xBTHlQzM2mvn9OPqO6WqCjEeA5am9hHlJ0xbBte0Z6gb2XIwTW6QWf9pu0g",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBFOMDYMe_zlD-fqblViZDSaue7PBZweMDMOH6iKU1K4-jbukMgsupi9xSyU9lq0BwCNonaEQq-GUJcmbtMWFrhtKUn41nyPd-dgbuPPS7dI3yIOiLLCbX9_5g6MvFITbi85nV1WJM99FmqrfXXML5V_8S1iaWOkasOntpOyHQgQeGVSkkOnsYKiKYLaIJAPkM6jt3yHyh7E7lUNyRDWKlC3MbMQN6zA90EmzPvJzt_Lf1bT01JUGJWsPeogCNKS-uejjTWToWyTrw",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB473NxorKS0PLtB2mH9eA8VE2ubrx6owKfTgEo9rWAefPnNTrB_5zQoDpH_vcnmwi6ywJ18l7PiTCngZM1OXWjc0n4w51OChPGfn3xxMA49RO5tZJMK4ZzcGeHN8pxmfw_5XzJ8zTwpjPOoH0Wrl1OMZQDje3SX-3t4m_RKjCJX4u64wm1KtFydvAqZYIcKEBPuDoaAydJO7It0VoEhJcUok5qwFBmIWBELY4m2Kdo2xn0YjkJU_bBK-d1XbMsrFVsxdldZS4X_vI",
    ];
    const randomImg = mockImages[Math.floor(Math.random() * mockImages.length)];
    setThumbnailUrl(randomImg);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanSuccess(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      const threeDaysAhead = new Date();
      threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);
      setExpiryDate(threeDaysAhead.toISOString().split("T")[0]);
    }, 2000);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitError(null);

    if (!productName.trim()) {
      setSubmitError("يرجى إدخال اسم المنتج");
      return;
    }
    if (!price || parseFloat(price) <= 0) {
      setSubmitError("يرجى إدخال سعر أصلي صحيح للمنتج");
      return;
    }
    if (!selectedCategory) {
      setSubmitError("يرجى اختيار تصنيف للمنتج");
      return;
    }

    const origPrice = parseFloat(price);
    const discPrice = discountedPrice
      ? parseFloat(discountedPrice)
      : origPrice * 0.5;
    const qty = quantity ? parseInt(quantity, 10) : 1;
    const expDate =
      expiryDate ||
      new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

    setIsSubmitting(true);

    try {
      if (mode === "edit" && productId) {
        const updateBody: UpdateProductRequest = {
          categoryId: selectedCategory,
          title: productName.trim(),
          titleAr: productName.trim(),
          description: description.trim() || null,
          descriptionAr: description.trim() || null,
          originalPrice: origPrice,
          discountedPrice: discPrice,
          quantityAvailable: qty,
          expirationDate: expDate,
        };
        const res = await updateMerchantProduct(productId, updateBody);

        if (res.data) {
          setToast({
            message: "تم تحديث بيانات المنتج بنجاح!",
            type: "success",
          });
          setTimeout(() => {
            window.location.href = `/product/${productId}`;
          }, 1200);
        } else {
          const errorMsg = res.error || "تعذر تحديث بيانات المنتج";
          setSubmitError(errorMsg);
          setToast({ message: errorMsg, type: "error" });
        }
      } else {
        const createBody: CreateProductRequest = {
          categoryId: selectedCategory,
          title: productName.trim(),
          titleAr: productName.trim(),
          description: description.trim() || undefined,
          descriptionAr: description.trim() || undefined,
          originalPrice: origPrice,
          discountedPrice: discPrice,
          quantityAvailable: qty,
          expirationDate: expDate,
        };
        const res = await createMerchantProduct(createBody);

        if (res.data) {
          setToast({
            message: "تم إنشاء ونشر المنتج بنجاح!",
            type: "success",
          });
          setTimeout(() => {
            window.location.href = "/inventory";
          }, 1200);
        } else {
          const errorMsg = res.error || "تعذر نشر المنتج";
          setSubmitError(errorMsg);
          setToast({ message: errorMsg, type: "error" });
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء التواصل مع السيرفر";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    expiryTab,
    setExpiryTab,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    thumbnailUrl,
    categories,
    isLoadingCategories,
    selectedCategory,
    setSelectedCategory,
    productName,
    setProductName,
    description,
    setDescription,
    price,
    setPrice,
    discountedPrice,
    setDiscountedPrice,
    quantity,
    setQuantity,
    expiryDate,
    setExpiryDate,
    isScanning,
    setIsScanning,
    scanSuccess,
    setScanSuccess,
    isSubmitting,
    submitError,
    toast,
    handleSimulateUpload,
    handleSimulateScan,
    handleSubmit,
  };
}
