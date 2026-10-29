import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import Card from '../cards/Card.jsx';
import { AITag } from './AIChat.jsx';
import { getAiSummary } from '../../services/aiService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AISummary() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: false, items: null, error: null });
  const run = async () => {
    setState({ loading: true, items: null, error: null });
    try { setState({ loading: false, items: await getAiSummary(user.role), error: null }); }
    catch (e) { setState({ loading: false, items: null, error: e.message }); }
  };
  return (
    <Card title="AI summary" subtitle="Insights from this month’s data" actions={<Button variant="primary" icon={Sparkles} loading={state.loading} onClick={run}>{state.items ? 'Regenerate' : 'AI Summary'}</Button>}>
      {state.error && <div className="alert">{state.error}</div>}
      {state.loading && <div className="stack-sm">{[80, 65, 72].map((w) => <div key={w} className="skel" style={{ height: 18, width: `${w}%` }} />)}</div>}
      {state.items && (<><div className="grid g2">{state.items.map((t, i) => <div key={i} className="card card-pad" style={{ boxShadow: 'none', background: 'var(--surface-2)' }}>{t}</div>)}</div><div style={{ marginTop: 10 }}><AITag /></div></>)}
      {!state.items && !state.loading && !state.error && <p className="muted">Select “AI Summary” to generate three to five insights.</p>}
    </Card>
  );
}
