"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAppStore, useHasHydrated } from "@/store/use-app-store";
import { useAdminLang } from "@/store/use-admin-lang";

interface NavItem {
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ReactNode;
}

const dict = {
  ar: {
    platformAdmin: "إدارة المنصة",
    createReport: "+ إنشاء تقرير",
    support: "الدعم والمساعدة",
    logout: "تسجيل الخروج",
    searchPlaceholder: "ابحث عن مستخدمين، طلبات، أو متاجر...",
    mainController: "المراقب الرئيسي",
  },
  en: {
    platformAdmin: "Platform Operations",
    createReport: "+ Create Report",
    support: "Support & Help",
    logout: "Log Out",
    searchPlaceholder: "Search users, orders, or stores...",
    mainController: "Main Controller",
  },
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();

  const { lang, setLang } = useAdminLang();

  const user = useAppStore((state) => state.user);
  const accessToken = useAppStore((state) => state.accessToken);
  const clearSession = useAppStore((state) => state.clearSession);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar drawer when pathname changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  // Check auth once rehydrated on the client side
  useEffect(() => {
    if (hasHydrated && mounted) {
      const isAdmin = user?.roles?.some(
        (role) => role.toLowerCase() === "admin" || role.toLowerCase() === "seniorcontroller"
      );
      if (!accessToken || !isAdmin) {
        router.push("/login");
      }
    }
  }, [hasHydrated, mounted, user, accessToken, router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  if (!hasHydrated || !mounted) {
    return <div className="min-h-screen bg-[#fafaf4]" />;
  }

  const isAdmin = user?.roles?.some(
    (role) => role.toLowerCase() === "admin" || role.toLowerCase() === "seniorcontroller"
  );

  if (!accessToken || !isAdmin) {
    return <div className="min-h-screen bg-[#fafaf4]" />;
  }

  const currentDict = dict[lang];

  const navItems: NavItem[] = [
    {
      labelAr: "إدارة المستخدمين",
      labelEn: "User Management",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      labelAr: "النزاعات والشكاوى",
      labelEn: "Disputes & Support",
      href: "/admin/disputes",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      labelAr: "مراجعة القوائم",
      labelEn: "Moderation",
      href: "/admin/moderation",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      labelAr: "التحليلات والإحصائيات",
      labelEn: "Analytics & Reports",
      href: "/admin/analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
        </svg>
      ),
    },
    {
      labelAr: "إعدادات النظام",
      labelEn: "System Settings",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const sidebarInnerContent = (
    <>
      <div className="flex flex-col gap-6 overflow-hidden flex-1">
        <div className="flex items-center gap-3 px-2 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl font-headline-md shrink-0">
            F
          </div>
          <div className="flex flex-col">
            <span className="font-plus-jakarta-sans text-2xl font-extrabold text-primary tracking-tight leading-none">
              FoodLoop
            </span>
            <span className="text-[11px] text-on-surface-variant opacity-75 font-bold font-sans mt-1">
              {currentDict.platformAdmin}
            </span>
          </div>
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
                    ? "bg-primary-fixed text-primary font-bold shadow-sm relative before:absolute before:inset-y-3 before:w-1 before:bg-primary before:rounded-full " + (lang === "ar" ? "before:right-0" : "before:left-0")
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
          <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="whitespace-nowrap">{currentDict.createReport}</span>
        </Link>

        <div className="flex flex-col gap-1 px-1">
          <Link
            href="/admin/disputes"
            className="flex items-center gap-3 py-2 px-3 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>{currentDict.support}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 py-2 px-3 rounded-xl text-error font-medium hover:bg-error-container hover:text-on-error-container transition-colors text-xs text-start w-full cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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
      <aside className="hidden md:flex w-72 h-screen sticky top-0 flex-col bg-surface-container-low border-r border-outline-variant p-6 z-30 shrink-0">
        {sidebarInnerContent}
      </aside>

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] h-full bg-surface-container-low p-6 flex flex-col z-10 shadow-2xl overflow-y-auto">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-6 flex-1 flex flex-col">{sidebarInnerContent}</div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="h-20 bg-surface/80 backdrop-blur-md sticky top-0 z-20 border-b border-outline-variant/60 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="relative hidden sm:block w-80 lg:w-[480px] max-w-xl">
              <svg className="w-4 h-4 text-outline absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={currentDict.searchPlaceholder}
                className="w-full bg-surface-container-high border-none rounded-full py-2 pr-10 pl-4 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-all text-xs font-bold border border-outline-variant/40 cursor-pointer"
              title={lang === "ar" ? "Switch to English" : "التحويل للعربية"}
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{lang === "ar" ? "EN" : "العربية"}</span>
            </button>

            <div className="h-6 w-px bg-outline-variant/60 hidden sm:block" />

            <div className="flex items-center gap-3 bg-surface-container-high p-1.5 pr-4 rounded-full border border-outline-variant/40">
              <div className="flex flex-col text-right hidden md:flex">
                <span className="text-xs font-bold text-on-surface leading-tight">
                  {user?.fullName || "Admin Controller"}
                </span>
                <span className="text-[10px] text-on-surface-variant font-medium">
                  {currentDict.mainController}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center text-sm shadow-xs border border-primary/20 overflow-hidden shrink-0">
                {(user as Record<string, any>)?.profilePictureUrl ? (
                  <Image
                    src={(user as Record<string, any>).profilePictureUrl}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(user?.fullName || "A").slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
