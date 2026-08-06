import React from "react";
import { CloseIcon } from "@/components/icons";

interface EnrollModalProps {
  isOpen: boolean;
  isRtl?: boolean;
  enrollForm: {
    name: string;
    email: string;
    location: string;
    extra: string;
  };
  onClose: () => void;
  onChange: (updated: {
    name: string;
    email: string;
    location: string;
    extra: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({
  isOpen,
  isRtl = false,
  enrollForm,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/55 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-[440px] shadow-2xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <span className="text-sm font-extrabold text-on-surface">
            {isRtl ? "التسجيل اليدوي" : "Manual Enrollment"}
          </span>
          <button
            onClick={onClose}
            className="cursor-pointer bg-transparent border-0 p-1 text-outline hover:text-on-surface transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3 text-xs">
          {[
            {
              label: isRtl ? "الاسم الكامل" : "Full Name / Entity",
              key: "name",
              type: "text",
            },
            {
              label: isRtl ? "البريد الإلكتروني" : "Email Address",
              key: "email",
              type: "email",
            },
            {
              label: isRtl ? "الموقع" : "Location",
              key: "location",
              type: "text",
            },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block font-bold text-on-surface-variant mb-1">
                {label}
              </label>
              <input
                type={type}
                required
                value={enrollForm[key as keyof typeof enrollForm]}
                onChange={(e) =>
                  onChange({ ...enrollForm, [key]: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-outline-variant outline-none bg-surface text-xs box-border focus:ring-1 focus:ring-surface-tint focus:border-surface-tint"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-2 p-2.5 bg-primary-container text-on-primary font-bold rounded-xl border-0 cursor-pointer text-xs hover:bg-primary-container/90 transition-colors shadow-sm"
          >
            {isRtl ? "إتمام عملية التسجيل" : "Complete Enrollment"}
          </button>
        </form>
      </div>
    </div>
  );
};
