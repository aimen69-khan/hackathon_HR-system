import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { EmptyState } from '../../components/layout/States.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
export default function NotFound() {
  const { user } = useAuth();
  return <div className="card"><EmptyState icon={SearchX} title="Page not found" message="That page doesn’t exist or isn’t available for your role." action={<Link className="btn primary" to={`/${user.role}/dashboard`}>Go to dashboard</Link>} /></div>;
}
