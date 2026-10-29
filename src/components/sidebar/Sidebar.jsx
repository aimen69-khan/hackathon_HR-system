import { NavLink } from "react-router-dom";
import { NAV } from "../../routes/navConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  return (
    <>
      <div className={`scrim ${open ? "show" : ""}`} onClick={onClose} />
      <aside
        className={`sidebar ${open ? "open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="brand">
          <span className="brand-mark">H</span>HCM Lite
        </div>
        <nav className="nav">
          {NAV[user.role].map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={`/${user.role}/${path}`} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-foot">
          Northwind Technologies
          <br />
          Demo workspace
        </div>
      </aside>
    </>
  );
}
