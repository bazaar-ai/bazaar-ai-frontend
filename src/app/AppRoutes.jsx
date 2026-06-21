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
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "../shared/context/AuthContext";

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
                <Route
                    path="invoices"
                    element={
                        <ComingSoonPage
                            title="My Invoices"
                            description="Your full invoice list is on its way. Check back soon."
                        />
                    }
                />
                <Route
                    path="upload"
                    element={
                        <ComingSoonPage
                            title="Upload Invoice"
                            description="Invoice upload is coming soon."
                        />
                    }
                />
                <Route
                    path="marketplace"
                    element={
                        <ComingSoonPage
                            title="Marketplace"
                            description="Browse investment opportunities here soon."
                        />
                    }
                />
                <Route
                    path="wallet"
                    element={
                        <ComingSoonPage
                            title="Wallet"
                            description="Your wallet and transaction history will live here."
                        />
                    }
                />
                <Route
                    path="dna"
                    element={
                        <ComingSoonPage
                            title="Trade DNA"
                            description="A detailed breakdown of your Trade DNA score is coming soon."
                        />
                    }
                />
                <Route
                    path="kyc"
                    element={
                        <ComingSoonPage
                            title="KYC Status"
                            description="Track your verification status here soon."
                        />
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}