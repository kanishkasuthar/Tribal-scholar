# SIH Jury Q&A Preparation — Tribal Scholar AI

Factual, honest, and technically accurate responses for the 20 SIH 2026 jury evaluation questions.

---

### Q1: What is novel about Tribal Scholar AI?
**A:** Novelty lies in three core differentiators built as an intelligence layer: (1) **AI Deficiency Resolution Copilot** (interactive 5-step guided repair for document mismatches), (2) **Application Digital Twin** (live stage machine showing exact authority ownership, blockers, and dependencies), and (3) **Process Intelligence Engine** (detecting queue accumulation, measuring processing durations vs benchmarks, and analyzing root cause patterns across districts).

### Q2: How is this different from existing government scholarship portals like NSP?
**A:** Existing portals excel at scheme cataloging, online form submission, and basic status displays (e.g. "Under Verification"). Tribal Scholar AI adds problem resolution (guiding students to fix document errors before rejection), live authority ownership tracking, and process intelligence to help institutes resolve bottlenecks.

### Q3: Why do we need AI in a scholarship system?
**A:** AI is used for explainability and OCR assistance — translating complex scheme rules into natural language checkmarks, pre-validating uploaded certificates for format/name mismatches, and summarizing process data into actionable administrative recommendations.

### Q4: Why can't existing portals simply add these features?
**A:** Existing portals can adopt these capabilities. Tribal Scholar AI is designed as a modular, API-first intelligence layer that can integrate over existing state and national backends via standard API connectors.

### Q5: What is the Deficiency Repair Copilot?
**A:** A 5-step guided workflow (**DETECT → EXPLAIN → REPAIR → RECHECK → RESOLVE**) that identifies document issues (e.g. name abbreviation variations between ST Caste Certificates and profile names) and guides students to provide legitimate resolution documents or affidavits before official verification.

### Q6: What is a Digital Twin in this context?
**A:** It is a real-time state machine representation of an application's lifecycle that tracks current stage, responsible authority (e.g., Institute Nodal Officer), current blocker, student action required, and complete historical status transition logs.

### Q7: What is Process Intelligence?
**A:** An analytical engine that aggregates application status history, processing durations, and document deficiencies to detect workflow bottlenecks (e.g., pending queue accumulation at specific institutes) and identify root causes.

### Q8: Does AI decide student eligibility?
**A:** No. AI calculates a match score and explains rules, but backend business rules enforce deterministic eligibility checks. Final official approval rests with human verification officers.

### Q9: Can AI approve or reject an application?
**A:** No. AI is strictly non-authoritative. Only authorized human officers (Institute Nodal Officers, State Department Officials) can approve, reject, or return applications.

### Q10: How do you prevent AI hallucinations?
**A:** By restricting AI outputs to structured database queries and rule-based template logic. Scheme guidelines, deadlines, and application statuses are retrieved directly from SQLite/PostgreSQL tables.

### Q11: How are documents protected against unauthorized access?
**A:** Uploaded files are stored in private server directories, validated for MIME types/extensions, assigned randomized secure filenames, and served via authenticated routes enforcing ownership checks.

### Q12: How do you protect student privacy?
**A:** Passwords are hashed with bcrypt, API endpoints require JWT authentication, bank secrets are redacted from public APIs, and administrative process intelligence uses aggregated/anonymized metrics.

### Q13: What happens when AI services are unavailable?
**A:** The application operates seamlessly in deterministic fallback mode. Rule-based checks, Digital Twin timelines, and document upload features continue functioning without disruption.

### Q14: How does the system integrate with existing government platforms?
**A:** Via REST APIs. The architecture decouples the frontend UI and intelligence layer, enabling integration with PFMS, DigiLocker, and state scholarship portals.

### Q15: What data is required for the system to operate?
**A:** Student profile attributes (ST category, family income, academic marks), scheme eligibility criteria, uploaded certificate files, and workflow status logs.

### Q16: Is the current prototype using real government data?
**A:** No. The prototype uses a fictional, synthetic dataset created specifically for SIH demonstration to ensure complete privacy compliance.

### Q17: How can this system scale nationally?
**A:** Built on a stateless Express REST API architecture and PostgreSQL database, the platform can be containerized (Docker/Kubernetes) and deployed on cloud infrastructure with horizontal scaling.

### Q18: How does this help educational institutions?
**A:** It provides Nodal Officers with a workload desk, automated document pre-validation, and structured return-for-correction comment tools to accelerate verification turnaround.

### Q19: How does this help ST students?
**A:** It eliminates rejection anxiety by providing explainable eligibility rules, proactive document deficiency repair, live Digital Twin tracking, grant renewal safeguards, and voice support in 7 Indian languages.

### Q20: What is the biggest limitation of the current prototype?
**A:** The prototype operates on synthetic demonstration data and simulated Web Speech voice API inputs rather than live direct integrations with state revenue databases.
