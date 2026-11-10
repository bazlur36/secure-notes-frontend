/** Small shared UI pieces. */

export function Logo() {
  return (
    <span className="logo" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="11" width="16" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </span>
  );
}

export function PageHead({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>{children}</div>;
}

/** Loading / empty placeholder for a list. Renders nothing when there are rows. */
export function ListState({ loading, count, empty }) {
  if (count) return null;
  return <div className="empty">{loading ? 'Loading…' : empty}</div>;
}

export function Chips({ items }) {
  if (!items?.length) return <span className="muted">—</span>;
  return (
    <span className="chips">
      {items.map((i) => (
        <span className="chip" key={i}>{i}</span>
      ))}
    </span>
  );
}

export const formatDate = (d) =>
  new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
