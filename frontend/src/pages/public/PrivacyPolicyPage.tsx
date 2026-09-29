import React from 'react';
import { ShieldCheck, FileText, Lock, Eye, Database, Server, UserCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 bg-cream min-h-screen">
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-border py-10 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-maroon" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100">
              LEGAL & PRIVACY TRANSPARENCY
            </span>
          </div>
          <h1 className="text-3xl font-serif font-black text-brand-dark">Privacy Policy</h1>
          <p className="text-xs text-muted-text leading-relaxed">
            Effective Date: September 29, 2026 • Last Updated: September 2026
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-4xl mx-auto px-6 space-y-8 text-xs text-charcoal leading-relaxed">
        {/* SECTION 1: OVERVIEW */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <Lock className="w-4 h-4 text-brand-maroon" /> 1. Commitment to Student Privacy
          </h2>
          <p>
            Tribal Scholar AI is dedicated to empowering Scheduled Tribe (ST) students across India with intelligent scholarship assistance while strictly safeguarding personal and academic data. This Privacy Policy explains how we collect, store, process, and protect your information when using our platform.
          </p>
        </div>

        {/* SECTION 2: INFORMATION WE COLLECT */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-4 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <Database className="w-4 h-4 text-brand-maroon" /> 2. Information We Collect & Purpose
          </h2>

          <div className="space-y-3">
            <div className="p-3.5 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block text-xs">Account Registration Data</strong>
              <p className="text-muted-text">
                <strong>What:</strong> Full Legal Name, Email Address, Password Hash.<br />
                <strong>Purpose:</strong> Account creation, user authentication, and 6-digit email OTP verification. Passwords are encrypted using bcrypt cost factor 10.
              </p>
            </div>

            <div className="p-3.5 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block text-xs">Academic & Eligibility Profile Data</strong>
              <p className="text-muted-text">
                <strong>What:</strong> Education level (School, Vocational, UG, PG, Research), Institution Name, Course, Current Year, Academic Performance (CGPA/%), State of Domicile, District, ST Category, Sub-Tribe, Annual Family Income, and DBT Bank Account metadata.<br />
                <strong>Purpose:</strong> Rule-based AI scholarship matching, explainable eligibility evaluation, and personalized opportunity roadmaps. Unentered fields default to "Not provided".
              </p>
            </div>

            <div className="p-3.5 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block text-xs">Uploaded Documents & OCR Metadata</strong>
              <p className="text-muted-text">
                <strong>What:</strong> Uploaded certificate files (ST Certificate, Income Certificate, Marksheets, Bonafide Letter) and AI OCR extracted field text.<br />
                <strong>Purpose:</strong> Automated document deficiency inspection (preventive Copilot detection of spelling or format mismatches).
              </p>
            </div>

            <div className="p-3.5 bg-ivory rounded-xl border border-border space-y-1">
              <strong className="font-bold text-brand-dark block text-xs">Grievances & AI Assistant Interactions</strong>
              <p className="text-muted-text">
                <strong>What:</strong> Grievance category/descriptions and chat queries submitted to Tribal Scholar AI Assistant.<br />
                <strong>Purpose:</strong> Grievance ticket resolution and context-aware informational support.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: DATA SECURITY & OWNERSHIP */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <UserCheck className="w-4 h-4 text-brand-maroon" /> 3. Data Ownership & Access Controls
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-text">
            <li><strong>Strict Student Ownership:</strong> Students can only view, edit, or download their own profile data and uploaded documents. Backend REST APIs verify ownership using JWT session IDs on every request.</li>
            <li><strong>Protected File Streaming:</strong> Sensitive document files are never exposed through public static web URLs. Files are streamed exclusively via authenticated routes (`/api/documents/:id/download`).</li>
            <li><strong>Role-Based Security:</strong> Authorized Nodal Officers and Administrators access application records strictly for verification and process bottleneck monitoring.</li>
          </ul>
        </div>

        {/* SECTION 4: AI & THIRD-PARTY SERVICES */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <Server className="w-4 h-4 text-brand-maroon" /> 4. Third-Party Services & AI Disclosure
          </h2>
          <p>
            Tribal Scholar AI uses Nodemailer SMTP for account verification emails and local deterministic AI rules / verified API providers for eligibility evaluation. We do not sell, rent, or monetize student data to commercial third parties.
          </p>
        </div>

        {/* SECTION 5: CONTACT & COMPLIANCE */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-2 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            5. Contact Us
          </h2>
          <p className="text-muted-text">
            For questions regarding data protection, account deletion requests, or privacy inquiries, contact the platform support desk at <a href="mailto:support@tribalscholar.gov.in" className="text-brand-maroon font-bold underline">support@tribalscholar.gov.in</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
