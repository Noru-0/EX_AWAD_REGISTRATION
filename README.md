# Auth Register Project

This repository contains a Next.js frontend and an Express + PostgreSQL backend implementing a simple authentication system (register, login, JWT stored in an httpOnly cookie).

## Layout

- `frontend/` - Next.js app (App Router). Runs on port 3000 by default.
- `backend/` - Express API server. Runs on port 4000 by default.
- `backend/sql/schema.sql` - SQL to create the `users` table.

## Features

- Server-side validation on registration (email format, password length).
- Passwords hashed with `bcrypt`.
- JWT-based authentication stored in an httpOnly cookie named `token`.
- Cookie is set with `httpOnly` and `sameSite` lax to allow cross-site dev usage.
- Protected frontend route `/home` guarded with Next middleware (checks for cookie at the edge).
- Frontend forms use `react-hook-form` and `@tanstack/react-query` (v5).

## Environment variables

Create `.env` files for backend and frontend as needed. Important backend env vars:

- `DB_HOST` - Postgres host (default: localhost)
- `DB_PORT` - Postgres port (default: 5432)
- `DB_NAME` - Postgres database name
- `DB_USER` - Postgres username
- `DB_PASS` - Postgres password
- `JWT_SECRET` - Secret used to sign JWTs (set a long random string)
- `FRONTEND_ORIGIN` - Origin for CORS (e.g. `http://localhost:3000`)
- `PORT` - (optional) backend port (default 4000)

The frontend uses fetch with `credentials: 'include'` to accept the httpOnly cookie. No frontend environment is strictly required beyond Next defaults.

## Setup & Run (development)

1. Start Postgres and create the database/user. Example (psql):

```sql
-- run in your Postgres environment
CREATE DATABASE auth_demo;
-- then run the SQL in backend/sql/schema.sql to create the users table
```

2. Backend

```cmd
cd /d D:\4\awad\EX\EX3\register\backend
npm install
# if you see errors about peer deps during installs in this project use --legacy-peer-deps
npm run dev
```

3. Frontend

```cmd
cd /d D:\4\awad\EX\EX3\register\frontend
npm install
npm run dev
```

Notes: If you added `@tanstack/react-query` manually and your environment complains about peer-deps, re-run with `--legacy-peer-deps`.

## API Endpoints (backend)

- `POST /api/register` and `POST /user/register` (alias)
  - Body: `{ "email": string, "password": string }`
  - Returns 201 and sets `token` cookie on success. Returns validation errors with 400, or 409 if email exists.

- `POST /api/login`
  - Body: `{ "email": string, "password": string }`
  - Returns 200 on success and sets `token` cookie.

- `GET /api/me`
  - Reads cookie and returns currently authenticated user data (without password) when cookie is valid.

- `POST /api/logout`
  - Clears the auth cookie.

- `GET /api/health`
  - Health check returning `{ status: 'ok' }`.

## Quick manual tests (curl, Windows cmd)

Register a user (stores cookie to `cookies.txt`):

```cmd
curl -i -c cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" http://localhost:4000/user/register
```

Login (re-uses cookie file):

```cmd
curl -i -c cookies.txt -b cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}" http://localhost:4000/api/login
```

Check authenticated user (send cookie):

```cmd
curl -i -b cookies.txt http://localhost:4000/api/me
```

## Troubleshooting

- Error: "Cannot find module 'cookie-parser'" when running backend
  - Fix: `cd backend && npm install cookie-parser`

- Next.js error: "Only plain objects... Classes or null prototypes are not supported"
  - Caused by creating a `QueryClient` instance inside a Server Component; fixed by using a client-only `ClientQueryProvider` that creates the QueryClient with `useState`.

- React Query v5 API
  - This project uses `@tanstack/react-query` v5. Code uses v5 `useMutation({ mutationFn })` and mutation `status` values like `pending` / `error` / `success`.

## Deploying to Render

This repository includes a `render.yaml` manifest to deploy both the frontend and backend as separate Render services.

- Link your Git repository in the Render dashboard and enable the `render.yaml` manifest.
- The manifest will create two web services: `frontend` (Next.js) and `backend` (Express).

Required environment variables (set these in the Render dashboard for each service):

- Backend service:
  - `DATABASE_URL` (preferred) or `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
  - `JWT_SECRET` (secure random value)
  - `DB_SSL=true` if your database requires TLS
  - `FRONTEND_ORIGIN` set to your frontend URL (e.g. `https://<frontend>.onrender.com`)

- Frontend service:
  - `NEXT_PUBLIC_API_URL` set to your backend public URL (e.g. `https://<backend>.onrender.com`)

After setting the env vars and deploying, Render will build the frontend (`cd frontend && npm run build`) and start it (`cd frontend && npm run start`), and install/run the backend (`cd backend && npm run start`).

Important: do NOT commit secrets to the repo. Use Render's environment variable settings to inject secrets at deploy time.

## Development notes & next improvements

- Consider strengthening validation (password complexity, rate limiting).
- Add tests for the backend endpoints and a small E2E test for register/login flows.
- For production, ensure HTTPS, set cookie `secure: true`, tighten CORS and cookie `sameSite` policy, rotate `JWT_SECRET`, and use proper session invalidation.

## Contacts / Further help

If you want, I can:
- Run a quick end-to-end smoke test from this environment (register -> login -> /api/me).
- Add tests or CI config to run these flows automatically.

Single-container deploy on Render
--------------------------------

This repository now supports deploying both frontend and backend in a single Render service. Key notes:

- The root-level `package.json` contains a `start` script which runs the backend on internal port `4000` and starts the Next.js frontend on the Render-assigned `$PORT`.
- When using the single-service approach set `NEXT_PUBLIC_API_URL` in Render to `http://localhost:4000` so the frontend will call the locally-running backend inside the same container.
- Build and start are handled by the included `render.yaml` manifest which has been updated for a single-service flow.

Security / production notes:

- Use `DATABASE_URL` or DB_* env vars and `JWT_SECRET` in Render's environment settings. Avoid committing secrets into the repo.
- If your DB requires TLS, set `DB_SSL=true` in Render env; for testing you may set `DB_SSL_REJECT_UNAUTHORIZED=false` (not recommended for production).


---
Generated on 2025-11-08 by the development helper.
