import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import { PublicLayout } from './components/layout/PublicLayout';
import { StudentLayout } from './components/layout/StudentLayout';
import { InstituteLayout } from './components/layout/InstituteLayout';
import { AdminLayout } from './components/layout/AdminLayout';

import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { ScholarshipsPage } from './pages/public/ScholarshipsPage';
import { ScholarshipDetailPage } from './pages/public/ScholarshipDetailPage';
import { FellowshipsPage } from './pages/public/FellowshipsPage';
import { FellowshipDetailPage } from './pages/public/FellowshipDetailPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { HelpPage } from './pages/public/HelpPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsPage } from './pages/public/TermsPage';
import { CookiePolicyPage } from './pages/public/CookiePolicyPage';

import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { StudentOpportunities } from './pages/student/StudentOpportunities';
import { StudentEligibilityDetail } from './pages/student/StudentEligibilityDetail';
import { StudentDocuments } from './pages/student/StudentDocuments';
import { StudentDeficiencyCopilotPage } from './pages/student/StudentDeficiencyCopilotPage';
import { StudentApplications } from './pages/student/StudentApplications';
import { StudentApplicationPreparation } from './pages/student/StudentApplicationPreparation';
import { StudentDigitalTwinPage } from './pages/student/StudentDigitalTwinPage';
import { StudentReminders } from './pages/student/StudentReminders';
import { StudentGrievances } from './pages/student/StudentGrievances';

import { StudentFundingJourney } from './pages/student/StudentFundingJourney';
import { StudentFundingHistory } from './pages/student/StudentFundingHistory';
import { StudentRenewalCenter } from './pages/student/StudentRenewalCenter';
import { StudentRenewalApplicationPage } from './pages/student/StudentRenewalApplicationPage';
import { StudentAcademicProgressPage } from './pages/student/StudentAcademicProgressPage';
import { StudentOpportunityRoadmapPage } from './pages/student/StudentOpportunityRoadmapPage';

import { InstituteDashboard } from './pages/institute/InstituteDashboard';
import { InstituteApplications } from './pages/institute/InstituteApplications';
import { InstituteApplicationReviewPage } from './pages/institute/InstituteApplicationReviewPage';
import { InstituteOfficerHistoryPage } from './pages/institute/InstituteOfficerHistoryPage';
import { InstituteAnalytics } from './pages/institute/InstituteAnalytics';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminApplicationDetail } from './pages/admin/AdminApplicationDetail';
import { AdminScholarships } from './pages/admin/AdminScholarships';
import { AdminDistricts } from './pages/admin/AdminDistricts';
import { AdminAIInsights } from './pages/admin/AdminAIInsights';
import { AdminDisbursement } from './pages/admin/AdminDisbursement';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';
import { AdminGrievances } from './pages/admin/AdminGrievances';

const ProtectedRoute: React.FC<{ children: React.ReactElement; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-xs font-bold text-forest-800">Authenticating user session...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/scholarships/:id" element={<ScholarshipDetailPage />} />
        <Route path="/fellowships" element={<FellowshipsPage />} />
        <Route path="/fellowships/:id" element={<FellowshipDetailPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      </Route>

      {/* Student Portal Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="funding" element={<StudentFundingJourney />} />
        <Route path="funding/history" element={<StudentFundingHistory />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="opportunities" element={<StudentOpportunities />} />
        <Route path="opportunities/:id" element={<ScholarshipDetailPage />} />
        <Route path="eligibility/:id" element={<StudentEligibilityDetail />} />
        <Route path="documents" element={<StudentDocuments />} />
        <Route path="deficiency-copilot" element={<StudentDeficiencyCopilotPage />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="applications/:id" element={<StudentApplicationPreparation />} />
        <Route path="digital-twin/:id" element={<StudentDigitalTwinPage />} />
        <Route path="reminders" element={<StudentReminders />} />
        <Route path="renewals" element={<StudentRenewalCenter />} />
        <Route path="renewals/:id" element={<StudentRenewalApplicationPage />} />
        <Route path="progress" element={<StudentAcademicProgressPage />} />
        <Route path="roadmap" element={<StudentOpportunityRoadmapPage />} />
        <Route path="fellowships" element={<FellowshipsPage />} />
        <Route path="grievances" element={<StudentGrievances />} />
      </Route>

      {/* Institute Verification Protected Routes */}
      <Route
        path="/institute"
        element={
          <ProtectedRoute allowedRoles={['INSTITUTE', 'ADMIN']}>
            <InstituteLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InstituteDashboard />} />
        <Route path="applications" element={<InstituteApplications />} />
        <Route path="applications/:id" element={<InstituteApplicationReviewPage />} />
        <Route path="applications/:id/history" element={<InstituteOfficerHistoryPage />} />
        <Route path="analytics" element={<InstituteAnalytics />} />
      </Route>

      {/* Ministry Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="applications/:id" element={<AdminApplicationDetail />} />
        <Route path="scholarships" element={<AdminScholarships />} />
        <Route path="districts" element={<AdminDistricts />} />
        <Route path="ai-insights" element={<AdminAIInsights />} />
        <Route path="disbursement" element={<AdminDisbursement />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="grievances" element={<AdminGrievances />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
