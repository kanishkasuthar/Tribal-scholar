import React, { useState } from 'react';
import { PhoneCall, Mail, Bot, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'How does the AI Deficiency Repair Copilot work?',
      a: 'The Copilot inspects uploaded documents (Aadhaar, Caste Certificate, Marksheet) and compares name spellings, DOB, and certificate numbers against your application data. It alerts you to mismatches before official submission.',
    },
    {
      q: 'Who is eligible for the Post-Matric ST Scholarship?',
      a: 'ST students studying in Class 11, 12, Diploma, Degree, or PG courses whose annual family income does not exceed ₹2.5 Lakhs are eligible.',
    },
    {
      q: 'How do I track my application status via Digital Twin?',
      a: 'Navigate to Student Dashboard -> Digital Twin to view the deterministic state machine tracking your application through Institute, State, and Central Ministry approvals.',
    },
    {
      q: 'What should I do if my institute officer has not verified my form?',
      a: 'You can check the responsible officer details in your Digital Twin view or raise a Grievance ticket directly through the Help Desk.',
    },
  ];

  return (
    <div className="space-y-12 pb-16 bg-cream min-h-screen">
      {/* HERO BANNER */}
      <section className="bg-ivory border-b border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-1 rounded-full border border-maroon-100 inline-block">
            24/7 SCHOLAR ASSISTANCE & HELPDESK
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-serif text-brand-dark tracking-tight">
            HELP CENTER & FAQS
          </h1>
          <p className="text-xs sm:text-sm text-muted-text max-w-2xl leading-relaxed">
            Need assistance with your scholarship application, document upload, or deficiency repair? Get instant help from our team or AI Assistant.
          </p>
        </div>
      </section>

      {/* THREE SUPPORT BLOCKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-maroon-50 text-brand-maroon flex items-center justify-center font-bold">
              <PhoneCall className="w-5 h-5 text-brand-maroon" />
            </div>
            <h3 className="font-serif font-extrabold text-base text-brand-dark">Toll Free Helpline</h3>
            <p className="text-xs text-muted-text">1800-11-7788 (Mon - Sat, 9:00 AM - 6:00 PM)</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
              <Mail className="w-5 h-5 text-terracotta" />
            </div>
            <h3 className="font-serif font-extrabold text-base text-brand-dark">Email Support</h3>
            <p className="text-xs text-muted-text font-mono">support-scholarship@mota.gov.in</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 text-dark-brown flex items-center justify-center font-bold">
              <Bot className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif font-extrabold text-base text-brand-dark">AI Assistant</h3>
            <p className="text-xs text-muted-text">Ask questions in English, Hindi, Odia, or Santhali via voice or chat.</p>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="space-y-3 pt-4">
          <h2 className="text-xl font-serif font-extrabold text-brand-dark mb-4">FREQUENTLY ASKED QUESTIONS</h2>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white rounded-xl border border-border overflow-hidden shadow-2xs">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-4 flex justify-between items-center font-serif font-extrabold text-sm text-brand-dark hover:text-brand-maroon transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-brand-maroon" /> : <ChevronDown className="w-4 h-4 text-muted-text" />}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-muted-text leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

