import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import { monthStatuses } from '../../data/attendance.js';

const LABEL = { Present: 'Present', Late: 'Late', Absent: 'Absent', Half: 'Half day', Leave: 'Leave', Missing: 'No checkout' };
const SWATCH = { Present: 'var(--ok-soft)', Late: 'var(--warn-soft)', Absent: 'var(--bad-soft)', Half: 'var(--info-soft)', Leave: 'var(--brand-soft)', Missing: 'var(--warn-soft)' };

export default function AttendanceCalendar({ seed = 1 }) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const statuses = useMemo(() => monthStatuses(cursor.y, cursor.m, seed), [cursor, seed]);
  const lead = new Date(cursor.y, cursor.m, 1).getDay();
  const days = Object.keys(statuses).map(Number);
  const move = (n) => setCursor((c) => { const d = new Date(c.y, c.m + n, 1); return { y: d.getFullYear(), m: d.getMonth() }; });
  return (
    <div className="stack-sm">
      <div className="row between">
        <strong>{new Date(cursor.y, cursor.m).toLocaleDateString('en', { month: 'long', year: 'numeric' })}</strong>
        <div className="row" style={{ gap: 6 }}><Button size="sm" icon={ChevronLeft} aria-label="Previous month" onClick={() => move(-1)} /><Button size="sm" icon={ChevronRight} aria-label="Next month" onClick={() => move(1)} /></div>
      </div>
      <div className="cal">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="h">{d}</div>)}
        {Array.from({ length: lead }, (_, i) => <div key={`b${i}`} />)}
        {days.map((d) => <div key={d} className={`d ${statuses[d]}`} title={LABEL[statuses[d]] || ''}><span>{d}</span><small>{LABEL[statuses[d]]}</small></div>)}
      </div>
      <div className="legend">{Object.entries(LABEL).map(([k, v]) => <span key={k}><i style={{ background: SWATCH[k] }} />{v}</span>)}</div>
    </div>
  );
}
