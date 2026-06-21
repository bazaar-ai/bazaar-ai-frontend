import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell, Button, TextField } from "../../../shared/ui";
import { useAuth } from "../../../shared/context/AuthContext";
import { loginUser } from "../api/authApi";
import { validateEmail } from "../../../shared/utils/validators";

function extractAccessToken(result) {
    return (
        result?.accessToken ||
        result?.access_token ||
        result?.token ||
        (typeof result === "string" ? result : null)
    );
}

export function SignInPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const nextErrors = {
            email: validateEmail(email),
            password: password ? null : "Password cannot be empty",
        };
        setErrors(nextErrors);
        return Object.values(nextErrors).every((error) => !error);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError(null);

        if (!validate()) return;

        setSubmitting(true);
        try {
            const result = await loginUser({ email: email.trim(), password });
            const accessToken = extractAccessToken(result);

            if (!accessToken) {
                setSubmitError("Login succeeded but no access token was returned. Please contact support.");
                return;
            }

            login(accessToken);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setSubmitError(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthShell maxWidth={480}>
            <h1 className="auth-title">Sign in</h1>
            <p className="auth-subtitle">Welcome back. Enter your details to continue.</p>

            {submitError ? <div className="form-error-banner">{submitError}</div> : null}

            <form onSubmit={handleSubmit} noValidate>
                <TextField
                    label="Email"
                    type="email"
                    placeholder="elvin@example.com"
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    error={errors.email}
                    containerClassName="field--spaced"
                    autoComplete="email"
                />
                <TextField
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    error={errors.password}
                    containerClassName="field--spaced"
                    autoComplete="current-password"
                />
                <Button type="submit" fullWidth loading={submitting}>
                    Sign In
                </Button>
            </form>

            <p className="auth-footer">
                Don't have an account? <Link to="/register">Sign up</Link>
            </p>
        </AuthShell>
    );
}