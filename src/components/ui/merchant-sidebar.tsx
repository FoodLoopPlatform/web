"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./icon";
import { useAppStore } from "@/store/use-app-store";
import { logoutSession } from "@/app/register/api/auth-api";

interface MerchantSidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function MerchantSidebar({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: MerchantSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const refreshToken = useAppStore((state) => state.refreshToken);
  const clearSession = useAppStore((state) => state.clearSession);

  // Best-effort: revoke the refresh token server-side, but always clear the
  // local session and leave — a failed/offline logout call shouldn't strand
  // the user on an authenticated-looking screen.
  const handleLogout = async () => {
    if (refreshToken) {
      await logoutSession(refreshToken);
    }
    clearSession();
    onClose?.();
    router.push("/login");
  };

  const menuItems = [
    {
      label: "لوحة التحكم",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      label: "المخزون",
      href: "/inventory",
      icon: "inventory_2",
    },
    {
      label: "التسعير",
      href: "#",
      icon: "payments",
    },
    {
      label: "الطلبات",
      href: "#",
      icon: "shopping_cart",
    },
    {
      label: "الخدمات اللوجستية",
      href: "#",
      icon: "local_shipping",
    },
    {
      label: "الإعدادات",
      href: "/settings",
      icon: "settings",
    },
  ];

  const footerItems = [
    {
      label: "الدعم والمساعدة",
      href: "#",
      icon: "contact_support",
    },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-light-green border-l border-outline-variant select-none justify-between transition-[width,padding] duration-300 ${
        isCollapsed ? "w-20 p-4" : "w-64 p-6"
      }`}
    >
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div
          className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"} px-2`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl font-headline-md shrink-0">
              F
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-plus-jakarta-sans text-2xl font-extrabold text-primary tracking-tight leading-none">
                  FoodLoop
                </span>
                <span className="text-[11px] text-on-surface-variant opacity-70 font-bold font-sans mt-1">
                  لوحة تحكم التاجر
                </span>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant transition-colors shrink-0 cursor-pointer"
              title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
            >
              <Icon
                name={isCollapsed ? "chevron_left" : "chevron_right"}
                className="h-5 w-5"
              />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 py-3 rounded-xl transition-[background-color,color,transform] duration-200 cursor-pointer active:scale-95 focus-visible:ring-2 focus-visible:ring-primary outline-none ${
                  isCollapsed ? "justify-center px-1" : "px-4"
                } ${
                  isActive
                    ? "bg-primary-fixed text-primary font-bold"
                    : "text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Icon
                  name={item.icon}
                  className="h-5 w-5 shrink-0"
                  fill={isActive}
                />
                {!isCollapsed && (
                  <span className="text-body-md font-sans leading-none">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Quick Action Button for adding product */}
        <Link
          href="/products/add"
          onClick={onClose}
          className={`flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-[opacity,transform] text-label-md font-sans cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none ${
            isCollapsed ? "h-11 w-11 p-0 rounded-full mx-auto" : "w-full"
          }`}
        >
          <Icon name="add" className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>إضافة منتج</span>}
        </Link>

        {/* Footer Support/Logout */}
        <div className="border-t border-outline-variant pt-4 flex flex-col gap-1">
          {footerItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 py-2.5 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors ${
                isCollapsed ? "justify-center px-1" : "px-4"
              }`}
            >
              <Icon name={item.icon} className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-body-md font-sans leading-none">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className={`flex items-center gap-3 py-2.5 rounded-xl text-error font-medium hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer text-start ${
              isCollapsed ? "justify-center px-1" : "px-4"
            }`}
          >
            <Icon name="logout" className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="text-body-md font-sans leading-none">
                تسجيل الخروج
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
