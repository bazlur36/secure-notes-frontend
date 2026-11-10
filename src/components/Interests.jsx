import { useState } from 'react';
import { usePaged } from '../usePaged';
import Pager from './Pager';
import { Alert, ListState, PageHead } from './ui';

/** Scenario 1: users grouped by interest (single aggregate() call on the backend). */
export default function Interests() {
  const [input, setInput] = useState('');
  const [interest, setInterest] = useState('');
  const groups = usePaged('/users/grouped-by-interest', { interest, usersPerGroup: 10 });

  const apply = (value) => (setInput(value), setInterest(value), groups.setPage(1));

  return (
    <div>
      <PageHead title="Interests" subtitle="Users grouped by shared interest." />

      <form className="toolbar" onSubmit={(e) => (e.preventDefault(), apply(input.trim()))}>
        <input placeholder="Filter by interest, e.g. chess" value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="primary">Filter</button>
        {interest && <button type="button" onClick={() => apply('')}>Clear</button>}
      </form>

      <Alert>{groups.error}</Alert>
      <div className="list">
        {groups.data.map((g) => (
          <article className="item" key={g.interest}>
            <div className="item-head">
              <h3>
                <button className="link" onClick={() => apply(g.interest)}>{g.interest}</button>
              </h3>
              <span className="badge">{g.userCount} {g.userCount === 1 ? 'user' : 'users'}</span>
            </div>
            <p className="item-body muted">
              {g.users.map((u) => u.name).join(', ')}
              {g.userCount > g.users.length && ` and ${g.userCount - g.users.length} more`}
            </p>
          </article>
        ))}
      </div>
      {!groups.error && (
        <ListState loading={groups.loading} count={groups.data.length} empty={interest ? `No users interested in "${interest}".` : 'No interests yet.'} />
      )}
      <Pager meta={groups.meta} page={groups.page} setPage={groups.setPage} />
    </div>
  );
}
