"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { getAuditLogs } from "../../api/audit-log-api";
import { adminDictionary } from "../../constants/dictionary";
import { AdminUserItem, AuditLogItem } from "../../types/admin.types";
import { UserManagementStats } from "./UserManagementStats";
import { UserManagementToolbarActions } from "./UserManagementToolbarActions";
import { TabSwitcher, TabOption } from "../common/TabSwitcher";
import { SearchToolbar, FilterOption } from "../common/SearchToolbar";
import { SmartInsightCard } from "../common/SmartInsightCard";
import { AuditLogsWidget } from "../audit-log/AuditLogsWidget";
import { UserCardList } from "./UserCardList";
import { UserTable } from "./UserTable";
import { Pagination } from "../common/Pagination";
import { ActivityLogsDrawer } from "./ActivityLogsDrawer";
import { UserManagementSkeleton } from "./UserManagementSkeleton";
import { CommissionsShell } from "../commissions/CommissionsShell";
import {
  exportAdminCSV,
  getSmartRecommendation,
} from "../../utils/admin-helpers";
import { UserManagementShellProps } from "../../types/user-management.types";

type ActorTab = "Consumers" | "Stores" | "Charities" | "Commissions";
type StatusFilter = "ALL" | "ACTIVE" | "PENDING" | "SUSPENDED";

