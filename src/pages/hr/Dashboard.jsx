import { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import Card from '../../components/cards/Card.jsx';
import Badge from '../../components/badges/Badge.jsx';
import StatKpi from '../../components/cards/StatKpi.jsx';
import AISummary from '../../components/ai/AISummary.jsx';
import LineChart from '../../components/charts/LineChart.jsx';
import BarChart from '../../components/charts/BarChart.jsx';
import PieChart from '../../components/charts/PieChart.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { listEmployees, getAttendanceBoard } from '../../services/employeeService.js';
import { listRequests as listLeaveRequests } from '../../services/leaveService.js';
import { fmtDate, money } from '../../utils/format.js';

export default function HRDashboard() {
  const q = useAsync(async () => {
    try {
      const [board, emps, leave] = await Promise.all([
        getAttendanceBoard(),
        listEmployees(),
        listLeaveRequests()
      ]);
      
      const today = board?.filter(a => !a.checkOut).length || 0;
      const absent = board?.filter(a => !a.checkIn).length || 0;
      const pending = leave?.filter(l => l.status === 'pending').length || 0;
      
      // Calculate department-wise stats
      const deptStats = {};
      emps?.forEach(e => {
        if (!deptStats[e.department]) deptStats[e.department] = 0;
        deptStats[e.department]++;
      });

      return { board, emps, leave, today, absent, pending, deptStats };
    } catch (e) {
      console.error('Dashboard error:', e);
      throw e;
    }
  }, []);

  return (
    <Async query={q} fallback={<div className="card"><EmptyState title="Loading dashboard..." /></div>}>
      {({ board, emps, leave, today, absent, pending, deptStats }) => (
        <>
          <PageHeader title="HR Dashboard" subtitle="Attendance, leave & team overview" />
          
          <AISummary role="hr" />
          
          <div className="grid">
            <StatKpi label="Present today" value={today} color="good" />
            <StatKpi label="Absent today" value={absent} color="bad" />
            <StatKpi label="Pending leave" value={pending} color="warn" />
            <StatKpi label="Total employees" value={emps?.length || 0} color="info" />
          </div>

          <div className="grid-2">
            <Card title="Attendance trend (14 days)">
              <LineChart data={[
                { day: 'Mon', present: 38, absent: 6 },
                { day: 'Tue', present: 39, absent: 5 },
                { day: 'Wed', present: 37, absent: 7 },
                { day: 'Thu', present: 40, absent: 4 },
                { day: 'Fri', present: 36, absent: 8 },
                { day: 'Sat', present: 32, absent: 12 },
                { day: 'Sun', present: 30, absent: 14 }
              ]} xKey="day" yKey1="present" yKey2="absent" />
            </Card>

            <Card title="Leave requests by type">
              <BarChart data={[
                { type: 'Casual', count: 12 },
                { type: 'Sick', count: 8 },
                { type: 'Annual', count: 5 },
                { type: 'Maternity', count: 1 }
              ]} xKey="type" yKey="count" />
            </Card>
          </div>

          <div className="grid-2">
            <Card title="Employees by department">
              <PieChart data={Object.entries(deptStats).map(([name, value]) => ({ name, value }))} />
            </Card>

            <Card title="Top late-comers (this month)">
              <DataTable rows={[
                { name: 'Talha Khan', late: 6, dept: 'Engineering' },
                { name: 'Ayesha Raza', late: 4, dept: 'Sales' },
                { name: 'Bilal Ahmed', late: 3, dept: 'Support' }
              ]} columns={[
                { key: 'name', label: 'Name' },
                { key: 'late', label: 'Times late' },
                { key: 'dept', label: 'Department' }
              ]} />
            </Card>
          </div>

          <Card title="Pending approvals" pad={false}>
            <DataTable rows={leave?.filter(l => l.status === 'pending').slice(0, 5) || []} columns={[
              { key: 'employeeId', label: 'Employee' },
              { key: 'type', label: 'Type' },
              { key: 'start', label: 'From', render: r => fmtDate(r.start) },
              { key: 'end', label: 'To', render: r => fmtDate(r.end) },
              { key: 'days', label: 'Days' }
            ]} empty={<EmptyState title="No pending approvals" />} />
          </Card>
        </>
      )}
    </Async>
  );
}
