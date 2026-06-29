import { useState } from "react";
import "./KycStatusPage.css";

const STEPS = [
    { id: "id_card",       label: "ID Card",           date: "Jan 15, 2025", status: "accepted" },
    { id: "registration",  label: "State Registration", date: "Jan 15, 2025", status: "accepted" },
    { id: "admin_review",  label: "Admin Review",       date: "Jan 16, 2025", status: "completed" },
    { id: "activated",     label: "Account Activated",  date: "Jan 16, 2025", status: "completed" },
];

const DOCUMENTS = [
    { id: "id_card",      icon: "🪪", label: "ID Card",           file: "id_card.jpg",       size: "2.1 MB", date: "Jan 14", status: "accepted" },
    { id: "registration", icon: "📄", label: "State Registration", file: "registration.pdf",  size: "1.4 MB", date: "Jan 14", status: "accepted" },
];

const KYC_STATUS = "approved"; // "approved" | "pending" | "rejected"

const STATUS_META = {
    approved: { label: "Approved",  tone: "eligible" },
    pending:  { label: "Pending",   tone: "pending"  },
    rejected: { label: "Rejected",  tone: "rejected" },
};

function CheckIcon() {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="kyc-step__check-svg">
            <circle cx="10" cy="10" r="10" fill="currentColor" />
            <path d="M5.5 10.5L8.5 13.5L14.5 7.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function KycStatusPage() {
    const [uploading, setUploading] = useState(false);
    const statusMeta = STATUS_META[KYC_STATUS] ?? STATUS_META.pending;

    const allComplete = STEPS.every((s) => s.status === "accepted" || s.status === "completed");

    const handleUpdateDocument = () => {
        setUploading(true);
        setTimeout(() => setUploading(false), 1500);
    };

    return (
        <div className="kyc-page">
            <div className="kyc-page__header">
                <h1 className="kyc-page__title">KYC Verification</h1>
                <span className={`pill pill--${statusMeta.tone} kyc-page__badge`}>
                    <span className="pill__dot" />
                    {statusMeta.label}
                </span>
            </div>

            <div className="kyc-page__grid">
                {/* Left: Verification Steps */}
                <section className="kyc-card">
                    <div className="kyc-card__title">Verification Steps</div>

                    <div className="kyc-steps">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="kyc-step">
                                <div className="kyc-step__icon">
                                    <CheckIcon />
                                </div>
                                <div className="kyc-step__body">
                                    <span className="kyc-step__label">{step.label}</span>
                                    <span className="kyc-step__date">
                                        {step.status === "completed" ? "Completed" : "Accepted"} · {step.date}
                                    </span>
                                </div>
                                {idx < STEPS.length - 1 && <div className="kyc-step__line" />}
                            </div>
                        ))}
                    </div>

                    {allComplete && (
                        <div className="kyc-complete-banner">
                            <CheckIcon />
                            <span>The KYC process is complete. You can use all services.</span>
                        </div>
                    )}
                </section>

                {/* Right: Uploaded Documents */}
                <section className="kyc-card">
                    <div className="kyc-card__title">Uploaded Documents</div>

                    <div className="kyc-docs">
                        {DOCUMENTS.map((doc) => (
                            <div key={doc.id} className="kyc-doc">
                                <div className="kyc-doc__icon">{doc.icon}</div>
                                <div className="kyc-doc__info">
                                    <span className="kyc-doc__name">{doc.label}</span>
                                    <span className="kyc-doc__meta">{doc.file} · {doc.size} · {doc.date}</span>
                                </div>
                                <span className={`pill pill--eligible kyc-doc__status`}>
                                    <span className="pill__dot" />
                                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <button
                        className="kyc-update-btn"
                        onClick={handleUpdateDocument}
                        disabled={uploading}
                    >
                        <span className="kyc-update-btn__icon">⬆</span>
                        {uploading ? "Uploading…" : "Update Document"}
                    </button>
                </section>
            </div>
        </div>
    );
}