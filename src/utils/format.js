export const money = (n) => `PKR ${Math.round(n || 0).toLocaleString('en-US')}`;
export const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const fmtDateTime = (iso) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
export const isoDate = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
export const todayIso = () => isoDate(new Date());
export const initials = (name = '') => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
export const monthLabel = (ym) => new Date(`${ym}-01`).toLocaleDateString('en', { month: 'long', year: 'numeric' });
export const currentMonth = () => todayIso().slice(0, 7);
