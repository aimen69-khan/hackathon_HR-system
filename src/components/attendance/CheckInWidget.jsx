import { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import StatusBadge from '../badges/StatusBadge.jsx';
import Card from '../cards/Card.jsx';
import * as attendance from '../../services/attendanceService.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function CheckInWidget() {
  const [now, setNow] = useState(new Date());
  const [inAt, setInAt] = useState(null);
  const [outAt, setOutAt] = useState(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const act = async (kind) => {
    setBusy(true);
    try {
      const { at } = await (kind === 'in' ? attendance.checkIn() : attendance.checkOut());
      kind === 'in' ? setInAt(new Date(at)) : setOutAt(new Date(at));
      toast.success(kind === 'in' ? 'Checked in. Have a good day.' : 'Checked out. See you tomorrow.');
    } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const status = !inAt ? 'Absent' : outAt ? 'Present' : now.getHours() * 60 + now.getMinutes() > 9 * 60 + 15 && inAt.getHours() * 60 + inAt.getMinutes() > 9 * 60 + 15 ? 'Late' : 'Present';
  const ms = inAt ? (outAt || now) - inAt : 0;
  const hh = Math.floor(ms / 36e5), mm = Math.floor((ms % 36e5) / 6e4);
  const t = (d) => d?.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) || '—';
  return (
    <Card title="Today" actions={<StatusBadge status={!inAt ? 'Pending' : status} />}>
      <div className="row between" style={{ alignItems: 'flex-end' }}>
        <div><div className="clock">{now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div><div className="muted">{now.toLocaleDateString('en', { weekday: 'long', day: 'numeric', month: 'long' })}</div></div>
        <div className="row">
          <Button variant="primary" icon={LogIn} loading={busy} disabled={!!inAt} onClick={() => act('in')}>Check in</Button>
          <Button icon={LogOut} loading={busy} disabled={!inAt || !!outAt} onClick={() => act('out')}>Check out</Button>
        </div>
      </div>
      <hr className="divider" style={{ margin: '16px 0' }} />
      <dl className="kv" style={{ margin: 0 }}><div><dt>Checked in</dt><dd>{t(inAt)}</dd></div><div><dt>Checked out</dt><dd>{t(outAt)}</dd></div><div><dt>Working hours</dt><dd>{hh}h {mm}m</dd></div><div><dt>Shift</dt><dd>09:00 – 18:00</dd></div></dl>
    </Card>
  );
}
