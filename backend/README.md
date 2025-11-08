# Auth Backend

Simple Express backend for handling register and login using PostgreSQL.

Prerequisites:
- Node 18+ (or compatible)
- PostgreSQL running and accessible

Setup:
1. Copy `.env.example` to `.env` and fill the DB and JWT values.
2. Install dependencies:
   npm install
3. Create the database schema (either run the SQL in `sql/schema.sql` or use the provided /api/register endpoint).

Run:
- Development with live reload:
  npm run dev
- Production:
  npm start

Startup behavior:
- On start the server will check connectivity to the PostgreSQL database by running a simple `SELECT 1` query. If the DB is unreachable the process will log an error and exit. This prevents the HTTP server from starting when the database is not available.

Endpoints:
- GET /api/health -> simple health check
- POST /api/register -> body: { email, password }
- POST /api/login -> body: { email, password } returns { token, user }

Use the frontend to call POST http://localhost:4000/api/login after starting the backend.
