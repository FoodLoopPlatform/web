import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    setCurrentPage,
  };
}
