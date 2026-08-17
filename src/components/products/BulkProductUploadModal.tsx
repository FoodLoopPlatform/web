"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import {
  validateCsvContent,
  type CsvValidationResult,
} from "@/utils/bulk-product-template";
import { bulkUploadProducts } from "@/app/products/api/products-api";
import { BulkTemplateGuideTab } from "./bulk-upload/BulkTemplateGuideTab";
import { BulkUploadTab } from "./bulk-upload/BulkUploadTab";

interface BulkProductUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BulkProductUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkProductUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"template" | "upload">("template");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<CsvValidationResult | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, startUploadTransition] = useTransition();

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadError(null);
    setUploadSuccess(null);

    // If CSV, do client-side pre-validation and preview
    if (file.name.toLowerCase().endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          const result = validateCsvContent(text);
          setCsvPreview(result);
        }
      };
      reader.readAsText(file);
    } else {
      setCsvPreview(null);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    if (csvPreview && !csvPreview.isValid) {
      setUploadError(
        csvPreview.error ||
          "تنسيق الملف غير متوافق. يرجى التأكد من تضمين كافة الأعمدة الإلزامية.",
      );
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);

    startUploadTransition(async () => {
      const res = await bulkUploadProducts(selectedFile);
      if (res.error) {
        setUploadError(res.error);
      } else {
        const count =
          typeof res.data === "object" &&
          res.data !== null &&
          "count" in res.data &&
          typeof (res.data as { count?: unknown }).count === "number"
            ? (res.data as { count: number }).count
            : csvPreview?.totalRows || undefined;

        setUploadSuccess(
          count !== undefined
            ? `تم استيراد ${count} منتج بنجاح وإضافتها إلى مخزون المتجر!`
            : "تم رفع واستيراد ملف المنتجات بنجاح!",
        );
        onSuccess?.();
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-upload-modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] bg-surface-container-lowest border border-outline-variant/60 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-right font-sans"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/40 bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon name="cloud_upload" className="h-6 w-6" />
            </div>
            <div>
              <h2
                id="bulk-upload-modal-title"
                className="text-lg sm:text-xl font-bold text-primary"
              >
                رفع المنتجات بالجملة (Excel / CSV)
              </h2>
              <p className="text-xs text-on-surface-variant">
                استيراد وتحديث كتالوج المنتجات دفعة واحدة عبر ملف إكسل أو كود
                CSV
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            aria-label="إغلاق النافذة"
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors cursor-pointer disabled:opacity-40"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/40 px-6 bg-surface-container-lowest shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("template")}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "template"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="description" className="h-4 w-4" />
            <span>تنسيق الملف والنموذج المعتمد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`py-3.5 px-4 font-bold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "upload"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Icon name="upload_file" className="h-4 w-4" />
            <span>رفع الملف والتحقق</span>
            {selectedFile && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "template" && (
            <BulkTemplateGuideTab onGoToUpload={() => setActiveTab("upload")} />
          )}

          {activeTab === "upload" && (
            <BulkUploadTab
              selectedFile={selectedFile}
              csvPreview={csvPreview}
              uploadError={uploadError}
              uploadSuccess={uploadSuccess}
              isUploading={isUploading}
              onFileSelect={handleFileSelect}
              onUpload={handleUpload}
              onGoToTemplate={() => setActiveTab("template")}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
