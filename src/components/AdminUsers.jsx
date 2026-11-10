import { useState } from 'react';
import { api } from '../api';
import { usePaged } from '../usePaged';
import Pager from './Pager';
import { splitInterests } from './AuthForm';

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
      setForm(EMPTY);
      setEditingId(null);
      users.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  async function remove(u) {
    setMsg('');
    try {
      await api(`/admin/users/${u._id}`, { method: 'DELETE' });
      users.reload();
    } catch (err) {
      setMsg(err.message);
    }
  }

  function edit(u) {
    setEditingId(u._id);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
  }

  return (
    <div>
      <h2>Manage users</h2>
      <form className="card" onSubmit={save}>
        <div className="grid">
          <input placeholder="Name" value={form.name} onChange={set('name')} required />
          <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
          <input
            type="password"
            placeholder={editingId ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={set('password')}
            required={!editingId}
          />
          <select value={form.role} onChange={set('role')}>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <input placeholder="Interests (comma separated)" value={form.interests} onChange={set('interests')} />
        </div>
        <div className="row">
          <button type="submit">{editingId ? 'Update user' : 'Add user'}</button>
          {editingId && <button type="button" onClick={() => (setEditingId(null), setForm(EMPTY))}>Cancel</button>}
        </div>
        {msg && <p className="error">{msg}</p>}
      </form>

      {users.error && <p className="error">{users.error}</p>}
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Interests</th><th></th></tr>
        </thead>
        <tbody>
          {users.data.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.interests.join(', ')}</td>
              <td className="row">
                <button onClick={() => edit(u)}>Edit</button>
                {u._id !== me._id && <button className="danger" onClick={() => remove(u)}>Delete</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pager meta={users.meta} page={users.page} setPage={users.setPage} />
    </div>
  );
}
