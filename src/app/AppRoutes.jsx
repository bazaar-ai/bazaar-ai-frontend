import { Routes, Route, Navigate } from "react-router-dom";
import { RegistrationProvider } from "../features/auth/context/RegistrationContext";
import { RoleSelectPage } from "../features/auth/pages/RoleSelectPage";
import { AccountDetailsPage } from "../features/auth/pages/AccountDetailsPage";
import { VerifyPage } from "../features/auth/pages/VerifyPage";
import { SignInPage } from "../features/auth/pages/SignInPage";
import { RequireRegistrationEmail } from "../features/auth/RequireRegistrationEmail";
import { DashboardLayout } from "../features/dashboard/layout/DashboardLayout";
import { MerchantOverviewPage } from "../features/user/pages/MerchantOverviewPage";
import { ProfilePage } from "../features/user/pages/ProfilePage";
import { ComingSoonPage } from "../features/user/pages/ComingSoonPage.jsx";
import { InvoicesPage } from "../features/invoices/pages/InvoicesPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../shared/context/AuthContext";
import { WalletPage } from "../features/user/pages/WalletPage.jsx";
import { MarketplacePage } from "../features/user/pages/MarketPlacePage.jsx";
import { TradeDNAPage } from "../features/user/pages/TradeDnaPage.jsx";
import { KycStatusPage } from "../features/user/pages/KycStatusPage.jsx";

function RegistrationFlow() {
    return (
        <RegistrationProvider>
            <Routes>
                <Route index element={<RoleSelectPage />} />
                <Route path="profile" element={<AccountDetailsPage />} />
                <Route
                    path="verify"
                    element={
                        <RequireRegistrationEmail>
                            <VerifyPage />
                        </RequireRegistrationEmail>
                    }
                />
            </Routes>
        </RegistrationProvider>
    );
}

export function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate to={isAuthenticated ? "/dashboard" : "/sign-in"} replace />
                }
            />
            <Route path="/register/*" element={<RegistrationFlow />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<MerchantOverviewPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route
                    path="upload"
                    element={
                        <ComingSoonPage
                            title="Upload Invoice"
                            description="Invoice upload is coming soon."
                        />
                    }
                />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="wallet" element={<WalletPage/>} />
                <Route
                    path="dna"
                    element={
                        <TradeDNAPage/>
                    }
                />
                <Route path="kyc" element={<KycStatusPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}