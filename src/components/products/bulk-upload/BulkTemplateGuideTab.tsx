"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import {
  BULK_PRODUCT_COLUMNS,
  BULK_PRODUCT_SAMPLE_ROWS,
  BULK_PRODUCT_CSV_HEADERS,
  BULK_PRODUCT_CSV_CONTENT,
  downloadBulkProductsTemplate,
} from "@/utils/bulk-product-template";

interface BulkTemplateGuideTabProps {
  onGoToUpload: () => void;
}

export function BulkTemplateGuideTab({
  onGoToUpload,
}: BulkTemplateGuideTabProps) {
  const [copiedHeaders, setCopiedHeaders] = useState(false);
  const [copiedFullCsv, setCopiedFullCsv] = useState(false);

  const handleCopyHeaders = async () => {
    try {
      await navigator.clipboard.writeText(BULK_PRODUCT_CSV_HEADERS);
      setCopiedHeaders(true);
      setTimeout(() => setCopiedHeaders(false), 2500);
    } catch {
      // Ignore clipboard fallback
    }
  };

  const handleCopyFullCsv = async () => {
    try {
      await navigator.clipboard.writeText(BULK_PRODUCT_CSV_CONTENT);
      setCopiedFullCsv(true);
      setTimeout(() => setCopiedFullCsv(false), 2500);
    } catch {
      // Ignore clipboard fallback
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Template Action Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-primary text-base flex items-center gap-2">
            <Icon name="table_chart" className="h-5 w-5 text-primary" />
            <span>تنسيق ملف Excel / CSV المطلوب</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
            يجب أن يحتوي الملف على الأعمدة السبعة التالية بالترتيب والمسميات
            الموضحة أدناه لضمان قبول البيانات واستيرادها بنجاح.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={downloadBulkProductsTemplate}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <Icon name="download" className="h-4 w-4" />
            <span>تحميل نموذج جاهز (CSV / Excel)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyHeaders}
            className="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-outline-variant/40"
            title="نسخ أسماء الأعمدة المطلوبة"
          >
            <Icon
              name={copiedHeaders ? "check" : "content_copy"}
              className={`h-4 w-4 ${copiedHeaders ? "text-primary font-bold" : ""}`}
            />
            <span>{copiedHeaders ? "تم نسخ الأعمدة!" : "نسخ الأعمدة"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullCsv}
            className="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 border border-outline-variant/40"
            title="نسخ بيانات النموذج بالكامل"
          >
            <Icon
              name={copiedFullCsv ? "check" : "content_copy"}
              className={`h-4 w-4 ${copiedFullCsv ? "text-primary font-bold" : ""}`}
            />
            <span>{copiedFullCsv ? "تم النسخ!" : "نسخ النموذج"}</span>
          </button>
        </div>
      </div>

      {/* Column Specification Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
            <Icon
              name="format_list_bulleted"
              className="h-4 w-4 text-primary"
            />
            <span>تفاصيل ومواصفات الأعمدة المطلوبة (Columns)</span>
          </h4>
          <span className="text-[11px] text-on-surface-variant">
            7 أعمدة معتمدة
          </span>
        </div>

        <div className="overflow-x-auto border border-outline-variant/60 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-right text-xs">
            <thead className="bg-surface-container-low/70 border-b border-outline-variant/50 text-on-surface-variant font-bold">
              <tr>
                <th className="p-3">اسم العمود بالملف (Key)</th>
                <th className="p-3">الاسم العربي</th>
                <th className="p-3">النوع</th>
                <th className="p-3 text-center">الإلزامية</th>
                <th className="p-3">الوصف والتنسيق</th>
                <th className="p-3">قيمة توضيحية</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {BULK_PRODUCT_COLUMNS.map((col) => (
                <tr
                  key={col.key}
                  className="hover:bg-surface-container-lowest/60 transition-colors"
                >
                  <td className="p-3 font-mono font-bold text-primary select-all">
                    {col.key}
                  </td>
                  <td className="p-3 font-bold">{col.nameAr}</td>
                  <td className="p-3 text-on-surface-variant">{col.type}</td>
                  <td className="p-3 text-center">
                    {col.required ? (
                      <span className="px-2 py-0.5 rounded-full bg-error-container/20 text-error font-bold text-[10px]">
                        إلزامي
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px]">
                        اختياري
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-on-surface-variant leading-relaxed">
                    {col.description}
                  </td>
                  <td
                    className="p-3 font-mono text-[11px] text-on-surface-variant/90 select-all"
                    dir="ltr"
                  >
                    {col.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sample Data Table Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-on-surface flex items-center gap-1.5">
            <Icon name="visibility" className="h-4 w-4 text-primary" />
            <span>معاينة بيانات النموذج المعتمد (Sample Data)</span>
          </h4>
          <span className="text-[11px] text-on-surface-variant">
            {BULK_PRODUCT_SAMPLE_ROWS.length} أمثلة توضيحية
          </span>
        </div>

        <div className="overflow-x-auto border border-outline-variant/60 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-right text-xs whitespace-nowrap">
            <thead className="bg-surface-container-low/70 border-b border-outline-variant/50 text-on-surface-variant font-bold">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">title</th>
                <th className="p-3">originalprice</th>
                <th className="p-3">discountedprice</th>
                <th className="p-3">quantityavailable</th>
                <th className="p-3">expirationdate</th>
                <th className="p-3">categoryname</th>
                <th className="p-3">description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30 text-on-surface">
              {BULK_PRODUCT_SAMPLE_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-surface-container-lowest/60 transition-colors"
                >
                  <td className="p-3 text-on-surface-variant font-mono">
                    {idx + 1}
                  </td>
                  <td className="p-3 font-bold text-primary">{row.title}</td>
                  <td className="p-3 font-mono text-outline line-through">
                    {row.originalprice} EGP
                  </td>
                  <td className="p-3 font-mono font-bold text-primary">
                    {row.discountedprice} EGP
                  </td>
                  <td className="p-3 font-mono">
                    <span className="px-2 py-0.5 rounded-lg bg-surface-container font-bold">
                      {row.quantityavailable}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-on-surface-variant">
                    {row.expirationdate}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-light-green text-primary font-bold text-[11px]">
                      {row.categoryname}
                    </span>
                  </td>
                  <td
                    className="p-3 text-on-surface-variant max-w-xs truncate"
                    title={row.description}
                  >
                    {row.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Format Guide Box */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 space-y-2 text-xs text-on-surface-variant leading-relaxed">
        <p className="font-bold text-on-surface flex items-center gap-1.5">
          <Icon name="info" className="h-4 w-4 text-primary" />
          <span>إرشادات هامة قبل رفع الملف:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 pr-2">
          <li>
            تأكد من أن صيغة التاريخ هي{" "}
            <code className="font-mono text-primary bg-white px-1.5 py-0.5 rounded border border-outline-variant/40">
              YYYY-MM-DD
            </code>{" "}
            (مثال: 2026-08-30).
          </li>
          <li>
            يجب أن يكون السعر بعد الخصم (discountedprice) أقل من أو مساوياً
            للسعر الأصلي (originalprice).
          </li>
          <li>
            يتم قبول ملفات بصيغة{" "}
            <code className="font-mono text-primary bg-white px-1.5 py-0.5 rounded border border-outline-variant/40">
              .csv
            </code>
            ،{" "}
            <code className="font-mono text-primary bg-white px-1.5 py-0.5 rounded border border-outline-variant/40">
              .xlsx
            </code>
            ، أو{" "}
            <code className="font-mono text-primary bg-white px-1.5 py-0.5 rounded border border-outline-variant/40">
              .xls
            </code>
            .
          </li>
        </ul>
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onGoToUpload}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span>الانتقال إلى رفع الملف</span>
          <Icon name="arrow_back" className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}
