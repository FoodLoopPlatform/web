"use client";

import React, { useState, useEffect } from "react";
import { sendAdminNote, getAdminNotes } from "../../api/user-note-api";
import { AdminNoteItem } from "../../types/admin.types";
import {
  PRESET_TEMPLATES,
  CATEGORY_STYLES,
  ROLE_LABEL_MAP,
  NoteTemplate,
} from "./admin-note-constants";
import { AdminNoteHistoryFeed } from "./AdminNoteHistoryFeed";

export interface AdminNoteCardProps {
  /** Optional pre-filled target recipient ID */
  targetId?: string;
  /** Optional pre-filled target recipient Name */
  targetName?: string;
  /** Optional pre-filled target recipient Role */
  targetRole?: "Consumer" | "Charity" | "Store";
  /** RTL orientation flag */
  isRtl?: boolean;
  /** Compact mode flag */
  compact?: boolean;
  /** Optional callback fired when a note is successfully sent */
  onNoteSent?: (note: AdminNoteItem) => void;
}

export const AdminNoteCard: React.FC<AdminNoteCardProps> = ({
  targetId,
  targetName,
  targetRole,
  isRtl = false,
  compact = false,
  onNoteSent,
}) => {
  const [activeTab, setActiveTab] = useState<"write" | "history">("write");

  // Form State
  const [recipientRole, setRecipientRole] = useState<
    "Consumer" | "Charity" | "Store"
  >(targetRole || "Consumer");
  const [recipientName] = useState<string>(targetName || "");
  const [recipientId] = useState<string>(targetId || "");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<
    "INFO" | "WARNING" | "URGENT" | "INTERNAL"
  >("INFO");
  const [isInternal, setIsInternal] = useState<boolean>(false);

  // Status & Notes List
  const [notes, setNotes] = useState<AdminNoteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Load existing notes history without calling state setters inside effect body
  useEffect(() => {
    let isSubscribed = true;
    getAdminNotes(targetId, targetRole)
      .then((res) => {
        if (isSubscribed && res.data) {
          setNotes(res.data);
        }
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false);
      });

    return () => {
      isSubscribed = false;
    };
  }, [targetId, targetRole]);

  const showFeedback = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const applyTemplate = (tmpl: NoteTemplate) => {
    setTitle(isRtl ? tmpl.titleAr : tmpl.titleEn);
    setContent(isRtl ? tmpl.bodyAr : tmpl.bodyEn);
    setCategory(tmpl.cat);
    setIsInternal(tmpl.cat === "INTERNAL");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      showFeedback(
        "error",
        isRtl
          ? "الرجاء كتابة محتوى الملاحظة أولاً"
          : "Please enter note content first",
      );
      return;
    }

    setIsSending(true);
    try {
      const res = await sendAdminNote({
        recipientId: recipientId || targetId || `usr-${Date.now()}`,
        recipientName: recipientName || targetName || "User",
        recipientRole,
        title: title.trim() || (isRtl ? "ملاحظة إدارية" : "Admin Note"),
        content: content.trim(),
        category,
        isInternal,
      });

      if (res.data) {
        setNotes((prev) => [res.data!, ...prev]);
        setTitle("");
        setContent("");
        showFeedback(
          "success",
          isRtl
            ? "تم إرسال وحفظ الملاحظة بنجاح"
            : "Note/Message saved successfully",
        );
        if (onNoteSent) onNoteSent(res.data);
      } else {
        showFeedback(
          "error",
          res.error || (isRtl ? "فشل إرسال الملاحظة" : "Failed to send note"),
        );
      }
    } catch {
      showFeedback(
        "error",
        isRtl ? "حدث خطأ غير متوقع" : "An unexpected error occurred",
      );
    } finally {
      setIsSending(false);
    }
  };

  const displayName = targetName
    ? targetName.length > 22
      ? targetName.slice(0, 20) + "..."
      : targetName
    : "";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`bg-white rounded-2xl ${
        compact ? "p-0" : "p-5 border border-card-border shadow-xs"
      }`}
    >
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-surface-container pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`text-xs font-black px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === "write"
                ? "bg-primary-container text-white shadow-2xs"
                : "text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            ✏️ {isRtl ? "كتابة ملاحظة" : "Compose Note"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`text-xs font-black px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === "history"
                ? "bg-primary-container text-white shadow-2xs"
                : "text-outline hover:text-on-surface hover:bg-surface-container"
            }`}
          >
            <span>📜 {isRtl ? "سجل الملاحظات" : "History"}</span>
            <span className="bg-white/20 text-current text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {notes.length}
            </span>
          </button>
        </div>

        {targetName && (
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-primary bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            <span>{ROLE_LABEL_MAP[targetRole || "Consumer"]?.icon}</span>
            <span>{displayName}</span>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <span>{feedback.type === "success" ? "✅" : "⚠️"}</span>
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Write Tab */}
      {activeTab === "write" && (
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          {/* Target Role Selector if not target pre-filled */}
          {!targetRole && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-on-surface-variant">
                {isRtl ? "فئة المستلم" : "Recipient Role"}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Consumer", "Store", "Charity"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRecipientRole(r)}
                    className={`py-1.5 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                      recipientRole === r
                        ? "bg-primary text-white border-primary shadow-2xs"
                        : "bg-surface border-card-border text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    {ROLE_LABEL_MAP[r].icon}{" "}
                    {isRtl ? ROLE_LABEL_MAP[r].ar : ROLE_LABEL_MAP[r].en}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Presets */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-extrabold text-outline">
              ⚡ {isRtl ? "قوالب سريعة جاهزة:" : "Quick Templates:"}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="text-[10px] font-bold whitespace-nowrap bg-surface-container/70 hover:bg-primary-container/10 hover:text-primary-container text-on-surface border border-outline-variant/40 px-2.5 py-1 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  {isRtl ? tmpl.titleAr : tmpl.titleEn}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-on-surface-variant">
              {isRtl ? "نوع ونبرة الملاحظة" : "Category & Severity"}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["INFO", "WARNING", "URGENT", "INTERNAL"] as const).map((c) => {
                const style = CATEGORY_STYLES[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setIsInternal(c === "INTERNAL");
                    }}
                    className={`py-1.5 px-2 text-[11px] font-extrabold rounded-xl border transition-all cursor-pointer text-center ${
                      category === c
                        ? style.activePill
                        : `${style.badge} hover:opacity-90`
                    }`}
                  >
                    {isRtl ? style.labelAr : style.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isRtl
                  ? "عنوان الملاحظة / الموضوع الرئيسي..."
                  : "Note Title / Subject..."
              }
              className="text-xs font-bold bg-surface border border-card-border rounded-xl px-3 py-2 text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary-container"
            />
          </div>

          {/* Main Body Input */}
          <div className="flex flex-col gap-1">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isRtl
                  ? "اكتب تفاصيل الملاحظة أو التنبيه الرسمي هنا..."
                  : "Type official note or message details here..."
              }
              className="text-xs font-medium bg-surface border border-card-border rounded-xl p-3 text-on-surface placeholder:text-outline focus:outline-hidden focus:border-primary-container resize-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="w-3.5 h-3.5 rounded-md text-primary accent-primary cursor-pointer"
              />
              <span className="text-xs font-bold text-outline">
                🔒 {isRtl ? "ملاحظة داخلية فقط" : "Internal Note Only"}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSending}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-black px-4 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSending
                ? isRtl
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isRtl
                  ? "إرسال وحفظ الملاحظة"
                  : "Send & Save Note"}
            </button>
          </div>
        </form>
      )}

      {/* History Feed Tab */}
      {activeTab === "history" && (
        <AdminNoteHistoryFeed
          notes={notes}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isRtl={isRtl}
        />
      )}
    </div>
  );
};
