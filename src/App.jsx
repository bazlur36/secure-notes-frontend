import { useEffect, useState } from 'react';
import { api, getToken, setToken } from './api';
import AuthForm from './components/AuthForm';
import Notes from './components/Notes';
import Posts from './components/Posts';
import Interests from './components/Interests';
import Profile from './components/Profile';
import AdminUsers from './components/AdminUsers';
import AdminNotes from './components/AdminNotes';

const TABS = [
  { id: 'notes', label: 'My notes' },
  { id: 'posts', label: 'Posts' },
  { id: 'interests', label: 'Interests' },
  { id: 'profile', label: 'Profile' },
  { id: 'admin-users', label: 'Admin: users', admin: true },
  { id: 'admin-notes', label: 'Admin: all notes', admin: true },
];

export default function App() {
  const [me, setMe] = useState(null);
  const [booting, setBooting] = useState(Boolean(getToken()));
  const [tab, setTab] = useState('notes');

  // Restore the session from a stored token
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me')
      .then((r) => setMe(r.user))
      .catch(() => setToken(null))
      .finally(() => setBooting(false));
  }, []);

  const logout = () => {
    setToken(null);
    setMe(null);
    setTab('notes');
  };

  if (booting) return <p className="container">Loading…</p>;

  return (
    <div className="container">
      <header>
        <h1>Secure Notes</h1>
        {me && (
          <span>
            {me.name} ({me.role}) <button onClick={logout}>Log out</button>
          </span>
        )}
      </header>

      {!me ? (
        <AuthForm onAuth={setMe} />
      ) : (
        <>
          <nav>
            {TABS.filter((t) => !t.admin || me.role === 'admin').map((t) => (
              <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </nav>
          {tab === 'notes' && <Notes />}
          {tab === 'posts' && <Posts me={me} />}
          {tab === 'interests' && <Interests />}
          {tab === 'profile' && <Profile me={me} onUpdate={setMe} />}
          {tab === 'admin-users' && me.role === 'admin' && <AdminUsers me={me} />}
          {tab === 'admin-notes' && me.role === 'admin' && <AdminNotes />}
        </>
      )}
    </div>
  );
}
