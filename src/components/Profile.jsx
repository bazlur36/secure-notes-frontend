import { useState } from 'react';
import { api } from '../api';
import { splitInterests } from './AuthForm';
import { Alert, PageHead } from './ui';

export default function Profile({ me, onUpdate }) {
  const [form, setForm] = useState({ name: me.name, interests: me.interests.join(', '), password: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });

  async function save(e) {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const body = { name: form.name, interests: splitInterests(form.interests) };
      if (form.password) body.password = form.password;
      const res = await api('/auth/me', { method: 'PATCH', body });
      onUpdate(res.user);
      setForm({ ...form, password: '' });
      setMsg({ type: 'ok', text: 'Profile saved.' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="narrow">
      <PageHead title="Profile" subtitle="Manage your account details." />
      <form className="card" onSubmit={save}>
        <div className="field">
          <label>Email</label>
          <input value={me.email} disabled />
        </div>
        <div className="field">
          <label htmlFor="p-name">Name</label>
          <input id="p-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="p-int">Interests</label>
          <input id="p-int" placeholder="Comma separated, e.g. chess, reading" value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="p-pw">New password</label>
          <input id="p-pw" type="password" placeholder="Leave blank to keep current" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="primary">Save changes</button>
        <Alert type={msg.type}>{msg.text}</Alert>
      </form>
    </div>
  );
}
