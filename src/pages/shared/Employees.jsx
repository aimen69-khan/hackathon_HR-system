import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileUp, Plus, Upload } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import SearchBar from '../../components/forms/SearchBar.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import DataTable from '../../components/tables/DataTable.jsx';
import StatusBadge from '../../components/badges/StatusBadge.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import EmployeeForm from '../../components/forms/EmployeeForm.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { commitImport, createEmployee, importDryRun, listEmployees } from '../../services/employeeService.js';
import { departments, designations } from '../../data/departments.js';
import { csvSample } from '../../data/employees.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { downloadCsv, download } from '../../utils/csv.js';
import { fmtDate, initials, money } from '../../utils/format.js';

function ImportModal({ onClose, onDone }) {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const input = useRef(null);
  const toast = useToast();
  const readFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) return toast.error('Choose a .csv file.');
    setFileName(file.name); setRows(null);
    file.text().then(setText);
  };
  const dry = async () => { setBusy(true); try { setRows(await importDryRun(text)); } finally { setBusy(false); } };
  const valid = rows?.filter((r) => !r.errors.length).length || 0;
  const commit = async () => { setBusy(true); const n = await commitImport(rows); toast.success(`${n} employees imported.`); onDone(); onClose(); };
  return (
    <Modal wide title="Import employees from CSV" onClose={onClose} footer={<><Button onClick={onClose}>Cancel</Button>{!rows ? <Button variant="primary" loading={busy} disabled={!text} onClick={dry}>Run dry check</Button> : <Button variant="primary" loading={busy} disabled={!valid} onClick={commit}>Import {valid} valid rows</Button>}</>}>
      <div className="stack">
        <div className={`drop-zone ${over ? 'over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); readFile(e.dataTransfer.files[0]); }}>
          <FileUp size={28} /><p style={{ margin: '8px 0' }}>{fileName || 'Drag and drop a CSV here'}</p>
          <div className="row" style={{ justifyContent: 'center' }}><Button onClick={() => input.current.click()}>Choose file</Button><Button variant="ghost" onClick={() => { setText(csvSample); setFileName('sample.csv'); setRows(null); }}>Use sample data</Button><Button variant="ghost" icon={Download} onClick={() => download('employee-template.csv', csvSample.split('\n')[0] + '\n')}>Template</Button></div>
          <input ref={input} type="file" accept=".csv" hidden onChange={(e) => readFile(e.target.files[0])} />
        </div>
        {rows && (
          <>
            <div className={`alert ${valid === rows.length ? 'ok' : 'info'}`}>{valid} of {rows.length} rows are valid. Nothing is saved until you import.</div>
            <div className="table-wrap"><table className="table"><thead><tr><th>Line</th><th>Code</th><th>Name</th><th>Department</th><th>Result</th></tr></thead>
              <tbody>{rows.map((r) => <tr key={r.line}><td>{r.line}</td><td>{r.code}</td><td>{r.name || '—'}</td><td>{r.department}</td><td>{r.errors.length ? <><StatusBadge status="Invalid" /> <span className="small" style={{ color: 'var(--bad)' }}>{r.errors.join(', ')}</span></> : <StatusBadge status="Valid" />}</td></tr>)}</tbody></table></div>
          </>
        )}
      </div>
    </Modal>
  );
}

export default function Employees() {
  const { user } = useAuth();
  const toast = useToast();
  const q = useAsync(listEmployees);
  const [f, setF] = useState({ search: '', department: '', designation: '', status: '' });
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v }));
  const rows = useMemo(() => (q.data || []).filter((e) => (!f.department || e.department === f.department) && (!f.designation || e.designation === f.designation) && (!f.status || e.status === f.status) && `${e.name} ${e.id} ${e.email}`.toLowerCase().includes(f.search.toLowerCase())), [q.data, f]);
  const add = async (data) => { try { await createEmployee(data); toast.success(`${data.name} was added.`); setAdding(false); q.reload(); } catch (e) { toast.error(e.message); } };
  return (
    <>
      <PageHeader title="Employees" subtitle="Everyone in the company" actions={<>
        <Button icon={Upload} onClick={() => setImporting(true)}>Import CSV</Button>
        <Button icon={Download} onClick={() => { downloadCsv('employees.csv', rows.map(({ id, name, email, department, designation, status, joiningDate, salary }) => ({ id, name, email, department, designation, status, joiningDate, salary }))); toast.success(`Exported ${rows.length} employees.`); }}>Export CSV</Button>
        <Button variant="primary" icon={Plus} onClick={() => setAdding(true)}>Add employee</Button></>} />
      <Async query={q}>{() => (
        <div className="card">
          <div className="toolbar"><SearchBar value={f.search} onChange={set('search')} placeholder="Search name, ID or email" />
            <FilterDropdown label="All departments" value={f.department} onChange={set('department')} options={departments.map((d) => d.name)} />
            <FilterDropdown label="All designations" value={f.designation} onChange={set('designation')} options={designations.map((d) => d.name)} />
            <FilterDropdown label="All statuses" value={f.status} onChange={set('status')} options={['Active', 'On probation', 'Resigned']} /></div>
          <DataTable rows={rows} empty={<EmptyState title="No employees found." message="Try a different search or clear the filters." />} columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name', render: (e) => <Link to={`/${user.role}/employees/${e.id}`} className="row" style={{ flexWrap: 'nowrap' }}><span className="avatar">{initials(e.name)}</span><strong>{e.name}</strong></Link> },
            { key: 'email', label: 'Email' }, { key: 'department', label: 'Department' }, { key: 'designation', label: 'Designation' },
            { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
            { key: 'joiningDate', label: 'Joined', render: (e) => fmtDate(e.joiningDate) }, { key: 'salary', label: 'Salary', render: (e) => money(e.salary) },
            { key: 'a', label: '', render: (e) => <Link className="btn sm" to={`/${user.role}/employees/${e.id}`}>View</Link> }]} />
        </div>
      )}</Async>
      {adding && <Modal wide title="Add employee" onClose={() => setAdding(false)}><EmployeeForm onSubmit={add} onCancel={() => setAdding(false)} /></Modal>}
      {importing && <ImportModal onClose={() => setImporting(false)} onDone={q.reload} />}
    </>
  );
}
