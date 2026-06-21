import "./RoleCard.css";

export function RoleCard({ icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`role-card${selected ? " role-card--selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className="role-card__top">
        <span className="role-card__icon">{icon}</span>
        {selected ? (
          <span className="role-card__check">
            <CheckIcon />
          </span>
        ) : null}
      </div>
      <h3 className="role-card__title">{title}</h3>
      <p className="role-card__description">{description}</p>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
