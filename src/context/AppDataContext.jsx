import { createContext, useContext, useState } from 'react';
import { notificationsByRole } from '../data/notifications.js';
import { initialAnnouncements } from '../data/announcements.js';
import { useAuth } from './AuthContext.jsx';

// Shared, mutable UI data (notifications + announcements) used by several screens.
const AppDataContext = createContext(null);
export function AppDataProvider({ children }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState(notificationsByRole);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const role = user?.role;
  const notifications = notes[role] || [];
  const patch = (fn) => setNotes((all) => ({ ...all, [role]: fn(all[role] || []) }));
  return (
    <AppDataContext.Provider value={{
      notifications, unread: notifications.filter((n) => !n.read).length,
      markRead: (id) => patch((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => patch((l) => l.map((n) => ({ ...n, read: true }))),
      announcements, setAnnouncements,
    }}>{children}</AppDataContext.Provider>
  );
}
export const useAppData = () => useContext(AppDataContext);
