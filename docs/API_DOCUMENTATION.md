# REST API Documentation - Tribal Scholar AI

**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new user account.
- **Request Body:**
  ```json
  {
    "email": "student@tribalscholar.gov.in",
    "password": "student123",
    "name": "Kanishka Suthar",
    "role": "STUDENT",
    "mobile": "+91 98765 43210"
  }
  ```
- **Response:** `201 Created` with JWT token and user object.

### `POST /auth/login`
Authenticates a user.
- **Request Body:**
  ```json
  {
    "email": "student@tribalscholar.gov.in",
    "password": "student123"
  }
  ```

---

## 2. AI Matching & Eligibility Endpoints

### `GET /matching/opportunities`
*(Auth Required: Student)*
Runs the AI Matching Engine for the authenticated student's profile against active ST schemes.
- **Response:** List of matched schemes with match score %, criteria checklist, and reasons.

### `GET /eligibility/:id`
*(Auth Required: Student)*
Generates an explainable eligibility report for a target scholarship.
- **Response:** Detailed status for Academic, Income, Category, and Document requirements.

---

## 3. Document Readiness & Deficiency Repair Endpoints

### `GET /documents`
Fetches all uploaded documents for the student.

### `GET /documents/readiness`
Calculates overall Document Readiness Score (e.g., 85/100) and counts.

### `POST /documents/upload`
Uploads a document file and runs automated AI checks.

### `POST /deficiency/repair`
Implements the AI Deficiency Repair Copilot endpoint. Uploads corrected replacement files, updates document status to `VERIFIED`, and clears deficiency flags.

---

## 4. Application & Digital Twin Endpoints

### `GET /applications`
Fetches active applications for the student.

### `POST /applications/apply`
Submits a new scholarship application.

### `GET /applications/:id/timeline`
**Scholarship Application Digital Twin Endpoint.** Returns full stage flow, current authority, action prompts, and historical logs.

---

## 5. Institute Verification Endpoints

### `GET /institute/dashboard`
*(Auth Required: Institute/Admin)*
Returns pending workload queue, assigned applications, and turnaround stats.

### `POST /institute/verify`
*(Auth Required: Institute/Admin)*
Approves, requests correction, or returns an application with official officer comments.

---

## 6. Ministry Admin Analytics Endpoints

### `GET /admin/analytics`
Returns national application counts, disbursement totals (₹18.4 Crore), state/district distribution data, and AI System Alerts.

### `GET /admin/audit-logs`
Returns the immutable system audit trail.
