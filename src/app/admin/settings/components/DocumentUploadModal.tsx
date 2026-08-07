"use client";

import React, { useState } from "react";
import { AdminDictionary } from "../../constants/dictionary";
import { DocumentCategory } from "../../types/admin.types";
import {
  CloseIcon,
  UploadCloudIcon,
  AlertCircleIcon,
} from "@/components/icons";

interface DocumentUploadModalProps {
  isOpen: boolean;
  t: AdminDictionary;
  isRtl?: boolean;
  onClose: () => void;
  onUpload: (data: {
    name: string;
    category: DocumentCategory;
    version: string;
    fileSize: string;
  }) => void;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  t,
  isRtl = false,
  onClose,
  onUpload,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentCategory>(
    "Egyptian Food Safety & Regulations",
  );
  const [version, setVersion] = useState("v1.0");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      !ALLOWED_TYPES.includes(file.type) &&
      !file.name.endsWith(".txt") &&
      !file.name.endsWith(".pdf") &&
      !file.name.endsWith(".docx")
    ) {
      setErrorMsg(
        isRtl
          ? "نوع الملف غير مدعوم. يرجى رفع ملفات PDF أو TXT أو DOCX فقط."
          : "Invalid file format. Please upload PDF, TXT, or DOCX files only.",
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMsg(
        isRtl
          ? "حجم الملف يتجاوز الحد الأقصى المسموح به (١٠ ميجابايت)."
          : "File size exceeds maximum allowed limit (10MB).",
      );
      setSelectedFile(null);
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg(
        isRtl
          ? "يرجى اختيار ملف للمتابعة."
          : "Please select a file to proceed.",
      );
      return;
    }

    const fileSizeStr =
      selectedFile.size >= 1024 * 1024
        ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(selectedFile.size / 1024)} KB`;

    onUpload({
      name: name || selectedFile.name,
      category,
      version,
      fileSize: fileSizeStr,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/55 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl p-6 w-full max-w-[500px] shadow-2xl flex flex-col gap-4 ${
          isRtl ? "text-right" : "text-left"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <h3 className="text-sm font-extrabold text-on-surface">
            {t.uploadDocumentBtn}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-lg text-outline transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-200">
            <AlertCircleIcon className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              {isRtl ? "اسم المستند / اللائحة" : "Document Name / Title"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                isRtl
                  ? "مثال: اللائحة الفنية المحدثة سلامة الغذاء..."
                  : "e.g. Technical Regulation Food Safety..."
              }
              className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {t.categoryCol}
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as DocumentCategory)
                }
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer truncate"
              >
                <option value="Egyptian Food Safety & Regulations">
                  {isRtl
                    ? "قوانين وسلامة الغذاء المصرية"
                    : "Egyptian Food Safety & Regulations"}
                </option>
                <option value="Food Handling & Eligibility">
                  {isRtl
                    ? "إرشادات وتداول الطعام والتبرعات"
                    : "Food Handling & Eligibility"}
                </option>
                <option value="Sales & Demand Patterns">
                  {isRtl
                    ? "أنماط المبيعات والطلب التاريخية"
                    : "Sales & Demand Patterns"}
                </option>
                <option value="Partner Inventory Info">
                  {isRtl ? "بيانات مخزون الشركاء" : "Partner Inventory Info"}
                </option>
                <option value="Store & Customer Location Data">
                  {isRtl
                    ? "البيانات الجغرافية للمتاجر والعملاء"
                    : "Store & Customer Location Data"}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                {t.versionCol}
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* File Selector */}
          <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-5 text-center flex flex-col items-center gap-2 bg-surface hover:bg-surface-container/40 transition-colors">
            <UploadCloudIcon className="w-8 h-8 text-primary" />
            <div className="text-xs text-on-surface-variant font-medium">
              {selectedFile ? (
                <span className="font-bold text-primary">
                  {selectedFile.name}
                </span>
              ) : isRtl ? (
                "اختر ملفاً (PDF, TXT, DOCX) بحجم أقل من ١٠ ميجابايت"
              ) : (
                "Choose a file (PDF, TXT, DOCX) under 10MB"
              )}
            </div>
            <label className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-2xs">
              <span>{isRtl ? "تصفح الملفات" : "Browse File"}</span>
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div
            className={`flex items-center gap-2 pt-2 justify-end ${isRtl ? "flex-row-reverse" : ""}`}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {isRtl ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
            >
              {t.uploadDocumentBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
