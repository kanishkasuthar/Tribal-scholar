import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ArrowRight, Wrench, ShieldCheck } from 'lucide-react';

export const StudentApplicationPreparation: React.FC = () => {
  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* 1. HEADER BANNER */}
      <div className="bg-white rounded-xl p-6 border border-border shadow-2xs space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded border border-maroon-100 inline-block">
          PREPARE FOR SUBMISSION
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-brand-dark">
          APPLICATION READINESS
        </h1>
        <p className="text-xs text-muted-text">
          Inspect profile completeness, document validation, and eligibility checks before launching single-click submission.
        </p>
      </div>

      {/* 2. PROGRESS VISUALIZATION & 4 STAGES */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-text block">OVERALL STATUS</span>
            <h2 className="font-serif font-extrabold text-xl text-brand-dark">Readiness Score</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full border-4 border-forest flex items-center justify-center font-serif font-extrabold text-lg text-forest bg-forest/5">
              84%
            </div>
          </div>
        </div>

        {/* FOUR STAGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-serif font-bold">
          <div className="bg-forest/10 border border-forest/30 p-4 rounded-xl text-forest space-y-1">
            <span className="text-[10px] font-mono block uppercase">STAGE 01</span>
            <span className="block font-serif text-sm">PROFILE ✓</span>
            <span className="text-[10px] font-normal block">Aadhaar Verified</span>
          </div>

          <div className="bg-terracotta/10 border border-terracotta/30 p-4 rounded-xl text-terracotta space-y-1">
            <span className="text-[10px] font-mono block uppercase">STAGE 02</span>
            <span className="block font-serif text-sm">DOCUMENTS ⚠</span>
            <span className="text-[10px] font-normal block">1 Issue Flagged</span>
          </div>

          <div className="bg-forest/10 border border-forest/30 p-4 rounded-xl text-forest space-y-1">
            <span className="text-[10px] font-mono block uppercase">STAGE 03</span>
            <span className="block font-serif text-sm">ELIGIBILITY ✓</span>
            <span className="text-[10px] font-normal block">94% Rules Matched</span>
          </div>

          <div className="bg-ivory border border-border p-4 rounded-xl text-charcoal space-y-1">
            <span className="text-[10px] font-mono block uppercase">STAGE 04</span>
            <span className="block font-serif text-sm">FORM ○</span>
            <span className="text-[10px] font-normal block">Pending Fix</span>
          </div>
        </div>
      </div>

      {/* 3. LARGE NEXT ACTION CARD */}
      <div className="bg-white rounded-xl border-2 border-terracotta p-6 shadow-xs space-y-3">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <span className="text-[10px] font-extrabold uppercase text-terracotta tracking-wider">RECOMMENDED ACTION</span>
          <AlertTriangle className="w-5 h-5 text-terracotta" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-serif font-extrabold text-base text-brand-dark">NEXT ACTION: FIX INCOME CERTIFICATE</h3>
            <p className="text-xs text-muted-text">
              Resolve the name mismatch on your Income Certificate to boost readiness score to 100%.
            </p>
          </div>

          <Link
            to="/student/deficiency-copilot"
            className="bg-terracotta hover:bg-terracotta/90 text-white font-extrabold text-xs px-6 py-3 rounded shadow transition-all flex items-center gap-1.5 shrink-0"
          >
            <Wrench className="w-4 h-4 text-white" /> Fix Now
          </Link>
        </div>
      </div>
    </div>
  );
};

