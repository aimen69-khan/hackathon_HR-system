import { useState } from 'react';
import { Eye } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import Modal from '../../components/modals/Modal.jsx';
import Button from '../../components/buttons/Button.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import PayslipCard from '../../components/payroll/PayslipCard.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getPayslips } from '../../services/payrollService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { money, monthLabel } from '../../utils/format.js';

export default function Payslips() {
  const { user } = useAuth();
  const q = useAsync(() => getPayslips(user.employeeId), [user.employeeId]);
  const [open, setOpen] = useState(null);
  return (
    <>
      <PageHeader title="My payslips" subtitle="Your last six months" />
      <Async query={q}>{(rows) => (
        <div className="card">
          <DataTable rowKey="month" rows={rows} empty={<EmptyState title="No payslips available" message="Payslips appear here once payroll is finalized." />}
            columns={[{ key: 'month', label: 'Period', render: (r) => monthLabel(r.month) }, { key: 'gross', label: 'Gross', render: (r) => money(r.gross) }, { key: 'deductions', label: 'Deductions', render: (r) => money(r.deductions) }, { key: 'net', label: 'Net', render: (r) => <strong>{money(r.net)}</strong> }, { key: 's', label: 'Status', render: () => <StatusBadge status="Paid" /> }, { key: 'a', label: '', render: (r) => <Button size="sm" icon={Eye} onClick={() => setOpen(r)}>View</Button> }]} />
        </div>
      )}</Async>
      {open && <Modal wide title={`Payslip — ${monthLabel(open.month)}`} onClose={() => setOpen(null)}><PayslipCard slip={open} /></Modal>}
    </>
  );
}
