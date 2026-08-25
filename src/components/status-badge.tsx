import type { ExperimentStatus } from "@/data/schema";

// Status in the palette's own logic (moodboards/01b-system.html): cobalt is
// the live pen, marigold flags, green validates, red corrects, quiet is
// not-yet. Classes are written out in full rather than composed, so Tailwind's
// scanner can see them.
const STATUS = {
  planned: { label: "Planned", dot: "bg-quiet", text: "text-quiet" },
  ongoing: { label: "Ongoing", dot: "bg-pen", text: "text-pen" },
  paused: { label: "Paused", dot: "bg-marigold", text: "text-marigold" },
  concluded: {
    label: "Concluded",
    dot: "bg-green-marker",
    text: "text-green-marker",
  },
  abandoned: { label: "Abandoned", dot: "bg-red-pen", text: "text-red-pen" },
} as const satisfies Record<
  ExperimentStatus,
  { label: string; dot: string; text: string }
>;

export function statusLabel(status: ExperimentStatus): string {
  return STATUS[status].label;
}

export function StatusBadge({
  status,
  className = "",
}: {
  status: ExperimentStatus;
  className?: string;
}) {
  const style = STATUS[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.08em] ${style.text} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-[7px] w-[7px] rounded-full ${style.dot}`}
      />
      {style.label}
    </span>
  );
}
