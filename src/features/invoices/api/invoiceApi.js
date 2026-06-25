import { httpClient } from "../../../shared/api/httpClient";

export function getInvoices({ page = 0, size = 10 } = {}) {
  return httpClient.get("/invoices", { params: { page, size } });
}

export function uploadInvoice(file) {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }
  return httpClient.post("/invoices/upload-invoice", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
