import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import Button from '../buttons/Button.jsx';

export function EmptyState({ title = 'Nothing here yet', message, action, icon: Icon = Inbox }) {
  return <div className="state"><Icon size={34} /><h3>{title}</h3>{message && <p>{message}</p>}{action}</div>;
}
export function LoadingState({ rows = 4 }) {
  return (
    <div className="card-pad stack-sm" aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => <div key={i} className="skel" style={{ height: i === 0 ? 22 : 38, width: i === 0 ? '40%' : '100%' }} />)}
    </div>
  );
}
export function ErrorState({ message, onRetry }) {
  return (
    <div className="state" role="alert"><AlertTriangle size={34} color="var(--bad)" /><h3>Couldn’t load this</h3><p>{message || 'Something went wrong.'}</p>
      {onRetry && <Button variant="primary" onClick={onRetry}>Try again</Button>}</div>
  );
}
export function Spinner() { return <Loader2 className="spin" size={18} />; }

// Renders loading / error / content from a useAsync() result.
export function Async({ query, children, skeleton }) {
  if (query.loading) return skeleton || <div className="card"><LoadingState /></div>;
  if (query.error) return <div className="card"><ErrorState message={query.error} onRetry={query.reload} /></div>;
  return children(query.data);
}
