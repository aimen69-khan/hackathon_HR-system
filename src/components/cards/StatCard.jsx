export default function StatCard({ label, value, icon: Icon, delta, tone = '', hint }) {
  return (
    <div className="card stat">
      {Icon && <div className={`stat-icon ${tone}`}><Icon size={19} /></div>}
      <div style={{ minWidth: 0 }}>
        <div className="muted small">{label}</div>
        <div className="v">{value}</div>
        {delta !== undefined && <div className={`delta ${delta >= 0 ? 'up' : 'down'}`}>{delta >= 0 ? '+' : ''}{delta}% <span className="muted" style={{ fontWeight: 400 }}>vs last month</span></div>}
        {hint && <div className="muted small">{hint}</div>}
      </div>
    </div>
  );
}
