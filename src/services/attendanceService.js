import { fetchApi } from '../config/api.js';
import { attendanceBoard, initialCorrections } from '../data/attendance.js';

function mapBoardRecord(r) {
  const statusMap = {
    Present: 'Present', Late: 'Late', Absent: 'Absent',
    'On leave': 'On leave', 'Half-day': 'Half day', 'Half day': 'Half day',
    'Missing checkout': 'Missing checkout',
  };
  return {
    id: r.employeeCode || r.id || r._id,
    name: r.employeeName || r.name || '',
    department: r.department || '',
    checkIn: r.checkIn || null,
    checkOut: r.checkOut || null,
    hours: r.workHours ?? r.hours ?? 0,
    status: statusMap[r.status] || r.status || 'Present',
  };
}

function mapCorrection(c) {
  const status = String(c.status || 'pending');
  return {
    ...c,
    id: c._id || c.id,
    employeeId: c.employeeCode || c.employeeId || '',
    employee: c.employeeName || c.employee || '',
    date: c.date ? String(c.date).slice(0, 10) : '',
    reason: c.reason || '',
    status: status.charAt(0).toUpperCase() + status.slice(1),
    comment: c.comments || c.comment || '',
  };
}

export async function getBoard() {
  try {
    const data = await fetchApi('/attendance/board');
    if (Array.isArray(data)) return data.map(mapBoardRecord);
    if (data?.records) return data.records.map(mapBoardRecord);
    return attendanceBoard;
  } catch {
    return attendanceBoard;
  }
}

export async function getAttendanceBoard() { return getBoard(); }

export async function listCorrections() {
  try {
    const data = await fetchApi('/attendance/corrections');
    const list = Array.isArray(data) ? data : (data?.items || []);
    return list.map(mapCorrection);
  } catch {
    return initialCorrections;
  }
}

export async function getAttendanceCorrections() { return listCorrections(); }

export async function submitCorrection(data) {
  const created = await fetchApi('/attendance/corrections', {
    method: 'POST',
    body: JSON.stringify({
      date: data.date,
      requestedCheckIn: data.checkIn || data.requestedCheckIn,
      requestedCheckOut: data.checkOut || data.requestedCheckOut,
      reason: data.reason || '',
      employeeId: data.employeeId,
    }),
  });
  return mapCorrection(created);
}

export async function decideCorrection(id, status, comment) {
  return mapCorrection(await fetchApi(`/attendance/corrections/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: String(status).toLowerCase(), comments: comment || '' }),
  }));
}

export async function approveCorrection(id) { return decideCorrection(id, 'approved'); }
export async function rejectCorrection(id) { return decideCorrection(id, 'rejected'); }

export async function checkIn() {
  try {
    const rec = await fetchApi('/attendance/check-in', { method: 'POST', body: JSON.stringify({}) });
    const time = rec.checkIn || new Date().toTimeString().slice(0, 5);
    const [h, m] = time.split(':').map(Number);
    const d = new Date(); d.setHours(h || 0, m || 0, 0, 0);
    return { at: d.toISOString(), record: rec };
  } catch {
    return { at: new Date().toISOString() };
  }
}

export async function checkOut() {
  try {
    const rec = await fetchApi('/attendance/check-out', { method: 'POST', body: JSON.stringify({}) });
    const time = rec.checkOut || new Date().toTimeString().slice(0, 5);
    const [h, m] = time.split(':').map(Number);
    const d = new Date(); d.setHours(h || 0, m || 0, 0, 0);
    return { at: d.toISOString(), record: rec };
  } catch {
    return { at: new Date().toISOString() };
  }
}
