"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HelpCircleIcon } from "@/components/icons/help-circle-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { HomeIcon } from "@/components/icons/home-icon";
import { BagIcon } from "@/components/icons/bag-icon";
import { LeafIcon } from "@/components/icons/leaf-icon";
import { LogoutIcon } from "@/components/icons/logout-icon";
import { useAppStore } from "@/store/use-app-store";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
  return initials.toUpperCase() || "؟";
}

const menuItems = [
  { label: "لوحة القيادة", href: "/portal/dashboard", icon: HomeIcon },
  { label: "إدارة المخزون", href: "/portal/inventory", icon: StoreIcon },
  { label: "سياسات التسعير", href: "/portal/pricing", icon: LeafIcon },
  { label: "الطلبات الواردة", href: "/portal/orders", icon: BagIcon },
  { label: "إعدادات الحساب", href: "/portal/settings", icon: StoreIcon },
];

type SidebarProps = {
  pathname: string;
  onLinkClick: () => void;
};

export function Sidebar({ pathname, onLinkClick }: SidebarProps) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const clearSession = useAppStore((state) => state.clearSession);

  function handleLogout() {
    clearSession();
    onLinkClick();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full bg-surface-container-low border-l border-outline-variant/30 w-64 p-6 select-none justify-between">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1 px-2">
          <Link href="/portal/dashboard" className="flex flex-col">
            <span className="font-plus-jakarta-sans text-2xl font-extrabold text-primary tracking-tight">
              FoodLoop
            </span>
            <span className="text-[11px] text-primary/75 font-semibold font-sans">
              تقليل الهدر الغذائي بمصر
            </span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={isActive ? "#" : item.href}
                onClick={onLinkClick}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all relative group ${
                  isActive
                    ? "bg-secondary-container text-primary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-primary" : "text-outline group-hover:text-on-surface-variant"}`}
                  />
                  <span className="text-body-md font-sans">{item.label}</span>
                </div>
                {isActive && (
                  <span className="absolute start-0 inset-y-3 w-[4px] rounded-r-md bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <Link
            href="#"
            className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <HelpCircleIcon className="h-5 w-5 text-outline" />
            <span className="text-body-md font-sans font-semibold">
              المساعدة والدعم
            </span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3.5 px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-colors"
          >
            <LogoutIcon className="h-5 w-5 text-outline group-hover:text-error" />
            <span className="text-body-md font-sans font-semibold">
              تسجيل الخروج
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-secondary-container/60 border border-outline-variant/10">
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/15 overflow-hidden flex items-center justify-center border border-outline-variant/40">
            {user?.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-label-md font-bold text-primary">
                {getInitials(user?.fullName ?? "")}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-label-md font-bold text-on-surface truncate">
              {user?.fullName ?? "مستخدم غير معروف"}
            </span>
            <Link
              href="/portal/settings"
              className="text-[11px] text-primary font-bold hover:underline"
            >
              عرض المتجر
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
