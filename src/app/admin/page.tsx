"use client";

import React, { useState, useEffect } from "react";
import { useAdminLang } from "@/store/use-admin-lang";
import {
  getAdminStores,
  getAdminCharities,
  getAdminConsumers,
  updateUserStatus,
  verifyStore,
  verifyCharity,
  getUserActivityLog,
  getAnalyticsSummary,
  Consumer,
  Store,
  Charity,
  ActivityLog,
  AnalyticsSummary,
} from "./api/admin-api";
import { adminDictionary } from "./constants/dictionary";
import { StatsCard } from "./components/StatsCard";
import { TabSwitcher, TabOption } from "./components/TabSwitcher";
import { SearchToolbar, FilterOption } from "./components/SearchToolbar";
import { SmartInsightCard } from "./components/SmartInsightCard";
import { AuditLogsWidget } from "./components/AuditLogsWidget";
import { UserCardList } from "./components/UserCardList";
import { UserTable } from "./components/UserTable";
import { Pagination } from "./components/Pagination";

type ActorTab = "Consumers" | "Stores" | "Charities";
type StatusFilter = "ALL" | "ACTIVE" | "PENDING" | "SUSPENDED";

export default function UserManagementPage() {
  const { lang } = useAdminLang();
  const t = adminDictionary[lang];
  const isRtl = lang === "ar";

  const [activeTab, setActiveTab] = useState<ActorTab>("Consumers");

  // Data states
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);

  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  // Filter & search states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Reset page when tab or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

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

  const loadData = async () => {
    const analyticsRes = await getAnalyticsSummary();
    if (analyticsRes.data) setAnalytics(analyticsRes.data);

    const consumersRes = await getAdminConsumers();
    if (consumersRes.data) setConsumers(consumersRes.data);

    const storesRes = await getAdminStores();
    if (storesRes.data) setStores(storesRes.data);

    const charitiesRes = await getAdminCharities();
    if (charitiesRes.data) setCharities(charitiesRes.data);
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    
    // Optimistic UI Update
    if (activeTab === "Consumers") {
      setConsumers(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus as any } : c));
      const res = await updateUserStatus(id, nextStatus as any);
      if (res.error) {
        alert(`Error toggling status: ${res.error}`);
        loadData();
      }
    } else if (activeTab === "Stores") {
      setStores(prev => prev.map(s => s.id === id ? { ...s, status: nextStatus as any } : s));
      const action = nextStatus === "ACTIVE" ? "Approved" : "Rejected";
      const res = await verifyStore(id, action);
      if (res.error) {
        alert(`Error toggling store status: ${res.error}`);
        loadData();
      }
    } else if (activeTab === "Charities") {
      setCharities(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus as any } : c));
      const action = nextStatus === "ACTIVE" ? "Approved" : "Rejected";
      const res = await verifyCharity(id, action);
      if (res.error) {
        alert(`Error toggling charity status: ${res.error}`);
        loadData();
      }
    }
  };

  const handleVerify = async (id: string) => {
    // Optimistic UI Update
    if (activeTab === "Stores") {
      setStores(prev => prev.map(s => s.id === id ? { ...s, verified: true, status: "ACTIVE" } : s));
      const res = await verifyStore(id);
      if (res.error) {
        alert(`Error verifying store: ${res.error}`);
        loadData();
      }
    } else if (activeTab === "Charities") {
      setCharities(prev => prev.map(c => c.id === id ? { ...c, verified: true, status: "ACTIVE" } : c));
      const res = await verifyCharity(id);
      if (res.error) {
        alert(`Error verifying charity: ${res.error}`);
        loadData();
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
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === "Consumers") {
      csvContent += "ID,Name,Email,Location,Status,Joined Date,Last Active\n";
      consumers.forEach((c) => {
        csvContent += `"${c.id}","${c.name}","${c.email}","${c.location}","${c.status}","${c.joinedDate}","${c.lastActive}"\n`;
      });
    } else if (activeTab === "Stores") {
      csvContent += "ID,Name,Email,Location,Status,Joined Date,Last Active\n";
      stores.forEach((s) => {
        csvContent += `"${s.id}","${s.name}","${s.email}","${s.location}","${s.status}","${s.joinedDate}","${s.lastActive}"\n`;
      });
    } else {
      csvContent += "ID,Name,Email,Location,Status,Tax ID,Verified,Joined Date,Last Active\n";
      charities.forEach((c) => {
        csvContent += `"${c.id}","${c.name}","${c.email}","${c.location}","${c.status}","${c.taxId}","${c.verified}","${c.joinedDate}","${c.lastActive}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `foodloop_admin_${activeTab.toLowerCase()}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredItems = () => {
    let items: any[] = [];
    if (activeTab === "Consumers") items = consumers;
    else if (activeTab === "Stores") items = stores;
    else items = charities;

    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const itemStatus = (item.status || "ACTIVE").toString().toUpperCase();
      const targetStatus = statusFilter.toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        itemStatus === targetStatus ||
        (targetStatus === "ACTIVE" && (itemStatus === "APPROVED" || itemStatus === "VERIFIED")) ||
        (targetStatus === "PENDING" && (itemStatus === "UNVERIFIED" || itemStatus === "REVIEW"));
      return matchesSearch && matchesStatus;
    });
  };

  const filteredItems = getFilteredItems();
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSmartRecommendation = () => {
    if (isRtl) {
      switch (activeTab) {
        case "Consumers":
          return {
            title: "ارتفاع غير عادي للتسجيلات",
            desc: "اكتشف نظامنا زيادة بنسبة 14% في حسابات المستهلكين الجديدة في محافظة الجيزة. نوصي بمراجعة وتحديث معايير التشغيل بالمنطقة.",
            actionText: "عرض الإعدادات",
            actionLink: "/admin/settings",
          };
        case "Stores":
          return {
            title: "طابور مراجعة المتاجر المعلقة",
            desc: "يوجد حالياً طلبين لتسجيل المتاجر من الإسكندرية بانتظار مراجعة المستندات.",
            actionText: "تصفية المتاجر المعلقة",
            actionLink: "PENDING",
          };
        case "Charities":
          return {
            title: "توثيق الحسابات الخيرية",
            desc: "الجمعيات الموثقة تمثل 85% من الإيعاز التبرعي الفعال بفضل دقة الأرقام الضريبية.",
            actionText: "تصفية التوثيق",
            actionLink: "PENDING",
          };
      }
    } else {
      switch (activeTab) {
        case "Consumers":
          return {
            title: "Unusual Registration Surge",
            desc: "Our system detected a 14% increase in new consumer accounts in Giza Governorates.",
            actionText: "View Settings",
            actionLink: "/admin/settings",
          };
        case "Stores":
          return {
            title: "Pending Stores Queue",
            desc: "2 store registration applications are awaiting document verification.",
            actionText: "Filter Pending Stores",
            actionLink: "PENDING",
          };
        case "Charities":
          return {
            title: "Charity Verification Status",
            desc: "Verified charities represent 85% of active donation fulfillment.",
            actionText: "Filter Verification",
            actionLink: "PENDING",
          };
      }
    }
  };

  const recommendation = getSmartRecommendation();

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

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1600px] mx-auto">
      {/* Header Title & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1a1c19] tracking-tight font-brand">
            {t.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#707a70]">{t.subtitle}</p>
        </div>

        <TabSwitcher tabs={tabOptions} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label={t.totalUsers}
          value={analytics?.totalConsumers != null ? analytics.totalConsumers.toLocaleString() : "..."}
          accentClass="bg-[#005129]/20"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.activeStores}
          value={analytics?.totalStores != null ? analytics.totalStores.toLocaleString() : "..."}
          accentClass="bg-[#005129]"
          textColorClass="text-[#005129]"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.activeCharities}
          value={analytics?.totalCharities != null ? analytics.totalCharities.toLocaleString() : "..."}
          accentClass="bg-blue-600/30"
          textColorClass="text-blue-900"
          isRtl={isRtl}
        />
        <StatsCard
          label={t.pendingApproval}
          value={
            analytics != null
              ? ((analytics.pendingStoresCount ?? 0) + (analytics.pendingCharitiesCount ?? 0)).toLocaleString()
              : "..."
          }
          accentClass="bg-amber-500/30"
          textColorClass="text-amber-900"
          isRtl={isRtl}
        />
      </div>

      {/* Search and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-2xl border border-[#e0e6df] shadow-sm gap-4">
        <SearchToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={t.searchPlaceholder}
          isRtl={isRtl}
          filterTitle={t.filter}
          filterButtonLabel={t.filter}
          filterOptions={filterOptions}
          activeFilter={statusFilter}
          onFilterSelect={setStatusFilter}
          showFilterDropdown={showFiltersDropdown}
          onToggleFilterDropdown={() => setShowFiltersDropdown(!showFiltersDropdown)}
        />

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#bfc9be] text-xs font-bold text-[#404941] hover:bg-[#eeeee9] transition-all cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4 text-[#707a70]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t.exportCsv}</span>
          </button>

          <button
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-2 bg-[#005129] hover:bg-[#02522a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>{isRtl ? "تسجيل يدوي" : "Manual Enroll"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Table & Cards Column */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e0e6df] shadow-sm overflow-hidden flex flex-col justify-between min-w-0">
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
                window.location.href = recommendation.actionLink;
              }
            }}
            isRtl={isRtl}
          />
          <AuditLogsWidget
            title={t.auditLogsTitle}
            logs={[]}
            isRtl={isRtl}
          />
        </div>
      </div>

      {/* ── Enroll Modal ─────────────────────────────────────── */}
      {showEnrollModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowEnrollModal(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: "16px", padding: "24px",
              width: "100%", maxWidth: "440px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              display: "flex", flexDirection: "column", gap: "16px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #eeeee9", paddingBottom: "12px" }}>
              <span style={{ fontSize: "14px", fontWeight: 800, color: "#1a1c19" }}>
                {isRtl ? "التسجيل اليدوي" : "Manual Enrollment"}
              </span>
              <button onClick={() => setShowEnrollModal(false)} style={{ cursor: "pointer", background: "none", border: "none", padding: "4px" }}>
                <svg width="20" height="20" fill="none" stroke="#707a70" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEnrollSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
              {[
                { label: isRtl ? "الاسم الكامل" : "Full Name / Entity", key: "name", type: "text" },
                { label: isRtl ? "البريد الإلكتروني" : "Email Address", key: "email", type: "email" },
                { label: isRtl ? "الموقع" : "Location", key: "location", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ display: "block", fontWeight: 700, color: "#404941", marginBottom: "4px" }}>{label}</label>
                  <input
                    type={type}
                    required
                    value={enrollForm[key as keyof typeof enrollForm]}
                    onChange={(e) => setEnrollForm({ ...enrollForm, [key]: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #bfc9be", outline: "none", background: "#fafaf4", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>
              ))}
              <button
                type="submit"
                style={{ marginTop: "8px", padding: "10px", background: "#005129", color: "#fff", fontWeight: 700, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "12px" }}
              >
                {isRtl ? "إتمام عملية التسجيل" : "Complete Enrollment"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Activity Logs Drawer ──────────────────────────────── */}
      {showLogsDrawer && (
        <>
          {/* Dim overlay — click to close */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(0,0,0,0.55)",
            }}
            onClick={() => setShowLogsDrawer(false)}
          />
          {/* Drawer panel — slides in from the correct side */}
          <div
            style={{
              position: "fixed",
              top: 0, bottom: 0,
              [isRtl ? "left" : "right"]: 0,
              zIndex: 9999,
              width: "100%", maxWidth: "420px",
              background: "#fff",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
              display: "flex", flexDirection: "column",
              padding: "24px",
              gap: "20px",
              overflowY: "auto",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", borderBottom: "1px solid #eeeee9", paddingBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#1a1c19" }}>{selectedUserName}</div>
                <div style={{ fontSize: "10px", color: "#707a70", fontFamily: "monospace", marginTop: "2px" }}>{selectedUserId}</div>
              </div>
              <button
                onClick={() => setShowLogsDrawer(false)}
                style={{ cursor: "pointer", background: "none", border: "none", padding: "6px", borderRadius: "8px" }}
              >
                <svg width="20" height="20" fill="none" stroke="#707a70" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Log entries */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
              {selectedUserLogs.length === 0 ? (
                <p style={{ fontSize: "12px", color: "#707a70", textAlign: "center", padding: "32px 0" }}>
                  {isRtl ? "لا توجد سجلات تدقيق لهذه الجهة." : "No activity logs found for this user."}
                </p>
              ) : (
                selectedUserLogs.map((log) => (
                  <div key={log.id} style={{ padding: "12px", background: "#fafaf4", border: "1px solid #eeeee9", borderRadius: "12px", fontSize: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#707a70" }}>
                      <span style={{ fontWeight: 700 }}>{log.adminName}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p style={{ color: "#1a1c19", margin: 0 }}>{log.action}</p>
                  </div>
                ))
              )}
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowLogsDrawer(false)}
              style={{ padding: "10px", background: "#eeeee9", color: "#1a1c19", fontWeight: 700, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "12px" }}
            >
              {isRtl ? "إغلاق اللوحة" : "Close Panel"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

