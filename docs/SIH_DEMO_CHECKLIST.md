# SIH 2026 Live Demonstration Checklist — Tribal Scholar AI

Use this checklist during live jury presentations to ensure a smooth, flaw-free 5–7 minute presentation.

---

## 1. Pre-Demo System Verification (Run 10 Minutes Before Jury)

- [ ] **Backend Server:** Confirm Node.js Express server running on port `5001` (`http://localhost:5001/api/health` returns `ONLINE`).
- [ ] **Frontend Application:** Confirm Vite React app running on port `5173` (`http://localhost:5173`).
- [ ] **Database Connection:** SQLite database (`prisma/dev.db`) seeded with multi-role demo data.
- [ ] **Demo Accounts Tested:**
  - Student: `student@demo.com` / `student123`
  - Institute Officer: `institute@demo.com` / `institute123`
  - Ministry Admin: `admin@demo.com` / `admin123`
- [ ] **Audio/Microphone:** Tested Web Speech API microphone input if demonstrating Voice Assistant.
- [ ] **Browser Resolution:** Browser zoom set to 100% on standard 1080p display.

---

## 2. 5–7 Minute Live Demo Step-by-Step Script

| Step | Persona & URL | Key Action & Script | Jury Value Highlight |
| :--- | :--- | :--- | :--- |
| **Step 1** | **Landing Page**<br>`/` | Show the Landing Page hero, primary CTA **"Explore Scholarships"**, and the **12-Stage Lifecycle Pipeline**. | *"We cover the entire scholarship lifecycle from discovery to DBT disbursement and renewals, not just basic listing."* |
| **Step 2** | **Student Login**<br>`/login` | Click **"1-Click Student Demo"** (`student@demo.com`). | Frictionless authentication with instant profile loading. |
| **Step 3** | **AI Match Engine**<br>`/student/dashboard` | Navigate to **Scholarships** & **AI Matching**. Highlight 96% Match Score on Post-Matric Scholarship. | *"AI analyzes ST category, income limit, and academic marks with transparent match explanations."* |
| **Step 4** | **Explainable Rules**<br>`/student/eligibility/sch_post_matric_01` | Open Explainable Eligibility page. Show criteria status checkmarks (✓ ST matched, ⚠ Document check). | *"We provide clear, non-black-box explanations so students know exactly where they stand."* |
| **Step 5** | **Deficiency Repair Copilot**<br>`/student/deficiency-copilot` | Open Document Center. Highlight the **"Name Mismatch"** discrepancy on Income Certificate. Click **"Launch AI Repair Copilot"**. | *"Our 5-step copilot guides students to fix document errors before submission, preventing rejections."* |
| **Step 6** | **Application Digital Twin**<br>`/student/digital-twin/app_1001` | Show live Digital Twin Timeline. Highlight current stage: **INSTITUTE_VERIFICATION**, responsible authority badge (**🏫 INSTITUTE**). | *"Students no longer wonder 'where is my application?'. The Digital Twin shows live stage progression and authority ownership."* |
| **Step 7** | **Institute Verification**<br>`/institute/dashboard` | Logout & Login as **Institute Officer** (`institute@demo.com`). Open application `app_1001` review desk. | *"Institute Nodal Officers get a streamlined verification workspace with field validation and return-for-correction capabilities."* |
| **Step 8** | **Return & Student Resubmit** | Issue officer return comment ("Please update income certificate year"). Switch back to student view to resolve deficiency. | Complete bidirectional feedback loop demonstrated live. |
| **Step 9** | **Renewal & Roadmap**<br>`/student/renewals` & `/student/roadmap` | View Renewal Readiness % and Higher Academic Research Fellowship Simulator. | *"Scholarships are continuous journeys. We protect renewals and map long-term research career paths."* |
| **Step 10**| **Voice & Multilingual AI** | Click floating AIAssistantDrawer. Switch language to **Hindi (हिंदी)** or **Kannada (ಕನ್ನಡ)**. | *"Voice and 7-language support ensures accessibility for tribal students with varying digital literacy."* |
| **Step 11**| **Ministry Intelligence**<br>`/admin/dashboard` | Login as **Ministry Admin** (`admin@demo.com`). Show national analytics, Ranchi district bottleneck alert, and audit logs. | *"Ministry administrators gain real-time visibility into application bottlenecks and fund disbursement velocity."* |

---

## 3. Jury FAQ Key Answers

- **Q: Does the AI make final approval decisions?**  
  *A: No. AI is strictly an explainability and document-checking assistant. Authoritative eligibility rules and workflow state machine transitions are enforced deterministically by the backend. Final approvals rest with human officers.*

- **Q: What happens if a student has no internet or low digital literacy?**  
  *A: The system provides voice input simulation, 7 regional languages, and simplified step-by-step guidance designed specifically for low-literacy users.*

- **Q: How does the system handle security and student data privacy?**  
  *A: Passwords are encrypted with bcrypt, requests require role-authorized JWT tokens, uploads pass strict MIME validation, and personal bank secrets are never exposed in logs.*
