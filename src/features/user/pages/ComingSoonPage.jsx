import "./ComingSoonPage.css";

export function ComingSoonPage({ title, description }) {
    return (
        <div className="coming-soon">
            <div className="coming-soon__card animate-rise">
                <div className="coming-soon__icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 8v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
                            stroke="url(#csGradient)"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <defs>
                            <linearGradient id="csGradient" x1="0" y1="0" x2="24" y2="24">
                                <stop offset="0%" stopColor="#7c6ff0" />
                                <stop offset="100%" stopColor="#5fd9c4" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div className="coming-soon__title">{title}</div>
                <p className="coming-soon__desc">{description}</p>
            </div>
        </div>
    );
}