import { usePaged } from '../usePaged';
import Pager from './Pager';
import { Alert, ListState, PageHead, formatDate } from './ui';

export default function AdminNotes() {
  const notes = usePaged('/admin/notes');
  return (
    <div>
      <PageHead title="All notes" subtitle="Every user's notes (admin only)." />
      <Alert>{notes.error}</Alert>
      {notes.data.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Content</th><th>Owner</th><th className="nowrap">Created</th></tr>
            </thead>
            <tbody>
              {notes.data.map((n) => (
                <tr key={n._id}>
                  <td><strong>{n.title}</strong></td>
                  <td className="clip" title={n.content}>{n.content || <span className="muted">—</span>}</td>
                  <td>
                    {n.owner ? (
                      <>
                        {n.owner.name}
                        <span className="sub">{n.owner.email}</span>
                      </>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td className="nowrap muted">{formatDate(n.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!notes.error && <ListState loading={notes.loading} count={notes.data.length} empty="No notes." />}
      <Pager meta={notes.meta} page={notes.page} setPage={notes.setPage} />
    </div>
  );
}
