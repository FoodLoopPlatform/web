/* eslint-disable max-lines */
"use client";

import React, { useState, useCallback } from "react";
import { useAppLang } from "@/store/use-app-lang";
import {
  getSupportTickets,
  getSupportTicketById,
  replyToSupportTicket,
  closeSupportTicket,
  getAdminReviews,
  deleteReview,
  getDisputes,
  resolveDispute,
  type SupportTicket,
  type TicketReply,
  type Review,
  type Dispute,
} from "../../api/admin-api";
import { adminDictionary } from "../../constants/dictionary";
import { StatsCard } from "../common/StatsCard";
import { TabSwitcher, TabOption } from "../common/TabSwitcher";
import { SearchToolbar, FilterOption } from "../common/SearchToolbar";
import { SmartInsightCard } from "../common/SmartInsightCard";
import { AuditLogsWidget } from "../audit-log/AuditLogsWidget";
import { DisputeCardList } from "./DisputeCardList";
import { DisputeTable } from "./DisputeTable";
import { TicketCardList } from "./TicketCardList";
import { TicketTable } from "./TicketTable";
import { ReviewCardList } from "./ReviewCardList";
import { ReviewTable } from "./ReviewTable";
import { TicketDrawer } from "./TicketDrawer";
import { DisputesSkeleton } from "./DisputesSkeleton";
import { Pagination } from "../common/Pagination";
import { ConfirmationModal } from "../common/ConfirmationModal";

type DisputeTab = "Disputes" | "Tickets" | "Reviews";
type PriorityFilter = "ALL" | "High" | "Medium" | "Low";

const PAGE_SIZE = 5;

interface DisputesShellProps {
  initialDisputes?: Dispute[];
  initialTickets?: SupportTicket[];
  initialReviews?: Review[];
}

