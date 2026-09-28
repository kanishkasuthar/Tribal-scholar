# REST API Documentation — Tribal Scholar AI

**Base URL:** `http://localhost:5001/api` (or environment-configured `VITE_API_URL`)  
**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication APIs

### `POST /auth/register`
- **Purpose:** Create a new user account (Student, Institute, or Admin).
- **Auth / Role:** Public
- **Request Example:**
  ```json
  {
    "email": "student@demo.com",
    "password": "password123",
    "name": "Arjun Munda",
    "role": "STUDENT",
    "mobile": "+91 98765 43210"
  }
  ```
- **Response Example (`201 Created`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "std_101",
      "email": "student@demo.com",
      "name": "Arjun Munda",
      "role": "STUDENT"
    }
  }
  ```

### `POST /auth/login`
- **Purpose:** Authenticate user and issue JWT token.
- **Auth / Role:** Public
- **Request Example:**
  ```json
  {
    "email": "student@demo.com",
    "password": "password123"
  }
  ```
- **Response Example (`200 OK`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "std_101",
      "email": "student@demo.com",
      "name": "Arjun Munda",
      "role": "STUDENT"
    }
  }
  ```

---

## 2. Student & Profile APIs

### `GET /student/profile`
- **Purpose:** Fetch authenticated student's full profile including ST category, state, institute, bank details status.
- **Auth / Role:** Required (`STUDENT`)
- **Response Example (`200 OK`):**
  ```json
  {
    "id": "profile_101",
    "userId": "std_101",
    "state": "Jharkhand",
    "district": "Ranchi",
    "tribeCategory": "Santhal",
    "annualIncome": 120000,
    "currentEducation": "B.Tech Computer Science",
    "academicPercentage": 84.5
  }
  ```

### `PUT /student/profile`
- **Purpose:** Update student profile attributes.
- **Auth / Role:** Required (`STUDENT`)
- **Request Example:**
  ```json
  {
    "annualIncome": 115000,
    "academicPercentage": 86.0
  }
  ```

---

## 3. Scholarship & Fellowship APIs

### `GET /scholarships`
- **Purpose:** Query and filter available ST scholarship opportunities.
- **Auth / Role:** Required (Any authenticated user)
- **Query Params:** `category`, `state`, `educationLevel`, `search`
- **Response Example (`200 OK`):**
  ```json
  [
    {
      "id": "sch_post_matric_01",
      "title": "Post-Matric Scholarship for ST Students - Jharkhand",
      "ministry": "Ministry of Tribal Affairs",
      "amount": 25000,
      "deadline": "2026-11-30T00:00:00.000Z",
      "category": "POST_MATRIC"
    }
  ]
  ```

### `GET /scholarships/:id`
- **Purpose:** Fetch full details and eligibility criteria of a target scholarship.
- **Auth / Role:** Required

### `GET /matching/opportunities`
- **Purpose:** Execute AI Matching Engine on student profile against active ST opportunities.
- **Auth / Role:** Required (`STUDENT`)
- **Response Example (`200 OK`):**
  ```json
  [
    {
      "scholarshipId": "sch_post_matric_01",
      "matchScore": 96,
      "eligibilityStatus": "HIGHLY_ELIGIBLE",
      "reasons": ["ST Category Matched", "Income below ₹2.5L limit", "Minimum marks criteria met"]
    }
  ]
  ```

### `GET /eligibility/:id`
- **Purpose:** Generate natural-language explainable eligibility breakdown for a specific scheme.
- **Auth / Role:** Required (`STUDENT`)

---

## 4. Document Intelligence & Deficiency Repair APIs

### `GET /documents`
- **Purpose:** List student's uploaded documents with verification flags and scores.
- **Auth / Role:** Required (`STUDENT`)

### `POST /documents/upload`
- **Purpose:** Securely upload a student document (PDF/PNG/JPEG) with server-side MIME & file header validation.
- **Auth / Role:** Required (`STUDENT`)

### `POST /deficiency/repair`
- **Purpose:** Deficiency Repair Copilot endpoint to replace deficient documents and clear error flags.
- **Auth / Role:** Required (`STUDENT`)
- **Request Example:** `multipart/form-data` with `documentId`, `file`, and `repairNote`.

---

