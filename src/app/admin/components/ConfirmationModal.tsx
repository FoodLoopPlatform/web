import React, { useState } from "react";

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
      ? "bg-red-600 hover:bg-red-700 text-white"
      : variant === "warning"
      ? "bg-amber-600 hover:bg-amber-700 text-white"
      : variant === "success"
      ? "bg-emerald-700 hover:bg-emerald-800 text-white"
      : "bg-[#005129] hover:bg-[#00381a] text-white";

  const defaultPlaceholder = isRtl
    ? "اكتب سبب الإجراء أو أي ملاحظات للإدارة والحساب..."
    : "Enter the reason or administrative notes...";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={() => {
        setReason("");
        onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
        className={isRtl ? "text-right" : "text-left"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#eeeee9] pb-3">
          <h3 className="text-sm font-extrabold text-[#1a1c19]">{title}</h3>
          <button
            type="button"
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="p-1 hover:bg-[#eeeee9] rounded-lg text-[#707a70] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-[#404941] leading-relaxed">{message}</p>

        {showReasonInput && (
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold text-[#1a1c19]">
              {isRtl ? "سبب الإجراء / الملاحظات (سيتم حفظها في سجل الحساب):" : "Action Reason / Notes (Saved to log):"}
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
                        ? "border-[#005129] bg-emerald-50 text-[#005129]"
                        : "border-[#e0e6df] text-[#404941] bg-[#fafaf4] hover:bg-[#eeeee9]"
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
              className="w-full p-2.5 rounded-xl border border-[#bfc9be] focus:outline-none focus:ring-1 focus:ring-[#005129] bg-[#fafaf4] text-xs text-[#1a1c19] resize-none"
            />
          </div>
        )}

        <div className={`flex items-center gap-2 pt-2 justify-end ${isRtl ? "flex-row-reverse" : ""}`}>
          <button
            type="button"
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="px-4 py-2 bg-[#eeeee9] hover:bg-[#e0e6df] text-[#1a1c19] font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
