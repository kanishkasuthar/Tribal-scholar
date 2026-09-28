import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Activity,
  CheckCircle2,
  Cpu,
  Wrench,
  GraduationCap,
  School,
  BookOpen,
  Microscope,
  Briefcase,
  ArrowUpRight,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LandingPage: React.FC = () => {
  const { t } = useLanguage();

  const educationStages = [
    { key: 'school', title: t('school'), desc: t('schoolDesc'), icon: School, color: 'bg-maroon-50 border-maroon-200 text-brand-maroon' },
    { key: 'diploma', title: t('diploma'), desc: t('diplomaDesc'), icon: BookOpen, color: 'bg-gold/10 border-gold/30 text-charcoal' },
    { key: 'ug', title: t('undergraduate'), desc: t('ugDesc'), icon: GraduationCap, color: 'bg-terracotta/10 border-terracotta/20 text-terracotta' },
    { key: 'pg', title: t('postgraduate'), desc: t('pgDesc'), icon: GraduationCap, color: 'bg-forest/10 border-forest/20 text-forest' },
    { key: 'research', title: t('research'), desc: t('researchDesc'), icon: Microscope, color: 'bg-maroon-100 border-maroon-300 text-brand-dark' },
    { key: 'career', title: t('professional'), desc: t('careerDesc'), icon: Briefcase, color: 'bg-[#5B1720] text-white border-[#5B1720]' },
  ];

  return (
    <div className="space-y-16 pb-16 bg-cream min-h-screen">
      {/* 1. TOP HERO SECTION WITH BROADER EDUCATION STAGE POSITIONING */}
      <section className="bg-ivory text-charcoal pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-maroon-50/40 via-gold-50/20 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* LEFT 45% */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 bg-white border border-gold px-3.5 py-1 rounded-full text-xs text-[#7A1F2B] font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" /> {t('heroBadge')}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight text-[#30251F] leading-[1.05]">
              {t('heroTitle')}
            </h1>

            <p className="text-sm text-muted-text leading-relaxed font-normal">
              {t('heroSubtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/scholarships"
                className="bg-[#7A1F2B] hover:bg-[#5B1720] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded shadow-xs hover:shadow transition-all flex items-center gap-2"
              >
                {t('exploreScholarships')} <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
              <Link
                to="/login"
                className="bg-white hover:bg-[#FFFDF8] text-[#7A1F2B] font-bold text-xs sm:text-sm px-5 py-3 rounded border border-[#7A1F2B] shadow-2xs hover:shadow transition-all flex items-center gap-2"
              >
                {t('signIn')}
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 divide-x divide-border/60 pt-4 border-t border-border/60 text-xs">
              <div className="pr-3">
                <span className="font-serif font-extrabold text-[#7A1F2B] block text-xl leading-tight">Class 9 - PhD</span>
                <span className="text-[10px] text-[#6B6259] font-bold uppercase tracking-wider block">ALL EDUCATION LEVELS</span>
              </div>
              <div className="px-3">
                <span className="font-serif font-extrabold text-[#7A1F2B] block text-xl leading-tight">₹2,450 Cr</span>
                <span className="text-[10px] text-[#6B6259] font-bold uppercase tracking-wider block">ANNUAL DISBURSAL</span>
              </div>
              <div className="pl-3">
                <span className="font-serif font-extrabold text-[#7A1F2B] block text-xl leading-tight">96.4%</span>
                <span className="text-[10px] text-[#6B6259] font-bold uppercase tracking-wider block">AI MATCH ACCURACY</span>
              </div>
            </div>
          </div>

          {/* RIGHT 55% HERO IMAGE VISUAL SHOWING DIVERSE EDUCATION JOURNEY */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-maroon-900 group">
              <img
                src="/images/st_student_scholar.jpg"
                alt="Diverse ST Students Education Journey"
                className="w-full h-80 sm:h-[420px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-3 left-4 right-4 text-xs flex justify-between items-center text-white/90 drop-shadow-sm font-medium">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                    {t('motaName')} • {t('govIndia')}
                  </span>
                  <span className="text-[11px] text-white/90 font-bold">
                    Supporting Scheduled Tribe Scholars at Every Education Stage
                  </span>
                </div>
                <ShieldCheck className="w-5 h-5 text-gold hidden sm:block shrink-0 opacity-90" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-brand-maroon via-terracotta to-gold"></div>
          </div>
        </div>
      </section>

      {/* 2. VISUAL EDUCATION JOURNEY: SCHOOL -> DIPLOMA -> UG -> PG -> RESEARCH -> CAREER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon bg-maroon-50 px-3 py-0.5 rounded-full border border-maroon-100 inline-block">
            {t('educationJourneyTitle')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-brand-dark tracking-tight">
            {t('educationJourneySubtitle')}
          </h2>
        </div>

        {/* 6-STAGE HORIZONTAL FLOW PIPELINE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {educationStages.map((stg, idx) => {
            const Icon = stg.icon;
            return (
              <div
                key={stg.key}
                className={`p-4 rounded-xl border ${stg.color} flex flex-col justify-between space-y-3 relative group hover:-translate-y-1 transition-all shadow-2xs`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-extrabold opacity-70">0{idx + 1}</span>
                  <Icon className="w-4 h-4 text-gold shrink-0" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-extrabold text-xs tracking-wide">{stg.title}</h3>
                  <p className="text-[10px] opacity-90 leading-snug line-clamp-2">{stg.desc}</p>
                </div>
                <Link
                  to="/scholarships"
                  className="text-[10px] font-extrabold underline flex items-center gap-1 opacity-90 hover:opacity-100"
                >
                  {t('exploreScholarships')} →
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURE STRIP (4 COLUMNS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-[#DDD3C5] shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-[#7A1F2B] font-mono">01</span>
              <div className="w-7 h-7 rounded border border-maroon-200 bg-maroon-50 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#7A1F2B]" />
              </div>
            </div>
            <h3 className="font-serif font-extrabold text-xs text-brand-dark tracking-wide">{t('matchedSchemes')}</h3>
            <p className="text-[11px] text-muted-text leading-snug">Personalized opportunity discovery aligned with ST profile.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#DDD3C5] shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-terracotta font-mono">02</span>
              <div className="w-7 h-7 rounded border border-terracotta/20 bg-terracotta/10 flex items-center justify-center">
                <Wrench className="w-3.5 h-3.5 text-terracotta" />
              </div>
            </div>
            <h3 className="font-serif font-extrabold text-xs text-brand-dark tracking-wide">{t('deficiencyCopilot')}</h3>
            <p className="text-[11px] text-muted-text leading-snug">Resolve application & document mismatch issues before submission.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#DDD3C5] shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-gold font-mono">03</span>
              <div className="w-7 h-7 rounded border border-gold/30 bg-gold/10 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-gold" />
              </div>
            </div>
            <h3 className="font-serif font-extrabold text-xs text-brand-dark tracking-wide">{t('applicationTwin')}</h3>
            <p className="text-[11px] text-muted-text leading-snug">Understand every application stage in real-time.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#DDD3C5] shadow-2xs space-y-2 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-[#7A1F2B] font-mono">04</span>
              <div className="w-7 h-7 rounded border border-maroon-200 bg-maroon-50 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[#7A1F2B]" />
              </div>
            </div>
            <h3 className="font-serif font-extrabold text-xs text-brand-dark tracking-wide">PROCESS INTELLIGENCE</h3>
            <p className="text-[11px] text-muted-text leading-snug">Identify recurring bottlenecks across administrative departments.</p>
          </div>
        </div>
      </section>

      {/* 4. THREE CORE INTELLIGENCE MODULES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon block">
            AI-POWERED ARCHITECTURE
          </span>
          <h2 className="text-2xl font-serif font-extrabold text-brand-dark">THREE CORE INTELLIGENCE MODULES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PANEL 1: DEFICIENCY REPAIR */}
          <div className="bg-white rounded-2xl p-6 border-2 border-terracotta/30 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-terracotta text-white flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-serif font-extrabold text-base text-brand-dark">{t('deficiencyCopilotTitle')}</h3>
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {t('deficiencyCopilotSubtitle')}
            </p>
            <Link
              to="/student/deficiency-copilot"
              className="text-xs font-bold text-terracotta hover:underline inline-flex items-center gap-1"
            >
              Open Deficiency Copilot <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* PANEL 2: DIGITAL TWIN */}
          <div className="bg-white rounded-2xl p-6 border-2 border-gold/40 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gold text-brand-dark flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-serif font-extrabold text-base text-brand-dark">{t('digitalTwinBannerTitle')}</h3>
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {t('digitalTwinBannerSubtitle')}
            </p>
            <Link
              to="/student/digital-twin/1"
              className="text-xs font-bold text-brand-maroon hover:underline inline-flex items-center gap-1"
            >
              View Digital Twin <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          </div>

          {/* PANEL 3: PROCESS INTELLIGENCE */}
          <div className="bg-white rounded-2xl p-6 border-2 border-forest/30 shadow-2xs space-y-4 relative overflow-hidden">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-forest text-white flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-serif font-extrabold text-base text-brand-dark">{t('processIntelligenceTitle')}</h3>
            </div>
            <p className="text-xs text-muted-text leading-relaxed">
              {t('processIntelligenceSubtitle')}
            </p>
            <Link
              to="/admin/process-intelligence"
              className="text-xs font-bold text-forest hover:underline inline-flex items-center gap-1"
            >
              Explore Process Intelligence <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-dark via-brand-maroon to-brand-dark rounded-2xl p-8 sm:p-12 text-center text-white space-y-4 shadow-md relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('heroTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-cream/90 font-normal">
              {t('heroSubtitle')}
            </p>
            <div className="pt-2">
              <Link
                to="/scholarships"
                className="bg-gold hover:bg-gold/90 text-brand-dark font-extrabold text-sm px-8 py-3.5 rounded shadow hover:shadow-md transition-all inline-flex items-center gap-2"
              >
                {t('exploreScholarships')} <ArrowRight className="w-4 h-4 text-brand-dark" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
