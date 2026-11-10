import { useState } from 'react';
import { usePaged } from '../usePaged';
import Pager from './Pager';

/** Scenario 1: users grouped by interest (single aggregate() call on the backend). */
export default function Interests() {
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const groups = usePaged('/users/grouped-by-interest', { interest, usersPerGroup: 10 });

  return (
    <div>
      <h2>Users grouped by interest</h2>
      <form className="row" onSubmit={(e) => (e.preventDefault(), setInterest(input.trim()), groups.setPage(1))}>
        <input placeholder="Filter by interest (optional)" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Filter</button>
        <button type="button" onClick={() => (setInput(''), setInterest(''), groups.setPage(1))}>Clear</button>
      </form>
      {groups.error && <p className="error">{groups.error}</p>}
      {groups.data.map((g) => (
        <div className="card" key={g.interest}>
          <strong>{g.interest}</strong> <span className="muted">({g.userCount} users)</span>
          <p>
            {g.users.map((u) => u.name).join(', ')}
            {g.userCount > g.users.length && ` … and ${g.userCount - g.users.length} more`}
          </p>
        </div>
      ))}
      {!groups.data.length && !groups.error && <p className="muted">No groups.</p>}
      <Pager meta={groups.meta} page={groups.page} setPage={groups.setPage} />
    </div>
  );
}
