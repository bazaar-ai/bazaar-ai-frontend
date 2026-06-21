import { Logo } from "./Logo";
import "./AuthShell.css";

export function AuthShell({ children, maxWidth = 640 }) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__card" style={{ maxWidth }}>
        <div className="auth-shell__header">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
