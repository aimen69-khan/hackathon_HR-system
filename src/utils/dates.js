import { isoDate } from './format.js';
// Counts Mon–Fri days between two ISO dates (inclusive). Holidays are not subtracted in this mock.
export function workingDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start), e = new Date(end);
  if (e < s) return 0;
  let n = 0;
  for (const d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) if (d.getDay() % 6 !== 0) n++;
  return n;
}
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export function nextWeekday(name, { skipThisWeek = false } = {}) {
  const target = DAYS.indexOf(name);
  const d = new Date();
  let diff = (target - d.getDay() + 7) % 7 || 7;
  if (skipThisWeek && diff < 7 && d.getDay() !== 0) diff += d.getDay() <= target ? 0 : 0;
  d.setDate(d.getDate() + diff);
  return isoDate(d);
}
export { DAYS };
