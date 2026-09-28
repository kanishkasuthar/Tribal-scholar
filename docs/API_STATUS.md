# REST API Audit & Inventory Status — Tribal Scholar AI

This document presents the complete technical audit of all REST API endpoints implemented in the **Tribal Scholar AI** backend, their authorization requirements, database interactions, frontend consumers, and operational status.

---

## 1. Authentication & User Preference APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | Public | Public | `User`, `StudentProfile` | `RegisterPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public | Public | `User` | `LoginPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/user/preferences` | Fetch user accessibility & language prefs | JWT | Any | `UserPreference` | `AIAssistantDrawer.tsx`, `Header.tsx` | `IMPLEMENTED + CONNECTED` |
| `PUT` | `/api/user/preferences` | Update language, contrast, font size | JWT | Any | `UserPreference` | `AIAssistantDrawer.tsx`, `Header.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 2. Student & Profile APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/students/me` | Fetch authenticated student profile | JWT | `STUDENT` | `StudentProfile`, `User` | `StudentDashboard.tsx`, `StudentProfile.tsx` | `IMPLEMENTED + CONNECTED` |
| `PUT` | `/api/students/me` | Update student profile attributes | JWT | `STUDENT` | `StudentProfile` | `StudentProfile.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/students/me/profile-completion` | Compute profile completeness % | JWT | `STUDENT` | `StudentProfile` | `StudentDashboard.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 3. Scholarship & Fellowship Discovery APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/scholarships` | Search & filter ST scholarships | JWT | Any | `Scholarship`, `EligibilityRule` | `StudentOpportunities.tsx`, `LandingPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/scholarships/:id` | Fetch scholarship details & rules | JWT | Any | `Scholarship`, `EligibilityRule` | `StudentOpportunityDetail.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/fellowships` | Fetch research fellowships | JWT | Any | `Fellowship` | `StudentOpportunities.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/matching/opportunities` | Run AI Profile Matching Engine | JWT | `STUDENT` | `StudentProfile`, `Scholarship` | `StudentDashboard.tsx`, `StudentOpportunities.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/eligibility/:id` | Explainable eligibility breakdown | JWT | `STUDENT` | `StudentProfile`, `Scholarship` | `StudentEligibilityDetail.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 4. Document Intelligence & Deficiency Repair APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/documents` | Fetch uploaded documents & status | JWT | `STUDENT` | `Document`, `DocumentCheck` | `StudentDocuments.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/documents/upload` | Upload document file with OCR scan | JWT | `STUDENT` | `Document`, `DocumentCheck` | `StudentDocuments.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/documents/readiness` | Calculate Document Readiness Score | JWT | `STUDENT` | `Document` | `StudentDashboard.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/deficiency-copilot` | Fetch active document deficiencies | JWT | `STUDENT` | `DocumentDeficiency` | `StudentDeficiencyCopilotPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/deficiency-copilot/repair` | Upload corrected document & recheck | JWT | `STUDENT` | `DocumentDeficiency`, `Document` | `StudentDeficiencyCopilotPage.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 5. Application Lifecycle & Digital Twin APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | List student applications | JWT | `STUDENT` | `Application`, `Scholarship` | `StudentApplications.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/applications/apply` | Submit new scholarship application | JWT | `STUDENT` | `Application`, `ApplicationStatusHistory` | `StudentApplicationPreparation.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/applications/:id/digital-twin` | **Digital Twin Timeline State Machine** | JWT | Any | `Application`, `ApplicationStatusHistory` | `StudentDigitalTwinPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/applications/:id/return` | Return application for correction | JWT | `INSTITUTE`, `ADMIN` | `Application`, `ApplicationStatusHistory` | `InstituteApplicationReviewPage.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 6. Institute Verification Workspace APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/institute/dashboard` | Load pending verification queue | JWT | `INSTITUTE`, `ADMIN` | `Application`, `Institute` | `InstituteDashboard.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/institute/applications/:id` | Review student application details | JWT | `INSTITUTE`, `ADMIN` | `Application`, `Document` | `InstituteApplicationReviewPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/institute/verify` | Verify & forward to Department | JWT | `INSTITUTE`, `ADMIN` | `Application`, `ApplicationStatusHistory` | `InstituteApplicationReviewPage.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 7. Ministry Admin & Process Intelligence APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | High-level Ministry KPI metrics | JWT | `ADMIN` | `Application`, `Scholarship` | `AdminDashboard.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/admin/applications` | Multi-filter application explorer | JWT | `ADMIN` | `Application` | `AdminApplications.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/admin/audit-logs` | Fetch system audit trail | JWT | `ADMIN` | `AuditLog` | `AdminAuditLogs.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/process-intelligence/report` | Process Intelligence Report | JWT | `ADMIN` | `Application`, `DocumentDeficiency` | `AdminAIInsights.tsx` | `IMPLEMENTED + CONNECTED` |

---

## 8. Renewal, Roadmap & Assistant APIs

| Method | Endpoint | Purpose | Auth Required | Role | Database Interaction | Frontend Consumer | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/student/renewals` | Renewal Readiness % & deadlines | JWT | `STUDENT` | `ScholarshipRenewal` | `StudentRenewalCenter.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/student/renewals/submit` | Submit scholarship renewal request | JWT | `STUDENT` | `ScholarshipRenewal` | `StudentRenewalApplicationPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/student/roadmap` | Academic & research fellowship roadmap | JWT | `STUDENT` | `StudentProgress`, `Fellowship` | `StudentOpportunityRoadmapPage.tsx` | `IMPLEMENTED + CONNECTED` |
| `POST` | `/api/ai/assistant` | Context-aware AI Assistant handler | JWT | Any | Service Orchestration | `AIAssistantDrawer.tsx` | `IMPLEMENTED + CONNECTED` |
| `GET` | `/api/assistant/suggestions` | Contextual prompt chips | JWT | Any | Service Orchestration | `AIAssistantDrawer.tsx` | `IMPLEMENTED + CONNECTED` |
