import { useEffect } from "react";
import "./InvoiceDrawer.css";

const STATUS_META = {
  ELIGIBLE: { label: "Eligible",  cls: "pill--eligible" },
  FUNDED:   { label: "Funded",    cls: "pill--funded"   },
  PENDING:  { label: "Pending",   cls: "pill--pending"  },
  REJECTED: { label: "Rejected",  cls: "pill--rejected" },
  DRAFT:    { label: "Draft",     cls: "pill--draft"    },
  SETTLED:  { label: "Settled",   cls: "pill--settled"  },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status?.toUpperCase()] ?? { label: status ?? "Unknown", cls: "pill--draft" };
  return (
    <span className={`pill ${meta.cls}`}>
      <span className="pill__dot" />{meta.label}
    </span>
  );
}

function fmt(amount) {
  if (amount == null) return "—";
  return `₼ ${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function InvoiceDrawer({ invoice, onClose }) {
  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const rows = [
    { label: "Invoice Code", value: invoice.invoiceCode },
    { label: "Buyer",        value: invoice.buyer },
    { label: "Seller",       value: invoice.seller },
    { label: "Goods",        value: invoice.goods },
    { label: "Invoice Date", value: fmtDate(invoice.invoiceDate ?? invoice.createdAt) },
    { label: "Due Date",     value: fmtDate(invoice.dueDate) },
    { label: "Uploaded",     value: fmtDate(invoice.createdAt) },
  ];

  return (
    <>
      <div className="inv-drawer-backdrop" onClick={onClose} />

      <aside className="inv-drawer">
        <div className="inv-drawer__header">
          <div className="inv-drawer__title">{invoice.invoiceCode ?? "Invoice Details"}</div>
          <button className="inv-drawer__close" onClick={onClose}>✕</button>
        </div>

        <div className="inv-drawer__hero">
          <span className="inv-drawer__hero-amount">{fmt(invoice.amount)}</span>
          <StatusPill status={invoice.invoiceStatus} />
        </div>

        <div className="inv-drawer__body">
          {rows.map(({ label, value }) => (
            <div key={label} className="inv-drawer__row">
              <span className="inv-drawer__lbl">{label}</span>
              <span className="inv-drawer__val">{value ?? "—"}</span>
            </div>
          ))}
        </div>

        {invoice.invoiceStatus === "PENDING" && (
          <div className="inv-drawer__info">
            <span>⏱️</span>
            Risk scoring is in progress. Result will be sent via notification within 2–5 minutes.
          </div>
        )}
      </aside>
    </>
  );
}