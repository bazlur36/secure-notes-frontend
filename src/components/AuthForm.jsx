import { useState } from 'react';
import { api, setToken } from '../api';

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const body =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              interests: splitInterests(form.interests),
            };
      const res = await api(`/auth/${mode}`, { method: 'POST', body });
      setToken(res.token);
      onAuth(res.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card narrow">
      <h2>{mode === 'login' ? 'Log in' : 'Register'}</h2>
      <form onSubmit={submit}>
        {mode === 'register' && <input placeholder="Name" value={form.name} onChange={set('name')} required />}
        <input type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        <input type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={set('password')} required />
        {mode === 'register' && (
          <input placeholder="Interests, comma separated (e.g. chess, reading)" value={form.interests} onChange={set('interests')} />
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
      <p>
        {mode === 'login' ? 'No account? ' : 'Have an account? '}
        <a href="#" onClick={(e) => (e.preventDefault(), setMode(mode === 'login' ? 'register' : 'login'))}>
          {mode === 'login' ? 'Register' : 'Log in'}
        </a>
      </p>
      <p className="muted">Demo: admin@example.com / Admin@12345 · user@example.com / User@12345</p>
    </div>
  );
}

export const splitInterests = (s) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
