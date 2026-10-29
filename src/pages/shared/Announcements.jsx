import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import { EmptyState } from '../../components/layout/States.jsx';
import Card from '../../components/cards/Card.jsx';
import AnnouncementCard from '../../components/cards/AnnouncementCard.jsx';
import Field from '../../components/forms/Field.jsx';
import Button from '../../components/buttons/Button.jsx';
import Modal from '../../components/modals/Modal.jsx';
import ConfirmDialog from '../../components/modals/ConfirmDialog.jsx';
import { useAppData } from '../../context/AppDataContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { todayIso } from '../../utils/format.js';

export default function Announcements() {
  const { user } = useAuth();
  const { announcements, setAnnouncements } = useAppData();
  const toast = useToast();
  const canEdit = user.role !== 'employee';
  const [edit, setEdit] = useState(null);
  const [remove, setRemove] = useState(null);
  const [err, setErr] = useState({});
  const list = canEdit ? announcements : announcements.filter((a) => a.active);
  const save = () => {
    const e = {};
    if (!edit.title?.trim()) e.title = 'Add a title.';
    if (!edit.body?.trim()) e.body = 'Write the announcement.';
    setErr(e); if (Object.keys(e).length) return;
    setAnnouncements((l) => (edit.id ? l.map((a) => (a.id === edit.id ? edit : a)) : [{ ...edit, id: `a${Date.now()}`, author: user.name, date: todayIso(), active: true }, ...l]));
    toast.success(edit.id ? 'Announcement updated.' : 'Announcement published.'); setEdit(null);
  };
  return (
    <>
      <PageHeader title="Announcements" subtitle={canEdit ? 'Share news with the whole company' : 'News from your company'} actions={canEdit && <Button variant="primary" icon={Plus} onClick={() => { setErr({}); setEdit({ title: '', body: '', audience: 'Everyone' }); }}>New announcement</Button>} />
      <Card pad={false}>
        {!list.length ? <EmptyState title="No announcements yet" message={canEdit ? 'Publish the first one.' : 'Check back soon.'} /> : list.map((a) => (
          <AnnouncementCard key={a.id} item={a} actions={canEdit && <div className="row" style={{ gap: 2 }}>
            <Button size="sm" variant="ghost" icon={Pencil} aria-label="Edit" onClick={() => { setErr({}); setEdit(a); }} />
            <Button size="sm" variant="ghost" onClick={() => { setAnnouncements((l) => l.map((x) => (x.id === a.id ? { ...x, active: !x.active } : x))); toast.success(a.active ? 'Announcement deactivated.' : 'Announcement activated.'); }}>{a.active ? 'Deactivate' : 'Activate'}</Button>
            <Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete" onClick={() => setRemove(a)} /></div>} />))}
      </Card>
      {edit && <Modal title={edit.id ? 'Edit announcement' : 'New announcement'} onClose={() => setEdit(null)} footer={<><Button onClick={() => setEdit(null)}>Cancel</Button><Button variant="primary" onClick={save}>{edit.id ? 'Save changes' : 'Publish'}</Button></>}>
        <div className="stack"><Field label="Title" value={edit.title} error={err.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /><Field label="Message" as="textarea" value={edit.body} error={err.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} /><Field label="Audience" options={['Everyone', 'Managers', 'Engineering', 'Sales']} value={edit.audience} onChange={(e) => setEdit({ ...edit, audience: e.target.value })} /></div></Modal>}
      {remove && <ConfirmDialog danger title="Delete announcement?" message={`“${remove.title}” will be removed for everyone.`} confirmLabel="Delete" onCancel={() => setRemove(null)} onConfirm={() => { setAnnouncements((l) => l.filter((x) => x.id !== remove.id)); setRemove(null); toast.success('Announcement deleted.'); }} />}
    </>
  );
}
