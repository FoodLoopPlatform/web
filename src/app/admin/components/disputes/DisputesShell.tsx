"use client";

import React, { useState, useCallback } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import {
  getSupportTickets,
  getSupportTicketById,
  replyToSupportTicket,
  closeSupportTicket,
  getAdminReviews,
  deleteReview,
  type SupportTicket,
  type Review,
} from "../../api/admin-api";
import { adminDictionary } from "../../constants/dictionary";
import { StatsCard } from "../common/StatsCard";
import { TabSwitcher, TabOption } from "../common/TabSwitcher";
import { SearchToolbar, FilterOption } from "../common/SearchToolbar";
import { SmartInsightCard } from "../common/SmartInsightCard";
import { AuditLogsWidget } from "../audit-log/AuditLogsWidget";
import { TicketCardList } from "./TicketCardList";
import { TicketTable } from "./TicketTable";
import { ReviewCardList } from "./ReviewCardList";
import { ReviewTable } from "./ReviewTable";
import { TicketDrawer } from "./TicketDrawer";
import { DisputesSkeleton } from "./DisputesSkeleton";

type DisputeTab = "Tickets" | "Reviews";
type PriorityFilter = "ALL" | "High" | "Medium" | "Low";

interface DisputesShellProps {
  initialTickets?: SupportTicket[];
  initialReviews?: Review[];
}

export function DisputesShell({
  initialTickets = [],
  initialReviews = [],
}: DisputesShellProps = {}) {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<DisputeTab>("Tickets");

  // Data states seeded from props or fetched on client
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialTickets.length === 0 && initialReviews.length === 0,
  );

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Ticket Detail Drawer
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [showTicketDrawer, setShowTicketDrawer] = useState(false);

  const fetchDisputesData = useCallback(async () => {
    try {
      const [ticketsRes, reviewsRes] = await Promise.all([
        getSupportTickets(),
        getAdminReviews(),
      ]);
      if (ticketsRes.data) setTickets(ticketsRes.data);
      if (reviewsRes.data) setReviews(reviewsRes.data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (initialTickets.length === 0 && initialReviews.length === 0) {
      fetchDisputesData();
    }
  }, [initialTickets.length, initialReviews.length, fetchDisputesData]);

  const handleOpenTicket = async (id: string) => {
    const ticketRes = await getSupportTicketById(id);
    if (ticketRes.data) {
      setSelectedTicket(ticketRes.data);
      setShowTicketDrawer(true);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    const updatedRes = await replyToSupportTicket(
      selectedTicket.id,
      replyMessage,
    );
    if (updatedRes.data) {
      setSelectedTicket(updatedRes.data);
      setReplyMessage("");
      fetchDisputesData();
    }
  };

  const handleCloseTicket = async (id: string) => {
    const confirmMsg = isRtl
      ? "هل أنت متأكد من إغلاق وحل هذه التذكرة؟"
      : "Are you sure you want to resolve and close this ticket?";
    if (confirm(confirmMsg)) {
      await closeSupportTicket(id);
      setShowTicketDrawer(false);
      setSelectedTicket(null);
      await fetchDisputesData();
    }
  };

  const handleDeleteReview = async (id: string) => {
    const confirmMsg = isRtl
      ? "هل أنت متأكد من حذف هذا التقييم بناءً على البلاغ؟"
      : "Are you sure you want to delete this flagged review?";
    if (confirm(confirmMsg)) {
      await deleteReview(id);
      fetchDisputesData();
    }
  };

  const handleDismissFlag = (id: string) => {
    alert(
      isRtl
        ? "تم تجاهل البلاغ والحفاظ على التقييم بنجاح."
        : "Dismissed flag. Review kept.",
    );
    setReviews(reviews.filter((r) => r.id !== id));
  };

  const getFilteredItems = () => {
    if (activeTab === "Tickets") {
      return tickets.filter((t) => {
        const matchesSearch =
          (t.subject ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.userName ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (t.id ?? "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority =
          priorityFilter === "ALL" || t.priority === priorityFilter;
        return matchesSearch && matchesPriority;
      });
    } else {
      return reviews.filter((r) => {
        return (
          r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.flagReason ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }
  };

  const filteredItems = getFilteredItems();

  const openTicketsCount = tickets.filter((t) => t.status === "Open").length;
  const closedTicketsCount = tickets.filter(
    (t) => t.status === "Closed",
  ).length;

  const tabOptions: TabOption<DisputeTab>[] = [
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight font-brand">
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
          value={tickets.length + reviews.length}
          accentClass="bg-primary-container/20"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.openDisputes}
          value={openTicketsCount}
          accentClass="bg-red-500"
          textColorClass="text-red-900"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.resolvedDisputes}
          value={closedTicketsCount}
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
          activeTab === "Tickets"
            ? t.searchPlaceholder
            : t.searchReviewsPlaceholder
        }
        isRtl={isRtl}
        filterTitle={activeTab === "Tickets" ? t.filterPriority : undefined}
        filterButtonLabel={t.filter}
        filterOptions={activeTab === "Tickets" ? priorityOptions : undefined}
        activeFilter={priorityFilter}
        onFilterSelect={(f) => setPriorityFilter(f)}
        showFilterDropdown={showFilters}
        onToggleFilterDropdown={() => setShowFilters(!showFilters)}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Main List / Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-w-0">
          {activeTab === "Tickets" ? (
            <>
              <TicketCardList
                tickets={filteredItems as SupportTicket[]}
                t={t}
                isRtl={isRtl}
                onOpenTicket={handleOpenTicket}
                onCloseTicket={handleCloseTicket}
              />
              <div className="hidden md:block overflow-x-auto w-full">
                <TicketTable
                  tickets={filteredItems as SupportTicket[]}
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
                reviews={filteredItems as Review[]}
                t={t}
                isRtl={isRtl}
                onDeleteReview={handleDeleteReview}
                onDismissFlag={handleDismissFlag}
              />
              <div className="hidden md:block overflow-x-auto w-full">
                <ReviewTable
                  reviews={filteredItems as Review[]}
                  t={t}
                  isRtl={isRtl}
                  onDeleteReview={handleDeleteReview}
                  onDismissFlag={handleDismissFlag}
                />
              </div>
            </>
          )}
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

      {/* Ticket Detail Drawer */}
      {showTicketDrawer && selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          t={t}
          isRtl={isRtl}
          replyMessage={replyMessage}
          onReplyChange={setReplyMessage}
          onSendReply={handleSendReply}
          onCloseDrawer={() => {
            setShowTicketDrawer(false);
            setSelectedTicket(null);
          }}
          onResolveTicket={handleCloseTicket}
        />
      )}
    </div>
  );
}
