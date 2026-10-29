import { useState } from 'react';
import { CalendarClock, CalendarOff, ClipboardCheck, Download, RefreshCw, UserCheck, Users } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async } from '../../components/layout/States.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Card from '../../components/cards/Card.jsx';
import ChartCard, { BarC, LineC, PieC } from '../../components/charts/ChartCard.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import Button from '../../components/buttons/Button.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getHrDashboard } from '../../services/dashboardService.js';
import { departments } from '../../data/departments.js';
import { downloadCsv } from '../../utils/csv.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function HRDashboard() {
  const [range, setRange] = useState('30');
  const [department, setDepartment] = useState('');
  const q = useAsync(() => getHrDashboard({ range, department }), [range, department]);
  const toast = useToast();
  return (
    <>
      <PageHeader title="HR dashboard" subtitle="Today’s attendance, leave and approvals" actions={<>
        <select className="input" aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)} style={{ width: 'auto' }}><option value="7">Last 7 days</option><option value="30">Last 14 days</option></select>
        <FilterDropdown label="All departments" value={department} onChange={setDepartment} options={departments.map((d) => d.name)} />
        <Button icon={RefreshCw} onClick={q.reload} aria-label="Refresh" />
        <Button icon={Download} onClick={() => q.data && (downloadCsv('hr-dashboard.csv', q.data.deptStats), toast.success('Exported dashboard data.'))}>Export</Button>
      </>} />
      <Async query={q}>{(d) => (
        <div className="stack">
          <div className="grid g5">
            <StatCard label="Headcount" value={d.kpis.headcount} icon={Users} />
            <StatCard label="Present today" value={d.kpis.present} icon={UserCheck} />
            <StatCard label="On leave" value={d.kpis.onLeave} icon={CalendarOff} tone="info" />
            <StatCard label="Late today" value={d.kpis.late} icon={CalendarClock} tone="warn" />
            <StatCard label="Pending approvals" value={d.kpis.pending} icon={ClipboardCheck} tone="bad" />
          </div>
          <div className="grid g-2-1">
            <ChartCard title="Attendance trend" subtitle="Daily attendance rate"><LineC data={d.trend} keys={['rate']} unit="%" /></ChartCard>
            <ChartCard title="Leave by type"><PieC data={d.leaveByType} /></ChartCard>
          </div>
          <div className="grid g2">
            <ChartCard title="Absenteeism by department" subtitle="% of working days"><BarC data={d.absenteeism} /></ChartCard>
            <Card title="Top 5 late-comers" pad={false}><ul className="list">{d.topLate.map((p, i) => <li key={p.name}><span className="avatar">{i + 1}</span><div className="grow"><div className="strong">{p.name}</div><div className="muted small">{p.department}</div></div><span className="badge warn">{p.count} times</span></li>)}</ul></Card>
          </div>
          <Card title="Department statistics" pad={false}>
            <DataTable rowKey="name" columns={[{ key: 'name', label: 'Department' }, { key: 'headcount', label: 'Headcount' }, { key: 'attendance', label: 'Attendance', render: (r) => `${r.attendance}%` }, { key: 'leave', label: 'On leave', render: (r) => r.leave }]} rows={d.deptStats} />
          </Card>
        </div>
      )}</Async>
    </>
  );
}
