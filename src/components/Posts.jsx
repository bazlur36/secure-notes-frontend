import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';

/** Public feed + create post. Clicking an author shows their posts (Scenario 2, $lookup). */
export default function Posts({ me }) {
  const [authorId, setAuthorId] = useState(null);
  const [form, setForm] = useState({ title: '', body: '' });
  const [msg, setMsg] = useState('');
  const feed = usePaged(authorId ? `/users/${authorId}/posts` : '/posts');

  async function create(e) {
    e.preventDefault();
    setMsg('');
    try {
      await api('/posts', { method: 'POST', body: form });
      setForm({ title: '', body: '' });
      feed.page === 1 ? feed.reload() : feed.setPage(1);
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(id) {
    try {
      await api(`/posts/${id}`, { method: 'DELETE' });
      feed.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  const showAuthor = (id) => (setAuthorId(id), feed.setPage(1));

  return (
    <div>
      <h2>Posts</h2>
      <form className="card" onSubmit={create}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Write a public post" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        <button type="submit">Publish</button>
        {msg && <p className="error">{msg}</p>}
      </form>

      <div className="row">
        <button onClick={() => showAuthor(null)} disabled={!authorId}>All posts</button>
        <button onClick={() => showAuthor(me._id)} disabled={authorId === me._id}>My posts</button>
      </div>
      {authorId && feed.user && (
        <p>
          Posts by <strong>{feed.user.name}</strong> — via <code>GET /users/:id/posts</code> ($lookup)
        </p>
      )}

      {feed.error && <p className="error">{feed.error}</p>}
      {feed.data.map((p) => {
        const author = p.author && typeof p.author === 'object' ? p.author : null;
        return (
          <div className="card" key={p._id}>
            <strong>{p.title}</strong>
            <p>{p.body}</p>
            <small className="muted">
              {author && (
                <>
                  by{' '}
                  <a href="#" onClick={(e) => (e.preventDefault(), showAuthor(author._id))}>
                    {author.name}
                  </a>{' '}
                  ·{' '}
                </>
              )}
              {new Date(p.createdAt).toLocaleString()}
            </small>
            {(me.role === 'admin' || (author ? author._id === me._id : authorId === me._id)) && (
              <div className="row">
                <button className="danger" onClick={() => remove(p._id)}>Delete</button>
              </div>
            )}
          </div>
        );
      })}
      {!feed.data.length && !feed.error && <p className="muted">No posts.</p>}
      <Pager meta={feed.meta} page={feed.page} setPage={feed.setPage} />
    </div>
  );
}
