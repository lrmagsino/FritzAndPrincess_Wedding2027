/** Minimal heart-with-location-pin divider detail. Decorative. */
export function HeartPin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 28"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M4 20C40 17 72 18 90 22" opacity=".7" />
      <path d="M196 20C160 17 128 18 110 22" opacity=".7" />
      <path d="M100 25C93 19 88 15 88 10.5A5.5 5.5 0 0 1 100 8a5.5 5.5 0 0 1 12 2.500C112 15 107 19 100 25Z" />
      <circle cx="100" cy="11" r="1.6" />
    </svg>
  );
}
