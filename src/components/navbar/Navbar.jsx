import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Settings, Sun } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';
import StatusBadge from '../badges/StatusBadge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useClickOutside } from '../../hooks/useClickOutside.js';
import { initials } from '../../utils/format.js';
import { ROLE_LABEL } from '../../routes/navConfig.js';

export default function Navbar({ onMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <header className="navbar">
      <Button className="mob-only" variant="ghost" icon={Menu} aria-label="Open menu" onClick={onMenu} />
      <div className="grow"><span className="badge info">{ROLE_LABEL[user.role]} workspace</span></div>
      <Button variant="ghost" icon={theme === 'light' ? Moon : Sun} aria-label="Toggle dark mode" onClick={toggle} />
      <NotificationDropdown />
      <div className="drop" ref={ref}>
        <button className="btn ghost" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Account menu">
          <span className="avatar">{initials(user.name)}</span><span className="desk-only">{user.name}</span>
        </button>
        {open && (
          <div className="drop-menu sm">
            <div style={{ padding: '10px 14px' }}><strong>{user.name}</strong><div className="muted small">{user.email}</div></div>
            <button className="menu-item" onClick={() => { setOpen(false); nav(`/${user.role}/settings`); }}><Settings size={16} />Settings</button>
            <button className="menu-item" onClick={() => { logout(); nav('/login'); }}><LogOut size={16} />Sign out</button>
          </div>
        )}
      </div>
    </header>
  );
}
