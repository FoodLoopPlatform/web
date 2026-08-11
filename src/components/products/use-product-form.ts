"use client";

import { useState, useEffect } from "react";
import {
  getCategories,
  createMerchantProduct,
  updateMerchantProduct,
  uploadProductImage,
} from "@/app/products/api/products-api";
import type {
  Category,
  CreateProductRequest,
  UpdateProductRequest,
  MerchantProduct,
  AutomationMode,
} from "@/app/products/api/types";
import { extractProductImages } from "@/utils/image-utils";

export interface ImageItem {
  id: string;
  file?: File;
  previewUrl: string;
  isExisting?: boolean;
}

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

  const [images, setImages] = useState<ImageItem[]>(() => {
    const extracted = extractProductImages(initialProduct);
    if (extracted.length > 0) {
      return extracted.map((url, idx) => ({
        id: `existing-${idx}-${Date.now()}`,
        previewUrl: url,
        isExisting: true,
      }));
    }
    return [];
  });

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
  const [automationMode, setAutomationMode] = useState<AutomationMode>(
    (initialProduct?.automationMode as AutomationMode) || "Assisted",
  );

  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgressStatus, setUploadProgressStatus] = useState<
    string | null
  >(null);
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

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    if (fileArray.length === 0) return;

    const newItems: ImageItem[] = fileArray.map((file) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const itemToRemove = prev[index];
      if (itemToRemove?.file && itemToRemove.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(itemToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
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
    setUploadProgressStatus(null);

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
    const rawExpDate =
      expiryDate ||
      new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
    const expDate = new Date(rawExpDate).toISOString();

    setIsSubmitting(true);

    try {
      let targetProductId: string | null = null;

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
          targetProductId = productId;
        } else {
          const errorMsg = res.error || "تعذر تحديث بيانات المنتج";
          setSubmitError(errorMsg);
          setToast({ message: errorMsg, type: "error" });
          setIsSubmitting(false);
          return;
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

        if (res.data && res.data.id) {
          targetProductId = res.data.id;
        } else {
          const errorMsg = res.error || "تعذر نشر المنتج";
          setSubmitError(errorMsg);
          setToast({ message: errorMsg, type: "error" });
          setIsSubmitting(false);
          return;
        }
      }

      // Upload pending images in ordered sequence
      if (targetProductId) {
        const pendingItems = images.filter((img) => img.file);
        if (pendingItems.length > 0) {
          for (let i = 0; i < pendingItems.length; i++) {
            setUploadProgressStatus(
              `جاري رفع الصور (${i + 1} من ${pendingItems.length})...`,
            );
            try {
              await uploadProductImage(targetProductId, pendingItems[i].file!);
            } catch (imgErr) {
              console.error(`فشل رفع الصورة رقم ${i + 1}:`, imgErr);
            }
          }
        }
      }

      setToast({
        message:
          mode === "edit"
            ? "تم تحديث بيانات المنتج ورصد الصور بنجاح!"
            : "تم إنشاء ونشر المنتج وإرفاق الصور بنجاح!",
        type: "success",
      });

      setTimeout(() => {
        if (mode === "edit" && productId) {
          window.location.href = `/product/${productId}`;
        } else {
          window.location.href = "/inventory";
        }
      }, 1200);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "حدث خطأ أثناء التواصل مع السيرفر";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgressStatus(null);
    }
  };

  return {
    expiryTab,
    setExpiryTab,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
    images,
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
    automationMode,
    setAutomationMode,
    isScanning,
    setIsScanning,
    scanSuccess,
    setScanSuccess,
    isSubmitting,
    uploadProgressStatus,
    submitError,
    toast,
    handleFilesAdded,
    handleMoveImage,
    handleRemoveImage,
    handleSimulateScan,
    handleSubmit,
  };
}
