import { useNavigate, Link } from "react-router-dom";
import { AuthShell, Button, StepIndicator } from "../../../shared/ui";
import { DocumentIcon, TrendingUpIcon, InfoIcon } from "../../../shared/ui/icons";
import { RoleCard } from "../components/RoleCard";
import { useRegistration } from "../context/RegistrationContext";
import { ROLE_META, UserRole } from "../userRole";

const STEPS = ["Choose role", "Details", "Verify"];

export function RoleSelectPage() {
    const navigate = useNavigate();
    const { formData, updateFields } = useRegistration();

    const handleContinue = () => {
        navigate("/register/profile");
    };

    return (
        <AuthShell>
            <StepIndicator steps={STEPS} currentStep={1} />

            <h1 className="auth-title">How do you want to participate in Bazaar AI?</h1>
            <p className="auth-subtitle">
                This choice can't be changed later from account settings — choose carefully.
            </p>

            <div className="role-grid">
                <RoleCard
                    icon={<DocumentIcon />}
                    title={ROLE_META[UserRole.MERCHANT].label}
                    description={ROLE_META[UserRole.MERCHANT].description}
                    selected={formData.userRole === UserRole.MERCHANT}
                    onSelect={() => updateFields({ userRole: UserRole.MERCHANT })}
                />
                <RoleCard
                    icon={<TrendingUpIcon />}
                    title={ROLE_META[UserRole.INVESTOR].label}
                    description={ROLE_META[UserRole.INVESTOR].description}
                    selected={formData.userRole === UserRole.INVESTOR}
                    onSelect={() => updateFields({ userRole: UserRole.INVESTOR })}
                />
            </div>

            <div className="auth-note">
                <InfoIcon />
                <p>
                    Admin and Compliance Officer accounts aren't created through public
                    registration — they're set up internally by the team via invite.
                </p>
            </div>

            <Button fullWidth onClick={handleContinue}>
                Continue
            </Button>

            <p className="auth-footer">
                Already have an account? <Link to="/sign-in">Sign In</Link>
            </p>
        </AuthShell>
    );
}