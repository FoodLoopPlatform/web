"use client";

import React from "react";
import { AdminNoteCard } from "./AdminNoteCard";
import { AdminNoteItem } from "../../types/admin.types";
import { CloseIcon } from "@/components/icons";

export interface SendNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetName?: string;
  targetRole?: "Consumer" | "Charity" | "Store";
  isRtl?: boolean;
  onNoteSent?: (note: AdminNoteItem) => void;
}

export const SendNoteModal: React.FC<SendNoteModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetRole,
  isRtl = false,
  onNoteSent,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`bg-white rounded-2xl p-5 sm:p-6 w-full max-w-[560px] shadow-2xl flex flex-col gap-4 border border-card-border ${
          isRtl ? "text-right" : "text-left"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container shrink-0" />
            <h3 className="font-extrabold text-sm text-on-surface">
              {isRtl ? "إرسال ملاحظة / رسالة جديدة" : "Send Note / Message"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isRtl ? "إغلاق" : "Close"}
            className="p-1 hover:bg-surface-container rounded-lg text-outline transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Inner Note Form */}
        <div className="max-h-[80vh] overflow-y-auto pe-1">
          <AdminNoteCard
            key={targetId}
            targetId={targetId}
            targetName={targetName}
            targetRole={targetRole}
            isRtl={isRtl}
            compact
            onNoteSent={(note) => {
              if (onNoteSent) onNoteSent(note);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
