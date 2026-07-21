"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/icons/menu-icon";
import { CloseIcon } from "@/components/icons/close-icon";
import { Sidebar } from "./components/sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <div className="fixed inset-0 flex bg-surface" dir="rtl">
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex lg:shrink-0 h-full">
        <Sidebar pathname={pathname} onLinkClick={handleLinkClick} />
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex ">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          {/* Sliding drawer block */}
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-5 left-5 z-50 lg:hidden">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg bg-secondary-container/80 hover:bg-secondary-fixed-dim border border-outline-variant/30 text-on-surface transition-all animate-in fade-in zoom-in-75 duration-200"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <Sidebar pathname={pathname} onLinkClick={handleLinkClick} />
          </aside>
        </div>
      )}

      {/* Main Content Area Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Top Header */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-outline-variant/30 shrink-0">
          <Link href="/portal/settings" className="flex flex-col">
            <span className="font-plus-jakarta-sans text-xl font-extrabold text-primary tracking-tight">
              FoodLoop
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface hover:bg-secondary-container transition-colors"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Child Pages Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
