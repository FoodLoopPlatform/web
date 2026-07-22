"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./icon";

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
      href: "#",
      icon: "settings",
    },
  ];

  const footerItems = [
    {
      label: "الدعم والمساعدة",
      href: "#",
      icon: "contact_support",
    },
    {
      label: "تسجيل الخروج",
      href: "#",
      icon: "logout",
    },
  ];

  return (
    <div
      className={`flex flex-col h-full bg-[#f2f5ee] border-l border-[#bfc9be] select-none justify-between transition-all duration-300 ${
        isCollapsed ? "w-20 p-4" : "w-64 p-6"
      }`}
    >
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div
          className={`flex ${isCollapsed ? "flex-col items-center gap-4" : "items-center justify-between"} px-2`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#00381a] flex items-center justify-center text-white font-bold text-xl font-headline-md shrink-0">
              F
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-plus-jakarta-sans text-2xl font-extrabold text-[#00381a] tracking-tight leading-none">
                  FoodLoop
                </span>
                <span className="text-[11px] text-[#404940] opacity-70 font-bold font-sans mt-1">
                  لوحة تحكم التاجر
                </span>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-[#e6e9e3] text-[#404940] transition-colors shrink-0 cursor-pointer"
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
                className={`flex items-center gap-3 py-3 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                  isCollapsed ? "justify-center px-1" : "px-4"
                } ${
                  isActive
                    ? "bg-[#98f3b0] text-[#00381a] font-bold"
                    : "text-[#404940] font-medium hover:bg-[#e6e9e3] hover:text-[#191d19]"
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
        <Link href="/products/add" onClick={onClose} className="w-full">
          <button
            className={`flex items-center justify-center gap-2 bg-[#00381a] text-white py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all text-label-md font-sans cursor-pointer ${
              isCollapsed ? "h-11 w-11 p-0 rounded-full mx-auto" : "w-full"
            }`}
          >
            <Icon name="add" className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>إضافة منتج</span>}
          </button>
        </Link>

        {/* Footer Support/Logout */}
        <div className="border-t border-[#bfc9be] pt-4 flex flex-col gap-1">
          {footerItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 py-2.5 rounded-xl text-[#404940] font-medium hover:bg-[#e6e9e3] transition-colors ${
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
        </div>
      </div>
    </div>
  );
}
