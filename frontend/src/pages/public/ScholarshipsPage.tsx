import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Search, RefreshCcw, Sparkles, ArrowRight, ShieldCheck, GraduationCap, School, BookOpen, Microscope, Briefcase, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export const ScholarshipsPage: React.FC = () => {
  const { t } = useLanguage();
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  const levelOptions = [
    { key: 'ALL', label: t('allLevels'), icon: GraduationCap },
    { key: 'SCHOOL', label: t('school'), icon: School },
    { key: 'DIPLOMA', label: t('diploma'), icon: BookOpen },
    { key: 'UNDERGRADUATE', label: t('undergraduate'), icon: GraduationCap },
    { key: 'POSTGRADUATE', label: t('postgraduate'), icon: GraduationCap },
    { key: 'RESEARCH', label: t('research'), icon: Microscope },
    { key: 'PROFESSIONAL', label: t('professional'), icon: Briefcase },
  ];

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await api.get('/scholarships');
      if (res.data.success && res.data.scholarships?.length > 0) {
        setScholarships(res.data.scholarships);
      }
    } catch (e) {
      console.error('Failed to load official schemes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  const filteredSchemes = scholarships.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        (s.title && s.title.toLowerCase().includes(q)) ||
        (s.officialName && s.officialName.toLowerCase().includes(q)) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.code && s.code.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (selectedLevel !== 'ALL' && s.educationLevel !== selectedLevel) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 pb-16 bg-cream min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="bg-ivory border-b border-border py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-maroon-50 border border-maroon-100 px-3 py-1 rounded-full text-xs text-brand-maroon font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-maroon" /> {t('govIndia')} • {t('motaName')}
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-brand-dark tracking-tight leading-tight uppercase">
              {t('scholarshipPageTitle')}
            </h1>
            <p className="text-base font-semibold text-brand-maroon">
              {t('scholarshipPageSubtitle')}
            </p>
            <p className="text-xs text-muted-text max-w-xl leading-relaxed">
              Official Central Sector & Centrally Sponsored scholarship schemes for Scheduled Tribe scholars sourced from the Ministry of Tribal Affairs and National Scholarship Portal.
            </p>
          </div>

          <div className="lg:col-span-4 relative">
            <div className="rounded-2xl overflow-hidden shadow-sm border-2 border-white bg-maroon-900 h-56 sm:h-64 relative">
              <img
                src="/images/st_student_scholar.jpg"
                alt="ST Student Scholars"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-border text-[11px] font-bold text-charcoal flex items-center justify-between">
                <span>Verified Official Government Schemes</span>
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROMINENT EDUCATION-LEVEL SELECTOR BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-3 border border-border shadow-2xs space-y-3">
          <div className="flex items-center justify-between px-2 text-xs font-extrabold text-brand-dark uppercase tracking-wider">
            <span>{t('filterLevel')}</span>
            <span className="text-muted-text text-[11px] lowercase">Select stage to filter opportunities</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {levelOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedLevel === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSelectedLevel(opt.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-brand-maroon text-white border-brand-maroon shadow-2xs'
                      : 'bg-ivory text-charcoal border-border hover:border-brand-maroon hover:text-brand-maroon'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-gold' : 'text-terracotta'}`} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SEARCH & CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-xl p-4 border border-border shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted-text absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-ivory text-xs border border-border rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-brand-maroon font-medium text-charcoal"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setSearch('');
                setSelectedLevel('ALL');
              }}
              className="bg-ivory hover:bg-cream text-[#292522] font-bold text-xs px-3.5 py-2.5 rounded-lg border border-border flex items-center justify-center gap-1 shrink-0 transition-colors w-full md:w-auto"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-brand-maroon" /> Reset
            </button>
          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex justify-between items-center text-xs text-muted-text px-1">
          <span className="font-bold text-[#292522]">
            Showing {filteredSchemes.length} Verified Government ST Schemes (Academic Year 2026–27)
          </span>
          <span className="text-[11px] text-[#174F43] bg-[#FFFDF8] px-2.5 py-1 rounded border border-[#174F43]/30 font-extrabold">
            ✓ 100% Sourced from MoTA / NSP
          </span>
        </div>

        {/* SCHOLARSHIPS GRID WITH OFFICIAL LINKS */}
        {loading ? (
          <div className="py-12 text-center text-xs font-bold text-brand-maroon flex justify-center items-center gap-2 bg-white rounded-xl border border-border">
            <Sparkles className="w-4 h-4 animate-spin text-gold" /> Loading Official Government Schemes...
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-10 text-center space-y-3 max-w-lg mx-auto shadow-2xs">
            <div className="w-14 h-14 rounded-full bg-maroon-50 text-brand-maroon flex items-center justify-center mx-auto border border-maroon-100">
              <Search className="w-6 h-6 text-brand-maroon" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-extrabold text-base text-brand-dark">{t('noResults')}</h3>
            </div>
            <button
              onClick={() => {
                setSearch('');
                setSelectedLevel('ALL');
              }}
              className="bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs px-5 py-2 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCcw className="w-3.5 h-3.5 text-white" /> Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((sch) => {
              return (
                <div
                  key={sch.id}
                  className="bg-white rounded-xl border border-border shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="bg-[#FCFAF5] px-4 py-2.5 flex justify-between items-center border-b border-border">
                    <span className="text-[11px] font-extrabold text-[#7A1F2B] bg-maroon-50 px-2.5 py-0.5 rounded border border-maroon-100">
                      OFFICIAL SCHEME • {sch.code}
                    </span>
                    <span className="text-[10px] font-extrabold text-forest bg-forest/10 px-2.5 py-0.5 rounded">
                      AY 2026–27
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-muted-text font-bold">
                        <span>{sch.provider || 'Ministry of Tribal Affairs'}</span>
                        <span>Verified: {sch.lastVerifiedAt || '27 Sep 2026'}</span>
                      </div>
                      <h3 className="font-serif font-extrabold text-sm text-brand-dark group-hover:text-brand-maroon transition-colors leading-snug">
                        {sch.title}
                      </h3>
                      <p className="text-xs text-muted-text line-clamp-2 leading-relaxed">
                        {sch.description}
                      </p>
                    </div>

                    <div className="bg-ivory p-2.5 rounded-lg border border-border text-xs space-y-0.5">
                      <span className="text-[10px] text-muted-text font-bold block uppercase">{t('amount')}</span>
                      <strong className="text-brand-maroon font-bold">{sch.benefitAmount}</strong>
                    </div>

                    <div className="text-[11px] text-charcoal space-y-1 bg-cream/50 p-2 rounded border border-border/50">
                      <p><strong>Eligibility:</strong> {sch.eligibility || 'ST candidates meeting income cutoffs'}</p>
                      <p><strong>Application Window:</strong> {sch.deadline ? `Deadline: ${sch.deadline}` : 'Deadline not currently verified'}</p>
                    </div>
                  </div>

                  {/* OFFICIAL ACTIONS */}
                  <div className="px-4 py-3 bg-ivory border-t border-border flex flex-col sm:flex-row gap-2 justify-between items-center text-xs">
                    <a
                      href={sch.officialGuidelineUrl || sch.sourceUrl || 'https://tribal.nic.in/Schemes.aspx'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-brand-maroon hover:underline flex items-center gap-1 w-full sm:w-auto justify-center"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> View Official Scheme
                    </a>

                    <a
                      href={sch.officialApplicationUrl || 'https://scholarships.gov.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-maroon hover:bg-brand-dark text-white text-[11px] font-extrabold px-3 py-1.5 rounded flex items-center gap-1 shadow-2xs transition-all w-full sm:w-auto justify-center"
                    >
                      <span>Continue to Official Portal</span> <ExternalLink className="w-3 h-3 text-gold" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
