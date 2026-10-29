import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../buttons/Button.jsx';
export default function Pagination({ page, pages, total, pageSize, onPage }) {
  const from = total ? (page - 1) * pageSize + 1 : 0;
  return (
    <div className="pager">
      <span className="muted small">{from}–{Math.min(page * pageSize, total)} of {total}</span>
      <div className="row" style={{ gap: 6 }}>
        <Button size="sm" icon={ChevronLeft} aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} />
        <span className="small">Page {page} of {pages}</span>
        <Button size="sm" icon={ChevronRight} aria-label="Next page" disabled={page >= pages} onClick={() => onPage(page + 1)} />
      </div>
    </div>
  );
}
