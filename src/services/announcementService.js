import { fetchApi } from '../config/api.js';
import { initialAnnouncements } from '../data/announcements.js';

function mapA(a) {
  return {
    ...a,
    id: a._id || a.id,
    title: a.title,
    body: a.body,
    author: a.author || '',
    date: a.publishedAt ? String(a.publishedAt).slice(0, 10) : (a.date || ''),
    audience: a.audience === 'all' ? 'Everyone' : (a.audience || 'Everyone'),
    active: a.active !== false,
    pinned: !!a.pinned,
  };
}

export async function listAnnouncements() {
  try {
    const data = await fetchApi('/announcements');
    const list = Array.isArray(data) ? data : [];
    return list.length ? list.map(mapA) : initialAnnouncements;
  } catch { return initialAnnouncements; }
}

export async function createAnnouncement(data) {
  return mapA(await fetchApi('/announcements', {
    method: 'POST',
    body: JSON.stringify({
      title: data.title, body: data.body,
      audience: data.audience === 'Everyone' ? 'all' : (data.audience || 'all'),
      pinned: !!data.pinned,
    }),
  }));
}

export async function updateAnnouncement(id, data) {
  return mapA(await fetchApi(`/announcements/${id}`, { method: 'PATCH', body: JSON.stringify(data) }));
}

export async function deleteAnnouncement(id) {
  return fetchApi(`/announcements/${id}`, { method: 'DELETE' });
}
