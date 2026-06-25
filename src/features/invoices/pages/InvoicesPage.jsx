import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useInvoices } from "../hooks/useInvoices";
import { uploadInvoice } from "../api/invoiceApi";
import "./InvoicesPage.css";

/* ─── status metadata ─── */
const STATUS_META = {
  ELIGIBLE: { label: "Eligible",  cls: "pill--eligible" },
  FUNDED:   { label: "Funded",    cls: "pill--funded"   },
  PENDING:  { label: "Pending",   cls: "pill--pending"  },
  REJECTED: { label: "Rejected",  cls: "pill--rejected" },
  DRAFT:    { label: "Draft",     cls: "pill--draft"    },
  SETTLED:  { label: "Settled",   cls: "pill--settled"  },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status?.toUpperCase()] ?? {
    label: status ?? "Unknown",
    cls: "pill--draft",
  };
  return (
      <span className={`pill ${meta.cls}`}>
      <span className="pill__dot" />
        {meta.label}
    </span>
  );
}

function formatAmount(amount) {
  if (amount == null) return "—";
  return `₼ ${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(instant) {
  if (!instant) return "—";
  return new Date(instant).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ─── Upload modal ─── */
export function UploadModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async () => {
    setUploading(true);
    setError(null);
    try {
      await uploadInvoice(file);
      onSuccess();
    } catch (err) {
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
      <div className="inv-modal-overlay" onClick={onClose}>
        <div
            className="inv-modal animate-rise"
            onClick={(e) => e.stopPropagation()}
        >
          <div className="inv-modal__header">
            <div className="inv-modal__title">Upload Invoice</div>
            <button className="inv-modal__close" onClick={onClose}>✕</button>
          </div>

          <p className="inv-modal__hint">
            Upload a text file (<code>.txt</code>) with <code>buyer</code>,{" "}
            <code>amount</code>, and <code>status</code> fields — or submit
            without a file to generate a random invoice.
          </p>

          <div
              className={`inv-dropzone${dragging ? " inv-dropzone--over" : ""}${file ? " inv-dropzone--has-file" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
          >
            <input
                ref={inputRef}
                type="file"
                accept=".txt,text/plain"
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0] ?? null)}
            />
            <div className="inv-dropzone__icon">
              {file ? "📄" : "⬆️"}
            </div>
            <div className="inv-dropzone__label">
              {file
                  ? file.name
                  : "Drop a .txt file here, or click to browse"}
            </div>
            {file && (
                <button
                    className="inv-dropzone__clear"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  Remove
                </button>
            )}
          </div>

          {error && <div className="inv-modal__error">{error}</div>}

          <div className="inv-modal__actions">
            <button className="mer-btn mer-btn--outline" onClick={onClose} disabled={uploading}>
              Cancel
            </button>
            <button
                className="mer-btn mer-btn--primary"
                onClick={handleSubmit}
                disabled={uploading}
            >
              {uploading ? "Uploading…" : file ? "Upload File" : "Generate Random"}
            </button>
          </div>
        </div>
      </div>
  );
}

/* ─── Pagination ─── */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(0, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  if (left > 0) {
    pages.push(0);
    if (left > 1) pages.push("...");
  }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) {
    if (right < totalPages - 2) pages.push("...");
    pages.push(totalPages - 1);
  }

  return (
      <div className="inv-pagination">
        <button
            className="inv-pagination__btn inv-pagination__btn--arrow"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
        >
          ←
        </button>

        {pages.map((p, idx) =>
            p === "..." ? (
                <span key={`ellipsis-${idx}`} className="inv-pagination__ellipsis">…</span>
            ) : (
                <button
                    key={p}
                    className={`inv-pagination__btn${p === page ? " inv-pagination__btn--active" : ""}`}
                    onClick={() => onPageChange(p)}
                >
                  {p + 1}
                </button>
            )
        )}

        <button
            className="inv-pagination__btn inv-pagination__btn--arrow"
            disabled={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
        >
          →
        </button>
      </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ onUpload }) {
  return (
      <div className="inv-empty">
        <div className="inv-empty__icon">📋</div>
        <div className="inv-empty__title">No invoices yet</div>
        <div className="inv-empty__sub">
          Upload your first invoice to start tracking and financing your receivables.
        </div>
        <button className="mer-btn mer-btn--primary" onClick={onUpload}>
          ⬆️ Upload your first invoice
        </button>
      </div>
  );
}

