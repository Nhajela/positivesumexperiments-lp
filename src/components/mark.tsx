// The identity marks, decided on moodboards/01b-system.html.
// Interim strokes — Naman's real scanned pen assets replace these paths
// (docs/future-changes.md) without changing any call sites.

// The drawn + : two strokes that don't quite meet perfectly.
export function PlusDrawn({
  className,
  strokeWidth = 13,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path
        d="M50 12 C51 34, 49 62, 50 88"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M14 52 C36 49, 66 51, 87 50"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Mark B1 "quarter-turn extra": one heavy-ink loop, ends overlapping a
// quarter turn, drawn + inside. Strokes thicken as the mark shrinks —
// pass thicker widths at small sizes.
export function RingMark({
  className,
  ringWidth = 4.4,
  plusWidth = 17,
}: {
  className?: string;
  ringWidth?: number;
  plusWidth?: number;
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <g transform="rotate(-6 50 50)">
        <path
          d="M64 13 C82 19, 92 35, 90 52 C88 72, 70 87, 50 87 C29 87, 13 71, 13 50 C13 29, 29 13, 50 13 C66 13, 80 22, 85 36"
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={ringWidth}
          strokeLinecap="round"
        />
      </g>
      <g transform="translate(29 29) scale(0.42)">
        <path
          d="M50 12 C51 34, 49 62, 50 88"
          fill="none"
          stroke="var(--color-pen)"
          strokeWidth={plusWidth}
          strokeLinecap="round"
        />
        <path
          d="M14 52 C36 49, 66 51, 87 50"
          fill="none"
          stroke="var(--color-pen)"
          strokeWidth={plusWidth}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
