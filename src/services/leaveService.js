import { fetchApi } from '../config/api.js';
import { initialBalances, initialLeaveRequests } from '../data/leave.js';

function mapRequest(r) {
  if (!r) return null;
  const status = String(r.status || 'pending');
  return {
    ...r,
    id: r._id || r.id,
    employeeId: r.employeeCode || r.employeeId || '',
    employee: r.employeeName || r.employee || '',
    type: r.type || 'Casual',
    start: r.startDate ? String(r.startDate).slice(0, 10) : (r.start || ''),
    end: r.endDate ? String(r.endDate).slice(0, 10) : (r.end || ''),
    days: r.days || 1,
    reason: r.reason || '',
    status: status.charAt(0).toUpperCase() + status.slice(1),
  };
}

function toBalanceArray(data) {
  if (Array.isArray(data)) return data;
  if (data?.balances) {
    const used = data.used || {};
    return Object.keys(data.balances).map((type) => ({
      type, quota: data.balances[type] ?? 0, used: used[type] ?? 0,
    }));
  }
  return initialBalances;
}

export async function listRequests() {
  try {
    const data = await fetchApi('/leave/requests');
    const list = Array.isArray(data) ? data : (data?.items || []);
    return list.map(mapRequest).filter(Boolean);
  } catch (e) {
    return initialLeaveRequests;
  }
}

export async function getLeaveBalances(employeeId) {
  try {
    if (!employeeId) return initialBalances;
    return toBalanceArray(await fetchApi(`/leave/balances?employeeId=${encodeURIComponent(employeeId)}`));
  } catch {
    return initialBalances;
  }
}

export async function getBalances(employeeId) {
  return getLeaveBalances(employeeId);
}

export async function applyForLeave(data) {
  const payload = {
    type: data.type,
    startDate: data.start || data.startDate,
    endDate: data.end || data.endDate,
    days: data.days,
    reason: data.reason || '',
    employeeId: data.employeeId,
  };
  return mapRequest(await fetchApi('/leave/requests', { method: 'POST', body: JSON.stringify(payload) }));
}

export async function applyLeave(data) { return applyForLeave(data); }

export async function decideLeave(id, status) {
  const normalized = String(status).toLowerCase();
  return mapRequest(await fetchApi(`/leave/requests/${id}`, {
    method: 'PATCH', body: JSON.stringify({ status: normalized }),
  }));
}

export async function approveLeave(id) { return decideLeave(id, 'approved'); }
export async function rejectLeave(id) { return decideLeave(id, 'rejected'); }

export async function smartLeave(text) {
  const dayMatch = text.match(/(\d+)\s*(?:day|days)/i);
  const typeMatch = text.match(/(casual|sick|annual|maternity|unpaid)/i);
  return {
    days: dayMatch ? parseInt(dayMatch[1], 10) : 1,
    type: typeMatch ? typeMatch[1].charAt(0).toUpperCase() + typeMatch[1].slice(1) : 'Casual',
    parsed: true,
  };
}
