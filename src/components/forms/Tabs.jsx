export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => {
        const [id, label] = Array.isArray(t) ? t : [t, t];
        return <button key={id} role="tab" aria-selected={value === id} className={`tab ${value === id ? 'active' : ''}`} onClick={() => onChange(id)}>{label}</button>;
      })}
    </div>
  );
}
