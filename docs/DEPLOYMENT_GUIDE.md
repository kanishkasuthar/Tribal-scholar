# Deployment Guide - Tribal Scholar AI

This project is prepared for single-click cloud deployment on:

- **Frontend:** Vercel / Netlify
- **Backend:** Render / Railway
- **Database:** Hosted PostgreSQL (Supabase / Render Postgres / Neon)

---

## 1. Frontend Deployment (Vercel)

1. Connect your repository to Vercel.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://tribal-scholar-api.onrender.com`)

---

## 2. Backend Deployment (Render)

1. Create a Web Service on Render pointing to the `backend` directory.
2. Build Command: `npm install && npm run build && npx prisma db push --schema=../prisma/schema.prisma && npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' ../prisma/seed.ts`
3. Start Command: `npm start`
4. Environment Variables:
   - `PORT`: `5000`
   - `DATABASE_URL`: Hosted PostgreSQL connection string
   - `JWT_SECRET`: Secure random string
   - `NODE_ENV`: `production`

---

## 3. Database Deployment (PostgreSQL)

1. Provision a PostgreSQL instance on Supabase, Render, or Neon.
2. Copy the database connection URL into `DATABASE_URL`.
3. In `prisma/schema.prisma`, update the provider from `"sqlite"` to `"postgresql"` when targeting production.
4. Run `npx prisma db push` to generate all tables and indexes.
