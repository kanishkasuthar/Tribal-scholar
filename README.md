# Tribal Scholar AI 🏛️

**Tagline:** *"Your Scholarship Journey, Simplified by AI."*

*SIH 2026 Problem Statement SIH26239 — Demonstration Prototype*

---

## 1. Problem Statement

Scheduled Tribe (ST) students across India face major hurdles in accessing government scholarships and research fellowships:
- Complex eligibility rules leading to high rejection rates due to lack of guidance.
- Document deficiencies (expired certificates, name mismatches) causing delayed disbursements or application rejections.
- Black-box verification progress leaving students anxious and unaware of status.
- Fragmented renewal tracking leading to lapsed grants year-over-year.
- Language barriers and low digital literacy in remote tribal areas.

---

## 2. Solution Overview

**Tribal Scholar AI** is a unified, end-to-end digital scholarship lifecycle platform designed for the **Ministry of Tribal Affairs**. It transforms complex scheme guidelines into explainable AI insights, proactively repairs document deficiencies, tracks verification via a live Digital Twin state machine, simplifies renewals, maps higher academic research roadmaps, and offers voice/multilingual accessibility for tribal students.

---

## 3. Key Innovations

1. **AI Scholarship & Fellowship Matching Engine:** Multi-factor scoring (% match score) across income, ST category, location, and academics.
2. **Explainable AI Eligibility Engine:** Natural language explanation for why a student is eligible or what criteria need attention.
3. **AI Document Intelligence & Deficiency Repair Copilot:** Automated OCR/field verification and interactive 5-step repair copilot.
4. **Scholarship Application Digital Twin:** Live stage machine showing stage progress, responsible authority, and actionable student instructions.
5. **Renewal Protection System:** Continuous academic tracking with automated renewal readiness scoring (0–100%).
6. **Academic & Fellowship Future Opportunity Roadmap:** Long-term career progression and fellowship scenario simulation.
7. **Voice & Multilingual AI Assistant:** Voice-enabled assistant supporting 7 Indian languages (`en`, `hi`, `kn`, `ta`, `te`, `mr`, `bn`).
8. **Ministry Bottleneck Intelligence Dashboard:** Decision-support dashboard detecting processing delays and funding bottlenecks.

---

## 4. Complete Lifecycle

```
DISCOVER → MATCH → UNDERSTAND → PREPARE → REPAIR → APPLY → VERIFY → TRACK → APPROVE → DISBURSE → RENEW → PROGRESS
```

---

## 5. AI Capabilities & Non-Authoritative Guardrails

- **Explainability:** AI explains eligibility and deficiency issues in simple language.
- **Safety Guardrail:** AI model does NOT alter database state, change application statuses, approve/reject applications, or invent rules.
- **Source of Truth:** Deterministic backend business rules and database state remain the sole authoritative source of truth.
- **Graceful Fallback:** If AI APIs are unavailable, the platform seamlessly displays rule-based fallbacks without breaking the UI.

---

## 6. User Roles

- **Student:** Account creation, profile management, scheme discovery, document upload, deficiency repair, digital twin tracking, renewal, roadmap, voice assistant.
- **Institute Nodal Officer:** Workload verification workspace, field validation, document inspection, approval forwarding, and return-for-correction with officer comments.
- **Ministry Admin:** National analytics, bottleneck detection, state/district distribution metrics, Direct Benefit Transfer overview, and system audit logs.

---

## 7. Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend:** Node.js, Express, TypeScript, REST APIs, JWT, bcryptjs, Multer.
- **Database:** Prisma ORM with SQLite (development) / PostgreSQL (production).
- **Voice & Accessibility:** Web Speech API, ARIA accessibility, high-contrast themes.

---

## 8. System Architecture

```
[ React 18 SPA (Vite + TS) ]  <--->  [ Express REST API (Node.js + TS) ]
         │                                       │
         ├─ Voice & Multilingual                 ├─ JWT & RBAC Middleware
         ├─ Digital Twin UI Component            ├─ AI Services (Matching, Repair, Guidance)
         └─ Recharts Analytics                   └─ Prisma ORM
                                                         │
                                               [ SQLite / PostgreSQL DB ]
```

---

## 9. Major Features

- ST Scholarship & National Fellowship Matching
- 5-Step Deficiency Repair Copilot
- Live Application Digital Twin Timeline
- Institute Nodal Officer Verification Desk
- Ministry Bottleneck & Risk Intelligence
- Continuous Grant Renewal Engine
- Academic Future Opportunity Roadmap
- Multilingual & Voice AI Assistant

---

## 10. Installation

```bash
# Clone the repository
git clone https://github.com/your-org/tribal-scholar-ai.git
cd tribal-scholar-ai

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

---

## 11. Environment Variables

Create `.env` inside `backend/` based on `.env.example`:

```env
PORT=5001
DATABASE_URL="file:../prisma/dev.db"
JWT_SECRET="tribal_scholar_ai_super_secret_jwt_key_2026"
AI_API_KEY="your_api_key_placeholder"
STORAGE_URL="http://localhost:5001/uploads"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

Create `.env` inside `frontend/`:

```env
VITE_API_URL="http://localhost:5001/api"
```

---

## 12. Database Setup

```bash
# Push database schema using Prisma
cd backend
npx prisma db push --schema=../prisma/schema.prisma

# Seed demo data
npx ts-node -O '{"module":"commonjs","moduleResolution":"node"}' ../prisma/seed.ts
```

---

## 13. Running Backend

```bash
cd backend
npm run dev
# Express API server starts on http://localhost:5001
```

---

## 14. Running Frontend

```bash
cd frontend
npm run dev
# Vite development app starts on http://localhost:5173
```

---

## 15. Demo Accounts

| Role | Email | Password | Primary Page |
| :--- | :--- | :--- | :--- |
| **ST Student** | `student@demo.com` | `student123` | `/student/dashboard` |
| **Institute Officer** | `institute@demo.com` | `institute123` | `/institute/dashboard` |
| **Ministry Admin** | `admin@demo.com` | `admin123` | `/admin/dashboard` |

---

## 16. API Documentation

Detailed REST API specifications are documented in [`docs/API.md`](file:///Users/kanishkasuthar/.gemini/antigravity/scratch/tribal-scholar-ai/docs/API.md).

---

## 17. Security Specifications

- Passwords hashed using `bcryptjs` (salt round 10).
- JWT token authentication with role-based middleware (`STUDENT`, `INSTITUTE`, `ADMIN`).
- Server-side file upload validation (MIME types, extensions, file size limits, non-public storage).
- Prevention of cross-tenant data access (Students can only access their own profile/documents/applications).
- Non-exposure of bank secrets and sensitive PII in public APIs or logs.

---

## 18. AI Limitations & Guardrails

- AI recommendations are non-authoritative advisory prompts.
- Deterministic backend logic enforces eligibility criteria, submission deadlines, and status transitions.
- All AI responses provide rule-based fallbacks if AI services experience timeouts.

---

## 19. Deployment Guide

Detailed deployment instructions for Vercel (Frontend), Render (Backend), and PostgreSQL are documented in [`docs/DEPLOYMENT.md`](file:///Users/kanishkasuthar/.gemini/antigravity/scratch/tribal-scholar-ai/docs/DEPLOYMENT.md).

---

## 20. SIH 2026 Context

- **Problem Statement Code:** SIH26239
- **Target Beneficiaries:** Scheduled Tribe (ST) students across India
- **Ministry:** Ministry of Tribal Affairs, Government of India
- **Status:** Complete Demonstration Prototype (Phases 0–7 Complete)
