import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, Sparkles } from 'lucide-react';
import Sidebar from '../sidebar/Sidebar.jsx';
import Navbar from '../navbar/Navbar.jsx';
import AIChat from '../ai/AIChat.jsx';
import { NAV } from '../../routes/navConfig.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEffect } from 'react';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [menu, setMenu] = useState(false);
  const [chat, setChat] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  const onAiPage = pathname.endsWith('/ai');
  return (
    <div className="app">
      <Sidebar open={menu} onClose={() => setMenu(false)} />
      <div className="main">
        <Navbar onMenu={() => setMenu(true)} />
        <main className="content" id="main"><Outlet /></main>
      </div>
      {!onAiPage && (<>
        {chat && <AIChat onClose={() => setChat(false)} />}
        <button className="fab" aria-label="Open AI assistant" onClick={() => setChat(!chat)}><Sparkles size={22} /></button>
      </>)}
      <nav className="bottom-nav" aria-label="Quick navigation">
        {NAV[user.role].slice(0, 4).map(({ label, icon: Icon, path }) => (
          <NavLink key={path} to={`/${user.role}/${path}`}><Icon size={20} />{label.replace('My ', '')}</NavLink>
        ))}
        <button onClick={() => setMenu(true)}><Menu size={20} />More</button>
      </nav>
    </div>
  );
}
