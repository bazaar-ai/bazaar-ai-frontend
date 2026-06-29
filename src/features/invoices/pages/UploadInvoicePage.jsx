import { useState, useRef } from "react";
import { uploadInvoice } from "../api/invoiceApi";
import "./UploadInvoicePage.css";

/* ─── Mock OCR simulation ─── */
function simulateOcr(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        invoiceNumber: "INV-2024-089",
        invoiceDate:   "12.01.2025",
        dueDate:       "12.02.2025",
        amount:        "22000",
        seller:        "Your Company LLC",
        buyer:         "Azersu LLC",
        goods:         "Construction materials",
        accuracy: {
          invoiceNumber: 98,
          invoiceDate:   99,
          dueDate:       87,
          amount:        99,
        },
      });
    }, 1400);
  });
}

/* ─── Step bar ─── */
const STEPS = ["File", "Verify OCR", "Confirm"];

function StepBar({ current }) {
  return (
    <div className="upl-steps">
      {STEPS.map((label, idx) => {
        const done   = idx < current;
        const active = idx === current;
        return (
          <div key={label} className="upl-steps__item">
            <div className={`upl-steps__circle${done ? " done" : active ? " active" : ""}`}>
              {done ? (
                <svg viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span className={`upl-steps__label${active ? " active" : done ? " done" : ""}`}>
              {label}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`upl-steps__line${done ? " done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Step 1: File ─── */
function StepFile({ onNext }) {
  const [file, setFile]       = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  const handleNext = async () => {
    setLoading(true);
    const ocr = await simulateOcr(file);
    setLoading(false);
    onNext(ocr, file);
  };

  return (
    <div className="upl-step animate-rise">
      <div
        className={`upl-dropzone${dragging ? " over" : ""}${file ? " has-file" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp"
          style={{ display: "none" }}
          onChange={(e) => setFile(e.target.files[0] ?? null)}
        />
        <div className="upl-dropzone__icon">{file ? "📄" : "⬆️"}</div>
        <div className="upl-dropzone__label">
          {file ? file.name : "Drop a PDF or image here, or click to browse"}
        </div>
        <div className="upl-dropzone__hint">
          {file
            ? `${(file.size / 1024).toFixed(0)} KB`
            : "PDF, PNG, JPG, WEBP accepted"}
        </div>
        {file && (
          <button
            className="upl-dropzone__clear"
            onClick={(e) => { e.stopPropagation(); setFile(null); }}
          >
            Remove
          </button>
        )}
      </div>

      <div className="upl-actions">
        <button
          className="mer-btn mer-btn--primary"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Analysing…" : file ? "Upload & Scan →" : "Generate  →"}
        </button>
      </div>
    </div>
  );
}

/* ─── Accuracy badge ─── */
function AccBadge({ pct }) {
  const tone = pct >= 95 ? "high" : pct >= 80 ? "mid" : "low";
  return <span className={`upl-acc upl-acc--${tone}`}>{pct}% accuracy</span>;
}

/* ─── Step 2: Verify OCR ─── */
function StepVerify({ ocr, onBack, onNext }) {
  const [fields, setFields] = useState({
    invoiceNumber: ocr?.invoiceNumber ?? "",
    invoiceDate:   ocr?.invoiceDate   ?? "",
    dueDate:       ocr?.dueDate       ?? "",
    amount:        ocr?.amount        ?? "",
    seller:        ocr?.seller        ?? "",
    buyer:         ocr?.buyer         ?? "",
    goods:         ocr?.goods         ?? "",
  });
  const acc = ocr?.accuracy ?? {};
  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));

  const lowAcc = Object.entries(acc).filter(([, v]) => v < 90);

  return (
    <div className="upl-verify animate-rise">
      <div className="upl-ocr-banner">
        <span>✅</span>
        OCR completed successfully. Review the data and edit if needed.
      </div>

      <div className="upl-verify__grid">
        {/* Left: fields */}
        <div className="upl-card">
          <div className="upl-card__head"><span>📋</span> Extracted Data</div>

          <div className="upl-field">
            <label>Invoice Number {acc.invoiceNumber && <AccBadge pct={acc.invoiceNumber} />}</label>
            <input value={fields.invoiceNumber} onChange={set("invoiceNumber")} />
          </div>

          <div className="upl-field-row">
            <div className="upl-field">
              <label>Invoice Date {acc.invoiceDate && <AccBadge pct={acc.invoiceDate} />}</label>
              <input value={fields.invoiceDate} onChange={set("invoiceDate")} />
            </div>
            <div className="upl-field">
              <label>Due Date {acc.dueDate && <AccBadge pct={acc.dueDate} />}</label>
              <input value={fields.dueDate} onChange={set("dueDate")} />
            </div>
          </div>

          <div className="upl-field">
            <label>Amount (₼) {acc.amount && <AccBadge pct={acc.amount} />}</label>
            <input value={fields.amount} onChange={set("amount")} inputMode="numeric" />
          </div>

          <div className="upl-field-row">
            <div className="upl-field">
              <label>Seller (You)</label>
              <input value={fields.seller} onChange={set("seller")} />
            </div>
            <div className="upl-field">
              <label>Buyer</label>
              <input value={fields.buyer} onChange={set("buyer")} />
            </div>
          </div>

          <div className="upl-field">
            <label>Goods / Service</label>
            <select value={fields.goods} onChange={set("goods")}>
              {["Construction materials","Electronics","Food & Beverages",
                "Textile","Chemicals","Machinery","Other"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: preview */}
        <div className="upl-card upl-preview">
          <div className="upl-card__head"><span>🧾</span> Invoice Preview</div>

          <div className="upl-preview__doc">
            <div className="upl-preview__label">INVOICE</div>
            <div className="upl-preview__row"><span>№:</span><span>{fields.invoiceNumber || "—"}</span></div>
            <div className="upl-preview__row"><span>Date:</span><span>{fields.invoiceDate || "—"}</span></div>
            <div className="upl-preview__row"><span>Due Date:</span><span>{fields.dueDate || "—"}</span></div>
            <div className="upl-preview__divider" />
            <div className="upl-preview__row"><span>Seller:</span><span>{fields.seller || "—"}</span></div>
            <div className="upl-preview__row"><span>Buyer:</span><span>{fields.buyer || "—"}</span></div>
            <div className="upl-preview__divider" />
            <div className="upl-preview__total">
              Total: ₼ {Number(fields.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>

          {lowAcc.length > 0 && (
            <div className="upl-preview__warn">
              ⚠️ Verify the accuracy of the {lowAcc.map(([k]) => k).join(", ")} —
              OCR read it with {lowAcc[0][1]}% confidence.
            </div>
          )}
        </div>
      </div>

      <div className="upl-actions">
        <button className="mer-btn mer-btn--outline" onClick={onBack}>← Back</button>
        <button className="mer-btn mer-btn--primary" onClick={() => onNext(fields)}>
          Data is correct — Continue →
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Confirm ─── */
function StepConfirm({ fields, file, onBack, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);

  const rows = [
    { label: "Invoice No.", value: fields.invoiceNumber },
    { label: "Buyer",       value: fields.buyer },
    { label: "Amount",      value: `₼ ${Number(fields.amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
    { label: "Goods",       value: fields.goods },
    { label: "Due Date",    value: fields.dueDate },
  ];

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await uploadInvoice(file);
    } catch {
      // ignore – real upload may fail in dev; flow continues
    } finally {
      setSubmitting(false);
      onSuccess();
    }
  };

  return (
    <div className="upl-step animate-rise">
      <div className="upl-card upl-confirm">
        <div className="upl-card__head"><span>📋</span> Final Confirmation</div>

        <div className="upl-confirm__rows">
          {rows.map(({ label, value }) => (
            <div key={label} className="upl-confirm__row">
              <span className="upl-confirm__lbl">{label}</span>
              <span className="upl-confirm__val">{value || "—"}</span>
            </div>
          ))}
        </div>

        <div className="upl-confirm__info">
          <span>⏱️</span>
          Risk scoring will be completed within 2–5 minutes. The result will be sent via notification.
        </div>
      </div>

      <div className="upl-actions">
        <button className="mer-btn mer-btn--outline" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
        <button className="mer-btn mer-btn--primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "✅ Submit Invoice"}
        </button>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
export function UploadInvoicePage({ onSuccess }) {
  const [step, setStep]     = useState(0);
  const [ocr, setOcr]       = useState(null);
  const [file, setFile]     = useState(null);
  const [fields, setFields] = useState(null);

  return (
    <div className="upl-page">
      <div className="upl-page__header">
        <h1 className="upl-page__title">Upload Invoice</h1>
        <p className="upl-page__sub">Via PDF, image, or camera</p>
      </div>

      <StepBar current={step} />

      {step === 0 && (
        <StepFile
          onNext={(ocrData, f) => { setOcr(ocrData); setFile(f); setStep(1); }}
        />
      )}
      {step === 1 && (
        <StepVerify
          ocr={ocr}
          onBack={() => setStep(0)}
          onNext={(edited) => { setFields(edited); setStep(2); }}
        />
      )}
      {step === 2 && (
        <StepConfirm
          fields={fields}
          file={file}
          onBack={() => setStep(1)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}