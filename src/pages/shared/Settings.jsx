import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/cards/Card.jsx';
import Field from '../../components/forms/Field.jsx';
import Button from '../../components/buttons/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ROLE_LABEL } from '../../routes/navConfig.js';

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const [pw, setPw] = useState({ current: '', next: '' });
  const [err, setErr] = useState('');
  const [prefs, setPrefs] = useState({ email: true, leave: true, payroll: true });
  return (
    <>
      <PageHeader title="Settings" subtitle="Your account and preferences" />
      <div className="grid g2">
        <Card title="Account"><div className="stack"><Field label="Name" value={user.name} readOnly /><Field label="Email" value={user.email} readOnly /><Field label="Role" value={ROLE_LABEL[user.role]} readOnly /></div></Card>
        <Card title="Appearance"><div className="stack-sm"><p className="muted">Choose how HCM Lite looks on this device.</p><div className="row">{['light', 'dark'].map((t) => <Button key={t} variant={theme === t ? 'primary' : ''} onClick={() => setTheme(t)}>{t === 'light' ? 'Light' : 'Dark'}</Button>)}</div></div></Card>
        <Card title="Notifications"><div className="stack-sm">{[['email', 'Email me important updates'], ['leave', 'Leave request updates'], ['payroll', 'Payslip availability']].map(([k, l]) => <label key={k} className="check"><input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} />{l}</label>)}<div><Button onClick={() => toast.success('Preferences saved.')}>Save preferences</Button></div></div></Card>
        <Card title="Change password"><form className="stack" onSubmit={(e) => { e.preventDefault(); if (pw.next.length < 8) return setErr('New password must be at least 8 characters.'); setErr(''); setPw({ current: '', next: '' }); toast.success('Password updated (demo only).'); }}>
          {err && <div className="alert" role="alert">{err}</div>}
          <Field label="Current password" type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /><Field label="New password" type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} hint="At least 8 characters." />
          <div><Button variant="primary" type="submit">Update password</Button></div></form></Card>
      </div>
    </>
  );
}
