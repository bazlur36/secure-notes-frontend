const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'secure-notes-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

/** Small fetch wrapper: JSON in/out, Bearer token, throws Error(message) on non-2xx. */
export async function api(path, { method = 'GET', body, query } = {}) {
  const qs = query
    ? '?' + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== '')).toString()
    : '';
  const token = getToken();
  const res = await fetch(BASE + path + qs, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) setToken(null);
    const details = data.error?.details?.map((d) => `${d.path}: ${d.message}`).join('; ');
    throw new Error([data.error?.message || `Request failed (${res.status})`, details].filter(Boolean).join(' — '));
  }
  return data;
}
