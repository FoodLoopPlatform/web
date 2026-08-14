import { Icon } from "@/components/ui/icon";

interface RiskTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function RiskTablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: RiskTablePaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="bg-surface border-t border-outline-variant flex items-center justify-between px-4 py-3 flex-wrap gap-3">
      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
            title="الصفحة السابقة"
          >
            <Icon name="chevron_right" className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1">
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg font-bold text-sm transition-all cursor-pointer flex items-center justify-center ${
                  p === page
                    ? "bg-primary text-white"
                    : "text-on-surface hover:bg-surface-container"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center"
            title="الصفحة التالية"
          >
            <Icon name="chevron_left" className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="text-sm font-medium text-on-surface-variant mr-auto">
        عرض {startItem} - {endItem} من أصل {totalItems} عنصرًا
      </p>
    </div>
  );
}
