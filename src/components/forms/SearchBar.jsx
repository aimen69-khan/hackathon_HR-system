import { Search } from 'lucide-react';
export default function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  return <div className="search"><Search size={16} /><input className="input" type="search" aria-label={placeholder} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} /></div>;
}
