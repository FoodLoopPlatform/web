"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { CloseIcon } from "@/components/icons";
import {
  getStoreNotes,
  StoreAdminNote,
} from "@/app/dashboard/api/store-notes-api";

interface AdminNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminNotesDrawer({ isOpen, onClose }: AdminNotesDrawerProps) {
  const [notes, setNotes] = useState<StoreAdminNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const res = await getStoreNotes({ pageSize: 50 });
    setIsLoading(false);
    if (res.data) {
      setNotes(res.data);
    } else {
      setError(res.error || "تعذر تحميل ملاحظات الإدارة");
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (isOpen) {
      Promise.resolve().then(() => {
        if (active) {
          setIsLoading(true);
          setError(null);
        }
      });
      getStoreNotes({ pageSize: 50 }).then((res) => {
        if (active) {
          setIsLoading(false);
          if (res.data) {
            setNotes(res.data);
          } else {
            setError(res.error || "تعذر تحميل ملاحظات الإدارة");
          }
        }
      });
    }
    return () => {
      active = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getCategoryBadge = (category?: string) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("warn") || cat.includes("تحذير")) {
      return {
        bg: "bg-rose-100 text-rose-800 border-rose-200",
        icon: "warning",
        label: "تحذير إداري",
      };
    }
    if (cat.includes("alert") || cat.includes("تنبيه")) {
      return {
        bg: "bg-amber-100 text-amber-900 border-amber-200",
        icon: "notifications",
        label: "تنبيه هام",
      };
    }
    return {
      bg: "bg-primary-fixed text-primary border-primary/20",
      icon: "info",
      label: "إشعار / ملاحظة",
    };
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div
        dir="rtl"
        className="fixed top-0 bottom-0 left-0 z-[9999] w-[95vw] sm:w-[620px] lg:w-[680px] shrink-0 bg-white shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto gap-6 animate-in slide-in-from-left duration-250 border-r border-card-border select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <Icon name="campaign" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-on-surface">
                ملاحظات وتنبيهات الإدارة
              </h3>
              <p className="text-xs sm:text-sm text-outline font-medium mt-0.5">
                التواصل الرسمي والملاحظات الإدارية لمتجرك
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchNotes}
              disabled={isLoading}
              className="p-2.5 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer disabled:opacity-50"
              title="تحديث الملاحظات"
            >
              <Icon
                name="refresh"
                className={`w-5 h-5 ${isLoading ? "animate-spin text-primary" : ""}`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl hover:bg-surface-container text-outline hover:text-on-surface transition-colors cursor-pointer"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
          {isLoading && notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3.5 text-outline">
              <Icon
                name="refresh"
                className="w-8 h-8 animate-spin text-primary"
              />
              <span className="text-sm font-bold">
                جاري تحميل ملاحظات الإدارة...
              </span>
            </div>
          ) : error && notes.length === 0 ? (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold text-center">
              {error}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3.5 text-outline">
              <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-outline">
                <Icon
                  name="mark_email_read"
                  className="w-7 h-7 text-emerald-700"
                />
              </div>
              <h4 className="text-base font-bold text-on-surface">
                لا توجد ملاحظات إدارية جديدة
              </h4>
              <p className="text-sm max-w-sm text-outline">
                لم تقم إدارة المنصة بإرسال أي ملاحظات أو تنبيهات خاصة لمتجرك حتى
                الآن.
              </p>
            </div>
          ) : (
            notes.map((note) => {
              const badge = getCategoryBadge(note.category);
              return (
                <div
                  key={note.id}
                  className="bg-surface rounded-2xl p-5 sm:p-6 border border-card-border hover:shadow-sm transition-shadow flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badge.bg}`}
                    >
                      <Icon name={badge.icon} className="w-4 h-4" />
                      <span>{badge.label}</span>
                    </span>

                    <span className="text-xs sm:text-sm font-data-mono text-outline font-medium">
                      {new Date(note.sentAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-on-surface">
                    {note.title}
                  </h4>

                  <p className="text-sm sm:text-base text-on-surface leading-relaxed bg-white/90 p-4 rounded-xl border border-surface-container font-medium">
                    {note.body}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-outline pt-1">
                    <span>
                      المرسل:{" "}
                      <span className="font-bold text-on-surface">
                        {note.sentByAdminName}
                      </span>
                    </span>
                    <span className="font-mono text-xs">
                      #{note.id.slice(0, 8)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-container pt-5">
          <span className="text-sm text-outline font-medium">
            إجمالي الملاحظات:{" "}
            <span className="font-bold text-on-surface">{notes.length}</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-outline hover:text-on-surface hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </>
  );
}
