"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { NotificationsDropdown } from "@/components/layout/NotificationsDropdown";
import { AdminNotesDrawer } from "@/components/common/AdminNotesDrawer";

interface MerchantTopHeaderProps {
  /** Opens the mobile sidebar drawer. */
  onMenuClick: () => void;
  /** Content rendered after the hamburger button (title, search box, breadcrumb, etc). */
  left?: ReactNode;
  storeName?: string | null;
  /** Store's actual logo URL (already resolved). Falls back to a generic avatar icon when absent. */
  avatarUrl?: string | null;
  className?: string;
}

/** The standard top bar (hamburger + left slot + admin notes + notifications + store name/logo) used across merchant pages. */
export function MerchantTopHeader({
  onMenuClick,
  left,
  storeName,
  avatarUrl,
  className,
}: MerchantTopHeaderProps) {
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);

  return (
    <>
      <header
        className={
          className ??
          "h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-light-green border-b border-outline-variant sticky top-0 z-40"
        }
      >
        <div className="flex items-center gap-md flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center cursor-pointer"
          >
            <Icon name="menu" className="h-5 w-5 text-primary" />
          </button>

          {left}
        </div>

        {/* Right Section: Notifications + Admin Notes + Store Profile */}
        <div className="flex items-center gap-3">
          <NotificationsDropdown />

          {/* Admin Notes Button */}
          <button
            type="button"
            onClick={() => setNotesDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-outline-variant hover:bg-surface-container-high text-primary font-bold text-xs transition-all shadow-2xs cursor-pointer active:scale-95"
            title="ملاحظات وتنبيهات الإدارة"
          >
            <Icon name="campaign" className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">ملاحظات الإدارة</span>
          </button>

          {/* Store Profile */}
          <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-highest p-1 pl-3 pr-1 rounded-full transition-all">
            {avatarUrl ? (
              <Image
                className="w-8 h-8 rounded-full border border-outline-variant object-cover"
                alt="شعار المتجر"
                src={avatarUrl}
                width={32}
                height={32}
                unoptimized
              />
            ) : (
              <div className="w-8 h-8 rounded-full border border-outline-variant bg-surface-container-high flex items-center justify-center overflow-hidden">
                <Icon
                  name="person"
                  className="h-4 w-4 text-on-surface-variant"
                />
              </div>
            )}
            <span className="font-label-caps text-label-caps text-primary font-bold hidden md:block">
              {storeName || "متجري"}
            </span>
          </div>
        </div>
      </header>

      {/* Slide-over Admin Notes Drawer */}
      <AdminNotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
      />
    </>
  );
}
