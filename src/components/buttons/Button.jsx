import { Loader2 } from 'lucide-react';
export default function Button({ variant = '', size = '', icon: Icon, loading, children, className = '', ...rest }) {
  return (
    <button type="button" className={`btn ${variant} ${size} ${!children ? 'icon' : ''} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? <Loader2 size={16} className="spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
