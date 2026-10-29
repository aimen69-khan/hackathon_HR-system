import { employees } from './employees.js';

export const initialBalances = [
  { type: 'Annual', quota: 20, used: 6 },
  { type: 'Sick', quota: 10, used: 2 },
  { type: 'Casual', quota: 8, used: 3 },
  { type: 'Unpaid', quota: 0, used: 0 },
];

const kinds = ['Annual', 'Sick', 'Casual', 'Casual', 'Annual', 'Sick'];
const states = ['Pending', 'Pending', 'Approved', 'Approved', 'Rejected', 'Approved', 'Pending'];
const reasons = ['Family function', 'Fever and rest', 'Wedding', 'Personal errand', 'Vacation', 'Doctor appointment', 'Moving house'];

export const initialLeaveRequests = Array.from({ length: 14 }, (_, i) => {
  const e = employees[(i * 3 + 1) % 40];
  const start = new Date(2026, 9, 5 + ((i * 3) % 24));
  const days = 1 + (i % 3);
  const end = new Date(start); end.setDate(start.getDate() + days - 1);
  return {
    id: `lv${i + 1}`,
    employeeId: i % 4 === 0 ? 'EMP-1005' : e.id,
    employee: i % 4 === 0 ? employees[4].name : e.name,
    type: kinds[i % kinds.length],
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
    days,
    reason: reasons[i % reasons.length],
    status: states[i % states.length],
    comment: '',
  };
});
