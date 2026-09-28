import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Clock, Award, FileText, Check } from 'lucide-react';
import api from '../../services/api';

export const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/scholarships/${id}`);
        if (res.data.success && res.data.scholarship) {
          setScholarship(res.data.scholarship);
        } else {
          setScholarship({
            id,
            code: 'MOTA-SCH-01',
            title: 'Post-Matric Scholarship for ST Students',
            provider: 'Ministry of Tribal Affairs & State Government',
            category: 'Post-Matric Scheme',
            degreeLevel: 'Undergraduate / PG',
            deadline: '30 Nov 2026',
            benefitAmount: '₹25,000 / Year + Allowance',
            minMarksPercentage: 50,
            maxIncome: 250000,
            matchScore: 94,
            description: 'Financial support for Scheduled Tribe students pursuing XI, XII, Diploma, Degree and Post-Graduate courses in recognized institutions across India.',
          });
        }
      } catch (e) {
        setScholarship({
          id,
          code: 'MOTA-SCH-01',
          title: 'Post-Matric Scholarship for ST Students',
          provider: 'Ministry of Tribal Affairs & State Government',
          category: 'Post-Matric Scheme',
          degreeLevel: 'Undergraduate / PG',
          deadline: '30 Nov 2026',
          benefitAmount: '₹25,000 / Year + Allowance',
          minMarksPercentage: 50,
          maxIncome: 250000,
          matchScore: 94,
          description: 'Financial support for Scheduled Tribe students pursuing XI, XII, Diploma, Degree and Post-Graduate courses in recognized institutions across India.',
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center text-xs font-bold text-brand-maroon flex justify-center items-center gap-2 bg-cream min-h-screen">
        <Sparkles className="w-5 h-5 animate-spin text-gold" /> Loading Scheme Details...
      </div>
    );
  }

  const handleStartApplication = async () => {
    try {
      const res = await api.post('/applications', { scholarshipId: id });
      if (res.data.success && res.data.application) {
        navigate(`/student/applications/${res.data.application.id}`);
      } else {
        navigate('/student/dashboard');
      }
    } catch (e) {
      navigate('/login');
    }
  };

  return (
    <div className="space-y-8 pb-16 bg-cream min-h-screen">
      {/* 1. TITLE HERO */}
      <section className="bg-brand-dark text-white py-10 px-4 sm:px-6 lg:px-8 border-b-2 border-gold relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[10px] font-extrabold text-gold bg-maroon-900 px-2.5 py-0.5 rounded border border-maroon-700">
                {scholarship.code || 'MOTA-SCH'}
              </span>
              <span className="text-ivory text-xs font-medium">• {scholarship.provider}</span>
              <span className="bg-gold text-brand-dark text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-dark" /> {scholarship.matchScore || 94}% Potential Match
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif text-white leading-snug">
              {scholarship.title}
            </h1>
            <p className="text-xs text-cream/80 font-normal">
              Category: <strong className="text-gold">{scholarship.category || 'Central ST Scheme'}</strong>
            </p>
          </div>

          <button
            onClick={handleStartApplication}
            className="bg-gold hover:bg-gold/90 text-brand-dark font-extrabold text-xs sm:text-sm px-6 py-3 rounded shadow transition-all flex items-center gap-2 shrink-0"
          >
            Start Application <ArrowRight className="w-4 h-4 text-brand-dark" />
          </button>
        </div>
      </section>

      {/* 2. QUICK FACTS (4 COMPACT VISUAL BLOCKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold text-muted-text uppercase tracking-wider block">Financial Funding</span>
            <p className="font-serif font-extrabold text-brand-maroon text-sm">{scholarship.benefitAmount}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold text-muted-text uppercase tracking-wider block">Income Eligibility</span>
            <p className="font-serif font-extrabold text-brand-dark text-sm">Up to ₹{(scholarship.maxIncome || 250000).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold text-muted-text uppercase tracking-wider block">Application Deadline</span>
            <p className="font-serif font-extrabold text-terracotta text-sm">{scholarship.deadline}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
            <span className="text-[10px] font-extrabold text-muted-text uppercase tracking-wider block">Education Level</span>
            <p className="font-serif font-extrabold text-forest text-sm">{scholarship.degreeLevel}</p>
          </div>
        </div>
      </section>

      {/* 3. CONTENT GRID: LEFT MAIN CONTENT + RIGHT STICKY APPLICATION PANEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS */}
          <div className="lg:col-span-8 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl border border-border p-6 space-y-3 shadow-2xs">
              <h3 className="font-serif font-extrabold text-lg text-brand-dark border-b border-border pb-2">
                Overview & Objectives
              </h3>
              <p className="text-xs text-charcoal leading-relaxed">{scholarship.description}</p>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-xl border border-border p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif font-extrabold text-lg text-brand-dark border-b border-border pb-2">
                Eligibility Requirements
              </h3>
              <ul className="space-y-2.5 text-xs text-charcoal">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>Must belong to Scheduled Tribe (ST) category with valid Caste Certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>Annual family income from all sources must not exceed ₹{(scholarship.maxIncome || 250000).toLocaleString('en-IN')}.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>Minimum {scholarship.minMarksPercentage || 50}% marks in previous qualifying examination.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                  <span>Enrolled in recognized AICTE / UGC / State university or institution.</span>
                </li>
              </ul>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-xl border border-border p-6 space-y-4 shadow-2xs">
              <h3 className="font-serif font-extrabold text-lg text-brand-dark border-b border-border pb-2">
                Required Verification Documents
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-ivory p-3 rounded-lg border border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-maroon" /> ST Caste Certificate
                </div>
                <div className="bg-ivory p-3 rounded-lg border border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-maroon" /> Income Certificate (Current FY)
                </div>
                <div className="bg-ivory p-3 rounded-lg border border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-maroon" /> Marksheet of Previous Year
                </div>
                <div className="bg-ivory p-3 rounded-lg border border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-maroon" /> Aadhaar Linked Bank Passbook
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: STICKY APPLICATION PANEL */}
          <div className="lg:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-xl border-2 border-brand-maroon p-5 shadow-xs space-y-4">
              <div className="border-b border-border pb-3 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-brand-maroon block tracking-wider">
                  APPLICATION READINESS
                </span>
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-extrabold text-base text-brand-dark">Readiness Score</h4>
                  <span className="font-black text-forest text-sm bg-forest/10 px-2 py-0.5 rounded">84% Ready</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-charcoal">
                  <span>ST Profile Verification</span>
                  <span className="text-forest font-bold">Verified ✓</span>
                </div>
                <div className="flex justify-between items-center text-charcoal">
                  <span>Aadhaar Linkage</span>
                  <span className="text-forest font-bold">Verified ✓</span>
                </div>
                <div className="flex justify-between items-center text-charcoal">
                  <span>Income Certificate</span>
                  <span className="text-terracotta font-bold">Needs Review ⚠</span>
                </div>
              </div>

              <button
                onClick={handleStartApplication}
                className="w-full bg-brand-maroon hover:bg-brand-dark text-white font-extrabold text-xs py-3 rounded shadow transition-all flex items-center justify-center gap-1.5"
              >
                Start Verified Application <ArrowRight className="w-4 h-4 text-gold" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

