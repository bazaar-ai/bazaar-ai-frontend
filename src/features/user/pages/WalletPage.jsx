import { useState } from "react";
import "./WalletPage.css";

const TRANSACTIONS = [
    { id: 1, name: "Factoring Payment", sub: "INV-088 · Jan 12, 2025", amount: 12400, type: "in",  icon: "⬇️" },
    { id: 2, name: "Bank Transfer",     sub: "Kapital Bank · Jan 10, 2025", amount: 5000, type: "out", icon: "⬆️" },
    { id: 3, name: "Deposit",           sub: "Jan 5, 2025",               amount: 2000, type: "in",  icon: "⬇️" },
    { id: 4, name: "Service Fee",       sub: "INV-088 · Jan 3, 2025",     amount: 248,  type: "out", icon: "🏷️" },
    { id: 5, name: "Payment Received",  sub: "INV-085 settlement · Dec 28", amount: 41000, type: "in", icon: "⬇️" },
];

const STATEMENT_ROWS = [
    { date: "Jan 12, 2025", description: "Factoring Payment — INV-088", amount: 12400, type: "in" },
    { date: "Jan 10, 2025", description: "Bank Transfer — Kapital Bank", amount: 5000,  type: "out" },
    { date: "Jan 5, 2025",  description: "Deposit",                      amount: 2000,  type: "in" },
    { date: "Jan 3, 2025",  description: "Service Fee — INV-088",        amount: 248,   type: "out" },
    { date: "Dec 28, 2024", description: "Payment Received — INV-085",   amount: 41000, type: "in" },
];

