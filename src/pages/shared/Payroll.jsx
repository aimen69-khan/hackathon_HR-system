import { useState } from 'react';
import { Eye, FilePlus2, Lock, ClipboardCheck } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import Tabs from '../../components/forms/Tabs.jsx';
import Card from '../../components/cards/Card.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx';
import PayslipCard from '../../components/payroll/PayslipCard.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getPayroll, setRunStatus } from '../../services/payrollService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { departments } from '../../data/departments.js';
import { currentMonth, money, monthLabel } from '../../utils/format.js';

export default function Payroll() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('monthly');
  const [month, setMonth] = useState(currentMonth());
  const [dept, setDept] = useState('');
  const [slip, setSlip] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const q = useAsync(() => getPayroll(month, dept), [month, dept]);
  const [selected, setSelected] = useState(null);

  const move = async (status, msg) => { setBusy(true); await setRunStatus(month, status); setBusy(false); setConfirm(false); toast.success(msg); q.reload(); };
  const toSlip = (r) => ({ month, employee: { id: r.id, name: r.name, department: r.department, designation: r.designation }, ...r });

  return (
    <>
      <PageHeader title="Payroll" subtitle="Monthly runs and salary structure" />
      <Tabs value={tab} onChange={setTab} tabs={[['monthly', 'Monthly payroll'], ['structure', 'Salary structure']]} />
      <Async query={q}>{({ rows, status }) => {
        const total = (k) => rows.reduce((s, r) => s + r[k], 0);
        if (tab === 'structure') {
          const r = rows.find((x) => x.id === selected) || rows[0];
          if (!r) return <div className="card"><EmptyState title="No employees" /></div>;
          return (
            <Card title="Salary structure" actions={<select className="input" aria-label="Employee" style={{ width: 'auto' }} value={r.id} onChange={(e) => setSelected(e.target.value)}>{rows.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>}>
              <dl className="kv" style={{ margin: 0 }}>{[['Basic salary', r.basic], ['House rent allowance', r.hra], ['Medical allowance', r.medical], ['Other allowances', r.other], ['Gross salary', r.gross], ['Deductions (PF + tax)', r.deductions], ['Net salary', r.net]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{money(v)}</dd></div>)}</dl>
            </Card>
          );
        }
        return (
          <div className="card">
            <div className="toolbar">
              <input className="input" type="month" aria-label="Month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} />
              <FilterDropdown label="All departments" value={dept} onChange={setDept} options={departments.map((d) => d.name)} />
              <StatusBadge status={status === 'Not created' ? 'Pending' : status} /><span className="muted small">{status === 'Not created' ? 'No run yet' : monthLabel(month)}</span>
              <div className="grow" />
              {status === 'Not created' && <Button variant="primary" icon={FilePlus2} loading={busy} onClick={() => move('Draft', 'Payroll created as draft.')}>Create Payroll</Button>}
              {status === 'Draft' && <Button variant="primary" icon={ClipboardCheck} loading={busy} onClick={() => move('Reviewed', 'Payroll marked as reviewed.')}>Review</Button>}
              {status === 'Reviewed' && user.role === 'admin' && <Button variant="primary" icon={Lock} onClick={() => setConfirm(true)}>Finalize</Button>}
              {status === 'Reviewed' && user.role !== 'admin' && <span className="muted small">Waiting for an admin to finalize</span>}
            </div>
            {status === 'Not created' ? <EmptyState title="Payroll hasn’t been created for this month" message="Create the run to generate salaries for active employees." /> : (
              <>
                <DataTable rows={rows} columns={[{ key: 'name', label: 'Employee', render: (r) => <><strong>{r.name}</strong><div className="muted small">{r.department}</div></> }, { key: 'gross', label: 'Gross', align: 'right', render: (r) => money(r.gross) }, { key: 'deductions', label: 'Deductions', align: 'right', render: (r) => money(r.pf) }, { key: 'tax', label: 'Tax', align: 'right', render: (r) => money(r.tax) }, { key: 'net', label: 'Net', align: 'right', render: (r) => <strong>{money(r.net)}</strong> }, { key: 's', label: 'Status', render: () => <StatusBadge status={status} /> }, { key: 'a', label: '', render: (r) => <Button size="sm" icon={Eye} aria-label="View payslip" onClick={() => setSlip(toSlip(r))} /> }]} />
                <div className="pager"><span className="muted">Totals for {rows.length} employees</span><span>Gross <strong>{money(total('gross'))}</strong> · Net <strong>{money(total('net'))}</strong></span></div>
              </>)}
          </div>
        );
      }}</Async>
      {confirm && <ConfirmDialog title="Finalize payroll?" message={`${monthLabel(month)} payroll will be locked and payslips published to employees.`} confirmLabel="Finalize" onCancel={() => setConfirm(false)} onConfirm={() => move('Finalized', 'Payroll finalized.')} />}
      {slip && <Modal wide title={`Payslip — ${slip.employee.name}`} onClose={() => setSlip(null)}><PayslipCard slip={slip} /></Modal>}
    </>
  );
}
