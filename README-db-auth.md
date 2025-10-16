# LearnSpace Backend: Database & Auth

## Database (Prisma + MongoDB)

- Add env vars in `.env`:

DATABASE_URL="mongodb://localhost:27017/learnspace"
JWT_SECRET="replace-with-strong-secret"
EMAILJS_SERVICE_ID="..."
EMAILJS_TEMPLATE_ID="..."
EMAILJS_PUBLIC_KEY="..."

- Initialize Prisma client and DB:

pnpm dlx prisma generate
pnpm dlx prisma db push

## Auth (JWT cookies)

- Login: POST /api/auth/login with { email, password }
- Me: GET /api/auth/me → returns current user from cookie
- Logout: POST /api/auth/logout

Note: Seed at least one user (via POST /api/users or Prisma Studio) using the same email/password you plan to log in with.

## APIs now backed by DB with file fallback

- GET/POST /api/requests, PUT/DELETE /api/requests/:id
- GET/POST/DELETE /api/users
- GET /api/rooms (seeds defaults on first run)
