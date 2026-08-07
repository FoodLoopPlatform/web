"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import { adminDictionary } from "../../constants/dictionary";
import {
  getModerationQueue,
  approveModerationItem,
  rejectModerationItem,
  requestChangesModerationItem,
  resetModerationQueue,
  ModerationItem,
} from "../../api/admin-api";

import { ModerationPageHeader } from "./ModerationPageHeader";
import { ModerationListingCard } from "./ModerationListingCard";
import { ModerationEmptyState } from "./ModerationEmptyState";
import { ModerationFilterModal } from "./ModerationFilterModal";
import { ConfirmationModal } from "../common/ConfirmationModal";

interface ModerationShellProps {
  initialItems?: ModerationItem[];
}

export function ModerationShell({ initialItems = [] }: ModerationShellProps) {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [items, setItems] = useState<ModerationItem[]>(initialItems);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialItems.length === 0,
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlagType, setSelectedFlagType] = useState<string>("ALL");
  const [confidenceRange, setConfidenceRange] = useState<
    "ALL" | "low" | "medium" | "high"
  >("ALL");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Skip initial effect execution if initialItems were pre-fetched
  const isFirstRender = useRef(true);

  // Action Modals State
  const [activeActionModal, setActiveActionModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject" | "requestChanges" | null;
    itemId: string | null;
  }>({ isOpen: false, type: null, itemId: null });

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialItems.length > 0) {
        return;
      }
    }

    let isSubscribed = true;

    let minConf: number | undefined;
    let maxConf: number | undefined;

    if (confidenceRange === "low") {
      maxConf = 49;
    } else if (confidenceRange === "medium") {
      minConf = 50;
      maxConf = 74;
    } else if (confidenceRange === "high") {
      minConf = 75;
    }

    setIsLoading(true);

    getModerationQueue({
      search: searchQuery,
      flagType: selectedFlagType,
      minConfidence: minConf,
      maxConfidence: maxConf,
    })
      .then((res) => {
        if (isSubscribed && res.data) {
          setItems(res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading moderation queue:", err);
      })
      .finally(() => {
        if (isSubscribed) {
          setIsLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [searchQuery, selectedFlagType, confidenceRange, initialItems.length]);

  // Handle Refresh Queue from Empty State
  const handleRefreshQueue = async () => {
    setIsRefreshing(true);
    try {
      resetModerationQueue();
      const res = await getModerationQueue({
        search: searchQuery,
        flagType: selectedFlagType,
      });
      if (res.data) {
        setItems(res.data);
      }
      showToast(
        isRtl
          ? "تمت إعادة جلب قائمة المراجعة بنجاح"
          : "Queue refreshed successfully",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // Trigger modals for actions
  const handleOpenApproveModal = (id: string) => {
    setActiveActionModal({ isOpen: true, type: "approve", itemId: id });
  };

  const handleOpenRejectModal = (id: string) => {
    setActiveActionModal({ isOpen: true, type: "reject", itemId: id });
  };

  const handleOpenRequestChangesModal = (id: string) => {
    setActiveActionModal({ isOpen: true, type: "requestChanges", itemId: id });
  };

  // Execution handlers for modals
  const handleConfirmAction = async (reasonOrNotes?: string) => {
    const { type, itemId } = activeActionModal;
    if (!itemId || !type) return;

    setActiveActionModal({ isOpen: false, type: null, itemId: null });

    // Optimistic UI Removal
    setItems((prev) => prev.filter((item) => item.id !== itemId));

    try {
      if (type === "approve") {
        await approveModerationItem(itemId);
        showToast(
          isRtl
            ? "تم التوثيق والقبول بنجاح"
            : "Approved and published successfully",
        );
      } else if (type === "reject") {
        await rejectModerationItem(itemId, reasonOrNotes);
        showToast(
          isRtl ? "تم رفض القائمة بنجاح" : "Listing rejected successfully",
        );
      } else if (type === "requestChanges") {
        await requestChangesModerationItem(itemId, reasonOrNotes);
        showToast(
          isRtl
            ? "تم إرسال طلب التعديلات للمتجر"
            : "Change request sent to store",
        );
      }
    } catch (err) {
      console.error("Action error:", err);
      handleRefreshQueue(); // Revert on failure
    }
  };

  const selectedItem = items.find((i) => i.id === activeActionModal.itemId);

  const isFilterActive =
    selectedFlagType !== "ALL" ||
    confidenceRange !== "ALL" ||
    searchQuery.trim() !== "";

  return (
    <div
      style={{ width: "100%", minWidth: "100%" }}
      className="w-full flex flex-col gap-5 lg:gap-6 max-w-[1600px] mx-auto min-h-screen pb-12 font-sans"
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-primary text-on-primary font-bold text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-primary-fixed-dim animate-bounce">
          <svg
            className="w-4 h-4 text-primary-fixed shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header (Eyebrow + Title + Pending Pill + Filter Button) */}
      <ModerationPageHeader
        pendingCount={items.length}
        t={t}
        isRtl={isRtl}
        onFilterClick={() => setIsFilterModalOpen(true)}
        isFilterActive={isFilterActive}
      />

      {/* Search Bar Input */}
      <div className="relative w-full max-w-xl sm:max-w-2xl">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchModerationPlaceholder}
          className={`w-full bg-surface-container-high border border-outline-variant/60 focus:border-primary rounded-full py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs ${
            isRtl ? "pr-10 pl-4" : "pl-10 pr-4"
          }`}
        />
        <svg
          className={`w-4 h-4 text-outline absolute top-1/2 -translate-y-1/2 pointer-events-none ${
            isRtl ? "right-3.5" : "left-3.5"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer ${
              isRtl ? "left-3.5" : "right-3.5"
            }`}
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Content State Rendering */}
      {isLoading ? (
        <div className="py-20 flex flex-col justify-center items-center gap-3 text-xs font-bold text-outline">
          <svg
            className="animate-spin h-6 w-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>
            {isRtl
              ? "جارٍ جلب قائمة المراجعة..."
              : "Loading moderation queue..."}
          </span>
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <ModerationEmptyState
          t={t}
          isRtl={isRtl}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
          onRefresh={handleRefreshQueue}
          isRefreshing={isRefreshing}
          lastSyncTime={new Date().toLocaleTimeString(
            isRtl ? "ar-EG" : "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          )}
        />
      ) : (
        /* Active State - Compact Multi-Column Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
          {items.map((item) => (
            <ModerationListingCard
              key={item.id}
              item={item}
              t={t}
              isRtl={isRtl}
              onApprove={handleOpenApproveModal}
              onReject={handleOpenRejectModal}
              onRequestChanges={handleOpenRequestChangesModal}
            />
          ))}
        </div>
      )}

      {/* Filter Modal */}
      <ModerationFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        t={t}
        isRtl={isRtl}
        selectedFlagType={selectedFlagType}
        onSelectFlagType={(flag) => setSelectedFlagType(flag)}
        confidenceRange={confidenceRange}
        onSelectConfidenceRange={(range) => setConfidenceRange(range)}
        onResetFilters={() => {
          setSelectedFlagType("ALL");
          setConfidenceRange("ALL");
          setSearchQuery("");
          setIsFilterModalOpen(false);
        }}
      />

      {/* Confirmation Modals for Actions */}
      <ConfirmationModal
        isOpen={
          activeActionModal.isOpen && activeActionModal.type === "approve"
        }
        title={t.confirmApproveTitle}
        message={
          selectedItem
            ? isRtl
              ? `هل ترغب في توثيق ونشر "${selectedItem.productNameAr || selectedItem.productName}" على المنصة؟`
              : `Approve and publish "${selectedItem.productNameEn || selectedItem.productName}" for the community?`
            : t.confirmApproveMsg
        }
        confirmLabel={t.approveBtn}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="success"
        isRtl={isRtl}
        onConfirm={() => handleConfirmAction()}
        onClose={() =>
          setActiveActionModal({ isOpen: false, type: null, itemId: null })
        }
      />

      <ConfirmationModal
        isOpen={activeActionModal.isOpen && activeActionModal.type === "reject"}
        title={t.confirmRejectTitle}
        message={
          selectedItem
            ? isRtl
              ? `هل ترغب في رفض وحذف قائمة "${selectedItem.productNameAr || selectedItem.productName}"؟ يمكنك تقديم سبب الرفض أدناه.`
              : `Reject and delete "${selectedItem.productNameEn || selectedItem.productName}"? You can provide a reason below.`
            : t.confirmRejectMsg
        }
        confirmLabel={t.rejectBtn}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="danger"
        showReasonInput={true}
        reasonPlaceholder={
          isRtl ? "سبب الرفض والرفع..." : "Enter reason for rejection..."
        }
        presetReasons={
          isRtl
            ? [
                "بيانات مضللة",
                "مستندات غير واضحة",
                "مخالفة معايير الجودة والسلامة",
                "منتج مكرر تم نشره سابقاً",
              ]
            : [
                "Misleading information",
                "Unclear documentation",
                "Safety policy violation",
                "Duplicate listing",
              ]
        }
        isRtl={isRtl}
        onConfirm={(reason) => handleConfirmAction(reason)}
        onClose={() =>
          setActiveActionModal({ isOpen: false, type: null, itemId: null })
        }
      />

      <ConfirmationModal
        isOpen={
          activeActionModal.isOpen &&
          activeActionModal.type === "requestChanges"
        }
        title={t.requestChangesModalTitle}
        message={
          selectedItem
            ? isRtl
              ? `طلب تعديلات وملاحظات إضافية من متجر "${selectedItem.storeNameAr || selectedItem.storeName}" على منتج "${selectedItem.productNameAr || selectedItem.productName}".`
              : `Request modifications for "${selectedItem.productNameEn || selectedItem.productName}" from "${selectedItem.storeNameEn || selectedItem.storeName}".`
            : t.requestChangesModalTitle
        }
        confirmLabel={t.requestChangesBtn}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="warning"
        showReasonInput={true}
        reasonPlaceholder={t.requestChangesPlaceholder}
        presetReasons={
          isRtl
            ? [
                "توضيح مكونات وحالة المنتج",
                "إعادة التقاط صورة أوجب وأوضح للمنتج",
                "التأكد من سعر العرض مقارنة بالسعر الأصلي",
              ]
            : [
                "Clarify ingredients and condition",
                "Upload higher resolution product image",
                "Verify offer price vs original price",
              ]
        }
        isRtl={isRtl}
        onConfirm={(notes) => handleConfirmAction(notes)}
        onClose={() =>
          setActiveActionModal({ isOpen: false, type: null, itemId: null })
        }
      />
    </div>
  );
}
