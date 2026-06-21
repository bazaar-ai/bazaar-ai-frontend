import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Sidebar } from "../../user/component/Sidebar.jsx";
import { Topbar } from "../../user/component/Topbar.jsx";
import { useAuth } from "../../../shared/context/AuthContext.jsx";
import { useUser } from "../../user/hooks/useUser.js";
import "./DashboardLayout.css";

const PATH_TO_PAGE_ID = {
    "/dashboard": "dashboard",
    "/dashboard/invoices": "invoices",
    "/dashboard/upload": "upload",
    "/dashboard/marketplace": "marketplace",
    "/dashboard/wallet": "wallet",
    "/dashboard/dna": "dna",
    "/dashboard/kyc": "kyc",
    "/dashboard/profile": "profile",
};

const PAGE_ID_TO_PATH = {
    dashboard: "/dashboard",
    invoices: "/dashboard/invoices",
    upload: "/dashboard/upload",
    marketplace: "/dashboard/marketplace",
    wallet: "/dashboard/wallet",
    dna: "/dashboard/dna",
    kyc: "/dashboard/kyc",
    profile: "/dashboard/profile",
};

export function DashboardLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const { user } = useUser();

    const activePage = PATH_TO_PAGE_ID[location.pathname] ?? "dashboard";

    const handleNavigate = (pageId) => {
        navigate(PAGE_ID_TO_PATH[pageId] ?? "/dashboard");
    };

    const handleLogout = () => {
        logout();
        navigate("/sign-in", { replace: true });
    };

    return (
        <div className="dash-layout">
            <Topbar user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
            <div className="dash-layout__body">
                <Sidebar activePage={activePage} onNavigate={handleNavigate} />
                <main className="dash-layout__content">
                    <Outlet context={{ user, onNavigate: handleNavigate }} />
                </main>
            </div>
        </div>
    );
}