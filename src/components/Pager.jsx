export default function Pager({ meta, page, setPage }) {
  if (!meta) return null;
  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
      <span>
        Page {meta.page} of {meta.totalPages} ({meta.total} total)
      </span>
      <button disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>Next ›</button>
    </div>
  );
}
