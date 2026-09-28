# Production Deployment Guide — Tribal Scholar AI

This document details step-by-step instructions for deploying the **Tribal Scholar AI** platform to production environments.

---

## 1. System Requirements & Architecture

- **Frontend Hosting:** Vercel, Netlify, or AWS CloudFront + S3 (Vite Single Page Application)
- **Backend Service:** Render, Railway, AWS ECS, or DigitalOcean App Platform (Node.js Express Server)
- **Database:** PostgreSQL (Render Postgres, Supabase, AWS RDS, or Neon)
- **File Storage:** AWS S3 or Local Upload Directory with appropriate ACL permissions

---

## 2. Environment Variables Setup

Ensure production environment variables are properly set in your cloud deployment platform settings:

### Backend Environment Variables
```env
PORT=5001
DATABASE_URL="postgresql://user:password@db-host:5432/tribalscholar?sslmode=require"
JWT_SECRET="YOUR_HIGH_ENTROPY_PRODUCTION_JWT_SECRET_KEY"
NODE_ENV="production"
FRONTEND_URL="https://tribal-scholar-ai.vercel.app"
STORAGE_URL="https://tribal-scholar-ai-api.onrender.com/uploads"
```

### Frontend Environment Variables
```env
VITE_API_URL="https://tribal-scholar-ai-api.onrender.com/api"
```

---

## 3. Database Migration & Seeding (PostgreSQL)

1. Set `provider = "postgresql"` in `prisma/schema.prisma` for production deployment.
2. Push database schema to production PostgreSQL instance:
   ```bash
   npx prisma db push --schema=./prisma/schema.prisma
   ```
3. Run database seed to populate default scholarships, fellowships, and demonstration accounts:
   ```bash
   npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' ./prisma/seed.ts
   ```

---

## 4. Backend Deployment (Render / Cloud Container)

1. Connect your GitHub repository to Render Web Service.
2. Configure build settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add environment variables in Render Dashboard.
4. Verify backend health endpoint at: `https://<your-backend-domain>/api/health`.

---

## 5. Frontend Deployment (Vercel)

1. Create a new project on Vercel linked to the repository.
2. Configure project settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Set `VITE_API_URL` environment variable pointing to the backend production API.
4. Deploy and verify HTTPS connection.

---

## 6. Post-Deployment Verification Checklist

- [ ] HTTPS enabled on both Frontend and Backend
- [ ] CORS policies restrict requests strictly to the Frontend domain
- [ ] JWT authentication tokens expire appropriately
- [ ] Static file uploads served securely with proper MIME type restrictions
- [ ] Database connection pool limits configured safely
- [ ] System audit logs capture login & application state changes
