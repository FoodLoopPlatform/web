"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  getStoreNotes,
  StoreAdminNote,
} from "@/app/dashboard/api/store-notes-api";
import { AdminNotesDrawer } from "@/components/common/AdminNotesDrawer";

export function AdminNoticesWidget() {
  const [notes, setNotes] = useState<StoreAdminNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    getStoreNotes({ pageSize: 5 }).then((res) => {
      if (mounted) {
        setIsLoading(false);
        if (res.data) {
          setNotes(res.data);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const getCategoryTheme = (category?: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("warn") || cat.includes("تحذير")) {
      return {
        badgeBg: "bg-rose-100 text-rose-800",
        icon: "warning",
        borderColor: "border-r-rose-600",
      };
    }
    if (cat.includes("alert") || cat.includes("تنبيه")) {
      return {
        badgeBg: "bg-amber-100 text-amber-900",
        icon: "notifications",
        borderColor: "border-r-amber-500",
      };
    }
    return {
      badgeBg: "bg-primary-fixed text-primary",
      icon: "info",
      borderColor: "border-r-primary",
    };
  };

  return (
    <>
      <div className="bg-light-green rounded-xl border border-outline-variant p-md flex flex-col justify-between">
        <div className="flex justify-between items-center mb-md">
          <div className="flex items-center gap-2">
            <Icon name="campaign" className="w-5 h-5 text-primary" />
            <h4 className="font-label-caps text-label-caps text-primary font-bold uppercase">
              ملاحظات وتنبيهات الإدارة
            </h4>
          </div>
          {notes.length > 0 && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="text-link text-xs font-bold hover:underline cursor-pointer"
            >
              عرض الكل ({notes.length})
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="py-6 flex items-center justify-center gap-2 text-outline text-xs">
            <Icon
              name="refresh"
              className="w-4 h-4 animate-spin text-primary"
            />
            <span>جاري التحميل...</span>
          </div>
        ) : notes.length === 0 ? (
          <div className="py-4 px-3 bg-white/60 rounded-lg text-center text-xs text-on-surface-variant">
            لا توجد ملاحظات أو تنبيهات إدارية جديدة لمتجرك حالياً.
          </div>
        ) : (
          <div className="space-y-sm">
            {notes.slice(0, 3).map((note) => {
              const theme = getCategoryTheme(note.category);
              return (
                <div
                  key={note.id}
                  onClick={() => setDrawerOpen(true)}
                  className={`p-3 bg-white rounded-lg shadow-2xs border-r-4 ${theme.borderColor} cursor-pointer hover:shadow-xs transition-shadow flex flex-col gap-1`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-on-surface line-clamp-1">
                      {note.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg}`}
                    >
                      {note.category || "إشعار"}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                    {note.body}
                  </p>
                  <span className="text-[10px] text-outline font-data-mono mt-0.5">
                    {new Date(note.sentAt).toLocaleDateString("ar-EG", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AdminNotesDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
