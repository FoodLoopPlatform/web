"use client";

import { useState, type ReactNode } from "react";
import { MerchantSidebar } from "@/components/ui/merchant-sidebar";
import { Icon } from "@/components/ui/icon";

export { MerchantTopHeader } from "./merchant-top-header";

export interface MerchantShellRenderProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

interface MerchantShellProps {
  /** Outer wrapper class override (defaults to the standard merchant page shell). */
  className?: string;
  children: ReactNode | ((props: MerchantShellRenderProps) => ReactNode);
}

/**
 * Shared chrome for every merchant-facing page: the same collapsible desktop
 * sidebar + mobile drawer wrapping `MerchantSidebar` that /dashboard uses.
 * Pages supply their own `<main>`/header content via the render-prop children,
 * using the exposed sidebar state to wire their hamburger button and margin.
 */
export function MerchantShell({ className, children }: MerchantShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderProps: MerchantShellRenderProps = {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    setSidebarCollapsed,
  };

  return (
    <div
      className={
        className ??
        "bg-surface-container-lowest text-on-surface min-h-screen flex font-sans"
      }
      dir="rtl"
    >
      {/* Sidebar for Desktop */}
      <aside
        className={`fixed right-0 top-0 h-screen hidden lg:block z-50 transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <MerchantSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <aside className="relative z-50 flex flex-col h-full w-64 animate-in slide-in-from-right duration-250">
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-full bg-light-green border border-outline-variant text-primary hover:bg-surface-container-highest transition-all cursor-pointer flex items-center justify-center"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <MerchantSidebar onClose={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {typeof children === "function" ? children(renderProps) : children}
    </div>
  );
}
