"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppLang } from "@/store/use-app-lang";
import {
  updateUserStatus,
  verifyStore,
  verifyCharity,
  getUserActivityLog,
  getAnalyticsSummary,
  getAdminConsumers,
  getAdminStores,
  getAdminCharities,
  type Consumer,
  type Store,
  type Charity,
  type ActivityLog,
  type AnalyticsSummary,
} from "../../api/admin-api";
import { adminDictionary } from "../../constants/dictionary";
import { AdminUserItem } from "../../types/admin.types";
import { UserManagementStats } from "./UserManagementStats";
import { UserManagementToolbarActions } from "./UserManagementToolbarActions";
import { TabSwitcher, TabOption } from "../common/TabSwitcher";
import { SearchToolbar, FilterOption } from "../common/SearchToolbar";
import { SmartInsightCard } from "../common/SmartInsightCard";
import { AuditLogsWidget } from "../audit-log/AuditLogsWidget";
import { UserCardList } from "./UserCardList";
import { UserTable } from "./UserTable";
import { Pagination } from "../common/Pagination";
import { EnrollModal } from "./EnrollModal";
import { ActivityLogsDrawer } from "./ActivityLogsDrawer";
import { UserManagementSkeleton } from "./UserManagementSkeleton";
import {
  exportAdminCSV,
  getSmartRecommendation,
} from "../../utils/admin-helpers";
import { UserManagementShellProps } from "../../types/user-management.types";

type ActorTab = "Consumers" | "Stores" | "Charities";
type StatusFilter = "ALL" | "ACTIVE" | "PENDING" | "SUSPENDED";

