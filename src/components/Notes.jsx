import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';
import { Alert, ListState, PageHead, formatDate } from './ui';

const EMPTY = { title: '', content: '' };

export default function Notes() {
  const { data, meta, page, setPage, error, loading, reload } = usePaged('/notes');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      if (editingId) await api(`/notes/${editingId}`, { method: 'PATCH', body: form });
      else await api('/notes', { method: 'POST', body: form });
      setForm(EMPTY);
      setEditingId(null);
      if (!editingId && page !== 1) setPage(1);
      else reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api(`/notes/${id}`, { method: 'DELETE' });
      if (id === editingId) cancel();
      if (data.length === 1 && page > 1) setPage(page - 1);
      else reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  function edit(n) {
    setEditingId(n._id);
    setForm({ title: n.title, content: n.content });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const cancel = () => (setEditingId(null), setForm(EMPTY));

  return (
    <div>
      <PageHead title="My notes" subtitle="Private notes, visible only to you." />

      <form className="card" onSubmit={save}>
        <h3 className="card-title">{editingId ? 'Edit note' : 'New note'}</h3>
        <div className="field">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <textarea placeholder="Write something…" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="actions">
          <button type="submit" className="primary">{editingId ? 'Save changes' : 'Add note'}</button>
          {editingId && <button type="button" onClick={cancel}>Cancel</button>}
        </div>
        <Alert>{msg}</Alert>
      </form>

      <Alert>{error}</Alert>
      <div className="list">
        {data.map((n) => (
          <article className="item" key={n._id}>
            <div className="item-head">
              <h3>{n.title}</h3>
              <div className="item-actions">
                <button className="sm" onClick={() => edit(n)}>Edit</button>
                <button className="sm danger" onClick={() => remove(n._id)}>Delete</button>
              </div>
            </div>
            {n.content && <p className="item-body">{n.content}</p>}
            <div className="item-meta">{formatDate(n.createdAt)}</div>
          </article>
        ))}
      </div>
      {!error && <ListState loading={loading} count={data.length} empty="No notes yet. Write your first one above." />}
      <Pager meta={meta} page={page} setPage={setPage} />
    </div>
  );
}
