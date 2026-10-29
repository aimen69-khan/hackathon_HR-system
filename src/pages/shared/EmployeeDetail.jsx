import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import Tabs from '../../components/forms/Tabs.jsx';
import Card from '../../components/cards/Card.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import PayslipCard from '../../components/payroll/PayslipCard.jsx';
import Modal from '../../components/modals/Modal.jsx';
import Button from '../../components/buttons/Button.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { listEmployees } from '../../services/employeeService.js';
import { listRequests } from '../../services/leaveService.js';
import { getPayslips } from '../../services/payrollService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { computePay } from '../../data/payroll.js';
import { fmtDate, initials, money, monthLabel } from '../../utils/format.js';

const KV = ({ items }) => (
  <dl className="kv" style={{ margin: 0 }}>
    {items.map(([k, v]) => (
      <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>
    ))}
  </dl>
);

function syntheticFromUser(user) {
  return {
    id: user.employeeId || user.employeeCode || user.id || 'SELF',
    code: user.employeeCode || user.employeeId || 'SELF',
    name: user.name || 'Employee',
    email: user.email || '',
    phone: '',
    address: '',
    department: user.department || 'Engineering',
    designation: 'Employee',
    status: 'Active',
    joiningDate: new Date().toISOString().slice(0, 10),
    salary: 100000,
    gender: '',
    employmentType: 'Full-time',
    manager: '',
  };
}

export default function EmployeeDetail({ self }) {
  const { user } = useAuth();
  const params = useParams();
  const id = self ? (user?.employeeId || user?.employeeCode || user?.id) : params.id;

  const q = useAsync(async () => {
    let emps = [];
    try {
      emps = await listEmployees();
    } catch {
      emps = [];
    }
    if (!Array.isArray(emps)) emps = [];

    let emp =
      emps.find((e) => e.id === id) ||
      emps.find((e) => e.code === id) ||
      emps.find((e) => String(e._id) === String(id)) ||
      (user?.email ? emps.find((e) => e.email && e.email.toLowerCase() === user.email.toLowerCase()) : null);

    if (!emp && self && user) emp = syntheticFromUser(user);
    if (!emp) throw new Error('Employee not found');

    let leave = [];
    let slips = [];
    try { leave = await listRequests(); } catch { leave = []; }
    try { slips = await getPayslips(emp.id); } catch { slips = []; }
    if (!Array.isArray(leave)) leave = [];
    if (!Array.isArray(slips)) slips = [];
    return { emp, leave, slips };
  }, [id, self, user?.email, user?.employeeId]);

  const [tab, setTab] = useState('personal');
  const [slip, setSlip] = useState(null);

  return (
    <Async query={q}>
      {({ emp, leave, slips }) => {
        if (!emp) {
          return (
            <div className="card">
              <EmptyState title="Employee not found" action={<Link className="btn" to={`/${user.role}/dashboard`}>Back</Link>} />
            </div>
          );
        }
        const pay = computePay(emp.salary || 0);
        const history = (leave || []).filter(
          (r) => r.employeeId === emp.id || r.employeeId === emp.code || r.employee === emp.name
        );
        const seed = Number(String(emp.id).replace(/\D/g, '').slice(-2)) || 5;
        return (
          <>
            {!self && (
              <Link to={`/${user.role}/employees`} className="row small" style={{ marginBottom: 8 }}>
                <ArrowLeft size={14} /> Back to employees
              </Link>
            )}
            <PageHeader title={emp.name} subtitle={`${emp.id} · ${emp.department} · ${emp.designation}`} actions={<StatusBadge status={emp.status || 'Active'} />} />
            <div className="row" style={{ marginBottom: 16, gap: 12 }}>
              <span className="avatar" style={{ width: 48, height: 48, fontSize: 16 }}>{initials(emp.name)}</span>
              <div>
                <div className="strong">{emp.name}</div>
                <div className="muted small">{emp.email}</div>
              </div>
            </div>
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                ['personal', 'Personal'],
                ['job', 'Job'],
                ['attendance', 'Attendance'],
                ['leave', 'Leave history'],
                ['salary', 'Salary'],
                ['payslips', 'Payslips'],
                ['activity', 'Activity'],
              ]}
            />
            {tab === 'personal' && (
              <Card title="Personal information">
                <KV items={[['Full name', emp.name], ['Gender', emp.gender], ['Email', emp.email], ['Phone', emp.phone], ['Address', emp.address]]} />
              </Card>
            )}
            {tab === 'job' && (
              <Card title="Job information">
                <KV items={[['Department', emp.department], ['Designation', emp.designation], ['Joining date', fmtDate(emp.joiningDate)], ['Status', emp.status], ['Employment type', emp.employmentType], ['Reports to', emp.manager]]} />
              </Card>
            )}
            {tab === 'attendance' && <Card title="Attendance"><AttendanceCalendar seed={seed} /></Card>}
            {tab === 'leave' && (
              <Card title="Leave history" pad={false}>
                <DataTable empty={<EmptyState title="No leave requests yet." />} rows={history} columns={[
                  { key: 'type', label: 'Type' },
                  { key: 'start', label: 'From', render: (r) => fmtDate(r.start) },
                  { key: 'end', label: 'To', render: (r) => fmtDate(r.end) },
                  { key: 'days', label: 'Days' },
                  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                ]} />
              </Card>
            )}
            {tab === 'salary' && (
              <Card title="Salary structure">
                <KV items={[['Basic salary', money(pay.basic)], ['House rent allowance', money(pay.hra)], ['Medical allowance', money(pay.medical)], ['Other allowances', money(pay.other)], ['Gross salary', money(pay.gross)], ['Deductions', money(pay.deductions)], ['Net salary', money(pay.net)]]} />
              </Card>
            )}
            {tab === 'payslips' && (
              <Card title="Payslips" pad={false}>
                <DataTable rowKey="month" rows={slips} empty={<EmptyState title="No payslips yet." />} columns={[
                  { key: 'month', label: 'Period', render: (r) => monthLabel(r.month) },
                  { key: 'net', label: 'Net', render: (r) => money(r.net) },
                  { key: 'a', label: '', render: (r) => <Button size="sm" onClick={() => setSlip(r)}>View</Button> },
                ]} />
              </Card>
            )}
            {tab === 'activity' && (
              <Card title="Activity" pad={false}>
                <ul className="list">
                  {[['Joined the company', emp.joiningDate], ['Profile updated', new Date().toISOString().slice(0, 10)]].map(([t, d]) => (
                    <li key={t}><span className="dot" /><div><div>{t}</div><div className="muted small">{fmtDate(d)}</div></div></li>
                  ))}
                </ul>
              </Card>
            )}
            {slip && <Modal wide title={`Payslip — ${monthLabel(slip.month)}`} onClose={() => setSlip(null)}><PayslipCard slip={slip} /></Modal>}
          </>
        );
      }}
    </Async>
  );
}
