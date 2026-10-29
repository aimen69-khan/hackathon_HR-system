import { fetchApi } from '../config/api.js';
import { employees as mockEmployees } from '../data/employees.js';

function mapEmployee(e) {
  if (!e) return null;
  return {
    ...e,
    id: e.code || e.id || String(e._id || ''),
    _id: e._id,
    code: e.code || e.id,
    name: e.name || '',
    email: e.email || '',
    department: e.department || '',
    designation: e.designation || '',
    status: e.status || 'Active',
    joiningDate: e.joiningDate ? String(e.joiningDate).slice(0, 10) : '',
    salary: Number(e.salary) || 0,
    phone: e.phone || '',
    address: e.address || '',
    gender: e.gender || '',
    employmentType: e.employmentType || 'Full-time',
    manager: e.manager || '',
  };
}

function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.employees)) return data.employees;
  return [];
}

export async function listEmployees() {
  try {
    const data = await fetchApi('/employees');
    return asArray(data).map(mapEmployee).filter(Boolean);
  } catch (e) {
    console.warn('employees fallback', e.message);
    return mockEmployees;
  }
}

export async function getEmployee(id) {
  try {
    try {
      return mapEmployee(await fetchApi(`/employees/${id}`));
    } catch {
      const all = await listEmployees();
      return all.find((e) => e.id === id || e.code === id || String(e._id) === String(id)) || null;
    }
  } catch {
    return mockEmployees.find((e) => e.id === id) || null;
  }
}

export async function createEmployee(data) {
  const payload = {
    ...data,
    code: data.code || data.id,
    joiningDate: data.joiningDate || new Date().toISOString().slice(0, 10),
    salary: Number(data.salary) || 0,
  };
  return mapEmployee(await fetchApi('/employees', { method: 'POST', body: JSON.stringify(payload) }));
}

export async function updateEmployee(id, data) {
  return mapEmployee(await fetchApi(`/employees/${data._id || id}`, { method: 'PATCH', body: JSON.stringify(data) }));
}

export async function deleteEmployee(id) {
  return fetchApi(`/employees/${id}`, { method: 'DELETE' });
}

export async function importDryRun(csvText) {
  const lines = String(csvText || '').trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',').map((c) => c.trim());
    const row = {};
    headers.forEach((h, idx) => { row[h] = cols[idx] || ''; });
    const errors = [];
    if (!row.name) errors.push('Name required');
    if (!row.email) errors.push('Email required');
    return {
      id: row.code || row.id || `IMP-${i + 1}`,
      name: row.name || '',
      email: row.email || '',
      department: row.department || '',
      designation: row.designation || '',
      joiningDate: row.joiningdate || row.joiningDate || '',
      salary: Number(row.salary) || 0,
      errors,
    };
  });
}

export async function commitImport(rows) {
  let n = 0;
  for (const emp of (rows || []).filter((r) => !r.errors?.length)) {
    try { await createEmployee(emp); n += 1; } catch {}
  }
  return n;
}
