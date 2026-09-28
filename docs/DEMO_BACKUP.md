# SIH Live Demo Backup & Troubleshooting Guide — Tribal Scholar AI

Quick operational commands, fallback URLs, database reset procedures, and demo accounts for live presentations.

---

## 1. Quick Local Execution Commands

### Reset & Seed Database (Run if database needs a fresh state)
```bash
cd /Users/kanishkasuthar/.gemini/antigravity/scratch/tribal-scholar-ai/backend
npx prisma db push --force-reset --schema=../prisma/schema.prisma
npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' ../prisma/seed.ts
cp ../prisma/dev.db ./prisma/dev.db
```

### Start Backend Service (Terminal 1)
```bash
cd /Users/kanishkasuthar/.gemini/antigravity/scratch/tribal-scholar-ai/backend
npm run dev
# Server running at http://localhost:5001
```

### Start Frontend Service (Terminal 2)
```bash
cd /Users/kanishkasuthar/.gemini/antigravity/scratch/tribal-scholar-ai/frontend
npm run dev
# Web app running at http://localhost:5173
```

---

## 2. Tested Demo Accounts

| Role | Email | Password | Primary Page Route |
| :--- | :--- | :--- | :--- |
| **ST Student** | `student@demo.com` | `student123` | `http://localhost:5173/student/dashboard` |
| **Institute Nodal Officer** | `institute@demo.com` | `institute123` | `http://localhost:5173/institute/dashboard` |
| **Ministry Admin** | `admin@demo.com` | `admin123` | `http://localhost:5173/admin/dashboard` |

---

## 3. Critical Demonstration Routes

- **Landing Page & 12-Stage Lifecycle:** `http://localhost:5173/`
- **Student Dashboard:** `http://localhost:5173/student/dashboard`
- **AI Matching & Opportunities:** `http://localhost:5173/student/opportunities`
- **Explainable Eligibility:** `http://localhost:5173/student/eligibility/sch_post_matric_01`
- **Document Center & Deficiency Copilot:** `http://localhost:5173/student/deficiency-copilot`
- **Application Digital Twin:** `http://localhost:5173/student/digital-twin/app_1001`
- **Institute Verification Desk:** `http://localhost:5173/institute/dashboard`
- **Process Intelligence & Bottleneck Engine:** `http://localhost:5173/admin/ai-insights`
- **Grant Renewal Center:** `http://localhost:5173/student/renewals`
- **Academic Funding Roadmap:** `http://localhost:5173/student/roadmap`
