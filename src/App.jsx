import { useEffect, useState } from 'react';
import { api, getToken, setToken } from './api';
import AuthForm from './components/AuthForm';
import Notes from './components/Notes';
import Posts from './components/Posts';
import Interests from './components/Interests';
import Profile from './components/Profile';
import AdminUsers from './components/AdminUsers';
import AdminNotes from './components/AdminNotes';
import { Logo } from './components/ui';

const TABS = [
  { id: 'notes', label: 'My notes' },
  { id: 'posts', label: 'Posts' },
  { id: 'interests', label: 'Interests' },
  { id: 'profile', label: 'Profile' },
  { id: 'admin-users', label: 'Users', admin: true },
  { id: 'admin-notes', label: 'All notes', admin: true },
];

const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

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

  if (booting) return <div className="center-screen">Loading…</div>;
  if (!me) return <AuthForm onAuth={setMe} />;

  const isAdmin = me.role === 'admin';
  const userTabs = TABS.filter((t) => !t.admin);
  const adminTabs = isAdmin ? TABS.filter((t) => t.admin) : [];
  const tabButton = (t) => (
    <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
      {t.label}
    </button>
  );

  return (
    <>
      <header className="topbar">
        <div className="container">
          <div className="brand">
            <Logo /> Secure Notes
          </div>
          <div className="user">
            <span className="avatar" title={me.email}>{initials(me.name)}</span>
            <span className="user-name">{me.name}</span>
            <span className={`badge ${isAdmin ? 'admin' : ''}`}>{me.role}</span>
            <button className="ghost sm" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main className="container">
        <nav className="tabs">
          {userTabs.map(tabButton)}
          {adminTabs.length > 0 && <span className="sep" />}
          {adminTabs.map(tabButton)}
        </nav>
        {tab === 'notes' && <Notes />}
        {tab === 'posts' && <Posts me={me} />}
        {tab === 'interests' && <Interests />}
        {tab === 'profile' && <Profile me={me} onUpdate={setMe} />}
        {tab === 'admin-users' && isAdmin && <AdminUsers me={me} />}
        {tab === 'admin-notes' && isAdmin && <AdminNotes />}
      </main>
    </>
  );
}
