import "./Sidebar.css";

const NAV = [
    {
        section: "Main",
        items: [
            { id: "dashboard", icon: "🏠", label: "Dashboard" },
            { id: "invoices", icon: "📄", label: "My Invoices", badge: "24" },
            { id: "upload", icon: "⬆️", label: "Upload Invoice" },
        ],
    },
    {
        section: "Finance",
        items: [
            { id: "marketplace", icon: "🏪", label: "Marketplace" },
            { id: "wallet", icon: "💳", label: "Wallet" },
        ],
    },
    {
        section: "Account",
        items: [
            { id: "dna", icon: "🧬", label: "Trade DNA" },
            { id: "kyc", icon: "✅", label: "KYC Status" },
            { id: "profile", icon: "👤", label: "Profile" },
        ],
    },
];

export function Sidebar({ activePage, onNavigate }) {
    return (
        <aside className="sidebar">
            {NAV.map((group) => (
                <div key={group.section}>
                    <div className="sidebar__section">{group.section}</div>
                    {group.items.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar__item${activePage === item.id ? " sidebar__item--active" : ""}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <span className="sidebar__icon">{item.icon}</span>
                            <span className="sidebar__label">{item.label}</span>
                            {item.badge && (
                                <span className="sidebar__badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </div>
            ))}
        </aside>
    );
}