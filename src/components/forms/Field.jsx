import { useId } from 'react';
// One wrapper for text, select, textarea. `options` turns it into a select.
export default function Field({ label, error, hint, options, as, className = '', ...props }) {
  const id = useId();
  const cls = `input ${error ? 'invalid' : ''}`;
  let control;
  if (options) control = <select id={id} className={cls} {...props}>{options.map((o) => (typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>))}</select>;
  else if (as === 'textarea') control = <textarea id={id} className={cls} {...props} />;
  else control = <input id={id} className={cls} {...props} />;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>{control}
      {hint && !error && <span className="hint">{hint}</span>}{error && <span className="err" role="alert">{error}</span>}
    </div>
  );
}
