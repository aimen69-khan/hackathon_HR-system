import { useState } from 'react';
import Field from './Field.jsx';
import Button from '../buttons/Button.jsx';
import { workingDays } from '../../utils/dates.js';
import { todayIso } from '../../utils/format.js';

export default function LeaveForm({ initial, balances, onSubmit, onCancel }) {
  const [v, setV] = useState({ type: 'Casual', start: todayIso(), end: todayIso(), reason: '', ...initial });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));
  const days = workingDays(v.start, v.end);
  const bal = balances.find((b) => b.type === v.type);
  const left = bal ? bal.quota - bal.used : 0;
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (v.end < v.start) er.end = 'End date must be on or after the start date.';
    else if (days === 0) er.end = 'Selected dates have no working days.';
    if (v.type !== 'Unpaid' && days > left) er.type = `Only ${left} days available.`;
    if (v.reason.trim().length < 3) er.reason = 'Add a short reason.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    try { await onSubmit({ ...v, days }); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label="Leave type" className="full" value={v.type} onChange={set('type')} options={balances.map((b) => b.type)} error={errors.type} />
        <Field label="Start date" type="date" value={v.start} onChange={set('start')} />
        <Field label="End date" type="date" value={v.end} onChange={set('end')} error={errors.end} />
        <Field label="Reason" as="textarea" className="full" value={v.reason} onChange={set('reason')} error={errors.reason} />
      </div>
      <div className="alert info" style={{ marginTop: 14 }}>
        {v.type === 'Unpaid' ? 'Unpaid leave has no balance limit.' : `Available ${v.type.toLowerCase()} balance: ${left} days.`} Working days requested: <strong>{days}</strong>.
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 16 }}>
        <Button onClick={onCancel}>Cancel</Button><Button variant="primary" type="submit" loading={saving}>Submit request</Button>
      </div>
    </form>
  );
}
