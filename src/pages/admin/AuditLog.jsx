import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { Async, EmptyState } from '../../components/layout/States.jsx';
import SearchBar from '../../components/forms/SearchBar.jsx';
import FilterDropdown from '../../components/forms/FilterDropdown.jsx';
import Pagination from '../../components/tables/Pagination.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { getAuditLog } from '../../services/dashboardService.js';
import { fmtDateTime, isoDate } from '../../utils/format.js';

const PAGE = 6;
export default function AuditLog() {
  const q = useAsync(getAuditLog);
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(1);
  return (
    <>
      <PageHeader title="Audit log" subtitle="Who changed what, and when" />
      <Async query={q}>{(all) => {
        const rows = all.filter((r) => (!action || r.action === action) && (!from || isoDate(r.at) >= from) && (!to || isoDate(r.at) <= to) && `${r.actor} ${r.entity}`.toLowerCase().includes(search.toLowerCase()));
        const pages = Math.max(1, Math.ceil(rows.length / PAGE));
        const p = Math.min(page, pages);
        return (
          <div className="card">
            <div className="toolbar"><SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search actor or entity" />
              <FilterDropdown label="All actions" value={action} onChange={(v) => { setAction(v); setPage(1); }} options={[...new Set(all.map((r) => r.action))]} />
              <input className="input" type="date" aria-label="From date" value={from} onChange={(e) => setFrom(e.target.value)} /><input className="input" type="date" aria-label="To date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
            {!rows.length ? <EmptyState title="No audit entries" message="Try widening the date range or clearing filters." /> : (
              <div className="table-wrap"><table className="table">
                <thead><tr><th /><th>Actor</th><th>Action</th><th>Entity</th><th>Date / time</th></tr></thead>
                <tbody>{rows.slice((p - 1) * PAGE, p * PAGE).map((r) => (
                  <Fragment key={r.id}>
                    <tr><td style={{ width: 40 }}><button className="btn ghost sm icon" aria-label="Toggle details" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>{open === r.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button></td><td>{r.actor}</td><td><span className="badge info">{r.action}</span></td><td>{r.entity}</td><td>{fmtDateTime(r.at)}</td></tr>
                    {open === r.id && <tr><td /><td colSpan={4}><div className="grid g2" style={{ padding: '4px 0' }}><div><div className="muted small">Before</div><pre className="json">{JSON.stringify(r.before, null, 2)}</pre></div><div><div className="muted small">After</div><pre className="json">{JSON.stringify(r.after, null, 2)}</pre></div></div></td></tr>}
                  </Fragment>))}</tbody>
              </table></div>)}
            {rows.length > PAGE && <Pagination page={p} pages={pages} total={rows.length} pageSize={PAGE} onPage={setPage} />}
          </div>
        );
      }}</Async>
    </>
  );
}
