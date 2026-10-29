import { fetchApi } from '../config/api.js';

export async function getNotifications() {
  try {
    const data = await fetchApi('/notifications');
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

export async function markNotificationAsRead(id) {
  return fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function deleteNotification(id) {
  return fetchApi(`/notifications/${id}`, { method: 'DELETE' });
}

export async function markAllAsRead() {
  return fetchApi('/notifications/read-all', { method: 'PATCH' });
}
