import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useInvoices } from "../../invoices/hooks/useInvoices";
import { UploadModal } from "../../invoices/pages/InvoicesPage";
import "./MerchantOverviewPage.css";

const STATUS_META = {
    ELIGIBLE: { label: "Eligible", cls: "pill--eligible" },
    FUNDED:   { label: "Funded",   cls: "pill--funded"   },
    PENDING:  { label: "Pending",  cls: "pill--pending"  },
    REJECTED: { label: "Rejected", cls: "pill--rejected" },
    DRAFT:    { label: "Draft",    cls: "pill--draft"    },
    SETTLED:  { label: "Settled",  cls: "pill--settled"  },
};

function formatAmount(amount) {
    if (amount == null) return "—";
    return `₼ ${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

export function MerchantOverviewPage() {
    const { user, onNavigate } = useOutletContext();
    const [showUpload, setShowUpload] = useState(false);

    const { invoices, totalElements, loading, refetch } = useInvoices(4);

    const today = new Date().toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
    });

    const firstName = user?.name?.split(" ")[0] ?? "Merchant";

    const handleUploadSuccess = () => {
        setShowUpload(false);
        refetch();
    };

    return (
        <div className="overview">
            <div className="overview__header animate-rise">
                <div>
                    <div className="overview__title">Welcome, {firstName} 👋</div>
                    <div className="overview__sub">Today: {today}</div>
                </div>
                <button className="mer-btn mer-btn--primary" onClick={() => setShowUpload(true)}>
                    ⬆️ Upload Invoice
                </button>
            </div>

            <div className="overview__metrics">
                <div className="metric-card animate-rise" style={{ animationDelay: "40ms" }}>
                    <div className="metric-card__label">Total Invoices</div>
                    <div className="metric-card__value">{loading ? "—" : totalElements}</div>
                    <div className="metric-card__trend metric-card__trend--up">↑ 3 added this month</div>
                </div>
                <div className="metric-card animate-rise" style={{ animationDelay: "90ms" }}>
                    <div className="metric-card__label">Factoring Volume</div>
                    <div className="metric-card__value">₼142K</div>
                    <div className="metric-card__trend metric-card__trend--up">↑ 18% vs last month</div>
                </div>
                <div className="metric-card animate-rise" style={{ animationDelay: "140ms" }}>
                    <div className="metric-card__label">Wallet Balance</div>
                    <div className="metric-card__value">₼8,430</div>
                    <div className="metric-card__trend">Last updated: today</div>
                </div>
                <div className="metric-card animate-rise" style={{ animationDelay: "190ms" }}>
                    <div className="metric-card__label">Trade DNA Score</div>
                    <div className="metric-card__value">78</div>
                    <div className="metric-card__trend metric-card__trend--up">↑ 4 points last month</div>
                </div>
            </div>

            <div className="overview__grid">
                <div className="mer-card animate-rise" style={{ animationDelay: "220ms" }}>
                    <div className="mer-card__row">
                        <div className="mer-card__title">Recent Invoices</div>
                        <button className="mer-btn mer-btn--outline mer-btn--sm" onClick={() => onNavigate("invoices")}>
                            View all →
                        </button>
                    </div>
                    <table className="mer-table">
                        <thead>
                        <tr>
                            <th>Invoice</th>
                            <th>Buyer</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i} className="overview-skel-row">
                                    <td><div className="overview-skel overview-skel--code" /></td>
                                    <td><div className="overview-skel overview-skel--buyer" /></td>
                                    <td><div className="overview-skel overview-skel--amount" /></td>
                                    <td><div className="overview-skel overview-skel--pill" /></td>
                                </tr>
                            ))
                        ) : invoices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="overview-empty-cell">
                                    No invoices yet —{" "}
                                    <button className="overview-empty-link" onClick={() => setShowUpload(true)}>
                                        upload your first one
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            invoices.map((inv) => {
                                const meta = STATUS_META[inv.invoiceStatus?.toUpperCase()] ?? { label: inv.invoiceStatus, cls: "pill--draft" };
                                return (
                                    <tr key={inv.id}>
                                        <td><strong>{inv.invoiceCode}</strong></td>
                                        <td>{inv.buyer}</td>
                                        <td>{formatAmount(inv.amount)}</td>
                                        <td>
                                                <span className={`pill ${meta.cls}`}>
                                                    <span className="pill__dot" />
                                                    {meta.label}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="mer-card animate-rise" style={{ animationDelay: "260ms" }}>
                    <div className="mer-card__title" style={{ marginBottom: 14 }}>Trade DNA Score</div>
                    <div className="dna-score">
                        <div className="dna-score__ring-wrap">
                            <svg width="96" height="96" viewBox="0 0 96 96">
                                <defs>
                                    <linearGradient id="dnaRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#7c6ff0" />
                                        <stop offset="55%" stopColor="#5b9ff5" />
                                        <stop offset="100%" stopColor="#5fd9c4" />
                                    </linearGradient>
                                </defs>
                                <circle cx="48" cy="48" r="40" fill="none" stroke="var(--glass-border-soft)" strokeWidth="8" />
                                <circle
                                    cx="48" cy="48" r="40" fill="none"
                                    stroke="url(#dnaRingGradient)" strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 40 * 0.78} ${2 * Math.PI * 40 * 0.22}`}
                                    strokeLinecap="round"
                                    className="dna-score__ring-progress"
                                    style={{ transform: "rotate(-90deg)", transformOrigin: "48px 48px" }}
                                />
                            </svg>
                            <div className="dna-score__center">
                                <div className="dna-score__num">78</div>
                                <div className="dna-score__label">/ 100</div>
                            </div>
                        </div>
                        <div className="dna-score__factors">
                            {[
                                { label: "Payment History", pct: 85 },
                                { label: "Volume Consistency", pct: 72 },
                                { label: "Buyer Diversity", pct: 68 },
                                { label: "Invoice Quality", pct: 90 },
                            ].map(({ label, pct }) => (
                                <div key={label} className="dna-factor">
                                    <div className="dna-factor__row">
                                        <span className="dna-factor__label">{label}</span>
                                        <span className="dna-factor__pct">{pct}%</span>
                                    </div>
                                    <div className="progress-bg">
                                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mer-card animate-rise" style={{ marginTop: 14, animationDelay: "300ms" }}>
                <div className="mer-card__row">
                    <div className="mer-card__title">Recent Wallet Transactions</div>
                    <button className="mer-btn mer-btn--outline mer-btn--sm" onClick={() => onNavigate("wallet")}>
                        View wallet →
                    </button>
                </div>
                {[
                    { icon: "tx-in", emoji: "↓", label: "Factoring payout — INV-088", date: "Jan 18, 2025", amount: "+₼ 15,213", cls: "tx-amount--in" },
                    { icon: "tx-out", emoji: "↑", label: "Service fee — INV-088", date: "Jan 18, 2025", amount: "−₼ 287", cls: "tx-amount--out" },
                    { icon: "tx-in", emoji: "↓", label: "Factoring payout — INV-085", date: "Jan 10, 2025", amount: "+₼ 24,570", cls: "tx-amount--in" },
                    { icon: "tx-fee", emoji: "★", label: "Platform fee — January", date: "Jan 1, 2025", amount: "−₼ 50", cls: "tx-amount--out" },
                ].map(({ icon, emoji, label, date, amount, cls }) => (
                    <div key={label} className="tx-row">
                        <div className="tx-row__left">
                            <div className={`tx-icon ${icon}`}>{emoji}</div>
                            <div>
                                <div className="tx-name">{label}</div>
                                <div className="tx-date">{date}</div>
                            </div>
                        </div>
                        <div className={`tx-amount ${cls}`}>{amount}</div>
                    </div>
                ))}
            </div>

            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onSuccess={handleUploadSuccess}
                />
            )}
        </div>
    );
}