import "./Button.css";

export function Button({
  variant = "primary",
  type = "button",
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}${fullWidth ? " btn--full" : ""}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      <span className={loading ? "btn__label--loading" : undefined}>
        {children}
      </span>
    </button>
  );
}
