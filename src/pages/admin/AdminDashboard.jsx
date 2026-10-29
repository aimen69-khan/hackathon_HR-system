import { CalendarCheck, TrendingDown, Users, Wallet } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async } from '../../components/layout/States.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Card from '../../components/cards/Card.jsx';
import AnnouncementCard from '../../components/cards/AnnouncementCard.jsx';
import ChartCard, { BarC, PieC } from '../../components/charts/ChartCard.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getAdminDashboard } from '../../services/dashboardService.js';
import { useAppData } from '../../context/AppDataContext.jsx';
import { money } from '../../utils/format.js';

export default function AdminDashboard() {
  const q = useAsync(getAdminDashboard);
  const { announcements } = useAppData();
  const k = (n) => `${Math.round(n / 1000)}k`;
  return (
    <>
      <PageHeader title="Company overview" subtitle="Headcount, payroll and attendance across Northwind Technologies" />
      <Async query={q}>{(d) => (
        <div className="stack">
          <div className="grid g4 keep2">
            <StatCard label="Total headcount" value={d.headcountByDept.reduce((s, x) => s + x.value, 0)} icon={Users} delta={d.adminKpis.headcountDelta} />
            <StatCard label="Attrition (12 mo)" value={`${d.adminKpis.attrition}%`} icon={TrendingDown} tone="warn" delta={d.adminKpis.attritionDelta} />
            <StatCard label="Monthly payroll" value={money(d.totalPayroll)} icon={Wallet} tone="info" delta={d.adminKpis.payrollDelta} />
            <StatCard label="Average salary" value={money(d.avgSalary)} icon={CalendarCheck} hint={`Avg tenure ${d.avgTenure} yrs`} />
          </div>
          <div className="grid g2">
            <ChartCard title="Headcount by department"><BarC data={d.headcountByDept} /></ChartCard>
            <ChartCard title="Payroll cost by department" subtitle="Gross, per month"><BarC data={d.payrollByDept} format={k} /></ChartCard>
          </div>
          <div className="grid g3">
            <ChartCard title="Gender distribution"><PieC data={d.genderSplit} /></ChartCard>
            <ChartCard title="Tenure" subtitle={`Average ${d.avgTenure} years`}><BarC data={d.tenureBuckets} /></ChartCard>
            <ChartCard title="Attendance today"><PieC data={d.attendanceOverview} /></ChartCard>
          </div>
          <div className="grid g2">
            <Card title="Recent activity" pad={false}><ul className="list">{d.activityFeed.map((a) => <li key={a.id}><span className="dot" /><div><div>{a.text}</div><div className="muted small">{a.time}</div></div></li>)}</ul></Card>
            <Card title="Announcements" pad={false}>{announcements.filter((a) => a.active).slice(0, 3).map((a) => <AnnouncementCard key={a.id} item={a} />)}</Card>
          </div>
        </div>
      )}</Async>
    </>
  );
}
