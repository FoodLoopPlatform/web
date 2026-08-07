"use client";

import React, { useState } from "react";
import { CloseIcon } from "@/components/icons";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default" | "success";
  isRtl?: boolean;
  showReasonInput?: boolean;
  reasonPlaceholder?: string;
  presetReasons?: string[];
  onConfirm: (reason?: string) => void;
  onClose: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "default",
  isRtl = false,
  showReasonInput = false,
  reasonPlaceholder,
  presetReasons = [],
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const confirmBtnBg =
    variant === "danger"
      ? "bg-error hover:bg-error/90 text-on-error"
      : variant === "warning"
        ? "bg-amber-600 hover:bg-amber-700 text-white"
        : variant === "success"
          ? "bg-primary hover:bg-primary-container text-on-primary"
          : "bg-primary-container hover:bg-primary text-on-primary";

  const defaultPlaceholder = isRtl
    ? "اكتب سبب الإجراء أو أي ملاحظات للإدارة والحساب..."
    : "Enter the reason or administrative notes...";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/55 flex items-center justify-center p-4"
      onClick={() => {
        setReason("");
        onClose();
      }}
    >
      <div
        className={`bg-white rounded-2xl p-6 w-full max-w-[460px] shadow-2xl flex flex-col gap-4 ${
          isRtl ? "text-right" : "text-left"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <h3 className="text-sm font-extrabold text-on-surface">{title}</h3>
          <button
            type="button"
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="p-1 hover:bg-surface-container rounded-lg text-outline transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {message}
        </p>

        {showReasonInput && (
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-on-surface">
              {isRtl
                ? "سبب الإجراء / الملاحظات (سيتم حفظها في سجل الحساب):"
                : "Action Reason / Notes (Saved to log):"}
            </label>

            {presetReasons.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-1">
                {presetReasons.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setReason(preset)}
                    className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold transition-all cursor-pointer ${
                      reason === preset
                        ? "border-primary-container bg-light-green text-primary-container"
                        : "border-card-border text-on-surface-variant bg-surface hover:bg-surface-container"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder || defaultPlaceholder}
              className="w-full p-2.5 rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-surface-tint bg-surface text-xs text-on-surface resize-none"
            />
          </div>
        )}

        <div
          className={`flex items-center gap-2 pt-2 justify-end ${isRtl ? "flex-row-reverse" : ""}`}
        >
          <button
            type="button"
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(reason);
              setReason("");
              onClose();
            }}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer ${confirmBtnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
