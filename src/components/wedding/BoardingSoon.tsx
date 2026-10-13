export function BoardingSoon() {
  return (
    <div className="boarding-soon">
      <svg
        viewBox="0 0 120 20"
        className="h-5 w-28 text-silver-300"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M1 10h45m28 0h45" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="m57 10 5-4 5 4-5 4Z" fill="none" stroke="currentColor" strokeWidth="0.9" />
      </svg>
      <p className="label mt-3">Boarding soon</p>
      <p className="muted mt-1">Our journey to forever is about to begin.</p>
    </div>
  );
}
