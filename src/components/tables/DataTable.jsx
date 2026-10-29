import { useEffect, useState } from 'react';
import Pagination from './Pagination.jsx';
import { EmptyState } from '../layout/States.jsx';

// columns: [{ key, label, render?(row), align? }]
export default function DataTable({ columns, rows, pageSize = 8, empty, rowKey = 'id' }) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => { if (page > pages) setPage(1); }, [pages, page]);
  if (!rows.length) return empty || <EmptyState title="No results" message="Try changing your search or filters." />;
  const slice = rows.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead><tr>{columns.map((c) => <th key={c.key} className={c.align === 'right' ? 'right' : ''}>{c.label}</th>)}</tr></thead>
          <tbody>{slice.map((r) => <tr key={r[rowKey]}>{columns.map((c) => <td key={c.key} className={c.align === 'right' ? 'right' : ''}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {rows.length > pageSize && <Pagination page={page} pages={pages} total={rows.length} pageSize={pageSize} onPage={setPage} />}
    </>
  );
}
