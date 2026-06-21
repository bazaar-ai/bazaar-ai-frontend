import { useState } from "react";
import { Logo } from "../../../shared/ui";
import { toProfilePhotoSrc, getInitials } from "../../../shared/utils/profilePhoto";
import "./Topbar.css";

const NOTIFICATIONS = [
    { id: 1, text: "INV-2024-089 received eligible status — you can request factoring", time: "2 hours ago", read: false },
    { id: 2, text: "Your KYC documents have been approved", time: "yesterday, 14:32", read: false },
    { id: 3, text: "₼ 15,500 was transferred to your account", time: "3 days ago", read: true },
    { id: 4, text: "Trade DNA score updated: 78/100", time: "1 week ago", read: true },
    { id: 5, text: "INV-2024-086 was rejected — score 41, below the limit", time: "2 weeks ago", read: true },
];

export function Topbar({ user, onNavigate, onLogout }) {
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifs, setNotifs] = useState(NOTIFICATIONS);

    const unreadCount = notifs.filter((n) => !n.read).length;

    function markRead(id) {
        setNotifs((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    }

    return (
        <>
            <header className="topbar">
                <Logo size="sm" />
                <div className="topbar__right">
                    <button
                        className="topbar__notif-btn"
                        onClick={() => setNotifOpen((v) => !v)}
                        title="Notifications"
                    >
                        🔔
                        {unreadCount > 0 && <span className="topbar__notif-badge" />}
                    </button>
                    <button
                        className="topbar__avatar"
                        onClick={() => onNavigate("profile")}
                        title="Profile"
                    >
                        {user?.profilePhoto ? (
                            <img
                                src={toProfilePhotoSrc(user.profilePhoto)}
                                alt="avatar"
                                className="topbar__avatar-img"
                            />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </button>
                </div>
            </header>

            {notifOpen && (
                <div className="notif-panel">
                    <div className="notif-panel__header">
                        <span>Notifications</span>
                        <button className="notif-panel__close" onClick={() => setNotifOpen(false)}>✕</button>
                    </div>
                    <div className="notif-panel__list">
                        {notifs.map((n) => (
                            <div
                                key={n.id}
                                className="notif-panel__item"
                                onClick={() => markRead(n.id)}
                            >
                                <div className="notif-panel__dot-wrap">
                                    <div className={`notif-panel__dot${n.read ? " notif-panel__dot--read" : ""}`} />
                                </div>
                                <div>
                                    <div className="notif-panel__text">{n.text}</div>
                                    <div className="notif-panel__time">{n.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="notif-panel__footer">
                        <button className="notif-panel__logout" onClick={onLogout}>
                            Sign out
                        </button>
                    </div>
                </div>
            )}
            {notifOpen && <div className="notif-panel__overlay" onClick={() => setNotifOpen(false)} />}
        </>
    );
}