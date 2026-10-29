import { fetchApi } from '../config/api.js';
import {
  headcountByDept, payrollByDept, avgSalary, totalPayroll, genderSplit,
  tenureBuckets, avgTenure, attendanceOverview, activityFeed, adminKpis,
  absenteeismByDept, leaveByType, leaveUtilization, topLate, deptStats,
} from '../data/dashboard.js';

const trend = [
  { name: 'Mon', rate: 92 }, { name: 'Tue', rate: 94 }, { name: 'Wed', rate: 91 },
  { name: 'Thu', rate: 95 }, { name: 'Fri', rate: 90 }, { name: 'Sat', rate: 0 },
  { name: 'Sun', rate: 0 }, { name: 'Mon', rate: 93 }, { name: 'Tue', rate: 96 },
  { name: 'Wed', rate: 92 }, { name: 'Thu', rate: 94 }, { name: 'Fri', rate: 91 },
];

function adminShape(api = {}) {
  return {
    headcountByDept: api.headcountByDept || headcountByDept,
    payrollByDept: api.payrollByDept || payrollByDept,
    avgSalary: api.averageSalary ?? api.avgSalary ?? avgSalary,
    totalPayroll: api.payrollExpense ?? api.totalPayroll ?? totalPayroll,
    genderSplit: api.genderSplit || genderSplit,
    tenureBuckets: api.tenureBuckets || tenureBuckets,
    avgTenure: api.stats?.avgTenure ?? api.avgTenure ?? avgTenure,
    attendanceOverview: api.attendanceOverview || attendanceOverview,
    activityFeed: api.activityFeed || activityFeed,
    adminKpis: {
      attrition: api.attrition ?? adminKpis.attrition,
      attritionDelta: adminKpis.attritionDelta,
      payrollDelta: adminKpis.payrollDelta,
      headcountDelta: api.headcountGrowth ?? adminKpis.headcountDelta,
    },
    // extra fields some charts may use
    headcount: api.headcount,
    attendanceRate: api.attendanceRate,
  };
}

function hrShape(api = {}) {
  // API: presentToday, absentToday, leavePending, totalEmployees, attendanceTrend
  const trendData = Array.isArray(api.attendanceTrend)
    ? api.attendanceTrend.map((t, i) => ({
        name: t.name || t.day || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i % 7],
        rate: t.rate ?? t.value ?? 90,
      }))
    : trend;
  return {
    kpis: {
      headcount: api.totalEmployees ?? 44,
      present: api.presentToday ?? 40,
      onLeave: api.onLeaveToday ?? api.absentToday ?? 4,
      late: api.lateToday ?? 5,
      pending: api.leavePending ?? 6,
    },
    trend: trendData,
    leaveByType: api.leaveByType || leaveByType,
    absenteeism: api.absenteeismByDept || absenteeismByDept,
    topLate: api.topLate || topLate,
    deptStats: api.deptStats || deptStats,
  };
}

export async function getAdminDashboard() {
  try { return adminShape(await fetchApi('/dashboard/admin')); }
  catch (e) { console.warn('admin dash fallback', e.message); return adminShape(); }
}

export async function getHrDashboard() {
  try { return hrShape(await fetchApi('/dashboard/hr')); }
  catch (e) { console.warn('hr dash fallback', e.message); return hrShape(); }
}

export async function getEmployeeDashboard() {
  try { return await fetchApi('/dashboard/employee'); }
  catch {
    return { presentToday: true, hoursThisWeek: 40, leaveBalance: { casual: 8, sick: 5, annual: 12 }, nextPayslip: '30-Sep-2026' };
  }
}

