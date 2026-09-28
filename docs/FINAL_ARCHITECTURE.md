# Technical Architecture Specification — Tribal Scholar AI

System architecture diagram, technology stack layers, and boundary separation between deterministic logic, AI assistance, and database source of truth.

---

## 1. System Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                               │
│  React 18 SPA (Vite + TypeScript) • Tailwind CSS • Recharts • Framer Motion │
│  Multilingual Locales (7 Languages) • Voice Assistant (Web Speech API)      │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │  REST API (JSON over HTTPS)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION SERVER                               │
│  Node.js + Express REST Server • JWT Authentication • Role RBAC Middleware   │
│  Multer Secure File Storage Abstraction • Input Sanitization Middleware     │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             SERVICE LAYER                                   │
│  ├─ Matching Engine (Weighted Criteria Scoring)                             │
│  ├─ Eligibility Service (Explainable Rules Generator)                       │
│  ├─ Document Analysis & OCR Service (MIME/Header Check + Field Extraction)  │
│  ├─ Deficiency Repair Copilot Service (5-Step Resolution Pipeline)          │
│  ├─ Application Digital Twin Engine (State Machine Timeline Log)            │
│  ├─ Process Intelligence Engine (Queue Accumulation & Root Cause Analysis)  │
│  ├─ Grant Renewal Protection Service (Readiness % Tracker)                  │
│  ├─ Academic & Research Roadmap Service (Milestone & Fellowship Simulator)  │
│  └─ Assistant Orchestration Service (Context-Aware Query Routing)           │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PERSISTENCE LAYER                               │
│  Prisma ORM • SQLite (Development) / PostgreSQL (Production Compatible)     │
│  Models: User, StudentProfile, Scholarship, Fellowship, Document,           │
│          DocumentDeficiency, Application, ApplicationStatusHistory,         │
│          ScholarshipRenewal, Grievance, AuditLog, UserPreference            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Logic Classification & Source of Truth Boundaries

| System Function | Logic Classification | Source of Truth / Authority |
| :--- | :--- | :--- |
| **Official Application Stage** | `DETERMINISTIC` | Database `Application.stage` column |
| **Official Approval / Rejection** | `HUMAN AUTHORITATIVE` | Authorized Institute / Department Officers |
| **Eligibility Verification** | `DETERMINISTIC` | `EligibilityRule` records in Database |
| **Submission Deadlines** | `DETERMINISTIC` | `Scholarship.deadline` in Database |
| **Document File Storage** | `DETERMINISTIC` | Private File System / S3 with ACL |
| **Profile Match Score (%)** | `AI / WEIGHTED ALGORITHM` | `matchingService.ts` calculation |
| **Explainable Rule Rationale** | `AI / EXPLAINABILITY` | `eligibilityService.ts` text generator |
| **Deficiency Repair Guidance** | `AI / GUIDANCE` | `deficiencyRepairService.ts` pipeline |
| **Bottleneck Alert Signals** | `AI / STATISTICAL PROCESS` | `processIntelligenceService.ts` engine |
| **Natural Language Assistant** | `AI / ORCHESTRATION` | `assistantService.ts` router |
