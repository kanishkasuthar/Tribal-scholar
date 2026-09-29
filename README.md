# Tribal Scholar AI

> **"Your Scholarship Journey, Simplified by AI."**

An AI-assisted scholarship assistance platform designed for Scheduled Tribe (ST) students in India, providing end-to-end guidance from scholarship discovery to document verification, application tracking, and future funding roadmaps.

---

## 🏛️ Executive Overview
Navigating government scholarships often presents significant hurdles for ST students: fragmented scheme information, stringent document formatting rules, name/spelling mismatches on certificates, and opaque application review stages. 

**Tribal Scholar AI** bridges this gap with:
1. **Student Intelligence**: Personalized rule-based AI scholarship matching and explainable eligibility breakdowns.
2. **Document Intelligence**: Preventive AI Deficiency Copilot catching spelling/income discrepancies prior to official submission.
3. **Application Intelligence**: Scholarship Application Digital Twin rendering live application states and responsible verification stages.
4. **System Intelligence**: Process Intelligence analytics for Institute and Ministry administrators to identify bottleneck trends.

---

## 🌟 Key Features

### 1. AI Scholarship Matching & Explainable Eligibility
- **Personalized Eligibility**: Evaluates student profile attributes (education stage, course, ST category, domicile state, annual family income, CGPA/%) against 100% verified Ministry of Tribal Affairs (MoTA) and National Scholarship Portal (NSP) schemes.
- **Explainable Match Breakdown**: Generates transparent profile match percentages with detailed criteria evaluation (`SATISFIED`, `ACTION_REQUIRED`, `NEEDS_INFO`) and recommended resolution steps.

### 2. Preventive AI Deficiency Repair Copilot
- **5-Stage Stepper Workflow**: `DETECT` → `EXPLAIN` → `REPAIR` → `RECHECK` → `RESOLVED`.
- **Side-by-Side Comparison**: Highlights discrepancies (e.g., Tehsil spelling variations between Aadhaar and Income Certificates) and guides students on uploading official affidavits or corrected certificates.

### 3. Scholarship Application Digital Twin
- **Real-Time Lifecycle Tracking**: Tracks application progress across `DRAFT`, `SUBMITTED`, `DOCUMENT_REVIEW`, `INSTITUTE_VERIFICATION`, `DEPARTMENT_VERIFICATION`, `APPROVED`, `DISBURSEMENT`, and `RETURNED_FOR_CORRECTION` stages.

### 4. Opportunity & Renewal Roadmap
- **Adaptive Education Levels**: Tailors roadmaps across School (Class 9-12), Diploma/ITI, Undergraduate (B.Tech, B.Sc, B.A.), Postgraduate, Research (M.Phil/Ph.D.), and Professional programs.

### 5. Multi-Role Verification & Process Intelligence
- **Student Portal**: Manage profile, documents, applications, grievances, and AI recommendations.
- **Institute Officer Desk**: Review bonafide status, verify academic records, and resolve flagged deficiencies.
- **Ministry Admin Desk**: Process intelligence bottleneck explorer, geographic trend analysis, and grievance resolution monitoring.

### 6. Bilingual & Accessible User Interface
- **English / Hindi Experience**: Integrated Devanagari translation support with user language persistence.
- **Accessibility**: Keyboard focus styling, ARIA landmarks, mobile-responsive layout, and high-contrast editorial typography.

---

## 🏗️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database** | SQLite (Development) / PostgreSQL (Production) |
| **Security** | JWT Authentication, BCrypt Password Hashing, Protected Document Streaming |
| **Email / OTP** | Nodemailer SMTP (Gmail Integration) + Controlled Development OTP Mode |

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/kanishkasuthar/Tribal-scholar.git
cd Tribal-scholar

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in both root and `backend` directories:
```bash
cp .env.example .env
cp .env.example backend/.env
```

### 3. Database Initialization & Seeding
```bash
# Push Prisma schema to SQLite database
npx prisma db push

# Seed official Ministry of Tribal Affairs schemes
node prisma/seedOfficialSchemes.js
```

### 4. Running Development Servers
```bash
# Terminal 1: Backend Server (Port 5001)
cd backend && npm run dev

# Terminal 2: Frontend Server (Port 5173)
cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Security & Data Integrity Policies
- **Authentication**: All self-registered users receive `STUDENT` role by default.
- **Protected File Streaming**: Documents are served via authenticated REST endpoints (`/api/documents/:id/download`) verifying ownership. Direct static directory browsing is forbidden.
- **Zero Fabricated Student Data**: Unprovided profile fields default to `"Not provided"`. Demo records in admin/institute queues are explicitly marked with `isDemoRecord: true` and `[Illustrative Demo]` badges.

---

## 📄 License & Attribution
Maintained under the SIH 2026 Development Initiative. Built for Scheduled Tribe student empowerment in alignment with Ministry of Tribal Affairs guidelines.
