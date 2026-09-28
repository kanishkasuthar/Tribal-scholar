# SIH Presentation Slide Content — Tribal Scholar AI

Concise content structure for the 6-slide SIH 2026 Jury Presentation deck.

---

## SLIDE 1: Problem & Vision
- **Title:** Tribal Scholar AI — Your Scholarship Journey, Simplified by AI
- **Subtitle:** Ministry of Tribal Affairs | SIH 2026 Problem Statement SIH26239
- **The Problem:**
  - Scheduled Tribe (ST) students face complex eligibility rules, high document rejection rates due to name format variations, and black-box verification delays.
  - Institutions lack visibility into recurring document deficiency root causes and bottleneck locations.
- **Our Vision:** An intelligence layer over existing scholarship ecosystems that guides students through problem resolution while giving stakeholders operational process intelligence.

---

## SLIDE 2: Solution & Complete 12-Stage Lifecycle
- **Unified Platform:** One integrated intelligent lifecycle from discovery to DBT credit and future career progression.
- **The 12-Stage Journey:**
  1. DISCOVER → 2. MATCH → 3. UNDERSTAND → 4. PREPARE → 5. REPAIR → 6. APPLY → 7. VERIFY → 8. TRACK → 9. APPROVE → 10. DISBURSE → 11. RENEW → 12. PROGRESS
- **Key Proposition:** Foundational portals provide listing & status; Tribal Scholar AI adds actionable problem resolution & process optimization.

---

## SLIDE 3: Core Innovations (The 3 Differentiators)
1. **AI Deficiency Resolution (Copilot):**
   - *Beyond error detection:* 5-step guided path (**DETECT → EXPLAIN → REPAIR → RECHECK → RESOLVE**) for name mismatches and expired certificates without modifying official documents.
2. **Application Digital Twin:**
   - *Beyond generic status:* Live stage machine showing responsible authority, pending action owner, current blocker, dependency, and transition history.
3. **Scholarship Process Intelligence:**
   - *Beyond pending counts:* System-wide queue accumulation measurement, average vs benchmark processing duration, root-cause pattern analysis, and preventive recommendations.

---

## SLIDE 4: Technical Architecture & System Guardrails
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend:** Node.js, Express, TypeScript, REST APIs, JWT, bcryptjs, Multer.
- **Database & ORM:** SQLite (dev) / PostgreSQL (prod) with Prisma ORM.
- **Non-Authoritative AI Guardrails:** Backend business rules and database state machine remain the sole source of truth for eligibility, deadlines, and approvals. AI provides explainable guidance and pattern insights.

---

## SLIDE 5: Three-Level Intelligence Model
- **Level 1 — Student Intelligence ("What should I do?"):** Personalized action priorities, document deficiency alerts, and renewal readiness tracking.
- **Level 2 — Application Intelligence ("Why is my application stuck?"):** Live Digital Twin stage breakdown and authority ownership.
- **Level 3 — System Intelligence ("Why are applications getting delayed?"):** Ministry-level bottleneck detection and district root-cause deficiency insights.

---

## SLIDE 6: Demonstration Prototype, Impact & Future Roadmap
- **Working Prototype Status:** 100% database-backed prototype with seeded multi-role dataset (Student, Institute Officer, Ministry Admin).
- **Accessibility Integration:** 7 Indian languages (`en`, `hi`, `kn`, `ta`, `te`, `mr`, `bn`), Web Speech API voice input/TTS, high-contrast mode, and text scaling.
- **Impact Potential:** Reduced application rejection rate by pre-submission deficiency repair, faster institute verification turnaround, and protected annual grant renewals.
