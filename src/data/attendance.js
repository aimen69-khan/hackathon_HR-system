import { employees } from './employees.js';

const pattern = ['Present', 'Present', 'Late', 'Present', 'Absent', 'Present', 'On leave', 'Half day', 'Present', 'Missing checkout'];
const times = {
  Present: ['09:02', '18:05', 9.0], Late: ['09:41', '18:10', 8.5], 'Half day': ['09:05', '13:10', 4.1],
  'Missing checkout': ['09:10', null, 0], Absent: [null, null, 0], 'On leave': [null, null, 0],
};

export const attendanceBoard = employees
  .filter((e) => e.status !== 'Resigned')
  .map((e, i) => {
    const status = pattern[i % pattern.length];
    const [checkIn, checkOut, hours] = times[status];
    return { id: e.id, name: e.name, department: e.department, checkIn, checkOut, hours, status };
  });

export const attendanceTrend = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(2026, 9, 12 + i);
  return { name: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }), rate: 88 + ((i * 7) % 9) };
});

// Deterministic mock status for a day of a month (used by AttendanceCalendar).
export function monthStatuses(year, month, seed = 1) {
  const out = {};
  const now = new Date();
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const dt = new Date(year, month, d);
    const dow = dt.getDay();
    if (dow === 0 || dow === 6) out[d] = 'Weekend';
    else if (dt > now) out[d] = 'None';
    else {
      const n = (d * 7 + seed * 13) % 17;
      out[d] = n === 0 ? 'Absent' : n === 1 || n === 2 ? 'Late' : n === 3 ? 'Half' : n === 4 ? 'Leave' : n === 5 ? 'Missing' : 'Present';
    }
  }
  return out;
}

export const initialCorrections = [
  { id: 'c1', employeeId: 'EMP-1005', employee: employees[4].name, date: '2026-10-19', reason: 'Forgot to check out after client visit.', status: 'Pending', comment: '' },
  { id: 'c2', employeeId: 'EMP-1008', employee: employees[7].name, date: '2026-10-16', reason: 'Biometric device was offline.', status: 'Approved', comment: 'Verified with IT.' },
  { id: 'c3', employeeId: 'EMP-1012', employee: employees[11].name, date: '2026-10-14', reason: 'Worked from the client site.', status: 'Rejected', comment: 'Needs manager sign-off.' },
  { id: 'c4', employeeId: 'EMP-1015', employee: employees[14].name, date: '2026-10-21', reason: 'Late due to road closure.', status: 'Pending', comment: '' },
];
