export default function Card({ title, subtitle, actions, children, pad = true, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="card-head">
          <div><h3>{title}</h3>{subtitle && <p className="muted">{subtitle}</p>}</div>{actions}
        </header>
      )}
      <div className={pad ? 'card-pad' : ''}>{children}</div>
    </section>
  );
}
