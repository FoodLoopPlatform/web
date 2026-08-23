/* eslint-disable max-lines */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
import { useAppLang } from "@/store/use-app-lang";
import { isAdminUser } from "@/utils/roles";
import {
  UserIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  CloseIcon,
  LogoutIcon,
  BarChartIcon,
  FileIcon,
  PlusIcon,
  LeafIcon,
} from "@/components/icons";
import { Icon } from "@/components/ui/icon";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";

interface NavItem {
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ReactNode;
}

const dict = {
  ar: {
    platformAdmin: "إدارة المنصة",
    createReport: "إنشاء تقرير",
    support: "الدعم والمساعدة",
    logout: "تسجيل الخروج",
    mainController: "المراقب الرئيسي",
  },
  en: {
    platformAdmin: "Platform Operations",
    createReport: "Create Report",
    support: "Support & Help",
    logout: "Log Out",
    mainController: "Main Controller",
  },
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();

  const { lang, setLang } = useAppLang();

  const user = useAppStore((state) => state.user);
  const accessToken = useAppStore((state) => state.accessToken);
  const clearSession = useAppStore((state) => state.clearSession);

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [headerSearchQuery, setHeaderSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar drawer when pathname changes during render
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const handleHeaderSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = headerSearchQuery.trim();
    if (!query) return;

    setIsSearchOpen(false);
    // Direct search to current active section or default to user management
    let targetBase = "/admin";
    if (pathname.startsWith("/admin/disputes")) targetBase = "/admin/disputes";
    else if (pathname.startsWith("/admin/moderation"))
      targetBase = "/admin/moderation";
    else if (pathname.startsWith("/admin/audit-log"))
      targetBase = "/admin/audit-log";
    else if (pathname.startsWith("/admin/analytics"))
      targetBase = "/admin/analytics";

    router.push(`${targetBase}?search=${encodeURIComponent(query)}`);
  };

  const handleQuickNavigate = (targetPath: string) => {
    setIsSearchOpen(false);
    const query = headerSearchQuery.trim();
    const fullUrl = query
      ? `${targetPath}?search=${encodeURIComponent(query)}`
      : targetPath;
    router.push(fullUrl);
  };

  if (!hasHydrated) {
    return <div className="min-h-screen bg-surface" />;
  }

  if (!accessToken || !isAdminUser(user)) {
    return <div className="min-h-screen bg-surface" />;
  }

  const currentDict = dict[lang];

  const navItems: NavItem[] = [
    {
      labelAr: "إدارة المستخدمين",
      labelEn: "User Management",
      href: "/admin",
      icon: <UserIcon className="w-5 h-5" />,
    },
    {
      labelAr: "النزاعات والشكاوى",
      labelEn: "Disputes & Support",
      href: "/admin/disputes",
      icon: <AlertCircleIcon className="w-5 h-5" />,
    },
    {
      labelAr: "مراجعة القوائم",
      labelEn: "Moderation",
      href: "/admin/moderation",
      icon: <CheckCircleIcon className="w-5 h-5" />,
    },
    {
      labelAr: "التحليلات والإحصائيات",
      labelEn: "Analytics & Reports",
      href: "/admin/analytics",
      icon: <BarChartIcon className="w-5 h-5" />,
    },
    {
      labelAr: "سجل المراجعة",
      labelEn: "Audit Log",
      href: "/admin/audit-log",
      icon: <FileIcon className="w-5 h-5" />,
    },
    {
      labelAr: "إدارة العمولات والأرباح",
      labelEn: "Commissions & Revenue",
      href: "/admin/commissions",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      labelAr: "إعدادات النظام",
      labelEn: "System Settings",
      href: "/admin/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  const sidebarInnerContent = (
    <>
      <div className="flex flex-col gap-6 overflow-hidden flex-1">
        <div className="flex items-center gap-2 px-2 shrink-0 flex-wrap">
          <Link
            href="/"
            dir="ltr"
            className="inline-flex items-center gap-2 group select-none cursor-pointer"
            aria-label="FoodLoop Home"
          >
            <span className="text-2xl font-extrabold font-brand tracking-tight text-[#00381a] group-hover:text-[#005129] transition-colors duration-300 shrink-0 whitespace-nowrap leading-none">
              FoodLoop
            </span>
            <LeafIcon className="w-7 h-7 aspect-square text-[#00381a] group-hover:text-[#005129] group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shrink-0 drop-shadow-2xs" />
          </Link>
          <span className="text-xs font-bold text-primary/80 shrink-0 border-r border-outline-variant/60 pr-2 mr-0.5 whitespace-nowrap">
            {currentDict.platformAdmin}
          </span>
        </div>

        <nav className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1 pl-1">
          {navItems.map((item) => {
            const label = lang === "ar" ? item.labelAr : item.labelEn;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer text-sm font-medium ${
                  isActive
                    ? "bg-primary-fixed text-primary font-bold shadow-sm relative before:absolute before:inset-y-3 before:w-1 before:bg-primary before:rounded-full " +
                      (lang === "ar" ? "before:right-0" : "before:left-0")
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-outline-variant pt-5 shrink-0">
        <Link
          href="/admin/analytics?generate_report=true"
          className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all text-xs cursor-pointer shadow-sm active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="whitespace-nowrap">{currentDict.createReport}</span>
        </Link>

        <div className="flex flex-col gap-1 px-1">
          <Link
            href="/admin/disputes"
            className="flex items-center gap-3 py-2 px-3 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors text-xs"
          >
            <AlertCircleIcon className="w-4 h-4" />
            <span>{currentDict.support}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 rounded-xl text-error font-medium hover:bg-error-container hover:text-on-error-container transition-colors text-xs text-start w-full cursor-pointer"
          >
            <LogoutIcon className="w-4 h-4" />
            <span>{currentDict.logout}</span>
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-surface flex flex-col md:flex-row text-on-surface font-sans antialiased selection:bg-primary-fixed selection:text-primary"
    >
      <aside className="hidden md:flex w-72 h-screen sticky top-0 flex-col bg-surface-container-low border-r border-outline-variant p-6 z-30 shrink-0 print:hidden">
        {sidebarInnerContent}
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden flex print:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-surface-container-low p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            <div className="mt-6 flex-1 flex flex-col">
              {sidebarInnerContent}
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Platform Admin Portal Top Bar Header (Matching Store Portal Header) */}
        <header className="h-16 flex justify-between items-center px-4 sm:px-8 w-full bg-[#FAF9F5] border-b border-outline-variant/40 sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
            >
              <Icon name="menu" className="h-5 w-5 text-primary" />
            </button>

            {/* Page Title in Top Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-bold text-sm text-primary/90 shrink-0">
                {lang === "ar" ? "لوحة تحكم المنصة" : "Platform Admin"}
              </span>
            </div>

            {/* Desktop Integrated Top Bar Search Bar */}
            <div
              ref={searchContainerRef}
              className="hidden md:block relative w-full max-w-md min-w-[200px]"
            >
              <form onSubmit={handleHeaderSearchSubmit} className="relative">
                <Icon
                  name="search"
                  className={`h-4 w-4 absolute ${
                    lang === "ar" ? "right-3" : "left-3"
                  } top-1/2 -translate-y-1/2 text-outline pointer-events-none`}
                />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => {
                    setHeaderSearchQuery(e.target.value);
                    setIsSearchOpen(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => {
                    if (headerSearchQuery.trim().length > 0)
                      setIsSearchOpen(true);
                  }}
                  placeholder={
                    lang === "ar"
                      ? "البحث في لوحة تحكم المنصة..."
                      : "Search admin portal..."
                  }
                  className={`w-full bg-white/90 border border-outline-variant/60 rounded-xl py-2 ${
                    lang === "ar" ? "pr-9 pl-8" : "pl-9 pr-8"
                  } text-xs font-sans text-on-surface placeholder:text-outline focus:bg-white focus:border-primary focus:outline-hidden transition-all shadow-2xs`}
                />
                {headerSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setHeaderSearchQuery("");
                      setIsSearchOpen(false);
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer ${
                      lang === "ar" ? "left-2.5" : "right-2.5"
                    }`}
                  >
                    ✕
                  </button>
                )}
              </form>

              {/* Quick Search Dropdown */}
              {isSearchOpen && headerSearchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 right-0 left-0 bg-white rounded-2xl border border-card-border shadow-xl p-2 z-50 flex flex-col gap-1 text-xs font-sans animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-outline uppercase tracking-wider border-b border-surface-container">
                    {lang === "ar"
                      ? "نتائج البحث السريع"
                      : "Quick Search Targets"}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickNavigate("/admin")}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-primary" />
                      <span className="font-bold text-on-surface">
                        {lang === "ar"
                          ? `البحث عن "${headerSearchQuery}" في المستخدمين والمتاجر`
                          : `Search "${headerSearchQuery}" in Users & Stores`}
                      </span>
                    </div>
                    <span className="text-[10px] text-outline bg-surface px-2 py-0.5 rounded-full border border-card-border">
                      {lang === "ar" ? "المستخدمين" : "Users"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNavigate("/admin/moderation")}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-on-surface">
                        {lang === "ar"
                          ? `البحث عن "${headerSearchQuery}" في مراجعة المنتجات`
                          : `Search "${headerSearchQuery}" in Moderation`}
                      </span>
                    </div>
                    <span className="text-[10px] text-outline bg-surface px-2 py-0.5 rounded-full border border-card-border">
                      {lang === "ar" ? "المراجعة" : "Moderation"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNavigate("/admin/disputes")}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircleIcon className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-on-surface">
                        {lang === "ar"
                          ? `البحث عن "${headerSearchQuery}" في النزاعات والدعم`
                          : `Search "${headerSearchQuery}" in Disputes`}
                      </span>
                    </div>
                    <span className="text-[10px] text-outline bg-surface px-2 py-0.5 rounded-full border border-card-border">
                      {lang === "ar" ? "النزاعات" : "Disputes"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNavigate("/admin/commissions")}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="font-bold text-on-surface">
                        {lang === "ar"
                          ? `البحث عن "${headerSearchQuery}" في عمولات المتاجر`
                          : `Search "${headerSearchQuery}" in Store Commissions`}
                      </span>
                    </div>
                    <span className="text-[10px] text-outline bg-surface px-2 py-0.5 rounded-full border border-card-border">
                      {lang === "ar" ? "العمولات" : "Commissions"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickNavigate("/admin/audit-log")}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container transition-colors text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-on-surface">
                        {lang === "ar"
                          ? `البحث عن "${headerSearchQuery}" في سجل المراجعة`
                          : `Search "${headerSearchQuery}" in Audit Log`}
                      </span>
                    </div>
                    <span className="text-[10px] text-outline bg-surface px-2 py-0.5 rounded-full border border-card-border">
                      {lang === "ar" ? "السجل" : "Audit"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Full-Width Expanded Search Overlay for Mobile */}
          {isMobileSearchExpanded && (
            <div className="md:hidden absolute inset-0 bg-white z-50 px-4 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-150 border-b border-outline-variant shadow-md">
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchExpanded(false);
                  setIsSearchOpen(false);
                }}
                className="p-2 text-on-surface-variant hover:text-on-surface rounded-full cursor-pointer shrink-0"
                aria-label="إغلاق البحث"
              >
                <Icon
                  name="arrow_forward"
                  className={`w-5 h-5 ${lang === "ar" ? "" : "rotate-180"}`}
                />
              </button>
              <div className="relative flex-1">
                <form
                  onSubmit={(e) => {
                    handleHeaderSearchSubmit(e);
                    setIsMobileSearchExpanded(false);
                  }}
                  className="relative"
                >
                  <Icon
                    name="search"
                    className={`h-4 w-4 absolute ${
                      lang === "ar" ? "right-3" : "left-3"
                    } top-1/2 -translate-y-1/2 text-outline pointer-events-none`}
                  />
                  <input
                    type="text"
                    autoFocus
                    value={headerSearchQuery}
                    onChange={(e) => {
                      setHeaderSearchQuery(e.target.value);
                      setIsSearchOpen(e.target.value.trim().length > 0);
                    }}
                    placeholder={
                      lang === "ar"
                        ? "البحث في لوحة تحكم المنصة..."
                        : "Search admin portal..."
                    }
                    className={`w-full bg-surface-container border border-outline-variant/60 rounded-xl py-2 ${
                      lang === "ar" ? "pr-9 pl-8" : "pl-9 pr-8"
                    } text-xs font-sans text-on-surface placeholder:text-outline focus:bg-white focus:border-primary outline-none transition-all`}
                  />
                  {headerSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setHeaderSearchQuery("");
                        setIsSearchOpen(false);
                      }}
                      className={`absolute top-1/2 -translate-y-1/2 text-xs font-bold text-outline hover:text-on-surface cursor-pointer ${
                        lang === "ar" ? "left-2.5" : "right-2.5"
                      }`}
                    >
                      ✕
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Mobile Search Trigger Icon */}
            <button
              type="button"
              onClick={() => setIsMobileSearchExpanded(true)}
              className="md:hidden p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title={lang === "ar" ? "البحث" : "Search"}
              aria-label="Search"
            >
              <Icon name="search" className="h-5 w-5 text-on-surface-variant" />
            </button>

            <div className="flex items-center">
              <NotificationsDropdown scope="admin" />

              <button
                type="button"
                className="hidden sm:flex p-2 hover:bg-surface-container-highest rounded-full transition-colors items-center justify-center cursor-pointer"
                title={lang === "ar" ? "المساعدة" : "Help"}
              >
                <Icon name="help" className="h-5 w-5 text-on-surface-variant" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-1.5 sm:p-2 hover:bg-surface-container-highest rounded-full transition-colors flex items-center justify-center cursor-pointer"
              title={lang === "ar" ? "تغيير اللغة" : "Switch Language"}
            >
              <Icon
                name="language"
                className="h-5 w-5 text-on-surface-variant"
              />
            </button>

            {/* Profile Pill */}
            <div className="flex items-center gap-2 border-none sm:border-r sm:border-solid border-outline-variant/50 sm:pr-3 mr-1">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
                {user?.fullName
                  ? user.fullName.slice(0, 2).toUpperCase()
                  : "AD"}
              </div>
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  {user?.fullName ||
                    (lang === "ar" ? "مسؤول النظام" : "System Admin")}
                </span>
                <span className="text-[10px] text-outline leading-none mt-0.5 font-medium">
                  {currentDict.mainController}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Main Workspace Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-surface overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
