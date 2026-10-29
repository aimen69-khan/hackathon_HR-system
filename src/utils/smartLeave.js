import { DAYS, nextWeekday } from './dates.js';
import { isoDate } from './format.js';

// Mock of the AI leave parser. The real one will live behind the backend.
export function parseSmartLeave(text) {
  const t = text.toLowerCase();
  let type = 'Casual';
  if (/(sick|ill|fever|doctor|flu|unwell|hospital)/.test(t)) type = 'Sick';
  else if (/(vacation|holiday|trip|travel|annual)/.test(t)) type = 'Annual';
  else if (/(unpaid)/.test(t)) type = 'Unpaid';
  const mentioned = DAYS.filter((d) => t.includes(d));
  let start, end;
  if (t.includes('tomorrow')) {
    const d = new Date(); d.setDate(d.getDate() + 1); start = end = isoDate(d);
  } else if (mentioned.length) {
    const dates = mentioned.map((d) => nextWeekday(d)).sort();
    start = dates[0]; end = dates[dates.length - 1];
  } else {
    const d = new Date(); d.setDate(d.getDate() + 1); start = end = isoDate(d);
  }
  const m = t.match(/(?:for|because(?: of)?)\s+(?:a\s+|an\s+|my\s+)?([a-z ]+?)(?:[.,!]|$)/);
  const reasonRaw = m ? m[1].trim() : 'Personal reason';
  return { type, start, end, reason: reasonRaw.charAt(0).toUpperCase() + reasonRaw.slice(1) };
}
