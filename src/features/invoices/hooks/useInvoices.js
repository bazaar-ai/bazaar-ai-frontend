import { useState, useEffect, useCallback } from "react";
import { getInvoices } from "../api/invoiceApi";

export function useInvoices(pageSize = 10) {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = useCallback(
    async (pageNum) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getInvoices({ page: pageNum, size: pageSize });
        // httpClient unwraps SuccessResponse<Page<T>>, so data = Page object
        setInvoices(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
        setPage(data.number ?? pageNum);
      } catch (err) {
        setError(err.message ?? "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchInvoices(0);
  }, [fetchInvoices]);

  const goToPage = (pageNum) => {
    fetchInvoices(pageNum);
  };

  return {
    invoices,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    refetch: () => fetchInvoices(page),
    goToPage,
  };
}
