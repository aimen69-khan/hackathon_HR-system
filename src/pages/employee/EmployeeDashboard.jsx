import { CalendarDays, Clock, FileText, Timer } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async } from '../../components/layout/States.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Card from '../../components/cards/Card.jsx';
import AnnouncementCard from '../../components/cards/AnnouncementCard.jsx';
import CheckInWidget from '../../components/attendance/CheckInWidget.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getBalances } from '../../services/leaveService.js';
import { getPayslips } from '../../services/payrollService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useAppData } from '../../context/AppDataContext.jsx';
import { money, monthLabel } from '../../utils/format.js';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { announcements, notifications } = useAppData();
  const q = useAsync(async () => {
    let balances = [];
    let slips = [];
    try { balances = await getBalances(user?.employeeId); } catch { balances = []; }
    try { slips = await getPayslips(user?.employeeId); } catch { slips = []; }
    if (!Array.isArray(balances)) balances = [];
    if (!Array.isArray(slips)) slips = [];
    return { balances, slips };
  }, [user?.employeeId]);
  const hours = 31.5;
  return (
    <>
      <PageHeader title={`Good day, ${user?.name?.split(' ')[0] || 'there'}`} subtitle="Your week at a glance" />
      <div className="stack">
        <CheckInWidget />
        <Async query={q}>{({ balances, slips }) => {
          const left = (balances || [])
            .filter((b) => b.type !== 'Unpaid')
            .reduce((s, b) => s + (Number(b.quota) || 0) - (Number(b.used) || 0), 0);
          const lastSlip = slips?.[0];
          return (
            <div className="grid g4 keep2">
              <StatCard label="Hours this week" value={`${hours} / 40`} icon={Timer} hint={<div className="progress" style={{ marginTop: 6, width: 110 }}><i style={{ width: `${(hours / 40) * 100}%` }} /></div>} />
              <StatCard label="Late this month" value="2" icon={Clock} tone="warn" />
              <StatCard label="Leave days left" value={left} icon={CalendarDays} tone="info" />
              <StatCard label="Last payslip" value={lastSlip ? money(lastSlip.net) : '—'} icon={FileText} hint={lastSlip ? monthLabel(lastSlip.month) : 'No payslip yet'} />
            </div>
          );
        }}</Async>
        <div className="grid g2">
          <Card title="Announcements" pad={false}>
            {(announcements || []).filter((a) => a.active).slice(0, 2).map((a) => <AnnouncementCard key={a.id} item={a} />)}
          </Card>
          <Card title="Notifications" pad={false}>
            <ul className="list">
              {(notifications || []).slice(0, 4).map((n) => (
                <li key={n.id}>
                  <span className={`dot ${n.read ? 'read' : ''}`} />
                  <div>
                    <div>{n.text}</div>
                    <div className="muted small">{n.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
