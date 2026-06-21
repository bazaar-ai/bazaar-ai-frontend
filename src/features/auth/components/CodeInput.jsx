import { useRef } from "react";
import "./CodeInput.css";

export function CodeInput({ length = 6, value, onChange, error }) {
  const inputsRef = useRef([]);

  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(""));
  };

  const handleChange = (index) => (event) => {
    const raw = event.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    // Handle paste of multiple digits into one box.
    if (raw.length > 1) {
      const chars = raw.split("");
      const next = [...digits];
      chars.forEach((char, offset) => {
        if (index + offset < length) {
          next[index + offset] = char;
        }
      });
      onChange(next.join(""));
      const targetIndex = Math.min(index + chars.length, length - 1);
      inputsRef.current[targetIndex]?.focus();
      return;
    }
    setDigit(index, raw);
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
      <div className="code-input">
        <div className="code-input__boxes">
          {digits.map((digit, index) => (
              <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  className={`code-input__box${error ? " code-input__box--error" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={length}
                  value={digit}
                  onChange={handleChange(index)}
                  onKeyDown={handleKeyDown(index)}
                  aria-label={`Digit ${index + 1}`}
              />
          ))}
        </div>
        {error ? <p className="field__error">{error}</p> : null}
      </div>
  );
}