function fmt(amount) {
    return Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function iconClass(type) {
    if (type === "fee") return "wallet-tx-icon--fee";
    return type === "in" ? "wallet-tx-icon--in" : "wallet-tx-icon--out";
}

/* Deposit Modal */
function DepositModal({ onClose }) {
    const [amount, setAmount] = useState("");
    const [bank, setBank] = useState("kapital");
    return (
        <div className="wallet-modal-overlay" onClick={onClose}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
                <div className="wallet-modal__header">
                    <span className="wallet-modal__icon">⬇</span>
                    <span className="wallet-modal__title">Deposit</span>
                    <button className="wallet-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="wallet-modal__body">
                    <label className="wallet-modal__label">Amount (₼)</label>
                    <input
                        className="wallet-modal__input"
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <label className="wallet-modal__label" style={{ marginTop: "var(--space-4)" }}>Bank Account</label>
                    <select className="wallet-modal__select" value={bank} onChange={(e) => setBank(e.target.value)}>
                        <option value="kapital">Kapital Bank — AZ29KAPS...1234</option>
                        <option value="abb">ABB — AZ21ABBB...5678</option>
                        <option value="rabitabank">Rabitabank — AZ14RABA...9012</option>
                    </select>
                    <div className="wallet-modal__info">
                        <span className="wallet-modal__info-icon">⏱</span>
                        <span>The transaction is processed within 1–2 business days.</span>
                    </div>
                    <button className="wallet-modal__confirm">Confirm</button>
                </div>
            </div>
        </div>
    );
}

/* Withdraw Modal */
function WithdrawModal({ onClose }) {
    const [amount, setAmount] = useState("");
    const [bank, setBank] = useState("kapital");
    return (
        <div className="wallet-modal-overlay" onClick={onClose}>
            <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
                <div className="wallet-modal__header">
                    <span className="wallet-modal__icon wallet-modal__icon--out">⬆</span>
                    <span className="wallet-modal__title">Withdraw</span>
                    <button className="wallet-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="wallet-modal__body">
                    <div className="wallet-modal__balance-hint">
                        Available balance: <strong>₼ 8,430.00</strong>
                    </div>
                    <label className="wallet-modal__label">Amount (₼)</label>
                    <input
                        className="wallet-modal__input"
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <label className="wallet-modal__label" style={{ marginTop: "var(--space-4)" }}>Withdraw to</label>
                    <select className="wallet-modal__select" value={bank} onChange={(e) => setBank(e.target.value)}>
                        <option value="kapital">Kapital Bank — AZ29KAPS...1234</option>
                        <option value="abb">ABB — AZ21ABBB...5678</option>
                        <option value="rabitabank">Rabitabank — AZ14RABA...9012</option>
                    </select>
                    <div className="wallet-modal__info wallet-modal__info--warn">
                        <span className="wallet-modal__info-icon">⚠️</span>
                        <span>Withdrawals may take up to 3 business days to process.</span>
                    </div>
                    <button className="wallet-modal__confirm">Confirm Withdrawal</button>
                </div>
            </div>
        </div>
    );
}

/* Statement Modal */
function StatementModal({ onClose }) {
    const [period, setPeriod] = useState("this_month");
    const total = STATEMENT_ROWS.reduce((s, r) => s + (r.type === "in" ? r.amount : -r.amount), 0);
    return (
        <div className="wallet-modal-overlay" onClick={onClose}>
            <div className="wallet-modal wallet-modal--wide" onClick={(e) => e.stopPropagation()}>
                <div className="wallet-modal__header">
                    <span className="wallet-modal__icon wallet-modal__icon--neutral">📋</span>
                    <span className="wallet-modal__title">Statement</span>
                    <button className="wallet-modal__close" onClick={onClose}>✕</button>
                </div>
                <div className="wallet-modal__body">
                    <div className="wallet-modal__stmt-top">
                        <select
                            className="wallet-modal__select wallet-modal__select--sm"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                        >
                            <option value="this_month">This month</option>
                            <option value="last_month">Last month</option>
                            <option value="last_3">Last 3 months</option>
                            <option value="all">All time</option>
                        </select>
                        <button className="wallet-modal__download">⬇ Download PDF</button>
                    </div>
                    <table className="wallet-stmt-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th className="wallet-stmt-table__right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {STATEMENT_ROWS.map((r, i) => (
                                <tr key={i}>
                                    <td className="wallet-stmt-table__date">{r.date}</td>
                                    <td>{r.description}</td>
                                    <td className={`wallet-stmt-table__right wallet-stmt-table__amt--${r.type}`}>
                                        {r.type === "in" ? "+" : "−"}₼ {fmt(r.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2" className="wallet-stmt-table__total-label">Net total</td>
                                <td className={`wallet-stmt-table__right wallet-stmt-table__total wallet-stmt-table__amt--${total >= 0 ? "in" : "out"}`}>
                                    {total >= 0 ? "+" : "−"}₼ {fmt(Math.abs(total))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}

/* Main page */
export function WalletPage() {
    const [filter, setFilter] = useState("this_month");
    const [modal, setModal] = useState(null);

    return (
        <div className="wallet-page">
            <h1 className="wallet-page__title">Wallet</h1>

            <div className="wallet-balance-card">
                <div className="wallet-balance-card__label">Current Balance</div>
                <div className="wallet-balance-card__amount">₼ 8,430.00</div>
                <div className="wallet-balance-card__meta">
                    Account No.: AZ-2024-00312 · Last updated: today
                </div>
                <div className="wallet-balance-card__actions">
                    <button className="wallet-action-btn" onClick={() => setModal("deposit")}>
                        <span className="wallet-action-btn__icon">⬇</span> Deposit
                    </button>
                    <button className="wallet-action-btn" onClick={() => setModal("withdraw")}>
                        <span className="wallet-action-btn__icon">⬆</span> Withdraw
                    </button>
                    <button className="wallet-action-btn" onClick={() => setModal("statement")}>
                        <span className="wallet-action-btn__icon">📋</span> Statement
                    </button>
                </div>
            </div>

            <div className="wallet-history-card">
                <div className="wallet-history-card__header">
                    <div className="wallet-history-card__title">Transaction History</div>
                    <select className="wallet-filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="this_month">This month</option>
                        <option value="last_month">Last month</option>
                        <option value="last_3">Last 3 months</option>
                        <option value="all">All time</option>
                    </select>
                </div>
                <div className="wallet-tx-list">
                    {TRANSACTIONS.map((tx) => (
                        <div className="wallet-tx-row" key={tx.id}>
                            <div className={`wallet-tx-icon ${iconClass(tx.type)}`}>{tx.icon}</div>
                            <div className="wallet-tx-info">
                                <div className="wallet-tx-info__name">{tx.name}</div>
                                <div className="wallet-tx-info__sub">{tx.sub}</div>
                            </div>
                            <div className={`wallet-tx-amount wallet-tx-amount--${tx.type === "fee" ? "out" : tx.type}`}>
                                {tx.type === "in" ? "+" : "−"}₼ {fmt(tx.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {modal === "deposit"   && <DepositModal   onClose={() => setModal(null)} />}
            {modal === "withdraw"  && <WithdrawModal  onClose={() => setModal(null)} />}
            {modal === "statement" && <StatementModal onClose={() => setModal(null)} />}
        </div>
    );
}