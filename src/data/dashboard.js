import { employees } from './employees.js';
import { departments } from './departments.js';
import { computePay } from './payroll.js';

const active = employees.filter((e) => e.status !== 'Resigned');
const byDept = (fn) => departments.map((d) => ({ name: d.name, value: fn(active.filter((e) => e.department === d.name)) }));

export const headcountByDept = byDept((l) => l.length);
export const payrollByDept = byDept((l) => l.reduce((s, e) => s + e.salary, 0));
export const avgSalary = Math.round(active.reduce((s, e) => s + e.salary, 0) / active.length);
export const totalPayroll = active.reduce((s, e) => s + e.salary, 0);
export const genderSplit = ['Female', 'Male'].map((g) => ({ name: g, value: active.filter((e) => e.gender === g).length }));
const years = (e) => (Date.now() - new Date(e.joiningDate)) / 3.15e10;
export const tenureBuckets = [['< 1 yr', 0, 1], ['1–2 yrs', 1, 2], ['2–4 yrs', 2, 4], ['4+ yrs', 4, 99]].map(([name, a, b]) => ({
  name, value: active.filter((e) => years(e) >= a && years(e) < b).length,
}));
export const avgTenure = (active.reduce((s, e) => s + years(e), 0) / active.length).toFixed(1);
export const netPayroll = active.reduce((s, e) => s + computePay(e.salary).net, 0);

export const attendanceOverview = [
  { name: 'Present', value: 31 }, { name: 'Late', value: 5 }, { name: 'Absent', value: 3 }, { name: 'On leave', value: 4 },
];
export const activityFeed = [
  { id: 1, text: 'Bilal Ahmed approved a leave request', time: '12 min ago' },
  { id: 2, text: 'September payroll finalized by Ayesha Raza', time: '3 h ago' },
  { id: 3, text: 'New employee Hassan Ali was added', time: 'Yesterday' },
  { id: 4, text: 'Attendance correction rejected for Daniyal Siddiqui', time: 'Yesterday' },
  { id: 5, text: 'Announcement “Q4 town hall” published', time: '2 days ago' },
];
export const adminKpis = { attrition: 4.2, attritionDelta: -0.6, payrollDelta: 2.1, headcountDelta: 3 };

export const absenteeismByDept = departments.map((d, i) => ({ name: d.name, value: +(2 + ((i * 7) % 6) * 0.8).toFixed(1) }));
export const leaveByType = [{ name: 'Annual', value: 38 }, { name: 'Sick', value: 21 }, { name: 'Casual', value: 29 }, { name: 'Unpaid', value: 6 }];
export const leaveUtilization = departments.map((d, i) => ({ name: d.name, Annual: 20 + ((i * 5) % 14), Sick: 6 + (i % 5), Casual: 8 + ((i * 3) % 7) }));
export const topLate = [['Daniyal Siddiqui', 'Sales', 7], ['Talha Khan', 'Engineering', 6], ['Iqra Ahmed', 'Support', 5], ['Kamran Malik', 'Operations', 4], ['Laiba Sheikh', 'Marketing', 3]]
  .map(([name, department, count]) => ({ name, department, count }));
export const deptStats = departments.map((d, i) => ({
  name: d.name, headcount: active.filter((e) => e.department === d.name).length, attendance: 90 + ((i * 3) % 8), leave: 2 + (i % 4),
}));

export const auditLog = [
  ['Ayesha Raza', 'UPDATE', 'Company settings', { graceMinutes: 10 }, { graceMinutes: 15 }],
  ['Bilal Ahmed', 'APPROVE', 'Leave request lv3', { status: 'Pending' }, { status: 'Approved' }],
  ['Ayesha Raza', 'FINALIZE', 'Payroll 2026-09', { status: 'Reviewed' }, { status: 'Finalized' }],
  ['Bilal Ahmed', 'CREATE', 'Employee EMP-1048', null, { name: 'Junaid Hussain', department: 'Support' }],
  ['Ayesha Raza', 'DEACTIVATE', 'HR user u6', { active: true }, { active: false }],
  ['Bilal Ahmed', 'REJECT', 'Attendance correction c3', { status: 'Pending' }, { status: 'Rejected', comment: 'Needs manager sign-off.' }],
  ['Ayesha Raza', 'CREATE', 'Department Support', null, { name: 'Support', head: 'Rabia Khan' }],
  ['Bilal Ahmed', 'UPDATE', 'Employee EMP-1010', { salary: 120000 }, { salary: 135000 }],
  ['Ayesha Raza', 'DELETE', 'Holiday h9', { name: 'Test holiday' }, null],
].map(([actor, action, entity, before, after], i) => ({
  id: i + 1, actor, action, entity, before, after, at: new Date(2026, 9, 24 - i, 10 + (i % 6), 15 * (i % 4)).toISOString(),
}));

export const aiSummaries = {
  admin: ['Headcount grew by 3 this month while attrition fell to 4.2%.', 'Engineering carries the largest share of payroll cost, 31% of the total.', 'Attendance improved by 4% compared with September.', 'Casual leave usage is higher than last month, mostly in Sales.'],
  hr: ['Attendance improved by 4% this month.', 'Engineering has the highest number of late arrivals.', 'Casual leave usage is higher than last month.', 'Three leave requests have been pending for over 48 hours.'],
};
export const suggestedQuestions = {
  admin: ['What is the total payroll cost this month?', 'How many active employees are in Engineering?', 'Which department has the highest attrition?', 'What is this month\u2019s attendance rate?'],
  hr: ['Who is on leave today?', 'Who came late most often this month?', 'How many leave requests are pending?', 'What is this month\u2019s attendance rate?'],
  employee: ['How many sick leaves do I have left?', 'What was my check-in time yesterday?', 'When is the next public holiday?', 'Where can I see my last payslip?'],
};
