"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAppLang } from "@/store/use-app-lang";
import { adminDictionary } from "../../constants/dictionary";
import { StoreCommission } from "../../types/admin.types";
import { getAdminCommissions } from "../../api/commissions-api";
import { CommissionsStats } from "./CommissionsStats";
import { CommissionsTable } from "./CommissionsTable";
import { CommissionsCardList } from "./CommissionsCardList";
import { WithdrawCommissionModal } from "./WithdrawCommissionModal";
import { Pagination } from "../common/Pagination";
import { SearchToolbar, FilterOption } from "../common/SearchToolbar";
import { useDebounce } from "../../hooks/useDebounce";

type CommissionFilterStatus = "ALL" | "WITHDRAWABLE" | "SETTLED" | "SUSPENDED";

interface CommissionsShellProps {
  initialCommissions?: StoreCommission[];
}

export const CommissionsShell: React.FC<CommissionsShellProps> = ({
  initialCommissions = [],
}) => {
  const { lang } = useAppLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [commissions, setCommissions] =
    useState<StoreCommission[]>(initialCommissions);
  const [isLoading, setIsLoading] = useState(initialCommissions.length === 0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] =
    useState<CommissionFilterStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Selected store for withdrawal
  const [selectedStoreForWithdraw, setSelectedStoreForWithdraw] =
    useState<StoreCommission | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialCommissions.length > 0) return;

    let isMounted = true;
    getAdminCommissions()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setCommissions(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching admin commissions:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCommissions.length]);

  const handleOpenWithdraw = (store: StoreCommission) => {
    setSelectedStoreForWithdraw(store);
    setIsWithdrawModalOpen(true);
  };

  const handleWithdrawSuccess = (storeId: string, withdrawnAmt: number) => {
    setCommissions((prev) =>
      prev.map((item) => {
        if (
          item.rawApiId === storeId ||
          item.storeId === storeId ||
          item.id === storeId
        ) {
          const newWithdrawable = Math.max(
            0,
            item.withdrawableAmount - withdrawnAmt,
          );
          const newWithdrawn = item.withdrawnAmount + withdrawnAmt;
          return {
            ...item,
            withdrawableAmount: newWithdrawable,
            withdrawnAmount: newWithdrawn,
            lastWithdrawalDate: new Date().toISOString(),
          };
        }
        return item;
      }),
    );

    setToastMessage(
      isRtl
        ? `تم سحب مبلغ ${withdrawnAmt.toLocaleString()} ج.م بنجاح من رصيد المتجر.`
        : `Successfully withdrew ${withdrawnAmt.toLocaleString()} EGP from store balance.`,
    );

    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filtered & Paginated items
  const filteredItems = useMemo(() => {
    return commissions.filter((item) => {
      const q = debouncedSearchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        item.storeName.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.businessCategory.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.storeId.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === "WITHDRAWABLE") {
        matchesStatus = item.withdrawableAmount > 0;
      } else if (statusFilter === "SETTLED") {
        matchesStatus =
          item.withdrawableAmount === 0 && item.withdrawnAmount > 0;
      } else if (statusFilter === "SUSPENDED") {
        matchesStatus = item.status === "SUSPENDED";
      }

      return matchesQuery && matchesStatus;
    });
  }, [commissions, debouncedSearchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const filterOptions: FilterOption<CommissionFilterStatus>[] = [
    { id: "ALL", label: t.all },
    {
      id: "WITHDRAWABLE",
      label: isRtl ? "مستحق للسحب" : "Withdrawable Balance",
    },
    {
      id: "SETTLED",
      label: isRtl ? "مسوى بالكامل" : "Fully Settled",
    },
    {
      id: "SUSPENDED",
      label: t.suspended,
    },
  ];

  const handleExportCSV = () => {
    const headers = [
      "Store ID",
      "Store Name",
      "Owner",
      "Category",
      "Location",
      "Commission Rate (%)",
      "Total Sales (EGP)",
      "Total Commission (EGP)",
      "Withdrawable Balance (EGP)",
      "Withdrawn Amount (EGP)",
      "Last Withdrawal Date",
      "Status",
    ];

    const rows = filteredItems.map((c) => [
      c.storeId || c.id,
      `"${c.storeName.replace(/"/g, '""')}"`,
      `"${c.ownerName.replace(/"/g, '""')}"`,
      c.businessCategory,
      `"${c.location.replace(/"/g, '""')}"`,
      c.commissionRate,
      c.totalSales,
      c.totalCommission,
      c.withdrawableAmount,
      c.withdrawnAmount,
      c.lastWithdrawalDate || "",
      c.status,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `commissions-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 w-full" dir={isRtl ? "rtl" : "ltr"}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 start-6 z-50 bg-emerald-700 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans text-xs font-bold">
          <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            ✓
          </span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ms-3 text-white/75 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 4 KPI Metric Summary Cards */}
      <CommissionsStats commissions={commissions} t={t} isRtl={isRtl} />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-card-border shadow-sm gap-4">
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          placeholder={t.searchCommissionsPlaceholder}
          isRtl={isRtl}
          filterTitle={t.filter}
          filterButtonLabel={t.filter}
          filterOptions={filterOptions}
          activeFilter={statusFilter}
          onFilterSelect={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          showFilterDropdown={showFiltersDropdown}
          onToggleFilterDropdown={() =>
            setShowFiltersDropdown(!showFiltersDropdown)
          }
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-64 bg-surface rounded-2xl animate-pulse border border-card-border" />
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-card-border p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center text-2xl">
            💳
          </div>
          <span className="text-sm font-bold text-on-surface">
            {t.noCommissionsData}
          </span>
          <span className="text-xs text-outline max-w-sm">
            {isRtl
              ? "لم يتم العثور على أي متاجر تطابق معايير البحث أو التصفية الحالية."
              : "No stores match your current search or filter query."}
          </span>
        </div>
      ) : (
        /* Desktop Table & Mobile Cards */
        <>
          <div className="hidden sm:block">
            <CommissionsTable
              items={paginatedItems}
              onOpenWithdraw={handleOpenWithdraw}
              t={t}
              isRtl={isRtl}
            />
          </div>

          <div className="sm:hidden">
            <CommissionsCardList
              items={paginatedItems}
              onOpenWithdraw={handleOpenWithdraw}
              t={t}
              isRtl={isRtl}
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredItems.length}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                isRtl={isRtl}
              />
            </div>
          )}
        </>
      )}

      {/* Withdrawal Action Modal */}
      <WithdrawCommissionModal
        store={selectedStoreForWithdraw}
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          setSelectedStoreForWithdraw(null);
        }}
        onSuccess={handleWithdrawSuccess}
        t={t}
        isRtl={isRtl}
      />
    </div>
  );
};
