"use client";

import React from "react";
import { AdminNoteItem } from "../../types/admin.types";
import { arText } from "../../constants/arabic-mapper";
import { CATEGORY_STYLES, ROLE_LABEL_MAP } from "./admin-note-constants";

interface AdminNoteHistoryFeedProps {
  notes: AdminNoteItem[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isRtl?: boolean;
}

export function AdminNoteHistoryFeed({
  notes,
  isLoading,
  searchQuery,
  onSearchChange,
  isRtl = false,
}: AdminNoteHistoryFeedProps) {
  const filteredNotes = notes.filter((n) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.recipientName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={
            isRtl
              ? "ابحث في سجل الملاحظات السابقة..."
              : "Search notes history..."
          }
          className="w-full text-xs bg-surface-container/60 border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary-container font-medium"
        />
      </div>

      {/* List Container */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-outline font-medium animate-pulse">
          {isRtl ? "جاري تحميل سجل الملاحظات..." : "Loading notes history..."}
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="py-8 text-center bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
          <p className="text-xs font-bold text-outline">
            {isRtl
              ? "لا توجد ملاحظات مرسلة مطابقة للبحث"
              : "No notes found matching search"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[320px] overflow-y-auto pe-1">
          {filteredNotes.map((note) => {
            const catStyle =
              CATEGORY_STYLES[note.category] || CATEGORY_STYLES.INFO;
            const roleInfo =
              ROLE_LABEL_MAP[note.recipientRole] || ROLE_LABEL_MAP.Consumer;

            return (
              <div
                key={note.id}
                className="bg-white border border-card-border rounded-xl p-3 shadow-2xs flex flex-col gap-2 hover:border-slate-300 transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs shrink-0">{roleInfo.icon}</span>
                    <span className="text-xs font-extrabold text-on-surface truncate">
                      {arText(note.recipientName, isRtl)}
                    </span>
                    <span className="text-[10px] text-outline font-mono">
                      ({arText(roleInfo.en, isRtl)})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${catStyle.badge}`}
                    >
                      {isRtl ? catStyle.labelAr : catStyle.labelEn}
                    </span>
                    {note.isInternal && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        🔒 {isRtl ? "داخلي" : "Internal"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xs font-extrabold text-primary font-sans leading-snug">
                  {arText(note.title, isRtl)}
                </h4>

                {/* Content */}
                <p className="text-xs text-on-surface-variant font-medium whitespace-pre-wrap leading-relaxed">
                  {arText(note.content, isRtl)}
                </p>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between text-[10px] text-outline font-mono pt-1.5 border-t border-slate-100">
                  <span>✍️ {arText(note.createdBy, isRtl)}</span>
                  <span>🕒 {note.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
