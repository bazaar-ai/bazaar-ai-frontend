import { useState } from "react";
import "./MarketPlacePage.css";

/* ─── Mock data ─── */
const MOCK_REQUESTS = [
    {
        id: "INV-2024-088",
        company: "Delta Trade",
        category: "Groceries",
        days: 45,
        date: "Jan 8, 2025",
        invoice: 15500,
        received: 12400,
        yield: 9.8,
        riskScore: 91,
        status: "FUNDED",
        progressPct: 80,
        paymentDate: "Feb 22, 2025",
        daysRemaining: 13,
    },
    {
        id: "INV-2024-072",
        company: "Araz Export",
        category: "Agriculture",
        days: 30,
        date: "Dec 14, 2024",
        invoice: 24000,
        received: 19200,
        yield: 8.5,
        riskScore: 85,
        status: "FUNDED",
        progressPct: 60,
        paymentDate: "Mar 5, 2025",
        daysRemaining: 28,
    },
];

const MOCK_ELIGIBLE = [
    {
        id: "INV-2024-101",
        company: "Silk Road LLC",
        category: "Trade",
        days: 60,
        date: "Feb 1, 2025",
        invoice: 32000,
        received: null,
        yield: 10.2,
        riskScore: 88,
        status: "ELIGIBLE",
        progressPct: 0,
        paymentDate: "Apr 2, 2025",
        daysRemaining: 60,
    },
];

const STATUS_MAP = {
    FUNDED:  { label: "Funded",  cls: "pill--funded"   },
    ELIGIBLE:{ label: "Eligible",cls: "pill--eligible"  },
    PENDING: { label: "Pending", cls: "pill--pending"   },
};

function fmt(amount) {
    if (amount == null) return "—";
    return `₼ ${Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
}

function fmtK(amount) {
    if (amount == null) return "—";
    if (amount >= 1000) return `₼ ${(amount / 1000).toFixed(0)}K`;
    return `₼ ${amount}`;
}

function StatusPill({ status }) {
    const meta = STATUS_MAP[status] ?? { label: status, cls: "pill--draft" };
    return (
        <span className={`pill ${meta.cls}`}>
            <span className="pill__dot" />
            {meta.label}
        </span>
    );
}

function RequestCard({ item }) {
    return (
        <div className="mkt-card">
            <div className="mkt-card__top">
                <div>
                    <div className="mkt-card__id">
                        {item.id} — {item.company}
                    </div>
                    <div className="mkt-card__meta">
                        {item.category} · {item.days} days · {item.date}
                    </div>
                </div>
                <StatusPill status={item.status} />
            </div>

            <div className="mkt-card__cols">
                <div>
                    <div className="mkt-card__col-label">Invoice</div>
                    <div className="mkt-card__col-value">{fmt(item.invoice)}</div>
                </div>
                <div>
                    <div className="mkt-card__col-label">Received</div>
                    <div className="mkt-card__col-value mkt-card__col-value--blue">
                        {item.received != null ? fmt(item.received) : "—"}
                    </div>
                </div>
                <div>
                    <div className="mkt-card__col-label">Yield</div>
                    <div className="mkt-card__col-value mkt-card__col-value--green">
                        {item.yield}%
                    </div>
                </div>
                <div>
                    <div className="mkt-card__col-label">Risk Score</div>
                    <div className="mkt-card__col-value">{item.riskScore}</div>
                </div>
            </div>

            <div className="mkt-progress">
                <div
                    className="mkt-progress__fill"
                    style={{ width: `${item.progressPct}%` }}
                />
            </div>

            <div className="mkt-card__footer">
                Payment: {item.paymentDate} — {item.daysRemaining} days remaining
            </div>
        </div>
    );
}

export function MarketplacePage() {
    const [activeTab, setActiveTab] = useState("requests");

    const items = activeTab === "requests" ? MOCK_REQUESTS : MOCK_ELIGIBLE;

    const totalReceived = MOCK_REQUESTS.reduce((s, r) => s + (r.received ?? 0), 0);
    const avgDays = Math.round(
        MOCK_REQUESTS.reduce((s, r) => s + r.days, 0) / MOCK_REQUESTS.length
    );

    return (
        <div className="mkt-page">
            {/* Header */}
            <div>
                <h1 className="mkt-page__title">Marketplace</h1>
                <p className="mkt-page__sub">Request factoring for your eligible invoices</p>
            </div>

            {/* Tabs */}
            <div className="mkt-tabs">
                <button
                    className={`mkt-tab ${activeTab === "requests" ? "mkt-tab--active" : ""}`}
                    onClick={() => setActiveTab("requests")}
                >
                    My Requests
                </button>
                <button
                    className={`mkt-tab ${activeTab === "eligible" ? "mkt-tab--active" : ""}`}
                    onClick={() => setActiveTab("eligible")}
                >
                    Eligible Invoices
                </button>
            </div>

            {/* Stats — yalnız My Requests tabında */}
            {activeTab === "requests" && (
                <div className="mkt-stats">
                    <div className="mkt-stat">
                        <div className="mkt-stat__label">Active Requests</div>
                        <div className="mkt-stat__value">{MOCK_REQUESTS.length}</div>
                    </div>
                    <div className="mkt-stat">
                        <div className="mkt-stat__label">Total Received</div>
                        <div className="mkt-stat__value">{fmtK(totalReceived)}</div>
                    </div>
                    <div className="mkt-stat">
                        <div className="mkt-stat__label">Avg. Financing Period</div>
                        <div className="mkt-stat__value">{avgDays} days</div>
                    </div>
                </div>
            )}

            {/* Cards */}
            {items.length === 0 ? (
                <div className="mkt-empty">No items to display.</div>
            ) : (
                items.map((item) => <RequestCard key={item.id} item={item} />)
            )}
        </div>
    );
}