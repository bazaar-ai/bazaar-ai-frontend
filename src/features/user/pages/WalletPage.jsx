import { useState } from "react";
import "./WalletPage.css";

const TRANSACTIONS = [
    {
        id: 1,
        name: "Factoring Payment",
        sub: "INV-088 · Jan 12, 2025",
        amount: 12400,
        type: "in",
        icon: "⬇️",
    },
    {
        id: 2,
        name: "Bank Transfer",
        sub: "Kapital Bank · Jan 10, 2025",
        amount: 5000,
        type: "out",
        icon: "⬆️",
    },
    {
        id: 3,
        name: "Deposit",
        sub: "Jan 5, 2025",
        amount: 2000,
        type: "in",
        icon: "⬇️",
    },
    {
        id: 4,
        name: "Service Fee",
        sub: "INV-088 · Jan 3, 2025",
        amount: 248,
        type: "out",
        icon: "🏷️",
    },
    {
        id: 5,
        name: "Payment Received",
        sub: "INV-085 settlement · Dec 28",
        amount: 41000,
        type: "in",
        icon: "⬇️",
    },
];

function fmt(amount) {
    return Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function iconClass(type) {
    if (type === "in")  return "wallet-tx-icon--in";
    if (type === "fee") return "wallet-tx-icon--fee";
    return "wallet-tx-icon--out";
}

export function WalletPage() {
    const [filter, setFilter] = useState("this_month");

    return (
        <div className="wallet-page">
            <h1 className="wallet-page__title">Wallet</h1>

            {/* Balance card */}
            <div className="wallet-balance-card">
                <div className="wallet-balance-card__label">Current Balance</div>
                <div className="wallet-balance-card__amount">₼ 8,430.00</div>
                <div className="wallet-balance-card__meta">
                    Account No.: AZ-2024-00312 · Last updated: today
                </div>
                <div className="wallet-balance-card__actions">
                    <button className="wallet-action-btn">
                        <span className="wallet-action-btn__icon">⬇</span>
                        Deposit
                    </button>
                    <button className="wallet-action-btn">
                        <span className="wallet-action-btn__icon">⬆</span>
                        Withdraw
                    </button>
                    <button className="wallet-action-btn">
                        <span className="wallet-action-btn__icon">📋</span>
                        Statement
                    </button>
                </div>
            </div>

            {/* Transaction history */}
            <div className="wallet-history-card">
                <div className="wallet-history-card__header">
                    <div className="wallet-history-card__title">Transaction History</div>
                    <select
                        className="wallet-filter-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="this_month">This month</option>
                        <option value="last_month">Last month</option>
                        <option value="last_3">Last 3 months</option>
                        <option value="all">All time</option>
                    </select>
                </div>

                <div className="wallet-tx-list">
                    {TRANSACTIONS.map((tx) => (
                        <div className="wallet-tx-row" key={tx.id}>
                            <div className={`wallet-tx-icon ${iconClass(tx.type)}`}>
                                {tx.icon}
                            </div>
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
        </div>
    );
}