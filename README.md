# Secure Notes — Frontend

A deliberately minimal React (Vite) client for the Secure Notes API. It was written by hand (no starter template or UI kit).
The task is backend-focused, so the UI aims for function over looks.

- **Live:** `<VERCEL_URL>` · **Backend repo:** https://github.com/bazlur36/secure-notes-backend · **API:** `<RENDER_URL>/api`

## Features
| Tab | What it exercises |
|---|---|
| Log in / Register | `POST /auth/login`, `POST /auth/register` (JWT kept in localStorage) |
| My notes | Paginated CRUD on your own notes (`/notes`) |
| Posts | Public feed (`/posts`), publish/delete. Clicking an author shows their posts through **Scenario 2** (`/users/:id/posts`, `$lookup`) |
| Interests | **Scenario 1**: users grouped by interest, with an optional filter (`/users/grouped-by-interest`) |
| Profile | Edit name / interests / password (`PATCH /auth/me`) |
| Admin: users | Add / edit / delete / list users, including role changes (admin only) |
| Admin: all notes | Everyone's notes (admin only) |

Demo accounts (after running `npm run seed` in the backend): `admin@example.com / Admin@12345`, `user@example.com / User@12345`.

## Run locally
```bash
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # http://localhost:5173
```
The backend's `CORS_ORIGIN` must include the frontend origin (the default is `http://localhost:5173`).

## Deploy (Vercel or Netlify)
- **Vercel:** import the repo. The framework preset (Vite) is detected automatically. Add the env var `VITE_API_URL=https://<your-api>.onrender.com/api` and deploy.
- **Netlify:** build command `npm run build`, publish directory `dist`, same env var.
- Then set the backend's `CORS_ORIGIN` to the deployed frontend URL.

The app has no client-side routes, so no SPA rewrite rules are needed.
