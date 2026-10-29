import { useState } from 'react';
import Field from './Field.jsx';
import Button from '../buttons/Button.jsx';
import { departments, designations } from '../../data/departments.js';
import { todayIso } from '../../utils/format.js';

const blank = { id: '', name: '', email: '', phone: '', address: '', department: 'Engineering', designation: 'Software Engineer', joiningDate: todayIso(), status: 'Active', salary: '', employmentType: 'Full-time', manager: '' };

export default function EmployeeForm({ initial, onSubmit, onCancel }) {
  const [v, setV] = useState({ ...blank, ...initial });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value, ...(k === 'department' ? { designation: designations.find((d) => d.department === e.target.value)?.name } : {}) }));
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!v.id.trim()) er.id = 'Employee code is required.';
    if (!v.name.trim()) er.name = 'Full name is required.';
    if (!/^\S+@\S+\.\S+$/.test(v.email)) er.email = 'Enter a valid email.';
    if (!(Number(v.salary) > 0)) er.salary = 'Enter a salary above 0.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSaving(true);
    try { await onSubmit(v); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} noValidate>
      <div className="form-grid">
        <Field label="Employee code" value={v.id} onChange={set('id')} error={errors.id} disabled={!!initial} placeholder="EMP-1049" />
        <Field label="Full name" value={v.name} onChange={set('name')} error={errors.name} />
        <Field label="Email" type="email" value={v.email} onChange={set('email')} error={errors.email} />
        <Field label="Phone" value={v.phone} onChange={set('phone')} />
        <Field label="Address" className="full" value={v.address} onChange={set('address')} />
        <Field label="Department" value={v.department} onChange={set('department')} options={departments.map((d) => d.name)} />
        <Field label="Designation" value={v.designation} onChange={set('designation')} options={designations.filter((d) => d.department === v.department).map((d) => d.name)} />
        <Field label="Joining date" type="date" value={v.joiningDate} onChange={set('joiningDate')} />
        <Field label="Job status" value={v.status} onChange={set('status')} options={['Active', 'On probation', 'Resigned']} />
        <Field label="Gross salary (PKR)" type="number" min="0" value={v.salary} onChange={set('salary')} error={errors.salary} />
        <Field label="Employment type" value={v.employmentType} onChange={set('employmentType')} options={['Full-time', 'Part-time', 'Contract']} />
        <Field label="Reporting manager" className="full" value={v.manager} onChange={set('manager')} />
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
        <Button onClick={onCancel}>Cancel</Button><Button variant="primary" type="submit" loading={saving}>{initial ? 'Save changes' : 'Add employee'}</Button>
      </div>
    </form>
  );
}
