import { Megaphone } from 'lucide-react';
import { fmtDate } from '../../utils/format.js';
export default function AnnouncementCard({ item, actions }) {
  return (
    <article className="announce">
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="row" style={{ gap: 8 }}><Megaphone size={16} color="var(--accent)" /><h3>{item.title}</h3>{!item.active && <span className="badge">Inactive</span>}</div>
        {actions}
      </div>
      <p style={{ margin: '6px 0' }}>{item.body}</p>
      <p className="muted small">{item.author} · {fmtDate(item.date)} · {item.audience}</p>
    </article>
  );
}
