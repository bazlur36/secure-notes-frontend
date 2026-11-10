export default function Pager({ meta, page, setPage }) {
  if (!meta || !meta.total) return null;
  return (
    <div className="pager">
      <span>
        Page {meta.page} of {meta.totalPages} · {meta.total} total
      </span>
      <div className="actions">
        <button className="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <button className="sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
