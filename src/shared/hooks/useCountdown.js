import { useEffect, useState } from "react";

export function useCountdown(initialSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;

    const timeoutId = setTimeout(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [secondsLeft]);

  const restart = (seconds = initialSeconds) => setSecondsLeft(seconds);

  const formatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

  return { secondsLeft, formatted, restart, isExpired: secondsLeft <= 0 };
}
