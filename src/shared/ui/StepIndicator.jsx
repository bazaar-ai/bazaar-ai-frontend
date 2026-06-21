import "./StepIndicator.css";

/**
 * @param {{ steps: string[], currentStep: number }} props
 * currentStep is 1-indexed.
 */
export function StepIndicator({ steps, currentStep }) {
  return (
    <ol className="steps">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const state =
          stepNumber < currentStep
            ? "done"
            : stepNumber === currentStep
            ? "active"
            : "upcoming";

        return (
          <li className="steps__item" key={label}>
            <span className={`steps__dot steps__dot--${state}`}>
              {state === "done" ? <CheckIcon /> : stepNumber}
            </span>
            <span className={`steps__label steps__label--${state}`}>
              {label}
            </span>
            {stepNumber !== steps.length ? (
              <span className={`steps__connector steps__connector--${state}`} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
