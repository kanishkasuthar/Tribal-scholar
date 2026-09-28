import React from 'react';
import { Target, Award, HeartHandshake, ShieldCheck, Building2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 bg-cream min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-ivory border-b border-border py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-100 px-3 py-1 rounded-full text-xs text-brand-maroon font-bold">
              <Building2 className="w-3.5 h-3.5 text-brand-maroon" /> GOVERNMENT OF INDIA • MINISTRY OF TRIBAL AFFAIRS
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-brand-dark tracking-tight leading-tight">
              ABOUT TRIBAL SCHOLAR AI & <br />
              <span className="text-brand-maroon">
                MINISTRY OF TRIBAL AFFAIRS
              </span>
            </h1>
            <p className="text-sm text-muted-text max-w-xl leading-relaxed font-normal">
              Next-generation AI governance platform ensuring 100% scholarship inclusion, preventive document repair, and zero-leakage Direct Benefit Transfer (DBT) for Scheduled Tribe students across India.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-maroon-900 h-64 relative">
              <img
                src="/images/indian_scholar_hero.jpg"
                alt="Ministry of Tribal Affairs"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-border text-[11px] font-bold text-charcoal flex justify-between items-center">
                <span>Shastri Bhawan, New Delhi</span>
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-maroon-50 text-brand-maroon flex items-center justify-center font-bold">
              <Target className="w-5 h-5 text-brand-maroon" />
            </div>
            <h3 className="font-serif font-extrabold text-lg text-brand-dark">100% Inclusion Mandate</h3>
            <p className="text-xs text-muted-text leading-relaxed">
              Eliminating administrative bottlenecks and document mismatch rejections that historically delayed ST student funding.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 text-dark-brown flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-gold" />
            </div>
            <h3 className="font-serif font-extrabold text-lg text-brand-dark">Premier & Overseas Studies</h3>
            <p className="text-xs text-muted-text leading-relaxed">
              Fully funding higher education in IITs, IIMs, AIIMS, and Top 500 foreign universities through flagship national schemes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-forest/10 text-forest flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5 text-forest" />
            </div>
            <h3 className="font-serif font-extrabold text-lg text-brand-dark">Direct Benefit Transfer (DBT)</h3>
            <p className="text-xs text-muted-text leading-relaxed">
              Ensuring direct, transparent bank transfer with real-time audit logs and zero intermediary leakage.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

