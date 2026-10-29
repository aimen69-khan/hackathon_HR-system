import { CheckCheck, BellOff } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState } from '../../components/layout/States.jsx';
import Button from '../../components/buttons/Button.jsx';
import { useAppData } from '../../context/AppDataContext.jsx';

export default function Notifications() {
  const { notifications, unread, markRead, markAllRead } = useAppData();
  return (
    <>
      <PageHeader title="Notifications" subtitle={`${unread} unread`} actions={<Button icon={CheckCheck} disabled={!unread} onClick={markAllRead}>Mark all as read</Button>} />
      <div className="card">
        {!notifications.length ? <EmptyState icon={BellOff} title="No notifications." message="Updates about leave, payroll and announcements show up here." /> : (
          <ul className="list">{notifications.map((n) => (
            <li key={n.id}><span className={`dot ${n.read ? 'read' : ''}`} /><div className="grow"><div style={{ fontWeight: n.read ? 400 : 600 }}>{n.text}</div><div className="muted small">{n.time}</div></div>
              {!n.read && <Button size="sm" onClick={() => markRead(n.id)}>Mark as read</Button>}</li>))}</ul>)}
      </div>
    </>
  );
}
