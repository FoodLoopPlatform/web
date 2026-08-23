"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { getProductPriceHistory } from "@/app/pricing/api/pricing-api";
import { ProductSelectorSidebar } from "./ProductSelectorSidebar";
import { PriceHistoryTimeline } from "./PriceHistoryTimeline";
import { PricingProductImage } from "./PricingProductImage";
import type {
  ProductPricingItem,
  ProductPriceHistoryData,
} from "@/app/pricing/api/types";

function formatEGP(value: number) {
  return `${value.toFixed(2)} EGP`;
}

type PricingHistoryViewProps = {
  products: ProductPricingItem[];
  initialProductId?: string | null;
};

export function PricingHistoryView({
  products,
  initialProductId,
}: PricingHistoryViewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Determine active product ID safely
  const effectiveProductId = useMemo(() => {
    if (initialProductId && products.some((p) => p.id === initialProductId)) {
      return initialProductId;
    }
    if (selectedProductId && products.some((p) => p.id === selectedProductId)) {
      return selectedProductId;
    }
    return products[0]?.id || "";
  }, [initialProductId, selectedProductId, products]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === effectiveProductId) || null;
  }, [products, effectiveProductId]);

  const [historyData, setHistoryData] =
    useState<ProductPriceHistoryData | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(
    (product: ProductPricingItem, showLoading = true) => {
      if (showLoading) {
        setIsLoadingHistory(true);
      }
      setHistoryError(null);

      getProductPriceHistory(product.id, product)
        .then((res) => {
          if (res.data) {
            setHistoryData(res.data);
          } else if (res.error) {
            setHistoryError(res.error);
          }
        })
        .catch((err) => {
          setHistoryError(
            err instanceof Error
              ? err.message
              : "حدث خطأ أثناء تحميل سجل الأسعار",
          );
        })
        .finally(() => {
          setIsLoadingHistory(false);
        });
    },
    [],
  );

  // Fetch history when active product changes
  useEffect(() => {
    if (!selectedProduct) return;
    let isMounted = true;

    getProductPriceHistory(selectedProduct.id, selectedProduct)
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setHistoryData(res.data);
        } else if (res.error) {
          setHistoryError(res.error);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setHistoryError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل سجل الأسعار",
        );
      })
      .finally(() => {
        if (isMounted) setIsLoadingHistory(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedProduct]);

  // Derived statistics for the selected product's history
  const historyStats = useMemo(() => {
    if (!historyData || historyData.history.length === 0) {
      return {
        totalChanges: 0,
        lowestPrice: selectedProduct?.currentPrice || 0,
      };
    }

    const prices = historyData.history.map((h) => h.newPrice);
    if (selectedProduct) {
      prices.push(selectedProduct.originalPrice, selectedProduct.currentPrice);
    }
    const lowest = Math.min(...prices);

    return {
      totalChanges: historyData.history.length,
      lowestPrice: lowest,
    };
  }, [historyData, selectedProduct]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Products Selector Sidebar */}
      <ProductSelectorSidebar
        products={products}
        selectedProductId={effectiveProductId}
        onSelectProduct={(id) => {
          setSelectedProductId(id);
          setIsLoadingHistory(true);
        }}
      />

      {/* History Details and Timeline */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {selectedProduct ? (
          <>
            {/* Selected Product Banner Header */}
            <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] flex flex-col gap-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <PricingProductImage
                    src={selectedProduct.image || historyData?.productImage}
                    alt={selectedProduct.name}
                    sizes="80px"
                    containerClassName="h-20 w-20 rounded-xl overflow-hidden bg-[#ecefe8] border border-outline-variant/20 shrink-0 relative flex items-center justify-center"
                    iconClassName="h-9 w-9 text-primary/40"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-sans text-2xl font-bold text-primary">
                        {selectedProduct.name}
                      </h2>
                      {selectedProduct.categoryName && (
                        <span className="bg-light-green text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {selectedProduct.categoryName}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      رمز المنتج (SKU):{" "}
                      <span className="font-mono font-bold text-on-surface">
                        {selectedProduct.code}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fetchHistory(selectedProduct, true)}
                    disabled={isLoadingHistory}
                    className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary bg-surface-container-low hover:bg-surface-container-high px-3 py-2 rounded-xl transition-colors cursor-pointer border border-outline-variant/30"
                  >
                    <Icon
                      name="refresh"
                      className={`h-4 w-4 ${
                        isLoadingHistory ? "animate-spin" : ""
                      }`}
                    />
                    تحديث السجل
                  </button>
                </div>
              </div>

              {/* Product Pricing Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-light-green/70 border border-outline-variant/20 rounded-xl p-3.5 flex flex-col gap-1 text-right items-start">
                  <span className="text-xs text-on-surface-variant text-right">
                    السعر الأصلي
                  </span>
                  <span className="font-data-mono text-lg font-bold text-on-surface text-right">
                    <bdi>{formatEGP(selectedProduct.originalPrice)}</bdi>
                  </span>
                </div>

                <div className="bg-light-green border border-primary/20 rounded-xl p-3.5 flex flex-col gap-1 text-right items-start">
                  <span className="text-xs text-on-surface-variant text-right">
                    السعر الحالي
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-data-mono text-lg font-bold text-primary text-right">
                      <bdi>{formatEGP(selectedProduct.currentPrice)}</bdi>
                    </span>
                    {selectedProduct.discountPercent > 0 && (
                      <span className="bg-[#ffddb7] text-[#653e00] text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                        <bdi>-{selectedProduct.discountPercent}%</bdi>
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-light-green/70 border border-outline-variant/20 rounded-xl p-3.5 flex flex-col gap-1 text-right items-start">
                  <span className="text-xs text-on-surface-variant text-right">
                    أدنى سعر مسجل
                  </span>
                  <span className="font-data-mono text-lg font-bold text-[#0b723c] text-right">
                    <bdi>{formatEGP(historyStats.lowestPrice)}</bdi>
                  </span>
                </div>

                <div className="bg-light-green/70 border border-outline-variant/20 rounded-xl p-3.5 flex flex-col gap-1 text-right items-start">
                  <span className="text-xs text-on-surface-variant text-right">
                    عدد التعديلات
                  </span>
                  <span className="font-sans text-lg font-bold text-primary text-right">
                    {historyStats.totalChanges} مرات
                  </span>
                </div>
              </div>
            </div>

            {/* Price Evolution History Timeline */}
            <PriceHistoryTimeline
              historyData={historyData}
              isLoadingHistory={isLoadingHistory}
              historyError={historyError}
              onRetry={() => fetchHistory(selectedProduct, true)}
            />
          </>
        ) : (
          <div className="bg-white border border-outline-variant/30 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3">
            <Icon
              name="inventory_2"
              className="h-12 w-12 text-on-surface-variant/40"
            />
            <h3 className="font-sans text-xl font-bold text-on-surface">
              اختر منتجًا لعرض سجله
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-[500px]">
              حدد أي منتج من القائمة الجانبية لعرض التغييرات السابقة على أسعاره
              وتفاصيل الخصومات.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
