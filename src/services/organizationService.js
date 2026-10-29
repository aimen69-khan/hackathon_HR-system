import { fetchApi } from '../config/api.js';

export async function getOrganization() {
  return fetchApi('/organization');
}

export async function getDepartments() {
  return fetchApi('/organization/departments');
}

export async function createDepartment(data) {
  return fetchApi('/organization/departments', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateDepartment(id, data) {
  return fetchApi(`/organization/departments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function getLeaveTypes() {
  return fetchApi('/organization/leave-types');
}

export async function createLeaveType(data) {
  return fetchApi('/organization/leave-types', { method: 'POST', body: JSON.stringify(data) });
}

export async function getHolidays() {
  return fetchApi('/organization/holidays');
}

export async function createHoliday(data) {
  return fetchApi('/organization/holidays', { method: 'POST', body: JSON.stringify(data) });
}

export async function getCompanySettings() {
  return fetchApi('/organization/settings');
}

export async function updateCompanySettings(data) {
  return fetchApi('/organization/settings', { method: 'PATCH', body: JSON.stringify(data) });
}
