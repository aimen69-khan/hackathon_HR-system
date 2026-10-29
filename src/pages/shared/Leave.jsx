import { useState } from 'react';
import { Check, Plus, Sparkles, X } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import Card from '../../components/cards/Card.jsx';
import Tabs from '../../components/forms/Tabs.jsx';
import Field from '../../components/forms/Field.jsx';
import LeaveForm from '../../components/forms/LeaveForm.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import { AITag } from '../../components/ai/AIChat.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { applyLeave, decideLeave, getBalances, listRequests, smartLeave } from '../../services/leaveService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { fmtDate } from '../../utils/format.js';

function ApprovalCard({ r, onDecide }) {
  const [comment, setComment] = useState('');
  return (
    <div className="card card-pad stack-sm">
      <div className="row between"><div><strong>{r.employee}</strong><div className="muted small">{r.employeeId}</div></div><StatusBadge status={r.status} /></div>
      <div className="row"><span className="badge info">{r.type}</span><span>{fmtDate(r.start)} – {fmtDate(r.end)}</span><span className="muted">· {r.days} day{r.days > 1 ? 's' : ''}</span></div>
      <p>{r.reason}</p>
      {r.comment && r.status !== 'Pending' && <p className="muted small">Comment: {r.comment}</p>}
      {r.status === 'Pending' && <div className="row"><input className="input grow" aria-label="Comment" placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} /><Button size="sm" variant="primary" icon={Check} onClick={() => onDecide(r.id, 'Approved', comment)}>Approve</Button><Button size="sm" icon={X} onClick={() => onDecide(r.id, 'Rejected', comment)}>Reject</Button></div>}
    </div>
  );
}

function SmartLeave({ onParsed }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); try { onParsed(await smartLeave(text)); } finally { setBusy(false); } };
  return (
    <Card title="Smart leave" subtitle="Describe your leave in a sentence" actions={<AITag />}>
      <div className="stack-sm">
        <Field label="What do you need?" as="textarea" placeholder="I need next Monday and Tuesday off for a wedding." value={text} onChange={(e) => setText(e.target.value)} />
        <div><Button variant="primary" icon={Sparkles} loading={busy} disabled={text.trim().length < 5} onClick={go}>Generate Leave Request</Button></div>
      </div>
    </Card>
  );
}

export default function Leave() {
  const { user } = useAuth();
  const toast = useToast();
  const reqs = useAsync(listRequests);
  const bal = useAsync(getBalances);
  const [tab, setTab] = useState('Pending');
  const [form, setForm] = useState(null); // null | {} | prefilled
  const decide = async (id, s, c) => { await decideLeave(id, s, c); toast.success(`Leave request ${s.toLowerCase()}.`); reqs.reload(); };

  if (user.role !== 'employee') return (
    <>
      <PageHeader title="Leave approvals" subtitle="Review requests from your team" />
      <Tabs value={tab} onChange={setTab} tabs={['Pending', 'Approved', 'Rejected']} />
      <Async query={reqs}>{(list) => { const l = list.filter((r) => r.status === tab); return l.length ? <div className="grid g2">{l.map((r) => <ApprovalCard key={r.id} r={r} onDecide={decide} />)}</div> : <div className="card"><EmptyState title={`No ${tab.toLowerCase()} requests`} message="New requests will show up here." /></div>; }}</Async>
    </>
  );

  return (
    <>
      <PageHeader title="My leave" subtitle="Balances, requests and history" actions={<Button variant="primary" icon={Plus} onClick={() => setForm({})}>Apply for leave</Button>} />
      <div className="stack">
        <Async query={bal}>{(list) => <div className="grid g4 keep2">{list.map((b) => (
          <div key={b.type} className="card card-pad"><div className="muted small">{b.type} leave</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{b.type === 'Unpaid' ? `${b.used} taken` : `${b.quota - b.used} left`}</div>
            {b.type !== 'Unpaid' && <><div className="progress" style={{ margin: '8px 0 4px' }}><i style={{ width: `${(b.used / b.quota) * 100}%` }} /></div><div className="muted small">{b.used} of {b.quota} used</div></>}</div>))}</div>}</Async>
        <SmartLeave onParsed={(p) => setForm(p)} />
        <Card title="Leave history" pad={false}><Async query={reqs}>{(list) => (
          <DataTable rows={list.filter((r) => r.employeeId === user.employeeId)} empty={<EmptyState title="No leave requests yet." message="Apply for leave to see it here." />}
            columns={[{ key: 'type', label: 'Type' }, { key: 'start', label: 'From', render: (r) => fmtDate(r.start) }, { key: 'end', label: 'To', render: (r) => fmtDate(r.end) }, { key: 'days', label: 'Days' }, { key: 'reason', label: 'Reason' }, { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> }]} />)}</Async></Card>
      </div>
      {form && bal.data && (
        <Modal title={form.type ? 'Confirm leave request' : 'Apply for leave'} onClose={() => setForm(null)}>
          {form.type && <div className="alert ok" style={{ marginBottom: 14 }}>Generated from your message. Check the details, edit anything, then submit. <AITag /></div>}
          <LeaveForm initial={form} balances={bal.data} onCancel={() => setForm(null)} onSubmit={async (data) => {
            try { await applyLeave({ ...data, employeeId: user.employeeId, employee: user.name }); toast.success('Leave request submitted.'); setForm(null); reqs.reload(); } catch (e) { toast.error(e.message); }
          }} />
        </Modal>)}
    </>
  );
}
