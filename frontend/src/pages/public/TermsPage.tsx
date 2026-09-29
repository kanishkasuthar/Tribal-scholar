import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 bg-cream min-h-screen">
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-border py-10 px-6">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-maroon" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100">
              TERMS OF SERVICE
            </span>
          </div>
          <h1 className="text-3xl font-serif font-black text-brand-dark">Terms & Conditions</h1>
          <p className="text-xs text-muted-text leading-relaxed">
            Effective Date: September 29, 2026 • Platform Terms of Use
          </p>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="max-w-4xl mx-auto px-6 space-y-8 text-xs text-charcoal leading-relaxed">
        {/* SECTION 1: PLATFORM PURPOSE & ASSISTANCE DISCLAIMER */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <ShieldAlert className="w-4 h-4 text-brand-maroon" /> 1. Platform Purpose & Official Assistance Disclaimer
          </h2>
          <p>
            Tribal Scholar AI is an AI-enabled scholarship guidance and document assistance platform built for Scheduled Tribe (ST) students. 
          </p>
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-medium space-y-1">
            <strong>Important Notice:</strong> Tribal Scholar AI provides guidance, AI match insights, document deficiency checking, and application timeline visualization. Unless an official government integration is explicitly specified, official application submissions, sanction decisions, and scholarship disbursements occur on official government portals (such as the National Scholarship Portal at <a href="https://scholarships.gov.in" target="_blank" rel="noreferrer" className="underline font-bold">scholarships.gov.in</a> or Ministry of Tribal Affairs at <a href="https://tribal.nic.in" target="_blank" rel="noreferrer" className="underline font-bold">tribal.nic.in</a>).
          </div>
        </div>

        {/* SECTION 2: ACCEPTABLE USE & ACCOUNT RESPONSIBILITY */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <CheckCircle2 className="w-4 h-4 text-brand-maroon" /> 2. Account Responsibility & Acceptable Use
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-text">
            <li>Users agree to provide accurate, truthful personal and academic information.</li>
            <li>Uploading fraudulent, forged, or altered government certificates is strictly prohibited.</li>
            <li>Users are responsible for maintaining account credential confidentiality.</li>
            <li>Attempting unauthorized access to other students' profiles or documents will result in immediate account termination.</li>
          </ul>
        </div>

        {/* SECTION 3: AI ASSISTANCE LIMITATIONS */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-3 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark flex items-center gap-2 border-b border-border pb-2">
            <HelpCircle className="w-4 h-4 text-brand-maroon" /> 3. AI Insights & Eligibility Limitations
          </h2>
          <p>
            AI-generated profile match scores, explainable eligibility breakdowns, and deficiency repair suggestions are informational tools to assist students in preparing high-quality applications. Official scheme eligibility, document verification, and final sanction decisions remain subject to official State and Central Ministry guidelines and Nodal Officer verification.
          </p>
        </div>

        {/* SECTION 4: NO PAYMENTS / FREE PLATFORM */}
        <div className="bg-white p-6 rounded-2xl border border-border space-y-2 shadow-2xs">
          <h2 className="font-serif font-extrabold text-base text-brand-dark border-b border-border pb-2">
            4. Free Service Guarantee
          </h2>
          <p className="text-muted-text">
            Tribal Scholar AI is 100% free for ST students. We do not charge application fees, premium subscription fees, or document processing charges.
          </p>
        </div>
      </div>
    </div>
  );
};