export function DisputesShell({
  initialDisputes = [],
  initialTickets = [],
  initialReviews = [],
}: DisputesShellProps = {}) {
  const { lang } = useAppLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<DisputeTab>("Disputes");

  // Data states seeded from props or fetched on client
  const [disputes, setDisputes] = useState<Dispute[]>(initialDisputes);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialDisputes.length === 0 &&
      initialTickets.length === 0 &&
      initialReviews.length === 0,
  );

  // Search/Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when tab or filters change
  const filterKey = `${activeTab}-${searchQuery}-${priorityFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  // Dispute Resolution Modal State
  const [resolveDisputeModalId, setResolveDisputeModalId] = useState<
    string | null
  >(null);

  // Ticket Detail Drawer
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [showTicketDrawer, setShowTicketDrawer] = useState(false);
  const [localRepliesMap, setLocalRepliesMap] = useState<
    Record<string, TicketReply[]>
  >({});

  // Custom Resolution Modal State
  const [resolveTicketId, setResolveTicketId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const fetchDisputesData = useCallback(async () => {
    try {
      const [disputesRes, ticketsRes, reviewsRes] = await Promise.all([
        getDisputes(),
        getSupportTickets(),
        getAdminReviews(),
      ]);
      if (disputesRes.data && disputesRes.data.length > 0) {
        setDisputes(disputesRes.data);
      }
      if (ticketsRes.data && ticketsRes.data.length > 0) {
        setTickets(ticketsRes.data);
      }
      if (reviewsRes.data && reviewsRes.data.length > 0) {
        setReviews(reviewsRes.data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (
      initialDisputes.length === 0 &&
      initialTickets.length === 0 &&
      initialReviews.length === 0
    ) {
      fetchDisputesData();
    }
  }, [
    initialDisputes.length,
    initialTickets.length,
    initialReviews.length,
    fetchDisputesData,
  ]);

  const disputeToTicket = useCallback(
    (dispute: Dispute): SupportTicket => ({
      id: dispute.id,
      userType: dispute.raisedByType || "Consumer",
      userName: dispute.raisedByName,
      userEmail: dispute.raisedByName,
      subject: dispute.orderId ? `طلب رقم: ${dispute.orderId}` : dispute.reason,
      description: dispute.reason,
      status: dispute.isResolved ? "Closed" : "Pending",
      priority: "High",
      createdAt: dispute.createdAt,
      replies: dispute.adminNote
        ? [
            {
              id: `rep_${dispute.id}`,
              sender: "Admin",
              message: dispute.adminNote,
              createdAt: dispute.resolvedAt || dispute.createdAt,
            },
          ]
        : [],
    }),
    [],
  );

  const handleOpenDispute = (id: string) => {
    const target = disputes.find((d) => d.id === id);
    if (target) {
      setSelectedTicket(disputeToTicket(target));
      setShowTicketDrawer(true);
    }
  };

  const handleResolveDisputeClick = (id: string) => {
    setResolveDisputeModalId(id);
  };

  const confirmResolveDisputeModal = async (reasonNote?: string) => {
    if (!resolveDisputeModalId) return;
    const id = resolveDisputeModalId;
    const noteText =
      (reasonNote || "").trim() ||
      (isRtl
        ? "تمت تسوية النزاع وتوثيق الحل من قِبل الإدارة"
        : "Resolved by admin.");

    setResolveDisputeModalId(null);
    setShowTicketDrawer(false);
    setSelectedTicket(null);

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isResolved: true,
              adminNote: noteText,
              resolvedAt: new Date().toISOString(),
            }
          : d,
      ),
    );

    await resolveDispute(id, noteText);
    await fetchDisputesData();
  };

  const handleOpenTicket = async (id: string) => {
    // 1. Immediately open drawer with local item so UI reacts instantly
    const local = tickets.find((t) => t.id === id);
    if (local) {
      const extra = localRepliesMap[id] || [];
      const existingIds = new Set((local.replies || []).map((r) => r.id));
      const mergedReplies = [
        ...(local.replies || []),
        ...extra.filter((r) => !existingIds.has(r.id)),
      ];
      setSelectedTicket({ ...local, replies: mergedReplies });
      setShowTicketDrawer(true);
    }

    // 2. Fetch fresh ticket details from API if possible
    try {
      const ticketRes = await getSupportTicketById(id);
      if (ticketRes?.data) {
        const extra = localRepliesMap[id] || [];
        const existingIds = new Set(
          (ticketRes.data.replies || []).map((r) => r.id),
        );
        const mergedReplies = [
          ...(ticketRes.data.replies || []),
          ...extra.filter((r) => !existingIds.has(r.id)),
        ];
        setSelectedTicket({ ...ticketRes.data, replies: mergedReplies });
        setShowTicketDrawer(true);
      }
    } catch {
      // Keep local item open if single ticket API endpoint fails
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const msg = replyMessage.trim();
    setReplyMessage("");

    const newReply = {
      id: `rep_${Date.now()}`,
      sender: "Admin" as const,
      message: msg,
      createdAt: new Date().toISOString(),
    };

    // Store in localRepliesMap permanently for this session
    setLocalRepliesMap((prev) => ({
      ...prev,
      [selectedTicket.id]: [...(prev[selectedTicket.id] || []), newReply],
    }));

    // Optimistically update selectedTicket and lists
    const updatedReplies = [...(selectedTicket.replies || []), newReply];
    const updatedSelectedTicket = {
      ...selectedTicket,
      replies: updatedReplies,
    };

    setSelectedTicket(updatedSelectedTicket);
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? updatedSelectedTicket : t)),
    );

    const isDispute = disputes.some((d) => d.id === selectedTicket.id);
    if (isDispute) {
      await resolveDispute(selectedTicket.id, msg);
      setShowTicketDrawer(false);
      setSelectedTicket(null);
      await fetchDisputesData();
      return;
    }

    const updatedRes = await replyToSupportTicket(selectedTicket.id, msg);
    if (updatedRes.data && updatedRes.data.replies?.length) {
      const serverTicket = updatedRes.data;
      const extra = localRepliesMap[selectedTicket.id] || [];
      const existingIds = new Set(
        (serverTicket.replies || []).map((r) => r.id),
      );
      const mergedReplies = [
        ...(serverTicket.replies || []),
        ...extra.filter((r) => !existingIds.has(r.id)),
      ];
      setSelectedTicket({ ...serverTicket, replies: mergedReplies });
    }
  };

  const handleCloseTicket = (id: string) => {
    setResolveTicketId(id);
    setResolutionNote(
      isRtl
        ? "تمت مراجعة المنتج وتصحيح الحالة من قِبل الإدارة"
        : "Reviewed and confirmed — product issue addressed.",
    );
  };

  const confirmResolveTicket = async () => {
    if (!resolveTicketId) return;

    const id = resolveTicketId;
    const noteText = resolutionNote;

    setResolveTicketId(null);
    setResolutionNote("");

    // Optimistically mark as Closed locally
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Closed" } : t)),
    );

    setShowTicketDrawer(false);
    setSelectedTicket(null);

    await closeSupportTicket(id, noteText);
    await fetchDisputesData();
  };

  // Review Delete Confirmation State
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);

  const handleDeleteReview = (id: string) => {
    setDeleteReviewId(id);
  };

  const confirmDeleteReview = async () => {
    if (!deleteReviewId) return;
    const id = deleteReviewId;
    setDeleteReviewId(null);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await deleteReview(id);
    fetchDisputesData();
  };

  const handleDismissFlag = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const getFilteredItems = () => {
    const q = searchQuery.toLowerCase().trim();
    if (activeTab === "Disputes") {
      return disputes.filter((d) => {
        if (!q) return true;
        return (
          (d.reason ?? "").toLowerCase().includes(q) ||
          (d.raisedByName ?? "").toLowerCase().includes(q) ||
          (d.id ?? "").toLowerCase().includes(q) ||
          (d.orderId ?? "").toLowerCase().includes(q)
        );
      });
    } else if (activeTab === "Tickets") {
      return tickets.filter((t) => {
        const matchesSearch =
          !q ||
          (t.subject ?? "").toLowerCase().includes(q) ||
          (t.userName ?? "").toLowerCase().includes(q) ||
          (t.id ?? "").toLowerCase().includes(q);
        const matchesPriority =
          priorityFilter === "ALL" || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      });
    } else {
      const list = (reviews || []) as Review[];
      return list.filter((r) => {
        if (!q) return true;
        return (
          (r.userName ?? "").toLowerCase().includes(q) ||
          (r.storeName ?? "").toLowerCase().includes(q) ||
          (r.comment ?? "").toLowerCase().includes(q) ||
          (r.flagReason ?? "").toLowerCase().includes(q)
        );
      });
    }
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const openDisputesCount = disputes.filter((d) => !d.isResolved).length;
  const resolvedDisputesCount = disputes.filter((d) => d.isResolved).length;

  const tabOptions: TabOption<DisputeTab>[] = [
    { id: "Disputes", label: t.disputesTabLabel },
    { id: "Tickets", label: t.tickets },
    { id: "Reviews", label: t.reviews },
  ];

  const priorityOptions: FilterOption<PriorityFilter>[] = [
    { id: "ALL", label: t.all },
    { id: "High", label: t.high },
    { id: "Medium", label: t.medium },
    { id: "Low", label: t.low },
  ];

  if (isLoading) {
    return <DisputesSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto">
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight font-sans">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-outline">{t.subtitle}</p>
        </div>

        <TabSwitcher
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label={t.totalDisputes}
          value={disputes.length}
          accentClass="bg-primary-container/20"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.openDisputes}
          value={openDisputesCount}
          accentClass="bg-red-500"
          textColorClass="text-red-900"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.resolvedDisputes}
          value={resolvedDisputesCount}
          accentClass="bg-green-500"
          textColorClass="text-green-900"
          isRtl={isRtl}
        />
      </div>

      {/* Search Toolbar */}
      <SearchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder={
          activeTab === "Reviews"
            ? t.searchReviewsPlaceholder
            : t.searchPlaceholder
        }
        isRtl={isRtl}
        filterTitle={activeTab !== "Reviews" ? t.filterPriority : undefined}
        filterButtonLabel={t.filter}
        filterOptions={activeTab !== "Reviews" ? priorityOptions : undefined}
        activeFilter={priorityFilter}
        onFilterSelect={(f) => setPriorityFilter(f)}
        showFilterDropdown={showFilters}
        onToggleFilterDropdown={() => setShowFilters(!showFilters)}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Main List / Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-w-0">
          {activeTab === "Disputes" ? (
            <>
              <DisputeCardList
                disputes={paginatedItems as Dispute[]}
                t={t}
                isRtl={isRtl}
                onOpenDispute={handleOpenDispute}
                onResolveDispute={handleResolveDisputeClick}
              />
              <div className="hidden md:block overflow-x-auto w-full">
                <DisputeTable
                  disputes={paginatedItems as Dispute[]}
                  t={t}
                  isRtl={isRtl}
                  onOpenDispute={handleOpenDispute}
                  onResolveDispute={handleResolveDisputeClick}
                />
              </div>
            </>
          ) : activeTab === "Tickets" ? (
            <>
              <TicketCardList
                tickets={paginatedItems as SupportTicket[]}
                t={t}
                isRtl={isRtl}
                onOpenTicket={handleOpenTicket}
                onCloseTicket={handleCloseTicket}
              />
              <div className="hidden md:block overflow-x-auto w-full">
                <TicketTable
                  tickets={paginatedItems as SupportTicket[]}
                  t={t}
                  isRtl={isRtl}
                  onOpenTicket={handleOpenTicket}
                  onCloseTicket={handleCloseTicket}
                />
              </div>
            </>
          ) : (
            <>
              <ReviewCardList
                reviews={paginatedItems as Review[]}
                t={t}
                isRtl={isRtl}
                onDeleteReview={handleDeleteReview}
                onDismissFlag={handleDismissFlag}
              />
              <div className="hidden md:block overflow-x-auto w-full">
                <ReviewTable
                  reviews={paginatedItems as Review[]}
                  t={t}
                  isRtl={isRtl}
                  onDeleteReview={handleDeleteReview}
                  onDismissFlag={handleDismissFlag}
                />
              </div>
            </>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
            isRtl={isRtl}
          />
        </div>

        {/* Side Column */}
        <div className="flex flex-col gap-6">
          <SmartInsightCard
            title={t.smartTitle}
            heading={
              isRtl
                ? "قاعدة معالجة النزاعات التلقائية"
                : "Automatic Dispute Resolution Rule"
            }
            bodyText={
              isRtl
                ? "التذاكر ذات الأولوية العالية غير المعالجة لأكثر من 24 ساعة تتطلب تنبيهاً فورياً لإدارة العمليات لتجنب تأثير النزاعات المالية على المتاجر."
                : "High priority tickets left unaddressed for >24 hours require instant admin escalation to prevent financial conflicts."
            }
            actionLabel={isRtl ? "مراجعة القواعد" : "Review Rules"}
            onActionClick={() => {
              window.location.href = "/admin/settings";
            }}
            isRtl={isRtl}
          />
          <AuditLogsWidget title={t.auditLogsTitle} logs={[]} isRtl={isRtl} />
        </div>
      </div>

      {/* Ticket / Dispute Detail Drawer */}
      {showTicketDrawer && selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          t={t}
          isRtl={isRtl}
          isDispute={disputes.some((d) => d.id === selectedTicket.id)}
          replyMessage={replyMessage}
          onReplyChange={setReplyMessage}
          onSendReply={handleSendReply}
          onCloseDrawer={() => {
            setShowTicketDrawer(false);
            setSelectedTicket(null);
          }}
          onResolveTicket={(id) => {
            const isDispute = disputes.some((d) => d.id === id);
            if (isDispute) {
              setResolveDisputeModalId(id);
            } else {
              handleCloseTicket(id);
            }
          }}
        />
      )}

      {/* Dispute Resolution Modal */}
      <ConfirmationModal
        isOpen={Boolean(resolveDisputeModalId)}
        title={isRtl ? "اعتماد وتسوية النزاع" : "Resolve Dispute"}
        message={
          isRtl
            ? "هل أنت متأكد من تسوية وإغلاق هذا النزاع؟ سيتم اعتماد الإجراء وتسجيل ملاحظة الحل."
            : "Are you sure you want to resolve and close this dispute? Notes will be logged."
        }
        confirmLabel={isRtl ? "تأكيد وتسوية النزاع" : "Confirm Resolution"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="success"
        isRtl={isRtl}
        showReasonInput={true}
        reasonPlaceholder={
          isRtl
            ? "أدخل ملاحظات القرار والتسوية والإجراء المتخذ..."
            : "Enter resolution notes or administrative decision..."
        }
        onConfirm={confirmResolveDisputeModal}
        onClose={() => setResolveDisputeModalId(null)}
      />

      {/* Ticket Resolution Modal */}
      {resolveTicketId && (
        <div className="fixed inset-0 z-[10000] w-full h-full min-h-screen flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className="bg-white rounded-2xl border border-card-border shadow-2xl w-[90vw] sm:w-[460px] min-w-[320px] shrink-0 p-6 flex flex-col gap-4"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">
                {isRtl ? "حل وإغلاق الشكوى" : "Resolve & Close Ticket"}
              </h3>
              <p className="text-xs text-outline">
                {isRtl
                  ? "أدخل ملاحظات التوجيه أو الإغلاق الخاصة بحل الشكوى للتسجيل في السجل:"
                  : "Enter resolution notes for the ticket audit log:"}
              </p>
            </div>

            <textarea
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-outline-variant text-xs text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary-container/40 focus:border-primary-container resize-none"
              placeholder={
                isRtl
                  ? "أدخل تفاصيل وملاحظات الإدارة..."
                  : "Enter resolution details..."
              }
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setResolveTicketId(null);
                  setResolutionNote("");
                }}
                className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
              >
                {isRtl ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmResolveTicket}
                className="px-5 py-2 text-xs font-bold bg-primary-container text-white hover:bg-primary-container/90 rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {isRtl ? "تأكيد الإغلاق والحل" : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteReviewId)}
        title={isRtl ? "حذف التقييم" : "Delete Review"}
        message={
          isRtl
            ? "هل أنت متأكد من حذف هذا التقييم بناءً على البلاغ؟ لا يمكن التراجع عن هذا الإجراء."
            : "Are you sure you want to delete this flagged review? This action cannot be undone."
        }
        confirmLabel={isRtl ? "تأكيد الحذف" : "Confirm Delete"}
        cancelLabel={isRtl ? "إلغاء" : "Cancel"}
        variant="danger"
        isRtl={isRtl}
        onConfirm={confirmDeleteReview}
        onClose={() => setDeleteReviewId(null)}
      />
    </div>
  );
}
