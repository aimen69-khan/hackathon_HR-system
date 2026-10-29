import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import StatCard from '../../components/cards/StatCard.jsx';
import Card from '../../components/cards/Card.jsx';
import Tabs from '../../components/forms/Tabs.jsx';
import Field from '../../components/forms/Field.jsx';
import SearchBar from '../../components/forms/SearchBar.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import CheckInWidget from '../../components/attendance/CheckInWidget.jsx';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { decideCorrection, getBoard, listCorrections, submitCorrection } from '../../services/attendanceService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { fmtDate, todayIso } from '../../utils/format.js';
import { employees } from '../../data/employees.js';

function CorrectionModal({ onClose, onDone }) {
  const { user } = useAuth();
  const toast = useToast();
  const [v, setV] = useState({ date: todayIso(), reason: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (v.date > todayIso()) return setErr('Pick today or an earlier date.');
    if (v.reason.trim().length < 5) return setErr('Explain what happened in a few words.');
    setBusy(true);
    await submitCorrection({ ...v, employeeId: user.employeeId, employee: user.name });
    toast.success('Correction request submitted.'); onDone(); onClose();
  };
  return (
    <Modal title="Request attendance correction" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button><Button variant="primary" loading={busy} onClick={send}>Submit request</Button></>}>
      <div className="stack">{err && <div className="alert" role="alert">{err}</div>}
        <Field label="Date" type="date" max={todayIso()} value={v.date} onChange={(e) => setV({ ...v, date: e.target.value })} />
        <Field label="Reason" as="textarea" value={v.reason} onChange={(e) => setV({ ...v, reason: e.target.value })} /></div>
    </Modal>
  );
}

function CorrectionRow({ c, canDecide, onDecide }) {
  const [comment, setComment] = useState('');
  return (
    <li style={{ flexDirection: 'column', gap: 8 }}>
      <div className="row between" style={{ width: '100%' }}><div><strong>{c.employee}</strong> <span className="muted">· {fmtDate(c.date)}</span></div><StatusBadge status={c.status} /></div>
      <div>{c.reason}</div>
      {c.comment && c.status !== 'Pending' && <div className="muted small">HR comment: {c.comment}</div>}
      {canDecide && c.status === 'Pending' && (
        <div className="row" style={{ width: '100%' }}>
          <input className="input grow" aria-label="Comment" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <Button size="sm" variant="primary" icon={Check} onClick={() => onDecide(c.id, 'Approved', comment)}>Approve</Button>
          <Button size="sm" icon={X} onClick={() => onDecide(c.id, 'Rejected', comment)}>Reject</Button>
        </div>)}
    </li>
  );
}

export default function Attendance() {
  const { user } = useAuth();
  const toast = useToast();
  const isStaff = user.role !== 'employee';
  const board = useAsync(getBoard);
  const corr = useAsync(listCorrections);
  const [tab, setTab] = useState('board');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [calEmp, setCalEmp] = useState('EMP-1001');
  const [modal, setModal] = useState(false);
  const decide = async (id, s, c) => { await decideCorrection(id, s, c); toast.success(`Correction ${s.toLowerCase()}.`); corr.reload(); };
  const mine = (corr.data || []).filter((c) => c.employeeId === user.employeeId);
  const hours = (r) => (r.hours ? `${r.hours.toFixed(1)}h` : '—');

  if (!isStaff) return (
    <>
      <PageHeader title="My attendance" subtitle="Check in, review your month, ask for fixes" actions={<Button variant="primary" icon={Plus} onClick={() => setModal(true)}>Request correction</Button>} />
      <div className="stack">
        <CheckInWidget />
        <Card title="This month"><AttendanceCalendar seed={5} /></Card>
        <Card title="My correction requests" pad={false}><Async query={corr}>{() => mine.length ? <ul className="list">{mine.map((c) => <CorrectionRow key={c.id} c={c} />)}</ul> : <EmptyState title="No correction requests yet" message="Missed a check-out? Request a correction above." />}</Async></Card>
      </div>
      {modal && <CorrectionModal onClose={() => setModal(false)} onDone={corr.reload} />}
    </>
  );

  return (
    <>
      <PageHeader title="Attendance" subtitle="Today’s board, corrections and calendars" />
      <Async query={board}>{(rows) => {
        const count = (s) => rows.filter((r) => r.status === s).length;
        const shown = rows.filter((r) => (!status || r.status === status) && `${r.name} ${r.id}`.toLowerCase().includes(search.toLowerCase()));
        return (
          <div className="stack">
            <div className="grid g6 keep2">
              <StatCard label="Present" value={count('Present')} /><StatCard label="Late" value={count('Late')} tone="warn" /><StatCard label="Absent" value={count('Absent')} tone="bad" />
              <StatCard label="Half day" value={count('Half day')} tone="info" /><StatCard label="Missing checkout" value={count('Missing checkout')} tone="warn" /><StatCard label="On leave" value={count('On leave')} tone="info" />
            </div>
            <Tabs value={tab} onChange={setTab} tabs={[['board', 'Daily board'], ['corrections', 'Corrections'], ['calendar', 'Calendar']]} />
            {tab === 'board' && (
              <div className="card"><div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder="Search employee" /><FilterDropdown label="All statuses" value={status} onChange={setStatus} options={['Present', 'Late', 'Absent', 'Half day', 'Missing checkout', 'On leave']} /></div>
                <DataTable rows={shown} columns={[{ key: 'name', label: 'Employee', render: (r) => <><strong>{r.name}</strong><div className="muted small">{r.id} · {r.department}</div></> }, { key: 'checkIn', label: 'Check-in', render: (r) => r.checkIn || '—' }, { key: 'checkOut', label: 'Check-out', render: (r) => r.checkOut || '—' }, { key: 'hours', label: 'Hours', render: hours }, { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                  { key: 'a', label: '', render: (r) => <Button size="sm" onClick={() => toast.success(`Reminder sent to ${r.name}.`)}>Remind</Button> }]} /></div>)}
            {tab === 'corrections' && <Card title="Correction requests" pad={false}><Async query={corr}>{(list) => list.length ? <ul className="list">{list.map((c) => <CorrectionRow key={c.id} c={c} canDecide onDecide={decide} />)}</ul> : <EmptyState title="No correction requests" />}</Async></Card>}
            {tab === 'calendar' && <Card title="Attendance calendar" actions={<select className="input" aria-label="Employee" value={calEmp} onChange={(e) => setCalEmp(e.target.value)} style={{ width: 'auto' }}>{employees.slice(0, 20).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select>}><AttendanceCalendar key={calEmp} seed={Number(calEmp.slice(-2))} /></Card>}
          </div>
        );
      }}</Async>
    </>
  );
}
