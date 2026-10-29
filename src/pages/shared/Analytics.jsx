import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async } from '../../components/layout/States.jsx';
import ChartCard, { BarC, LineC, PieC } from '../../components/charts/ChartCard.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getAnalytics } from '../../services/dashboardService.js';
import { attendanceTrend } from '../../data/attendance.js';
import { departments } from '../../data/departments.js';

export default function Analytics() {
  const q = useAsync(getAnalytics);
  const [range, setRange] = useState('14');
  const [dept, setDept] = useState('');
  const only = (list) => (dept ? list.filter((x) => x.name === dept) : list);
  return (
    <>
      <PageHeader title="Analytics" subtitle="Trends across attendance, people and cost" actions={<>
        <select className="input" aria-label="Date range" style={{ width: 'auto' }} value={range} onChange={(e) => setRange(e.target.value)}><option value="7">Last 7 days</option><option value="14">Last 14 days</option></select>
        <FilterDropdown label="All departments" value={dept} onChange={setDept} options={departments.map((d) => d.name)} /></>} />
      <Async query={q}>{(d) => (
        <div className="grid g2">
          <ChartCard title="Attendance trend"><LineC data={attendanceTrend.slice(-Number(range))} keys={['rate']} unit="%" /></ChartCard>
          <ChartCard title="Headcount by department"><BarC data={only(d.headcountByDept)} /></ChartCard>
          <ChartCard title="Payroll cost by department"><BarC data={only(d.payrollByDept)} format={(n) => `${Math.round(n / 1000)}k`} /></ChartCard>
          <ChartCard title="Leave utilization" subtitle="Days used per department"><BarC data={only(d.leaveUtilization)} keys={['Annual', 'Sick', 'Casual']} stacked /></ChartCard>
          <ChartCard title="Absenteeism" subtitle="% of working days"><BarC data={only(d.absenteeismByDept)} /></ChartCard>
          <ChartCard title="Late employees" subtitle="Times late this month"><BarC data={d.topLate.filter((x) => !dept || x.department === dept)} x="name" keys={['count']} /></ChartCard>
          <ChartCard title="Gender distribution"><PieC data={d.genderSplit} /></ChartCard>
          <ChartCard title="Tenure"><BarC data={d.tenureBuckets} /></ChartCard>
        </div>
      )}</Async>
    </>
  );
}
