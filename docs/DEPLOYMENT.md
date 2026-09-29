# TRIBAL SCHOLAR AI — DEPLOYMENT GUIDE

## 1. System Architecture Overview
- **Frontend**: React + TypeScript + Vite + Tailwind CSS (Deployed on Vercel)
- **Backend**: Node.js + Express + TypeScript + Prisma ORM (Deployed on Render / Railway)
- **Database**: SQLite / PostgreSQL / MySQL (Managed via Prisma DB Sync)
- **File Storage**: Authenticated File Stream Endpoint (`/api/documents/:id/download`)

## 2. Environment Variables Configuration

### Backend (.env)
```env
PORT=5001
NODE_ENV="production"
AUTH_MODE="production"
FRONTEND_URL="https://your-frontend-domain.vercel.app"
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_production_jwt_secret_key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="sender@gmail.com"
SMTP_PASS="16_char_app_password"
EMAIL_FROM="Tribal Scholar AI <no-reply@mota.gov.in>"
```

### Frontend (.env)
```env
VITE_API_BASE_URL="https://your-backend-domain.onrender.com/api"
```

## 3. Build & Deployment Commands

### Backend Build
```bash
cd backend
npm install
npx prisma generate --schema=../prisma/schema.prisma
npx prisma db push --schema=../prisma/schema.prisma
npm run build
npm start
```

### Frontend Build
```bash
cd frontend
npm install
npm run build
```

## 4. Production Security Controls
1. **JWT Secret Enforcement**: Fails startup cleanly if `JWT_SECRET` is omitted in production mode.
2. **CORS Security**: Restricts allowed origins strictly to `FRONTEND_URL`.
3. **Protected Document Streaming**: Disables static public folder indexing; streams documents through ownership-authenticated REST endpoints.
4. **BCrypt Hashing**: Hashes all passwords with cost factor 10.