/* ─── Skeleton rows ─── */
function SkeletonRows({ count = 6 }) {
  return Array.from({ length: count }).map((_, i) => (
      <tr key={i} className="inv-table__row inv-table__row--skeleton">
        <td><div className="inv-skel inv-skel--code" /></td>
        <td><div className="inv-skel inv-skel--buyer" /></td>
        <td><div className="inv-skel inv-skel--amount" /></td>
        <td><div className="inv-skel inv-skel--pill" /></td>
        <td><div className="inv-skel inv-skel--date" /></td>
      </tr>
  ));
}

/* ─── Main page ─── */
export function InvoicesPage() {
  const { onNavigate } = useOutletContext();
  const [showUpload, setShowUpload] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const {
    invoices,
    page,
    totalPages,
    totalElements,
    loading,
    error,
    refetch,
    goToPage,
  } = useInvoices(10);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setSuccessBanner(true);
    refetch();
    setTimeout(() => setSuccessBanner(false), 4000);
  };

  return (
      <div className="inv-page">
        {/* Header */}
        <div className="inv-page__header animate-rise">
          <div>
            <h1 className="inv-page__title">My Invoices</h1>
            <p className="inv-page__sub">
              {loading
                  ? "Loading…"
                  : `${totalElements} invoice${totalElements !== 1 ? "s" : ""} total`}
            </p>
          </div>
          <button
              className="mer-btn mer-btn--primary"
              onClick={() => setShowUpload(true)}
          >
            ⬆️ Upload Invoice
          </button>
        </div>

        {/* Success banner */}
        {successBanner && (
            <div className="inv-banner inv-banner--success animate-rise">
              ✅ Invoice uploaded successfully! Your list has been refreshed.
            </div>
        )}

        {/* Error banner */}
        {error && (
            <div className="inv-banner inv-banner--error animate-rise">
              ⚠️ {error}
              <button className="inv-banner__retry" onClick={refetch}>
                Retry
              </button>
            </div>
        )}

        {/* Stats strip */}
        {!loading && !error && invoices.length > 0 && (
            <div className="inv-stats animate-rise" style={{ animationDelay: "60ms" }}>
              {[
                { label: "Total",    cls: "",              count: totalElements },
                { label: "Pending",  cls: "stat--pending", count: invoices.filter(i => i.invoiceStatus === "PENDING").length },
                { label: "Eligible", cls: "stat--eligible",count: invoices.filter(i => i.invoiceStatus === "ELIGIBLE").length },
                { label: "Funded",   cls: "stat--funded",  count: invoices.filter(i => i.invoiceStatus === "FUNDED").length },
              ].map(({ label, cls, count }) => (
                  <div key={label} className={`inv-stat ${cls}`}>
                    <span className="inv-stat__count">{count}</span>
                    <span className="inv-stat__label">{label}</span>
                  </div>
              ))}
            </div>
        )}

        {/* Table card */}
        <div className="mer-card animate-rise" style={{ animationDelay: "100ms", padding: 0, overflow: "hidden" }}>
          {!loading && !error && invoices.length === 0 ? (
              <EmptyState onUpload={() => setShowUpload(true)} />
          ) : (
              <>
                <div className="inv-table-wrap">
                  <table className="inv-table">
                    <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Buyer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <SkeletonRows count={8} />
                    ) : (
                        invoices.map((inv, idx) => (
                            <tr
                                key={inv.id}
                                className="inv-table__row animate-rise"
                                style={{ animationDelay: `${idx * 30}ms` }}
                            >
                              <td>
                                <span className="inv-table__code">{inv.invoiceCode}</span>
                              </td>
                              <td>
                                <span className="inv-table__buyer">{inv.buyer}</span>
                              </td>
                              <td>
                          <span className="inv-table__amount">
                            {formatAmount(inv.amount)}
                          </span>
                              </td>
                              <td>
                                <StatusPill status={inv.invoiceStatus} />
                              </td>
                              <td>
                          <span className="inv-table__date">
                            {formatDate(inv.createdAt)}
                          </span>
                              </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                  </table>
                </div>

                {!loading && (
                    <div className="inv-table-footer">
                <span className="inv-table-footer__info">
                  Page {page + 1} of {totalPages || 1}
                </span>
                      <Pagination
                          page={page}
                          totalPages={totalPages}
                          onPageChange={goToPage}
                      />
                    </div>
                )}
              </>
          )}
        </div>

        {/* Upload modal */}
        {showUpload && (
            <UploadModal
                onClose={() => setShowUpload(false)}
                onSuccess={handleUploadSuccess}
            />
        )}
      </div>
  );
}