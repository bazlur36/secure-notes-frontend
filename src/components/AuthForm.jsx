import { useEffect, useState } from 'react';
import { api, setToken } from '../api';
import { Alert, Logo } from './ui';

const DEMO = [
  { label: 'Admin', email: 'admin@example.com', password: 'Admin@12345' },
  { label: 'User', email: 'user@example.com', password: 'User@12345' },
];

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isLogin = mode === 'login';

  // The free-tier API sleeps when idle; tell the user why the first request is slow.
  useEffect(() => {
    if (!busy) return setSlow(false);
    const t = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(t);
  }, [busy]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, interests: splitInterests(form.interests) };
      const res = await api(`/auth/${mode}`, { method: 'POST', body });
      setToken(res.token);
      onAuth(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const switchMode = () => {
    setMode(isLogin ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="auth">
      <div className="auth-box">
        <div className="brand">
          <Logo /> Secure Notes
        </div>
        <div className="card">
          <h2>{isLogin ? 'Sign in' : 'Create an account'}</h2>
          <p className="sub-title">{isLogin ? 'Welcome back. Enter your details below.' : 'Your notes stay private to you.'}</p>
          <form onSubmit={submit}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" value={form.name} onChange={set('name')} required autoComplete="name" />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder={isLogin ? '' : 'At least 8 characters'}
                value={form.password}
                onChange={set('password')}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>
            {!isLogin && (
              <div className="field">
                <label htmlFor="interests">Interests</label>
                <input id="interests" placeholder="e.g. chess, reading" value={form.interests} onChange={set('interests')} />
              </div>
            )}
            <button type="submit" className="primary" disabled={busy}>
              {busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
            {slow && <Alert type="info">Waking up the server (free hosting tier). The first request can take up to a minute.</Alert>}
            <Alert>{error}</Alert>
          </form>
        </div>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" className="link" onClick={switchMode}>
            {isLogin ? 'Create one' : 'Sign in'}
          </button>
        </p>

        {isLogin && (
          <div className="demo">
            <strong>Demo accounts</strong>
            {DEMO.map((d) => (
              <div className="demo-row" key={d.email}>
                <span>
                  {d.label} <code>{d.email} / {d.password}</code>
                </span>
                <button type="button" className="sm" onClick={() => setForm({ ...form, email: d.email, password: d.password })}>
                  Use
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const splitInterests = (s) =>
  s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
