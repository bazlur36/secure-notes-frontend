import { useCallback, useEffect, useState } from 'react';
import { api } from './api';

/** Fetches a paginated endpoint ({ data, meta }) and re-fetches when page/query change. */
export function usePaged(path, query = {}, limit = 10) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ data: [], meta: null });
  // `result` may also carry extra fields, e.g. `user` from GET /users/:id/posts
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify(query);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResult(await api(path, { query: { ...JSON.parse(key), page, limit } }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [path, key, page, limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  // reset to an empty list when switching endpoints so stale rows don't flash
  useEffect(() => setResult({ data: [], meta: null }), [path]);

  return { ...result, page, setPage, error, loading, reload };
}
