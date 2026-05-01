// Schedules and PTT articles are keyed by calendar days in Asia/Taipei (LINE
// returns local TW dates). The browser may be in any timezone, so derive the
// "today + N days" list explicitly in TW time instead of relying on local clock.
const TAIPEI_FMT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getNextTaipeiDays(count = 7): string[] {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) =>
    TAIPEI_FMT.format(new Date(now + i * 86_400_000)).replace(/-/g, '')
  );
}
