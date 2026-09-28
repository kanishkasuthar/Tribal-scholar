import React from 'react';
import { UserCheck, Search, Sparkles, BookOpen, FileCheck, Wrench, Send, Building2, GitMerge, RefreshCw, ArrowRight } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const STEPS = [
    { num: '01', title: 'Profile', desc: 'Create your ST scholar profile with Aadhaar & Caste details.', icon: UserCheck },
    { num: '02', title: 'Discover', desc: 'Explore central & state schemes tailored for your degree level.', icon: Search },
    { num: '03', title: 'Match', desc: 'AI calculates your exact eligibility and match confidence score.', icon: Sparkles },
    { num: '04', title: 'Understand', desc: 'Get transparent breakdown of income limits, marks cutoffs & docs.', icon: BookOpen },
    { num: '05', title: 'Prepare', desc: 'Organize required documents in your secure Digital Locker.', icon: FileCheck },
    { num: '06', title: 'Repair', desc: 'AI Copilot detects document name/spelling mismatches before submit.', icon: Wrench },
    { num: '07', title: 'Apply', desc: 'Submit application with verified digital attachments in one click.', icon: Send },
    { num: '08', title: 'Verify', desc: 'Institute officer reviews & signs bonafide verification online.', icon: Building2 },
    { num: '09', title: 'Track', desc: 'Follow live progress through Digital Twin state machine transitions.', icon: GitMerge },
    { num: '10', title: 'Renew', desc: 'Receive predictive renewal alerts before academic year deadlines.', icon: RefreshCw },
  ];

  return (
    <div className="space-y-12 pb-16 bg-cream min-h-screen">
      {/* HERO */}
      <section className="bg-ivory border-b border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-1 rounded-full border border-maroon-100 inline-block">
            TRANSPARENT SCHOLARSHIP ARCHITECTURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-brand-dark tracking-tight">
            HOW TRIBAL SCHOLAR AI WORKS
          </h1>
          <p className="text-xs sm:text-sm text-muted-text max-w-2xl leading-relaxed">
            A 10-stage visual journey from scholar registration to predictive renewal.
          </p>
        </div>
      </section>

      {/* CONNECTED 10-STEP VISUAL JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-8">
          <div className="border-b border-border pb-4 flex justify-between items-center">
            <h2 className="font-serif font-extrabold text-xl text-brand-dark">10-STEP LIFECYCLE ROADMAP</h2>
            <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1 rounded">End-to-End Guided</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="bg-ivory p-5 rounded-xl border border-border shadow-2xs hover:shadow-xs transition-all space-y-3 relative group"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-3xl font-extrabold text-gold">{step.num}</span>
                    <div className="w-9 h-9 rounded-lg bg-brand-maroon text-white flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-extrabold text-sm text-brand-dark">{step.title}</h3>
                    <p className="text-[11px] text-muted-text leading-relaxed">{step.desc}</p>
                  </div>

                  {idx < 9 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gold">
                      <ArrowRight className="w-4 h-4 text-gold font-bold" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