## 5. Application & Digital Twin APIs

### `GET /applications`
- **Purpose:** Fetch student's submitted or draft applications.
- **Auth / Role:** Required (`STUDENT`)

### `POST /applications/apply`
- **Purpose:** Initiate or submit a new scholarship application.
- **Auth / Role:** Required (`STUDENT`)
- **Request Example:**
  ```json
  {
    "scholarshipId": "sch_post_matric_01",
    "documentIds": ["doc_1", "doc_2", "doc_3"]
  }
  ```

### `GET /applications/:id/timeline`
- **Purpose:** **Scholarship Application Digital Twin API**. Returns full live stage progression, pending action owner, correction notes, and state machine log history.
- **Auth / Role:** Required (`STUDENT`, `INSTITUTE`, `ADMIN`)
- **Response Example (`200 OK`):**
  ```json
  {
    "applicationId": "app_1001",
    "currentStage": "INSTITUTE_VERIFICATION",
    "status": "UNDER_REVIEW",
    "actionRequiredFrom": "INSTITUTE_OFFICER",
    "studentActionRequired": false,
    "completionPercentage": 60,
    "stages": [
      { "name": "Application Submission", "status": "COMPLETED", "date": "2026-09-20" },
      { "name": "Institute Verification", "status": "IN_PROGRESS", "date": null },
      { "name": "Ministry Sanction", "status": "PENDING", "date": null },
      { "name": "DBT Disbursement", "status": "PENDING", "date": null }
    ]
  }
  ```

---

## 6. Institute Verification Workspace APIs

### `GET /institute/dashboard`
- **Purpose:** Load Institute Nodal Officer verification queue, pending applications, and verified counts.
- **Auth / Role:** Required (`INSTITUTE`, `ADMIN`)

### `POST /institute/verify`
- **Purpose:** Formally verify and forward student application to Ministry stage.
- **Auth / Role:** Required (`INSTITUTE`, `ADMIN`)
- **Request Example:**
  ```json
  {
    "applicationId": "app_1001",
    "action": "APPROVE",
    "remarks": "Document verification completed successfully."
  }
  ```

### `POST /applications/:id/return`
- **Purpose:** Return application to student for deficiency correction with specific officer notes.
- **Auth / Role:** Required (`INSTITUTE`, `ADMIN`)
- **Request Example:**
  ```json
  {
    "remarks": "Correction Reason: Income Certificate Expired | Affected: Income Cert | Note: Please upload 2026 FY certificate."
  }
  ```

---

## 7. Ministry & Admin Intelligence APIs

### `GET /admin/analytics`
- **Purpose:** High-level executive decision-support dashboard data (total grant sanctioned, bottleneck insights, state breakdown).
- **Auth / Role:** Required (`ADMIN`)

### `GET /admin/audit-logs`
- **Purpose:** Audit log system records tracking security, login, and application status transitions.
- **Auth / Role:** Required (`ADMIN`)

---

## 8. Renewal & Academic Roadmap APIs

### `GET /renewals`
- **Purpose:** Check scholarship renewal eligibility, performance tracking, and requirement readiness percentage.
- **Auth / Role:** Required (`STUDENT`)

### `POST /renewals/submit`
- **Purpose:** Submit annual scholarship renewal request with grade sheet proof.
- **Auth / Role:** Required (`STUDENT`)

### `GET /roadmap`
- **Purpose:** Academic & Fellowship Future Opportunity Roadmap with scenario simulator projection.
- **Auth / Role:** Required (`STUDENT`)

---

## 9. AI Assistant & Voice APIs

### `POST /assistant/chat`
- **Purpose:** Non-authoritative context-aware AI assistant prompt handler. Provides guidance without state modification.
- **Auth / Role:** Required (Any authenticated user)
- **Request Example:**
  ```json
  {
    "message": "How do I check my renewal deadline?",
    "language": "hi",
    "currentRoute": "/renewals"
  }
  ```
- **Response Example (`200 OK`):**
  ```json
  {
    "reply": "नवीनीकरण पृष्ठ पर आपके अंकपत्रक और उपस्थिति प्रमाणपत्र की स्थिति देखी जा सकती है।",
    "actionSuggested": "GO_TO_RENEWALS"
  }
  ```
