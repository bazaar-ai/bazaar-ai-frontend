import "./Logo.css";

export function Logo({ size = "md" }) {
  return (
    <div className={`logo logo--${size}`}>
      <span className="logo__mark">B</span>
      <span className="logo__word">
        Bazaar<span className="logo__word-accent">AI</span>
      </span>
    </div>
  );
}
