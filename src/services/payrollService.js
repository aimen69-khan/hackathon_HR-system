import { fetchApi } from '../config/api.js';
import { employees } from '../data/employees.js';
import { computePay } from '../data/payroll.js';

function mapPayroll(data, month) {
  if (!data || data.error) return { rows: [], status: 'Not created', month };
  const statusMap = { draft: 'Draft', processing: 'Reviewed', finalized: 'Finalized', paid: 'Finalized' };
  const status = statusMap[data.status] || data.status || 'Draft';
  const payslips = data.payslips || [];
  const rows = payslips.map((p) => {
    const gross = (p.basic || 0) + (p.allowances || 0);
    const pf = p.deductions || 0;
    const tax = p.tax || 0;
    return {
      id: p.employeeCode || p.employee || p._id,
      name: p.employeeName || p.name || '',
      department: p.department || '',
      designation: p.designation || '',
      gross, basic: p.basic || 0, pf, tax,
      deductions: pf + tax,
      net: p.net || (gross - pf - tax),
    };
  });
  // If no payslips in DB, synthesize from employees so page isn't empty
  if (!rows.length) {
    const active = employees.filter((x) => x.status !== 'Resigned');
    return {
      rows: active.map((e) => ({ id: e.id, name: e.name, department: e.department, designation: e.designation, ...computePay(e.salary) })),
      status: status === 'Draft' ? 'Draft' : status,
      month,
    };
  }
  return { rows, status, month: data.month || month };
}

export async function getPayroll(month) {
  try {
    return mapPayroll(await fetchApi(`/payroll/${month}`), month);
  } catch (e) {
    const active = employees.filter((x) => x.status !== 'Resigned');
    return {
      rows: active.map((e) => ({ id: e.id, name: e.name, department: e.department, designation: e.designation, ...computePay(e.salary) })),
      status: 'Not created',
      month,
    };
  }
}

export async function getPayslips(employeeId) {
  try {
    if (!employeeId) return [];
    const data = await fetchApi(`/payroll/payslips?employeeId=${encodeURIComponent(employeeId)}`);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function createPayroll(month) {
  return fetchApi('/payroll', { method: 'POST', body: JSON.stringify({ month }) });
}

export async function updatePayrollStatus(month, status) {
  const map = { Draft: 'draft', Reviewed: 'processing', Finalized: 'finalized', Paid: 'paid' };
  return fetchApi(`/payroll/${month}/status`, {
    method: 'POST',
    body: JSON.stringify({ status: map[status] || String(status).toLowerCase() }),
  });
}

export async function setRunStatus(month, status) {
  // Creating draft when "Not created" path calls this with Draft
  if (status === 'Draft') {
    try { await createPayroll(month); } catch {}
  }
  return updatePayrollStatus(month, status);
}

export async function finalizePayroll(month) {
  return updatePayrollStatus(month, 'Finalized');
}
