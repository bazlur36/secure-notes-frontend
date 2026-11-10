import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';

export default function Notes() {
  const { data, meta, page, setPage, error, reload } = usePaged('/notes');
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      if (editingId) await api(`/notes/${editingId}`, { method: 'PATCH', body: form });
      else await api('/notes', { method: 'POST', body: form });
      setForm({ title: '', content: '' });
      setEditingId(null);
      if (!editingId && page !== 1) setPage(1);
      else reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(id) {
    try {
      await api(`/notes/${id}`, { method: 'DELETE' });
      if (data.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div>
      <h2>My notes</h2>
      <form className="card" onSubmit={save}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <div className="row">
          <button type="submit">{editingId ? 'Save changes' : 'Add note'}</button>
          {editingId && (
            <button type="button" onClick={() => (setEditingId(null), setForm({ title: '', content: '' }))}>
              Cancel
            </button>
          )}
        </div>
        {msg && <p className="error">{msg}</p>}
      </form>

      {error && <p className="error">{error}</p>}
      {data.map((n) => (
        <div className="card" key={n._id}>
          <strong>{n.title}</strong>
          <p>{n.content}</p>
          <small className="muted">{new Date(n.createdAt).toLocaleString()}</small>
          <div className="row">
            <button onClick={() => (setEditingId(n._id), setForm({ title: n.title, content: n.content }))}>Edit</button>
            <button className="danger" onClick={() => remove(n._id)}>Delete</button>
          </div>
        </div>
      ))}
      {!data.length && !error && <p className="muted">No notes yet.</p>}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