export function UserManagementShell({
  initialAnalytics = null,
  initialConsumers = [],
  initialStores = [],
  initialCharities = [],
  initialAuditLogs = [],
}: UserManagementShellProps = {}) {
  const { lang } = useAppLang();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<ActorTab>(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam?.toLowerCase() === "commissions" ||
      tabParam?.toLowerCase() === "commission"
    ) {
      return "Commissions";
    }
    if (tabParam?.toLowerCase() === "stores") return "Stores";
    if (tabParam?.toLowerCase() === "charities") return "Charities";
    return "Consumers";
  });

  // Data states — seeded directly from props
  const [consumers, setConsumers] = useState<Consumer[]>(initialConsumers);
  const [stores, setStores] = useState<Store[]>(initialStores);
  const [charities, setCharities] = useState<Charity[]>(initialCharities);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(
    initialAnalytics,
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [isLoading, setIsLoading] = useState<boolean>(
    initialConsumers.length === 0 &&
      initialStores.length === 0 &&
      initialCharities.length === 0,
  );

  const [consumersCount, setConsumersCount] = useState(initialAnalytics?.users?.customers ?? 0);
  const [storesCount, setStoresCount] = useState(initialAnalytics?.users?.merchants ?? 0);
  const [charitiesCount, setCharitiesCount] = useState(initialAnalytics?.users?.charities ?? 0);
  const [pendingCount, setPendingCount] = useState(initialAnalytics?.organizations?.pending ?? 0);
  
  const [activeTotalCount, setActiveTotalCount] = useState(initialAnalytics?.users?.customers ?? 0);
  const [totalPages, setTotalPages] = useState(() => {
    const total = initialAnalytics?.users?.customers ?? 0;
    return Math.ceil(total / 5) || 1;
  });

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || searchParams.get("q") || "",
  );
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

  // Pagination & Drawer states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [showLogsDrawer, setShowLogsDrawer] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [selectedUserLogs, setSelectedUserLogs] = useState<ActivityLog[]>([]);

  // Sync tab and search query from URL query params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const lower = tabParam.toLowerCase();
      if ((lower === "commissions" || lower === "commission") && activeTab !== "Commissions") {
        setActiveTab("Commissions");
      } else if (lower === "stores" && activeTab !== "Stores") {
        setActiveTab("Stores");
      } else if (lower === "charities" && activeTab !== "Charities") {
        setActiveTab("Charities");
      } else if (lower === "consumers" && activeTab !== "Consumers") {
        setActiveTab("Consumers");
      }
    }
    const q = searchParams.get("search") || searchParams.get("q");
    if (q !== null && q !== searchQuery) {
      setSearchQuery(q);
      setDebouncedSearchQuery(q);
    }
  }, [searchParams]);

  // Debounce search query input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Decoupled Background Metrics Polling
  useEffect(() => {
    let isSubscribed = true;
    getAnalyticsSummary()
      .then((res) => {
        if (isSubscribed && res.data) {
          setAnalytics(res.data);
          if (res.data.users) {
            setConsumersCount(res.data.users.customers);
            setStoresCount(res.data.users.merchants);
            setCharitiesCount(res.data.users.charities);
          }
          if (res.data.organizations && res.data.organizations.pending !== undefined) {
            setPendingCount(res.data.organizations.pending);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load analytics summary:", err);
      });
    return () => {
      isSubscribed = false;
    };
  }, []);

  const isDataFirstRender = useRef(true);
  useEffect(() => {
    if (isDataFirstRender.current) {
      isDataFirstRender.current = false;
      if (
        initialConsumers.length > 0 ||
        initialStores.length > 0 ||
        initialCharities.length > 0
      ) {
        return;
      }
    }

    let isSubscribed = true;
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchAll = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "Consumers") {
          const res = await getAdminConsumers({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            search: debouncedSearchQuery || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            signal,
          });
          if (isSubscribed && res.data) {
            setConsumers(res.data);
            if (res.totalCount !== undefined) {
              setActiveTotalCount(res.totalCount);
              setTotalPages(res.totalPages || Math.ceil(res.totalCount / ITEMS_PER_PAGE) || 1);
            }
          }
        } else if (activeTab === "Stores") {
          const res = await getAdminStores({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            search: debouncedSearchQuery || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            signal,
          });
          if (isSubscribed && res.data) {
            setStores(res.data);
            if (res.totalCount !== undefined) {
              setActiveTotalCount(res.totalCount);
              setTotalPages(res.totalPages || Math.ceil(res.totalCount / ITEMS_PER_PAGE) || 1);
            }
          }
        } else if (activeTab === "Charities") {
          const res = await getAdminCharities({
            page: currentPage,
            pageSize: ITEMS_PER_PAGE,
            search: debouncedSearchQuery || undefined,
            status: statusFilter !== "ALL" ? statusFilter : undefined,
            signal,
          });
          if (isSubscribed && res.data) {
            setCharities(res.data);
            if (res.totalCount !== undefined) {
              setActiveTotalCount(res.totalCount);
              setTotalPages(res.totalPages || Math.ceil(res.totalCount / ITEMS_PER_PAGE) || 1);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error loading user management data:", err);
        }
      } finally {
        if (isSubscribed) setIsLoading(false);
      }
    };

    fetchAll();

    return () => {
      isSubscribed = false;
      abortController.abort();
    };
  }, [activeTab, currentPage, debouncedSearchQuery, statusFilter, initialConsumers.length]);

  useEffect(() => {
    let isSubscribed = true;
    getAdminStores({ status: "PENDING", page: 1, pageSize: 1 }).then((res) => {
      if (isSubscribed && res.data && res.totalCount !== undefined) {
        setPendingCount(res.totalCount);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, []);

  const isAuditLogFirstRender = useRef(true);
  useEffect(() => {
    if (isAuditLogFirstRender.current) {
      isAuditLogFirstRender.current = false;
      if (initialAuditLogs.length > 0) return;
    }
    let isSubscribed = true;
    const abortController = new AbortController();
    const signal = abortController.signal;

    getAuditLogs({ pageSize: 5, signal })
      .then((res) => {
        if (isSubscribed && res.items) setAuditLogs(res.items);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error loading audit logs:", err);
        }
      });

    return () => {
      isSubscribed = false;
      try {
        abortController.abort();
      } catch (e) {
        // Ignore abort errors
      }
    };
  }, [initialAuditLogs.length]);

  const handleTabChange = (tab: ActorTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterSelect = (filter: string) => {
    setStatusFilter(filter as StatusFilter);
    setCurrentPage(1);
    setShowFiltersDropdown(false);
  };

  const rawActiveItems: AdminUserItem[] = useMemo(() => {
    if (activeTab === "Consumers") return consumers as AdminUserItem[];
    if (activeTab === "Stores") return stores as AdminUserItem[];
    if (activeTab === "Charities") return charities as AdminUserItem[];
    return [];
  }, [activeTab, consumers, stores, charities]);

  const filteredItems = useMemo(() => {
    let items = rawActiveItems;
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      items = items.filter(
        (user) =>
          user.name.toLowerCase().includes(q) ||
          user.email?.toLowerCase().includes(q) ||
          user.phone?.includes(q) ||
          user.location?.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "ALL") {
      items = items.filter((user) => user.status === statusFilter);
    }
    return items;
  }, [rawActiveItems, debouncedSearchQuery, statusFilter]);

  const paginatedItems = filteredItems;

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    if (activeTab === "Consumers") {
      setConsumers((prev) =>
        prev.map((c) => (c.id === userId ? { ...c, status: newStatus } : c)),
      );
    } else if (activeTab === "Stores") {
      setStores((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, status: newStatus } : s)),
      );
    } else if (activeTab === "Charities") {
      setCharities((prev) =>
        prev.map((ch) => (ch.id === userId ? { ...ch, status: newStatus } : ch)),
      );
    }

    try {
      await updateUserStatus(userId, newStatus);
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  const handleVerify = async (actorId: string) => {
    if (activeTab === "Stores") {
      setStores((prev) =>
        prev.map((s) => (s.id === actorId ? { ...s, status: "ACTIVE" } : s)),
      );
      try {
        await verifyStore(actorId);
      } catch (err) {
        console.error("Failed to verify store:", err);
      }
    } else if (activeTab === "Charities") {
      setCharities((prev) =>
        prev.map((ch) => (ch.id === actorId ? { ...ch, status: "ACTIVE" } : ch)),
      );
      try {
        await verifyCharity(actorId);
      } catch (err) {
        console.error("Failed to verify charity:", err);
      }
    }
  };

  const handleViewActivity = async (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setShowLogsDrawer(true);
    try {
      const res = await getUserActivityLog(userId);
      if (res.data) {
        setSelectedUserLogs(res.data);
      } else {
        setSelectedUserLogs([]);
      }
    } catch (err) {
      console.error("Failed to fetch user activity log:", err);
      setSelectedUserLogs([]);
    }
  };

  const handleExportCSV = () => {
    exportAdminCSV(activeTab, consumers, stores, charities);
  };

  const tabOptions: TabOption<ActorTab>[] = [
    { id: "Consumers", label: t.consumers, badge: consumersCount },
    { id: "Stores", label: t.stores, badge: storesCount },
    { id: "Charities", label: t.charities, badge: charitiesCount },
    { id: "Commissions", label: t.commissions },
  ];

  const filterOptions: FilterOption<StatusFilter>[] = [
    { id: "ALL", label: t.all },
    { id: "ACTIVE", label: t.active },
    { id: "PENDING", label: t.pending },
    { id: "SUSPENDED", label: t.suspended },
  ];

  const smartRec = getSmartRecommendation(activeTab, isRtl);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-sans">
            {t.title}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-sans">
            {activeTab === "Commissions" ? t.commissionsSubtitle : t.subtitle}
          </p>
        </div>

        <TabSwitcher
          tabs={tabOptions}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {activeTab === "Commissions" ? (
        <CommissionsShell />
      ) : (
        <>
          {/* Top Metrics Banner */}
          <UserManagementStats 
            t={t} 
            consumersCount={consumersCount} 
            storesCount={storesCount} 
            charitiesCount={charitiesCount} 
            pendingCount={pendingCount} 
            isRtl={isRtl} 
          />

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
              exportCsvLabel={t.exportCsv}
              isRtl={isRtl}
            />
          </div>

          {/* Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Table & Cards Column */}
            <div className={`lg:col-span-2 bg-white rounded-2xl border border-card-border shadow-sm overflow-hidden flex flex-col justify-between min-w-0 transition-opacity ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
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
                totalItems={activeTotalCount}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
                isRtl={isRtl}
              />
            </div>

            {/* Widgets Column */}
            <div className="flex flex-col gap-6">
              <AuditLogsWidget
                title={t.auditLogsTitle}
                logs={auditLogs.map((log) => ({
                  id: log.id,
                  adminName: log.actorName,
                  action: isRtl ? log.detailsAr : log.detailsEn,
                  timestamp: log.timestamp,
                  details: log.detailsEn,
                }))}
                isRtl={isRtl}
              />
            </div>
          </div>

          {/* ── Activity Logs Drawer ──────────────────────────────── */}
          <ActivityLogsDrawer
            isOpen={showLogsDrawer}
            isRtl={isRtl}
            userId={selectedUserId}
            userName={selectedUserName}
            logs={selectedUserLogs}
            onClose={() => setShowLogsDrawer(false)}
          />
        </>
      )}
    </div>
  );
}
