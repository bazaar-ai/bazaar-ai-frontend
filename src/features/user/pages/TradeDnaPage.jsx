import { useOutletContext } from "react-router-dom";
import "./TradeDnaPage.css";

const SCORE = 78;
const CIRCUMFERENCE = 226;
const SCORE_OFFSET = CIRCUMFERENCE * (1 - SCORE / 100);

const STATS = [
    { label: "Total Invoices",    value: "24" },
    { label: "Factoring Volume",  value: "₼142K" },
    { label: "Avg. Payment Days", value: "18 days" },
    { label: "Network",           value: "9 companies" },
];

/* ─── SVG Icons ─── */
function IconShare() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
    );
}

function IconDownload() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
    );
}

function IconStar() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#f5a623" stroke="#e09515" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
    );
}

function IconClock() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#285a9e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
        </svg>
    );
}

function IconTrendUp() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d6b4a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
        </svg>
    );
}

function IconDiamond() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20"/><path d="M6 3l4 6m4 0 4-6"/>
        </svg>
    );
}

function IconBrick() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#285a9e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="5" rx="1"/><rect x="2" y="12" width="20" height="5" rx="1"/>
            <line x1="7" y1="7" x2="7" y2="12"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="17" y1="7" x2="17" y2="12"/>
        </svg>
    );
}

function IconCart() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6b4a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
    );
}

function IconZap() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c08c14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
    );
}

const BADGES = [
    { Icon: IconStar,    name: "First Factoring", locked: false, bg: "#fffbeb" },
    { Icon: IconClock,   name: "On-Time Payer",   locked: false, bg: "#eff6ff" },
    { Icon: IconTrendUp, name: "Growing Trader",  locked: false, bg: "#f0fdf4" },
    { Icon: IconDiamond, name: "Elite Trader",    locked: true,  bg: "#f5f5f5" },
];

const GOODS = [
    { Icon: IconBrick, name: "Construction materials", pct: 65, amount: "₼92K",  color: "#285a9e" },
    { Icon: IconCart,  name: "Groceries",              pct: 25, amount: "₼35K",  color: "#2d6b4a" },
    { Icon: IconZap,   name: "Electronics",            pct: 10, amount: "₼15K",  color: "#c08c14" },
];

export function TradeDNAPage() {
    const context = useOutletContext();
    const user = context?.user;
    const name = user?.name ?? "Ali Hasanov";

    return (
        <div className="dna-page">
            {/* Header */}
            <div className="dna-page__header">
                <h1 className="dna-page__title">Trade DNA Profile</h1>
                <div className="dna-page__actions">
                    <button className="dna-action-btn"><IconShare /> Share</button>
                    <button className="dna-action-btn dna-action-btn--primary"><IconDownload /> Download PDF</button>
                </div>
            </div>

            {/* Top row */}
            <div className="dna-top-row">
                {/* Profile card */}
                <div className="dna-profile-card">
                    <div className="dna-circle">
                        <svg width="88" height="88" viewBox="0 0 88 88">
                            <circle className="dna-circle__track" cx="44" cy="44" r="36"/>
                            <circle
                                className="dna-circle__fill"
                                cx="44" cy="44" r="36"
                                style={{ strokeDashoffset: SCORE_OFFSET }}
                            />
                        </svg>
                        <div className="dna-circle__label">
                            <span className="dna-circle__score">{SCORE}</span>
                            <span className="dna-circle__sub">Trade DNA</span>
                        </div>
                    </div>
                    <div className="dna-profile-info">
                        <div className="dna-profile-info__name">{name}</div>
                        <div className="dna-profile-info__company">Your Company LLC</div>
                        <div className="dna-profile-info__meta">Member since: January 2024 · Baku</div>
                        <div className="dna-profile-info__badge">
                            <span className="dna-profile-info__badge-dot" />
                            Good Trader
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="dna-stats-grid">
                    {STATS.map((s) => (
                        <div className="dna-stat-card" key={s.label}>
                            <div className="dna-stat-card__label">{s.label}</div>
                            <div className="dna-stat-card__value">{s.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Badges */}
            <div className="dna-section-card">
                <div className="dna-section-card__title">Achievement Badges</div>
                <div className="dna-badges">
                    {BADGES.map(({ Icon, name: bname, locked, bg }) => (
                        <div
                            key={bname}
                            className={`dna-badge ${locked ? "dna-badge--locked" : ""}`}
                            style={{ background: locked ? "#f5f5f5" : bg }}
                        >
                            <div className="dna-badge__icon-wrap">
                                <Icon />
                            </div>
                            <span className="dna-badge__name">{bname}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top goods */}
            <div className="dna-section-card">
                <div className="dna-section-card__title">Top Goods</div>
                <div className="dna-goods-list">
                    {GOODS.map(({ Icon, name: gname, pct, amount, color }) => (
                        <div className="dna-goods-row" key={gname}>
                            <div className="dna-goods-row__top">
                                <span className="dna-goods-row__name">
                                    <span className="dna-goods-row__icon" style={{ color }}>
                                        <Icon />
                                    </span>
                                    {gname}
                                </span>
                                <span className="dna-goods-row__meta">{pct}% · {amount}</span>
                            </div>
                            <div className="dna-goods-bar">
                                <div className="dna-goods-bar__fill" style={{ width: `${pct}%`, background: color }}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}