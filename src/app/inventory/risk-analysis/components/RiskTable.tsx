import { SparklesIcon } from "@/components/icons";
import { RiskTablePagination } from "./RiskTablePagination";
import { RiskTableRow } from "./RiskTableRow";
import type { RiskAnalysisItem } from "../lib/risk-analysis";

interface RiskTableProps {
  items: RiskAnalysisItem[];
  totalItems: number;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  aiMode: boolean;
  onToggleAiMode: () => void;
}

export function RiskTable({
  items,
  totalItems,
  page,
  totalPages,
  pageSize,
  onPageChange,
  aiMode,
  onToggleAiMode,
}: RiskTableProps) {
  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-xs overflow-hidden w-full">
      {/* Table toolbar */}
      <div className="bg-surface-container-low border-b border-outline-variant flex items-center justify-between px-4 py-3.5 flex-wrap gap-2">
        <h4 className="text-lg text-primary">قائمة تحليل المخاطر</h4>
        <button
          type="button"
          onClick={onToggleAiMode}
          aria-pressed={aiMode}
          title="ترتيب القائمة حسب أولوية الذكاء الاصطناعي"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
            aiMode
              ? "bg-primary-fixed text-primary"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${aiMode ? "bg-primary" : "bg-outline"}`}
          />
          وضع رؤى الذكاء الاصطناعي
          <SparklesIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Table */}
      <div>
        <table className="w-full table-fixed border-collapse text-right">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[9%]">
                الإجراءات
              </th>
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[16%]">
                مستوى المخاطر
              </th>
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[14%]">
                درجة الطلب
              </th>
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[19%]">
                تاريخ الانتهاء
              </th>
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[14%]">
                الكمية الحالية
              </th>
              <th className="px-2 sm:px-3 py-2 text-[11px] sm:text-xs font-bold text-on-surface-variant w-[28%]">
                اسم المنتج
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {items.map((item, index) => (
              <RiskTableRow
                key={item.product.id}
                item={item}
                openMenuUpward={index >= items.length - 2}
              />
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="py-14 text-center text-on-surface-variant text-sm">
            لا توجد عناصر مطابقة لخيارات الفلترة الحالية.
          </div>
        )}
      </div>

      <RiskTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
