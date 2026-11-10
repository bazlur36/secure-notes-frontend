import { usePaged } from '../usePaged';
import Pager from './Pager';

export default function AdminNotes() {
  const notes = usePaged('/admin/notes');
  return (
    <div>
      <h2>All users' notes</h2>
      {notes.error && <p className="error">{notes.error}</p>}
      <table>
        <thead>
          <tr><th>Title</th><th>Content</th><th>Owner</th><th>Created</th></tr>
        </thead>
        <tbody>
          {notes.data.map((n) => (
            <tr key={n._id}>
              <td>{n.title}</td>
              <td>{n.content}</td>
              <td>{n.owner ? `${n.owner.name} (${n.owner.email})` : '—'}</td>
              <td>{new Date(n.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager meta={notes.meta} page={notes.page} setPage={notes.setPage} />
    </div>
  );
}