export function UserManagementShell({
  initialAnalytics = null,
  initialConsumers = [],
  initialStores = [],
  initialCharities = [],
}: UserManagementShellProps = {}) {
  const { lang } = useAppLang();
  const router = useRouter();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<ActorTab>("Consumers");

  // Data states — seeded directly from props
  const [consumers, setConsumers] = useState<Consumer[]>(initialConsumers);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [charities, setCharities] = useState<Charity[]>(initialCharities);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(
    initialAnalytics,
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    initialConsumers.length === 0 &&
      initialStores.length === 0 &&
      initialCharities.length === 0,
  );

  useEffect(() => {
    if (
      initialConsumers.length > 0 ||
      initialStores.length > 0 ||
      initialCharities.length > 0
    ) {
      return;
    }

    let isSubscribed = true;

    Promise.all([
      getAnalyticsSummary(),
      getAdminConsumers(),
      getAdminStores(),
      getAdminCharities(),
    ])
      .then(([analyticsRes, consumersRes, storesRes, charitiesRes]) => {
        if (!isSubscribed) return;
        if (analyticsRes.data) setAnalytics(analyticsRes.data);
        if (consumersRes.data) setConsumers(consumersRes.data);
        if (storesRes.data) setStores(storesRes.data);
        if (charitiesRes.data) setCharities(charitiesRes.data);
      })
      .catch((err) => {
        console.error("Error loading user management data:", err);
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [initialConsumers.length, initialStores.length, initialCharities.length]);

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleTabChange = (tab: ActorTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handleFilterSelect = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  // Modal & Drawer states
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: "",
    email: "",
    location: "",
    extra: "",
  });

  const [selectedUserLogs, setSelectedUserLogs] = useState<ActivityLog[]>([]);
  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const refreshAllData = async () => {
    const [analyticsRes, consumersRes, storesRes, charitiesRes] =
      await Promise.all([
        getAnalyticsSummary(),
        getAdminConsumers(),
        getAdminStores(),
        getAdminCharities(),
      ]);
    if (analyticsRes.data) setAnalytics(analyticsRes.data);
    if (consumersRes.data) setConsumers(consumersRes.data);
    if (storesRes.data) setStores(storesRes.data);
    if (charitiesRes.data) setCharities(charitiesRes.data);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus: "ACTIVE" | "SUSPENDED" =
      currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

    // Optimistic UI Update
    if (activeTab === "Consumers") {
      setConsumers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)),
      );
      const res = await updateUserStatus(id, nextStatus);
      if (res.error) {
        alert(`Error toggling status: ${res.error}`);
        refreshAllData();
      }
    } else if (activeTab === "Stores") {
      setStores((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus } : s)),
      );
      const action = nextStatus === "ACTIVE" ? "Approved" : "Rejected";
      const res = await verifyStore(id, action);
      if (res.error) {
        alert(`Error toggling store status: ${res.error}`);
        refreshAllData();
      }
    } else if (activeTab === "Charities") {
      setCharities((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c)),
      );
      const action = nextStatus === "ACTIVE" ? "Approved" : "Rejected";
      const res = await verifyCharity(id, action);
      if (res.error) {
        alert(`Error toggling charity status: ${res.error}`);
        refreshAllData();
      }
    }
  };

  const handleVerify = async (id: string) => {
    // Optimistic UI Update
    if (activeTab === "Stores") {
      setStores((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, verified: true, status: "ACTIVE" } : s,
        ),
      );
      const res = await verifyStore(id);
      if (res.error) {
        alert(`Error verifying store: ${res.error}`);
        refreshAllData();
      }
    } else if (activeTab === "Charities") {
      setCharities((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, verified: true, status: "ACTIVE" } : c,
        ),
      );
      const res = await verifyCharity(id);
      if (res.error) {
        alert(`Error verifying charity: ${res.error}`);
        refreshAllData();
      }
    }
  };

  const handleViewActivity = async (id: string, name: string) => {
    setSelectedUserId(id);
    setSelectedUserName(name);
    const logsRes = await getUserActivityLog(id);
    if (logsRes.data) {
      setSelectedUserLogs(logsRes.data);
    }
    setShowLogsDrawer(true);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add real API endpoint for enrolling new actors
    alert("Enroll functionality requires a backend endpoint.");
    setShowEnrollModal(false);
    setEnrollForm({ name: "", email: "", location: "", extra: "" });
  };

  const handleExportCSV = () => {
    exportAdminCSV(activeTab, consumers, stores, charities);
  };

  const filteredItems = useMemo(() => {
    let items: AdminUserItem[] = [];
    if (activeTab === "Consumers") items = consumers;
    else if (activeTab === "Stores") items = stores;
    else items = charities;

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location &&
          item.location.toLowerCase().includes(searchQuery.toLowerCase()));

      const itemStatus = (item.status || "ACTIVE").toString().toUpperCase();
      const targetStatus = statusFilter.toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        itemStatus === targetStatus ||
        (targetStatus === "ACTIVE" &&
          (itemStatus === "APPROVED" || itemStatus === "VERIFIED")) ||
        (targetStatus === "PENDING" &&
          (itemStatus === "UNVERIFIED" || itemStatus === "REVIEW"));
      return matchesSearch && matchesStatus;
    });
  }, [activeTab, consumers, stores, charities, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const recommendation = getSmartRecommendation(activeTab, isRtl)!;

  const tabOptions: TabOption<ActorTab>[] = [
    { id: "Consumers", label: t.consumers },
    { id: "Stores", label: t.stores },
    { id: "Charities", label: t.charities },
  ];

  const filterOptions: FilterOption<StatusFilter>[] = [
    { id: "ALL", label: t.all },
    { id: "ACTIVE", label: t.active },
    { id: "PENDING", label: t.pending },
    { id: "SUSPENDED", label: t.suspended },
  ];

  if (isLoading) {
    return <UserManagementSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto">
      {/* Header Title & Tab Switcher */}
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
          onTabChange={handleTabChange}
        />
      </div>

      {/* Top Metrics Banner */}
      <UserManagementStats t={t} analytics={analytics} isRtl={isRtl} />

      {/* Search and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-card-border shadow-sm gap-4">
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          placeholder={t.searchPlaceholder}
          isRtl={isRtl}
          filterTitle={t.filter}
          filterButtonLabel={t.filter}
          filterOptions={filterOptions}
          activeFilter={statusFilter}
          onFilterSelect={handleFilterSelect}
          showFilterDropdown={showFiltersDropdown}
          onToggleFilterDropdown={() =>
            setShowFiltersDropdown(!showFiltersDropdown)
          }
        />

        <UserManagementToolbarActions
          onExportCSV={handleExportCSV}
          onOpenEnrollModal={() => setShowEnrollModal(true)}
          exportCsvLabel={t.exportCsv}
          isRtl={isRtl}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Table & Cards Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-w-0">
          <div>
            <UserCardList
              users={paginatedItems}
              t={t}
              activeTab={activeTab}
              isRtl={isRtl}
              onViewActivity={handleViewActivity}
              onToggleStatus={handleToggleStatus}
              onVerify={handleVerify}
            />
            <UserTable
              users={paginatedItems}
              t={t}
              activeTab={activeTab}
              isRtl={isRtl}
              onViewActivity={handleViewActivity}
              onToggleStatus={handleToggleStatus}
              onVerify={handleVerify}
            />
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={(page) => setCurrentPage(page)}
            isRtl={isRtl}
          />
        </div>

        {/* Widgets Column */}
        <div className="flex flex-col gap-6">
          <SmartInsightCard
            title={t.smartTitle}
            heading={recommendation.title}
            bodyText={recommendation.desc}
            actionLabel={recommendation.actionText}
            onActionClick={() => {
              if (recommendation.actionLink === "PENDING") {
                setStatusFilter("PENDING");
              } else {
                router.push(recommendation.actionLink);
              }
            }}
            isRtl={isRtl}
          />
          <AuditLogsWidget title={t.auditLogsTitle} logs={[]} isRtl={isRtl} />
        </div>
      </div>

      {/* ── Enroll Modal ─────────────────────────────────────── */}
      <EnrollModal
        isOpen={showEnrollModal}
        isRtl={isRtl}
        enrollForm={enrollForm}
        onClose={() => setShowEnrollModal(false)}
        onChange={(form) => setEnrollForm(form)}
        onSubmit={handleEnrollSubmit}
      />

      {/* ── Activity Logs Drawer ──────────────────────────────── */}
      <ActivityLogsDrawer
        isOpen={showLogsDrawer}
        isRtl={isRtl}
        userId={selectedUserId}
        userName={selectedUserName}
        logs={selectedUserLogs}
        onClose={() => setShowLogsDrawer(false)}
      />
    </div>
  );
}
