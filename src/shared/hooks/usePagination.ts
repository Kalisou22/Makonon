import { useState, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialSize?: number;
  totalItems?: number;
}

export function usePagination({
  initialPage = 0,
  initialSize = 20,
  totalItems = 0,
}: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / size));

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const resetPagination = useCallback(() => {
    setPage(initialPage);
  }, [initialPage]);

  return {
    page,
    size,
    totalPages,
    setSize,
    goToPage,
    nextPage,
    previousPage,
    resetPagination,
  };
}
