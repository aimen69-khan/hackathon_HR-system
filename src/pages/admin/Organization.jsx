import { useState } from 'react';
import { KeyRound, Pencil, Plus, Power, Trash2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import Tabs from '../../components/forms/Tabs.jsx';
import Card from '../../components/cards/Card.jsx';
import Field from '../../components/forms/Field.jsx';
import SearchBar from '../../components/forms/SearchBar.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getOrganization } from '../../services/dashboardService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { fmtDate } from '../../utils/format.js';
import { departments as deptList } from '../../data/departments.js';

// Generic CRUD list used for departments, designations, leave types, holidays and HR users.
function CrudManager({ noun, initial, columns, fields, toggle = true, extra }) {
  const [rows, setRows] = useState(initial);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // row | {} (new)
  const [removing, setRemoving] = useState(null);
  const [draft, setDraft] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const open = (row) => { setEditing(row); setDraft({ ...Object.fromEntries(fields.map((f) => [f.name, f.options ? f.options[0] : ''])), ...row }); setErrors({}); };
  const save = () => {
    const er = {};
    fields.filter((f) => f.required !== false).forEach((f) => { if (!String(draft[f.name] ?? '').trim()) er[f.name] = `${f.label} is required.`; });
    setErrors(er);
    if (Object.keys(er).length) return;
    setRows((l) => (editing.id ? l.map((r) => (r.id === editing.id ? { ...r, ...draft } : r)) : [{ id: `n${Date.now()}`, active: true, ...draft }, ...l]));
    toast.success(editing.id ? `${noun} updated.` : `${noun} added.`);
    setEditing(null);
  };
  const filtered = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  return (
    <Card pad={false}>
      <div className="toolbar"><SearchBar value={search} onChange={setSearch} placeholder={`Search ${noun.toLowerCase()}s`} /><div className="grow" /><Button variant="primary" icon={Plus} onClick={() => open({})}>Add {noun.toLowerCase()}</Button></div>
      <DataTable rows={filtered} empty={<EmptyState title={`No ${noun.toLowerCase()}s found`} message="Add one to get started." />}
        columns={[...columns, ...(toggle ? [{ key: 'active', label: 'Status', render: (r) => <StatusBadge status={r.active ? 'Active' : 'Inactive'} /> }] : []),
          { key: 'actions', label: '', align: 'right', render: (r) => (
            <div className="row" style={{ justifyContent: 'flex-end', gap: 4, flexWrap: 'nowrap' }}>
              {extra?.(r, toast)}
              <Button size="sm" variant="ghost" icon={Pencil} aria-label="Edit" onClick={() => open(r)} />
              {toggle && <Button size="sm" variant="ghost" icon={Power} aria-label={r.active ? 'Deactivate' : 'Activate'} onClick={() => { setRows((l) => l.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x))); toast.success(`${noun} ${r.active ? 'deactivated' : 'activated'}.`); }} />}
              <Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete" onClick={() => setRemoving(r)} />
            </div>) }]} />
      {editing && (
        <Modal title={editing.id ? `Edit ${noun.toLowerCase()}` : `Add ${noun.toLowerCase()}`} onClose={() => setEditing(null)} footer={<><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="primary" onClick={save}>Save</Button></>}>
          <div className="stack">{fields.map((f) => <Field key={f.name} label={f.label} type={f.type || 'text'} options={f.options} value={draft[f.name] ?? ''} error={errors[f.name]} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} />)}</div>
        </Modal>
      )}
      {removing && <ConfirmDialog danger title={`Delete ${noun.toLowerCase()}?`} message={`“${removing.name}” will be removed. This can’t be undone.`} confirmLabel="Delete" onCancel={() => setRemoving(null)} onConfirm={() => { setRows((l) => l.filter((r) => r.id !== removing.id)); setRemoving(null); toast.success(`${noun} deleted.`); }} />}
    </Card>
  );
}

function CompanySettingsForm({ initial }) {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const save = (e) => { e.preventDefault(); setSaving(true); setTimeout(() => { setSaving(false); toast.success('Company settings saved.'); }, 600); };
  return (
    <Card title="Company settings"><form onSubmit={save}>
      <div className="form-grid">
        <Field label="Company name" className="full" value={v.companyName} onChange={set('companyName')} />
        <Field label="Office start" type="time" value={v.officeStart} onChange={set('officeStart')} />
        <Field label="Office end" type="time" value={v.officeEnd} onChange={set('officeEnd')} />
        <Field label="Grace time (minutes)" type="number" min="0" value={v.graceMinutes} onChange={set('graceMinutes')} />
        <Field label="Weekend" options={['Saturday, Sunday', 'Friday, Saturday', 'Sunday']} value={v.weekend} onChange={set('weekend')} />
        <Field label="Office location" className="full" value={v.officeLocation} onChange={set('officeLocation')} />
        <Field label="Location radius (meters)" type="number" min="0" value={v.radiusMeters} onChange={set('radiusMeters')} hint="Employees must be within this distance to check in." />
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 18 }}><Button variant="primary" type="submit" loading={saving}>Save settings</Button></div>
    </form></Card>
  );
}

export default function Organization() {
  const q = useAsync(getOrganization);
  const [tab, setTab] = useState('company');
  const deptNames = deptList.map((d) => d.name);
  return (
    <>
      <PageHeader title="Organization" subtitle="Company rules, structure and HR logins" />
      <Tabs value={tab} onChange={setTab} tabs={[['company', 'Company'], ['departments', 'Departments'], ['designations', 'Designations'], ['leave', 'Leave types'], ['holidays', 'Public holidays'], ['hr', 'HR users']]} />
      <Async query={q}>{(o) => ({
        company: <CompanySettingsForm initial={o.companySettings} />,
        departments: <CrudManager noun="Department" initial={o.departments} columns={[{ key: 'name', label: 'Name' }, { key: 'head', label: 'Head' }]} fields={[{ name: 'name', label: 'Department name' }, { name: 'head', label: 'Department head' }]} />,
        designations: <CrudManager noun="Designation" initial={o.designations} columns={[{ key: 'name', label: 'Title' }, { key: 'department', label: 'Department' }]} fields={[{ name: 'name', label: 'Designation title' }, { name: 'department', label: 'Department', options: deptNames }]} />,
        leave: <CrudManager noun="Leave type" initial={o.leaveTypes} columns={[{ key: 'name', label: 'Type' }, { key: 'quota', label: 'Annual quota (days)' }, { key: 'paid', label: 'Pay' }]} fields={[{ name: 'name', label: 'Leave type' }, { name: 'quota', label: 'Annual quota (days)', type: 'number', required: false }, { name: 'paid', label: 'Pay', options: ['Paid', 'Unpaid'] }]} />,
        holidays: <CrudManager noun="Holiday" toggle={false} initial={o.holidays} columns={[{ key: 'name', label: 'Holiday' }, { key: 'date', label: 'Date', render: (r) => fmtDate(r.date) }]} fields={[{ name: 'name', label: 'Holiday name' }, { name: 'date', label: 'Date', type: 'date' }]} />,
        hr: <CrudManager noun="HR user" initial={o.hrUsers} columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Login email' }]} fields={[{ name: 'name', label: 'Full name' }, { name: 'email', label: 'Login email', type: 'email' }]} extra={(r, toast) => <Button size="sm" variant="ghost" icon={KeyRound} aria-label="Reset login" onClick={() => toast.success(`Reset link sent to ${r.email}.`)} />} />,
      }[tab])}</Async>
    </>
  );
}
