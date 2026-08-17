"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { CsvValidationResult } from "@/utils/bulk-product-template";

interface BulkUploadTabProps {
  selectedFile: File | null;
  csvPreview: CsvValidationResult | null;
  uploadError: string | null;
  uploadSuccess: string | null;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  onUpload: () => void;
  onGoToTemplate: () => void;
  onClose: () => void;
}

export function BulkUploadTab({
  selectedFile,
  csvPreview,
  uploadError,
  uploadSuccess,
  isUploading,
  onFileSelect,
  onUpload,
  onGoToTemplate,
  onClose,
}: BulkUploadTabProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* File Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
          dragOver
            ? "border-primary bg-primary/5 scale-[0.99]"
            : "border-outline-variant/70 hover:border-primary/50 hover:bg-surface-container-lowest/50 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />

        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
          <Icon name="cloud_upload" className="h-6 w-6" />
        </div>

        <div className="space-y-1">
          <p className="font-bold text-sm text-on-surface">
            {selectedFile
              ? "تم تحديد الملف — انقر لتغييره أو اسحب ملفاً جديداً"
              : "اسحب وأفلت ملف المنتجات هنا، أو "}
            {!selectedFile && (
              <span className="text-primary underline underline-offset-4">
                تصفح من جهازك
              </span>
            )}
          </p>
          <p className="text-[11px] text-on-surface-variant">
            الصيغ المدعومة: Excel (.xlsx, .xls) أو CSV (.csv) — الحجم الأقصى
            10MB
          </p>
        </div>
      </div>

      {/* CSV Pre-Validation & Read Rows Preview */}
      {csvPreview && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-on-surface flex items-center gap-1.5">
              <Icon
                name={csvPreview.isValid ? "verified" : "warning"}
                className={`h-4 w-4 ${csvPreview.isValid ? "text-primary" : "text-error"}`}
              />
              <span>
                {csvPreview.isValid
                  ? `البيانات المقروءة من الملف (${csvPreview.totalRows} منتج جاهز للاستيراد):`
                  : "تنبيه في تنسيق الملف المقروء"}
              </span>
            </h4>

            {csvPreview.isValid && (
              <span className="text-[11px] text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full">
                7 أعمدة مطابقة
              </span>
            )}
          </div>

          {!csvPreview.isValid && csvPreview.missingHeaders.length > 0 && (
            <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-xs">
              <p className="font-bold mb-1">
                الأعمدة الإلزامية التالية مفقودة من ملفك:
              </p>
              <p className="font-mono select-all">
                {csvPreview.missingHeaders.join(", ")}
              </p>
            </div>
          )}

          {/* All Read Rows Preview Table */}
          {csvPreview.rows.length > 0 && (
            <div className="overflow-x-auto border border-outline-variant/60 rounded-2xl bg-white max-h-64 shadow-xs">
              <table className="w-full text-right text-xs whitespace-nowrap">
                <thead className="bg-surface-container-low/70 sticky top-0 border-b border-outline-variant/50 text-on-surface-variant font-bold">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">title</th>
                    <th className="p-2.5">originalprice</th>
                    <th className="p-2.5">discountedprice</th>
                    <th className="p-2.5">quantityavailable</th>
                    <th className="p-2.5">expirationdate</th>
                    <th className="p-2.5">categoryname</th>
                    <th className="p-2.5">description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                  {csvPreview.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-surface-container-lowest transition-colors"
                    >
                      <td className="p-2.5 text-on-surface-variant font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-primary">
                        {row.title || "-"}
                      </td>
                      <td className="p-2.5 font-mono text-outline line-through">
                        {row.originalprice ? `${row.originalprice} EGP` : "-"}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-primary">
                        {row.discountedprice
                          ? `${row.discountedprice} EGP`
                          : "-"}
                      </td>
                      <td className="p-2.5 font-mono">
                        <span className="px-2 py-0.5 rounded-lg bg-surface-container font-bold">
                          {row.quantityavailable || "-"}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono text-on-surface-variant">
                        {row.expirationdate || "-"}
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-light-green text-primary font-bold text-[11px]">
                          {row.categoryname || "-"}
                        </span>
                      </td>
                      <td
                        className="p-2.5 text-on-surface-variant max-w-xs truncate"
                        title={row.description}
                      >
                        {row.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Upload Success Alert */}
      {uploadSuccess && (
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-4 text-primary animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
              <Icon name="check" className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{uploadSuccess}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                تم تحديث قائمة منتجات المتجر فوراً.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              window.location.reload();
            }}
            className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            تحديث القائمة
          </button>
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-4 rounded-2xl bg-error-container/20 border border-error/30 flex items-center gap-3 text-error animate-in fade-in duration-200">
          <Icon name="error" className="h-5 w-5 shrink-0" />
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-sm">فشل في استيراد المنتجات</p>
            <p className="whitespace-pre-line leading-relaxed">{uploadError}</p>
          </div>
        </div>
      )}

      {/* Upload Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onGoToTemplate}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-outline-variant/60 text-on-surface font-bold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
        >
          الرجوع للنموذج والتعليمات
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-outline-variant/60 text-on-surface-variant font-bold text-xs hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-40"
          >
            إلغاء
          </button>

          <button
            type="button"
            onClick={onUpload}
            disabled={!selectedFile || isUploading}
            className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md shadow-primary/20 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>جاري رفع ومعالجة الملف...</span>
              </>
            ) : (
              <>
                <Icon name="cloud_upload" className="h-4 w-4" />
                <span>بدء الاستيراد والرفع</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
