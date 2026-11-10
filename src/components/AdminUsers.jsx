import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';
import { splitInterests } from './AuthForm';
import { Alert, Chips, ListState, PageHead } from './ui';

const EMPTY = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function AdminUsers({ me }) {
  const users = usePaged('/admin/users');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      const body = { name: form.name, email: form.email, role: form.role, interests: splitInterests(form.interests) };
      if (form.password) body.password = form.password;
      if (editingId) await api(`/admin/users/${editingId}`, { method: 'PATCH', body });
      else await api('/admin/users', { method: 'POST', body });
      cancel();
      users.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(u) {
    if (!window.confirm(`Delete ${u.name}? Their notes and posts will also be removed.`)) return;
    setMsg('');
    try {
      await api(`/admin/users/${u._id}`, { method: 'DELETE' });
      if (u._id === editingId) cancel();
      users.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  function edit(u) {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancel() {
    setEditingId(null);
    setForm(EMPTY);
  }

  return (
    <div>
      <PageHead title="Users" subtitle="Create, edit and remove accounts (admin only)." />

      <form className="card" onSubmit={save}>
        <h3 className="card-title">{editingId ? 'Edit user' : 'Add user'}</h3>
        <div className="form-grid">
          <div>
            <label className="lbl" htmlFor="u-name">Name</label>
            <input id="u-name" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="lbl" htmlFor="u-email">Email</label>
            <input id="u-email" type="email" value={form.email} onChange={set('email')} required />
          </div>
          <div>
            <label className="lbl" htmlFor="u-pw">{editingId ? 'New password' : 'Password'}</label>
            <input
              id="u-pw"
              type="password"
              autoComplete="new-password"
              placeholder={editingId ? 'Leave blank to keep' : 'At least 8 characters'}
              value={form.password}
              onChange={set('password')}
              required={!editingId}
            />
          </div>
          <div>
            <label className="lbl" htmlFor="u-role">Role</label>
            <select id="u-role" value={form.role} onChange={set('role')}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="u-int">Interests</label>
            <input id="u-int" placeholder="chess, reading" value={form.interests} onChange={set('interests')} />
          </div>
        </div>
        <div className="actions">
          <button type="submit" className="primary">{editingId ? 'Save changes' : 'Add user'}</button>
          {editingId && <button type="button" onClick={cancel}>Cancel</button>}
        </div>
        <Alert>{msg}</Alert>
      </form>

      <Alert>{users.error}</Alert>
      {users.data.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Role</th><th>Interests</th><th></th></tr>
            </thead>
            <tbody>
              {users.data.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    {u._id === me._id && <span className="muted"> (you)</span>}
                    <span className="sub">{u.email}</span>
                  </td>
                  <td><span className={`badge ${u.role === 'admin' ? 'admin' : ''}`}>{u.role}</span></td>
                  <td><Chips items={u.interests} /></td>
                  <td>
                    <div className="item-actions" style={{ justifyContent: 'flex-end' }}>
                      <button className="sm" onClick={() => edit(u)}>Edit</button>
                      {u._id !== me._id && <button className="sm danger" onClick={() => remove(u)}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!users.error && <ListState loading={users.loading} count={users.data.length} empty="No users." />}
      <Pager meta={users.meta} page={users.page} setPage={users.setPage} />
    </div>
  );
}
