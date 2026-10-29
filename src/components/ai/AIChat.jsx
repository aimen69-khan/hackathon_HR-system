import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Sparkles, User, AlertCircle } from 'lucide-react';
import Button from '../buttons/Button.jsx';
import { askAssistant } from '../../services/aiService.js';
import { suggestedQuestions } from '../../data/dashboard.js';
import { useAuth } from '../../context/AuthContext.jsx';

export const AITag = () => <span className="ai-tag"><Sparkles size={11} />AI-generated</span>;

export default function AIChat({ embedded = false, onClose }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([{ id: 0, from: 'ai', text: `Hi ${user?.name?.split(' ')[0] || 'there'}, ask me about ${user?.role === 'employee' ? 'your own attendance, leave and payslips' : user?.role === 'hr' ? 'attendance, leave and your team' : 'company-wide numbers'}.` }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const end = useRef(null);
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [messages, busy]);

  const send = async (q) => {
    const question = (q ?? text).trim();
    if (!question || busy) return;
    setText(''); 
    setBusy(true);
    setMessages((m) => [...m, { id: Date.now(), from: 'user', text: question }]);
    try {
      const { answer } = await askAssistant(user?.role || 'employee', question);
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'ai', text: answer, ai: true }]);
    } catch (e) {
      setMessages((m) => [...m, { id: Date.now() + 1, from: 'ai', text: e.message || 'Failed to get response', error: true, retry: question }]);
    } finally { 
      setBusy(false); 
    }
  };

  return (
    <div className={`card chat-panel ${embedded ? 'embedded' : ''}`} role="dialog" aria-label="AI assistant">
      <div className="chat-head"><div className="row" style={{ gap: 8 }}><Bot size={18} color="var(--brand)" /><strong>HCM Assistant</strong></div>{onClose && <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>}</div>
      <div className="chat-body">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.from}`}>
            <span className="avatar">{m.from === 'ai' ? <Bot size={15} /> : <User size={15} />}</span>
            <div>
              <div className="bubble" style={m.error ? { borderColor: 'var(--bad)', display: 'flex', alignItems: 'center', gap: 6 } : null}>
                {m.error && <AlertCircle size={14} color="var(--bad)" />}
                {m.text}
              </div>
              {m.ai && <div style={{ marginTop: 4 }}><AITag /></div>}
              {m.error && <Button size="sm" variant="ghost" onClick={() => send(m.retry)}>Retry</Button>}
            </div>
          </div>
        ))}
        {busy && <div className="msg"><span className="avatar"><Bot size={15} /></span><div className="bubble typing" aria-label="Assistant is typing"><span /><span /><span /></div></div>}
        {messages.length < 3 && !busy && <div className="chips">{(suggestedQuestions[user?.role] || suggestedQuestions.employee).map((q) => <button key={q} className="chip" onClick={() => send(q)}>{q}</button>)}</div>}
        <div ref={end} />
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input className="input" aria-label="Ask a question" placeholder="Ask a question…" value={text} onChange={(e) => setText(e.target.value)} />
        <Button variant="primary" icon={Send} type="submit" aria-label="Send" disabled={busy || !text.trim()} />
      </form>
    </div>
  );
}
