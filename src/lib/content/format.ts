// Date formatting for the pages. Content dates are plain YYYY-MM-DD with no
// time or place attached, so they are formatted in UTC — parsing one as local
// time would shift it a day for anyone west of Greenwich.

const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return FORMATTER.format(new Date(`${iso}T00:00:00Z`));
}

/** Whole days between two content dates, counting the first day as day one. */
export function daysBetween(startIso: string, endIso: string): number {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  const end = Date.parse(`${endIso}T00:00:00Z`);
  return Math.round((end - start) / 86_400_000) + 1;
}
