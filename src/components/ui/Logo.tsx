/** Monograma AL: una base compartida y un punto como unidad de datos. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="48"
      viewBox="0 0 96 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 52 28 12 46 52M18.1 34H37.9M46 12V52H68"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <circle cx="82" cy="51" r="4.5" fill="var(--green, #395d47)" />
    </svg>
  );
}
