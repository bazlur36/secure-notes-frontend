import { useState } from 'react';
import { api } from '../api';
import { splitInterests } from './AuthForm';

export default function Profile({ me, onUpdate }) {
  const [form, setForm] = useState({ name: me.name, interests: me.interests.join(', '), password: '' });
  const [msg, setMsg] = useState('');

  async function save(e) {
    e.preventDefault();
    setMsg('');
    try {
      const body = { name: form.name, interests: splitInterests(form.interests) };
      if (form.password) body.password = form.password;
      const res = await api('/auth/me', { method: 'PATCH', body });
      onUpdate(res.user);
      setForm({ ...form, password: '' });
      setMsg('Saved');
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <form className="card narrow" onSubmit={save}>
      <h2>My profile</h2>
      <p className="muted">
        {me.email} · role: {me.role}
      </p>
      <label>Name</label>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <label>Interests (comma separated)</label>
      <input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
      <label>New password (optional)</label>
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Save</button>
      {msg && <p className={msg === 'Saved' ? 'ok' : 'error'}>{msg}</p>}
    </form>
  );
}
