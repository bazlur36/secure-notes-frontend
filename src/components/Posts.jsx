import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';
import { Alert, ListState, PageHead, formatDate } from './ui';

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
    if (!window.confirm('Delete this post?')) return;
    try {
      await api(`/posts/${id}`, { method: 'DELETE' });
      feed.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  const showAuthor = (id) => (setAuthorId(id), feed.setPage(1));
  const viewingOther = authorId && authorId !== me._id;

  return (
    <div>
      <PageHead title="Posts" subtitle="Public posts from everyone." />

      <form className="card" onSubmit={create}>
        <h3 className="card-title">New post</h3>
        <div className="field">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="field">
          <textarea placeholder="What would you like to share?" rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
        </div>
        <button type="submit" className="primary">Publish</button>
        <Alert>{msg}</Alert>
      </form>

      <div className="toolbar">
        <div className="segmented">
          <button className={!authorId ? 'active' : ''} onClick={() => showAuthor(null)}>All posts</button>
          <button className={authorId === me._id ? 'active' : ''} onClick={() => showAuthor(me._id)}>My posts</button>
          {viewingOther && <button className="active">{feed.user?.name || 'Author'}</button>}
        </div>
        {authorId && feed.user && (
          <span className="muted">
            Posts by <strong>{feed.user.name}</strong> via <code>GET /users/:id/posts</code> ($lookup)
          </span>
        )}
      </div>

      <Alert>{feed.error}</Alert>
      <div className="list">
        {feed.data.map((p) => {
          const author = p.author && typeof p.author === 'object' ? p.author : null;
          const canDelete = me.role === 'admin' || (author ? author._id === me._id : authorId === me._id);
          return (
            <article className="item" key={p._id}>
              <div className="item-head">
                <h3>{p.title}</h3>
                {canDelete && (
                  <div className="item-actions">
                    <button className="sm danger" onClick={() => remove(p._id)}>Delete</button>
                  </div>
                )}
              </div>
              <p className="item-body">{p.body}</p>
              <div className="item-meta">
                {author && (
                  <>
                    <button className="link" onClick={() => showAuthor(author._id)}>{author.name}</button>
                    {' · '}
                  </>
                )}
                {formatDate(p.createdAt)}
              </div>
            </article>
          );
        })}
      </div>
      {!feed.error && <ListState loading={feed.loading} count={feed.data.length} empty="No posts yet." />}
      <Pager meta={feed.meta} page={feed.page} setPage={feed.setPage} />
    </div>
  );
}