function mapOrganization(api) {
  const fallbackDepts = [
    { id: 'd1', name: 'Engineering', head: 'Hamza Siddiqui', active: true },
    { id: 'd2', name: 'Human Resources', head: 'Bilal Ahmed', active: true },
    { id: 'd3', name: 'Finance', head: 'Sana Qureshi', active: true },
    { id: 'd4', name: 'Sales', head: 'Usman Malik', active: true },
    { id: 'd5', name: 'Marketing', head: 'Noor Sheikh', active: true },
    { id: 'd6', name: 'Operations', head: 'Imran Hussain', active: true },
    { id: 'd7', name: 'Support', head: 'Rabia Khan', active: true },
  ];
  const fallbackDesig = [
    { id: 'g1', name: 'Software Engineer', department: 'Engineering', active: true },
    { id: 'g2', name: 'HR Manager', department: 'Human Resources', active: true },
    { id: 'g3', name: 'Accountant', department: 'Finance', active: true },
  ];
  const fallbackLeave = [
    { id: 'l1', name: 'Annual', quota: 20, paid: 'Paid', active: true },
    { id: 'l2', name: 'Sick', quota: 10, paid: 'Paid', active: true },
    { id: 'l3', name: 'Casual', quota: 8, paid: 'Paid', active: true },
    { id: 'l4', name: 'Unpaid', quota: 0, paid: 'Unpaid', active: true },
  ];
  const fallbackHolidays = [
    { id: 'h1', name: 'Eid Milad-un-Nabi', date: '2026-08-26' },
    { id: 'h2', name: 'Iqbal Day', date: '2026-11-09' },
    { id: 'h3', name: "Quaid-e-Azam's Birthday", date: '2026-12-25' },
  ];
  const fallbackHr = [
    { id: 'u2', name: 'Bilal Ahmed', email: 'hr@hcm.test', department: 'Human Resources', active: true },
  ];
  const fallbackSettings = {
    companyName: 'Northwind Technologies',
    officeStart: '09:00', officeEnd: '18:00', graceMinutes: 15,
    weekend: 'Saturday, Sunday',
    officeLocation: 'Plot 12, Shahrah-e-Faisal, Karachi',
    radiusMeters: 150,
  };

  const depts = (api?.departments || []).map((d, i) => ({
    id: d._id || d.id || `d${i + 1}`, name: d.name, head: d.head || '', active: d.active !== false,
  }));
  const desigs = (api?.designations || []).map((d, i) => ({
    id: d._id || d.id || `g${i + 1}`, name: d.name, department: d.department || '', active: d.active !== false,
  }));
  const leaves = (api?.leaveTypes || []).map((d, i) => ({
    id: d._id || d.id || `l${i + 1}`, name: d.name, quota: d.quota ?? 0, paid: d.paid || 'Paid', active: d.active !== false,
  }));
  const hols = (api?.holidays || []).map((d, i) => ({
    id: d._id || d.id || `h${i + 1}`, name: d.name, date: d.date ? String(d.date).slice(0, 10) : '',
  }));
  const settings = api?.settings || {};
  return {
    name: api?.name || 'Northwind Technologies',
    departments: depts.length ? depts : fallbackDepts,
    designations: desigs.length ? desigs : fallbackDesig,
    leaveTypes: leaves.length ? leaves : fallbackLeave,
    holidays: hols.length ? hols : fallbackHolidays,
    hrUsers: fallbackHr,
    companySettings: {
      companyName: api?.name || settings.companyName || fallbackSettings.companyName,
      officeStart: settings.workStart || settings.officeStart || fallbackSettings.officeStart,
      officeEnd: settings.workEnd || settings.officeEnd || fallbackSettings.officeEnd,
      graceMinutes: settings.graceMinutes ?? fallbackSettings.graceMinutes,
      weekend: settings.weekend || fallbackSettings.weekend,
      officeLocation: settings.officeLocation || fallbackSettings.officeLocation,
      radiusMeters: settings.radiusMeters ?? fallbackSettings.radiusMeters,
    },
  };
}

export async function getOrganization() {
  try { return mapOrganization(await fetchApi('/organization')); }
  catch (e) { console.warn('org fallback', e.message); return mapOrganization(null); }
}

export async function getAuditLog() {
  try {
    const data = await fetchApi('/audit');
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function getAnalytics() {
  try {
    const api = await fetchApi('/analytics');
    return {
      headcountByDept: api.headcountByDept || headcountByDept,
      payrollByDept: api.payrollByDept || payrollByDept,
      leaveUtilization: api.leaveUtilization || leaveUtilization,
      absenteeismByDept: api.absenteeismByDept || absenteeismByDept,
      topLate: api.topLate || topLate,
      genderSplit: api.genderSplit || genderSplit,
      tenureBuckets: api.tenureBuckets || tenureBuckets,
      headcount: api.headcount,
      leaveByType: api.leaveByType || leaveByType,
    };
  } catch {
    return { headcountByDept, payrollByDept, leaveUtilization, absenteeismByDept, topLate, genderSplit, tenureBuckets };
  }
}
