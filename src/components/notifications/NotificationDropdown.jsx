import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useClickOutside } from '../../hooks/useClickOutside.js';

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { notifications, unread, markRead, markAllRead } = useAppData();
  const { user } = useAuth();
  useClickOutside(ref, () => setOpen(false));
  return (
    <div className="drop" ref={ref}>
      <Button variant="ghost" icon={Bell} aria-label={`Notifications, ${unread} unread`} aria-expanded={open} onClick={() => setOpen(!open)} />
      {unread > 0 && <span className="count">{unread}</span>}
      {open && (
        <div className="drop-menu">
          <div className="row between" style={{ padding: '12px 14px' }}><strong>Notifications</strong><Button size="sm" variant="ghost" onClick={markAllRead}>Mark all read</Button></div>
          <ul className="list" style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 && <li className="muted">No notifications.</li>}
            {notifications.slice(0, 5).map((n) => (
              <li key={n.id} onClick={() => markRead(n.id)} style={{ cursor: 'pointer' }}>
                <span className={`dot ${n.read ? 'read' : ''}`} /><div><div>{n.text}</div><div className="muted small">{n.time}</div></div>
              </li>
            ))}
          </ul>
          <Link to={`/${user.role}/notifications`} onClick={() => setOpen(false)} className="menu-item" style={{ justifyContent: 'center', borderTop: '1px solid var(--line)' }}>View all</Link>
        </div>
      )}
    </div>
  );
}
