import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell, Button, StepIndicator } from "../../../shared/ui";
import { CodeInput } from "../components/CodeInput";
import { useRegistration } from "../context/RegistrationContext";
import { useAuth } from "../../../shared/context/AuthContext";
import { verifyUser } from "../api/authApi";
import { useCountdown } from "../../../shared/hooks/useCountdown";
import { validateCode } from "../../../shared/utils/validators";

const STEPS = ["Choose role", "Details", "Verify"];
const RESEND_SECONDS = 42;

// The backend response shape for the access token isn't fully locked down yet,
// so we accept a few common shapes here instead of assuming `accessToken`.
function extractAccessToken(result) {
    return (
        result?.accessToken ||
        result?.access_token ||
        result?.token ||
        (typeof result === "string" ? result : null)
    );
}

export function VerifyPage() {
    const navigate = useNavigate();
    const { formData, reset } = useRegistration();
    const { login } = useAuth();
    const { formatted, isExpired, restart } = useCountdown(RESEND_SECONDS);

    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const email = formData.email;

    const handleVerify = async () => {
        const codeError = validateCode(code);
        if (codeError) {
            setError(codeError);
            return;
        }

        setError(null);
        setSubmitting(true);
        try {
            const result = await verifyUser({ email, code });
            const accessToken = extractAccessToken(result);

            if (!accessToken) {
                // Don't navigate anywhere — staying here with a clear error is much
                // better than silently bouncing the user back to role selection.
                setError(
                    "Verification succeeded but no access token was returned. Please contact support or try signing in."
                );
                return;
            }

            login(accessToken);
            navigate("/dashboard", { replace: true });
            // Reset the registration form after navigating away, not before —
            // nothing on this page needs formData once we've navigated.
            reset();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResend = () => {
        if (!isExpired) return;
        // TODO: wire to a real "resend code" endpoint once it exists on the backend.
        restart();
    };

    const handleWhatsAppVerify = () => {
        // TODO: wire to a WhatsApp-based verification flow once the backend supports it.
    };

    return (
        <AuthShell>
            <StepIndicator steps={STEPS} currentStep={3} />

            <h1 className="auth-title">Verify your email</h1>
            <p className="auth-subtitle">
                Enter the 6-digit code sent to <strong>{email || "your email address"}</strong>.
            </p>

            <CodeInput value={code} onChange={setCode} error={error} />

            <p className="resend-row">
                {isExpired ? (
                    <button type="button" className="resend-row__link" onClick={handleResend}>
                        Resend code
                    </button>
                ) : (
                    <>
                        <span className="resend-row__muted">Resend code</span>
                        <span className="resend-row__timer">· {formatted}</span>
                    </>
                )}
            </p>

            <Button fullWidth variant="navy" loading={submitting} onClick={handleVerify}>
                Create account
            </Button>

            <div className="auth-divider">OR</div>

            <Button fullWidth variant="ghost" onClick={handleWhatsAppVerify}>
                Verify with WhatsApp
            </Button>
        </AuthShell>
    );
}