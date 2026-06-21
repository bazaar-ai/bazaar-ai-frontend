import { useId } from "react";
import "./TextField.css";

export function TextField({
  label,
  error,
  prefix,
  className = "",
  containerClassName = "",
  ...rest
}) {
  const id = useId();

  return (
    <div className={`field ${containerClassName}`}>
      {label ? (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      ) : null}
      <div
        className={`field__control${prefix ? " field__control--prefixed" : ""}${
          error ? " field__control--error" : ""
        }${rest.disabled ? " field__control--disabled" : ""}`}
      >
        {prefix ? <span className="field__prefix">{prefix}</span> : null}
        <input
          id={id}
          className={`field__input ${className}${error ? " field__input--error" : ""}`}
          aria-invalid={Boolean(error)}
          {...rest}
        />
      </div>
      {error ? <p className="field__error">{error}</p> : null}
    </div>
  );
}
