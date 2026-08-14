"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAppLang } from "@/store/use-app-lang";
import { adminDictionary } from "../../constants/dictionary";
import {
  AuditLogFilterParams,
  AuditLogFetchResult,
  AuditLogItem,
} from "../../types/admin.types";
import { getAuditLogs, exportAuditLogsCsv } from "../../api/audit-log-api";
import { AuditLogFilters } from "../audit-log/AuditLogFilters";
import { AuditLogTable } from "../audit-log/AuditLogTable";
import { AuditEmptyState } from "../audit-log/AuditEmptyState";
import { AuditDetailModal } from "../audit-log/AuditDetailModal";
import { AuditStatsRow } from "../audit-log/AuditStatsRow";
import { Pagination } from "../common/Pagination";
import { SpinnerIcon } from "@/components/icons";

interface AuditLogClientContainerProps {
  initialData?: AuditLogFetchResult;
}

export function AuditLogClientContainer({
  initialData,
}: AuditLogClientContainerProps) {
  const { lang } = useAppLang();
  const searchParams = useSearchParams();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [filters, setFilters] = useState<AuditLogFilterParams>(() => ({
    search: searchParams.get("search") || searchParams.get("q") || "",
    actionType: "ALL",
    dateRange: "ALL",
    severity: "ALL",
    page: 1,
    pageSize: 5,
  }));

  const [data, setData] = useState<AuditLogFetchResult | null>(
    initialData ?? null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AuditLogItem | null>(null);

  const isFirstRender = React.useRef(!!initialData);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let isSubscribed = true;

    getAuditLogs(filters)
      .then((res) => {
        if (isSubscribed) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch audit logs", err);
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [filters]);

  const handleFilterChange = useCallback((updated: AuditLogFilterParams) => {
    setIsLoading(true);
    setFilters(updated);
  }, []);

  const handleResetFilters = () => {
    setIsLoading(true);
    setFilters({
      search: "",
      actionType: "ALL",
      dateRange: "ALL",
      severity: "ALL",
      page: 1,
      pageSize: 5,
    });
  };

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await exportAuditLogsCsv(filters, isRtl);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const hasNoResults = !isLoading && data && data.items.length === 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto pb-12">
      {/* Header Bar */}
      <div className={isRtl ? "text-right" : "text-left"}>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight font-sans">
          {t.auditDashboardTitle}
        </h1>
        <p className="text-xs sm:text-sm text-outline mt-1 font-medium">
          {t.auditDashboardSubtitle}
        </p>
      </div>

      {/* Filter Row */}
      <AuditLogFilters
        t={t}
        isRtl={isRtl}
        filters={filters}
        onFilterChange={handleFilterChange}
        onExportCsv={handleExportCsv}
        isExporting={isExporting}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="w-full bg-white rounded-2xl border border-card-border p-12 flex flex-col items-center justify-center gap-3 min-h-[300px]">
          <SpinnerIcon className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs font-bold text-outline">
            {isRtl ? "جاري تحميل سجلات النظام..." : "Loading audit logs..."}
          </span>
        </div>
      ) : hasNoResults ? (
        /* No Results State */
        <AuditEmptyState t={t} onResetFilters={handleResetFilters} />
      ) : (
        /* Activity History Table & Pagination */
        <div className="flex flex-col gap-4">
          <AuditLogTable
            t={t}
            isRtl={isRtl}
            items={data?.items || []}
            onViewDetails={(item) => setSelectedItem(item)}
          />

          {data && data.total > 0 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              totalItems={data.total}
              pageSize={data.pageSize}
              onPageChange={handlePageChange}
              isRtl={isRtl}
            />
          )}
        </div>
      )}

      {/* Bottom System Stats Row */}
      {data && <AuditStatsRow t={t} isRtl={isRtl} stats={data.stats} />}

      {/* Item Details View Modal */}
      <AuditDetailModal
        t={t}
        isRtl={isRtl}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
