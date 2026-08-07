"use client";

import { use, useMemo, useState } from "react";
import type { ApiResponse } from "@/utils/server";
import type { Category, MerchantProduct } from "@/app/products/api/types";
import { buildRiskAnalysis, type RiskLevel } from "../lib/risk-analysis";
import { RiskAnalysisHeader } from "./RiskAnalysisHeader";
import { RiskFiltersSidebar } from "./RiskFiltersSidebar";
import { ValueAtRiskWidget } from "./ValueAtRiskWidget";
import { RiskTable } from "./RiskTable";
import { ForecastSpotlight } from "./ForecastSpotlight";

const PAGE_SIZE = 4;

interface RiskAnalysisBoardProps {
  productsPromise: Promise<ApiResponse<MerchantProduct[]>>;
  categoriesPromise: Promise<ApiResponse<Category[]>>;
}

export function RiskAnalysisBoard({
  productsPromise,
  categoriesPromise,
}: RiskAnalysisBoardProps) {
  const productsRes = use(productsPromise);
  const categoriesRes = use(categoriesPromise);
  const products = useMemo(() => productsRes.data ?? [], [productsRes]);
  const categories = categoriesRes.data ?? [];

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | null>(null);
  const [page, setPage] = useState(1);
  const [aiMode, setAiMode] = useState(true);

  const analysis = useMemo(() => buildRiskAnalysis(products), [products]);

  const riskCounts = useMemo(() => {
    const counts: Record<RiskLevel, number> = { high: 0, medium: 0, low: 0 };
    for (const item of analysis) counts[item.riskLevel] += 1;
    return counts;
  }, [analysis]);

  const avgDemandScore = useMemo(() => {
    if (analysis.length === 0) return 0;
    const sum = analysis.reduce((acc, item) => acc + item.demandScore, 0);
    return Math.round(sum / analysis.length);
  }, [analysis]);

  const totalValueAtRisk = useMemo(
    () => analysis.reduce((sum, item) => sum + item.valueAtRisk, 0),
    [analysis],
  );

  const percentOfInventory = useMemo(() => {
    const totalInventoryValue = analysis.reduce((sum, item) => {
      const unitPrice =
        item.product.discountedPrice ?? item.product.originalPrice ?? 0;
      return sum + unitPrice * (item.product.quantityAvailable ?? 0);
    }, 0);
    return totalInventoryValue > 0
      ? Math.round((totalValueAtRisk / totalInventoryValue) * 100)
      : 0;
  }, [analysis, totalValueAtRisk]);

  const filteredAnalysis = useMemo(() => {
    let list = analysis;
    if (selectedCategoryIds.length > 0) {
      list = list.filter((item) =>
        selectedCategoryIds.includes(item.product.categoryId),
      );
    }
    if (riskFilter) {
      list = list.filter((item) => item.riskLevel === riskFilter);
    }
    if (aiMode) {
      list = [...list].sort(
        (a, b) =>
          a.daysUntilExpiry - b.daysUntilExpiry ||
          b.valueAtRisk - a.valueAtRisk,
      );
    }
    return list;
  }, [analysis, selectedCategoryIds, riskFilter, aiMode]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAnalysis.length / PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredAnalysis.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    setPage(1);
  };

  const setRiskFilterAndReset = (level: RiskLevel | null) => {
    setRiskFilter(level);
    setPage(1);
  };

  const spotlightCategory = useMemo(() => {
    const byCategory = new Map<string, { name: string; count: number }>();
    for (const item of analysis) {
      if (item.riskLevel !== "high") continue;
      const key = item.product.categoryId;
      const name =
        item.product.categoryNameAr || item.product.categoryName || "غير مصنف";
      const entry = byCategory.get(key) ?? { name, count: 0 };
      entry.count += 1;
      byCategory.set(key, entry);
    }
    let best: { id: string; name: string; count: number } | null = null;
    for (const [id, entry] of byCategory) {
      if (!best || entry.count > best.count) best = { id, ...entry };
    }
    return best;
  }, [analysis]);

  const criticalItem = analysis
    .filter((item) => item.riskLevel === "high")
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)[0];

  return (
    <div className="flex flex-col gap-lg w-full">
      <RiskAnalysisHeader
        avgDemandScore={avgDemandScore}
        criticalCount={riskCounts.high}
      />

      <div className="flex flex-col lg:flex-row gap-lg items-start w-full">
        <RiskFiltersSidebar
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          onToggleCategory={toggleCategory}
          riskFilter={riskFilter}
          onSetRiskFilter={setRiskFilterAndReset}
          riskCounts={riskCounts}
          insight={
            criticalItem
              ? {
                  body: `"${criticalItem.product.titleAr || criticalItem.product.title}" هو الأكثر عرضة للهدر حالياً — تحقق منه أولاً لتقليل الخسائر.`,
                  onView: () => setRiskFilterAndReset("high"),
                }
              : null
          }
        />

        <div className="flex-1 min-w-0 flex flex-col gap-lg w-full">
          <ValueAtRiskWidget
            totalValueAtRisk={totalValueAtRisk}
            criticalCount={riskCounts.high}
            percentOfInventory={percentOfInventory}
          />

          <RiskTable
            items={pageItems}
            totalItems={filteredAnalysis.length}
            page={safePage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            aiMode={aiMode}
            onToggleAiMode={() => setAiMode((v) => !v)}
          />

          {spotlightCategory && (
            <ForecastSpotlight
              categoryName={spotlightCategory.name}
              affectedCount={spotlightCategory.count}
              onFocusCategory={() => {
                setSelectedCategoryIds([spotlightCategory.id]);
                setRiskFilterAndReset("high");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
