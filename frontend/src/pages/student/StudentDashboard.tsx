import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import { AlertCircle, Wrench, GraduationCap, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [userLevel, setUserLevel] = useState<'SCHOOL' | 'UG' | 'PG' | 'RESEARCH'>('UG');
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [deficiencyCount, setDeficiencyCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profRes, matchRes, docRes] = await Promise.all([
          api.get('/students/me').catch(() => null),
          api.get('/matching/opportunities').catch(() => null),
          api.get('/documents').catch(() => null),
        ]);

        if (profRes?.data?.success && profRes.data.profile) {
          const p = profRes.data.profile;
          setProfile(p);
          const lvl = p.educationLevel;
          if (lvl === 'SCHOOL') setUserLevel('SCHOOL');
          else if (lvl === 'POSTGRADUATE') setUserLevel('PG');
          else if (lvl === 'RESEARCH') setUserLevel('RESEARCH');
          else setUserLevel('UG');
        }

        if (matchRes?.data?.success) {
          setMatches(matchRes.data.matches || []);
        }

        if (docRes?.data?.success) {
          const docs = docRes.data.documents || [];
          const deficient = docs.filter((d: any) => d.status === 'NEEDS_ATTENTION' || d.status === 'DEFICIENT' || d.issue);
          setDeficiencyCount(deficient.length);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8 pb-12 bg-cream min-h-screen">
      {/* WELCOME BANNER WITH LEVEL INDICATOR */}
      <div className="bg-white rounded-xl border border-border p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-maroon">
            {t('motaName')} • {t('studentPortal')}
          </span>
          <h1 className="font-serif font-extrabold text-2xl text-brand-dark uppercase">
            WELCOME BACK, {user?.name ? user.name : 'SCHOLAR'}!
          </h1>
          <p className="text-xs text-muted-text">
            Track active applications, resolve deficiency alerts, and manage direct benefit disbursements.
          </p>
        </div>

        {/* Level Indicator Badge */}
        <div className="flex items-center gap-2 bg-maroon-50 px-3.5 py-1.5 rounded-full border border-maroon-200 text-brand-maroon font-bold text-xs">
          <GraduationCap className="w-4 h-4 text-gold" />
          <span>Stage: {userLevel === 'SCHOOL' ? t('school') : userLevel === 'RESEARCH' ? t('research') : userLevel === 'PG' ? t('postgraduate') : t('undergraduate')}</span>
        </div>
      </div>

      {/* 4 COMPACT ADAPTIVE KPI BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">{t('recommendedScholarships')}</span>
          <strong className="font-serif text-2xl font-black text-brand-maroon block">
            {matches.length > 0 ? `${matches.length} Schemes Matched` : 'Searching Matches...'}
          </strong>
          <span className="text-[10px] text-muted-text">Matched for {profile?.stCategory || 'ST'} Profile</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">
            Active Applications
          </span>
          <strong className="font-serif text-2xl font-black text-brand-dark block">
            {profile?.courseName ? '1 Active' : '0 Active'}
          </strong>
          <span className="text-[10px] text-muted-text">
            {profile?.institutionName || 'Recognized Institute'}
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">{t('documentReadiness')}</span>
          <strong className="font-serif text-2xl font-black text-gold block">
            {deficiencyCount === 0 ? '100% Vault Ready' : 'Attention Required'}
          </strong>
          <span className="text-[10px] text-muted-text">Document Center Vault</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-1">
          <span className="text-[10px] font-extrabold text-muted-text uppercase">
            Annual Renewal
          </span>
          <strong className="font-serif text-2xl font-black text-forest block">
            {profile?.academicMarks ? `${profile.academicMarks} CGPA` : 'Progress Verified'}
          </strong>
          <span className="text-[10px] text-forest font-semibold">Academic Year 2026-27</span>
        </div>
      </div>

      {/* WHAT NEEDS YOUR ATTENTION? ACTION PANEL */}
      <section className={`bg-white rounded-xl border-2 p-6 shadow-xs space-y-3 relative overflow-hidden ${
        deficiencyCount > 0 ? 'border-terracotta' : 'border-forest/40'
      }`}>
        <div className="flex justify-between items-center border-b border-border pb-2">
          <div className="flex items-center gap-2">
            {deficiencyCount > 0 ? (
              <AlertCircle className="w-5 h-5 text-terracotta" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-forest" />
            )}
            <h2 className="font-serif font-extrabold text-lg text-brand-dark">ACTION ITEMS & NOTIFICATIONS</h2>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border ${
            deficiencyCount > 0 ? 'bg-terracotta/10 text-terracotta border-terracotta/20' : 'bg-forest/10 text-forest border-forest/30'
          }`}>
            {deficiencyCount > 0 ? 'HIGH PRIORITY DEFICIENCY' : 'ALL CLEAR'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1">
          <div className="space-y-1">
            {deficiencyCount > 0 ? (
              <>
                <h3 className="font-serif font-extrabold text-sm text-brand-dark">DOCUMENT VERIFICATION ISSUES DETECTED</h3>
                <p className="text-xs text-muted-text">
                  One or more documents require updated official uploads before submitting applications.
                </p>
              </>
            ) : (
              <>
                <h3 className="font-serif font-extrabold text-sm text-brand-dark">ALL DOCUMENTS VERIFIED & READY</h3>
                <p className="text-xs text-muted-text">
                  Your profile and documents are up to date. You can explore matched schemes and apply directly.
                </p>
              </>
            )}
          </div>

          <Link
            to={deficiencyCount > 0 ? "/student/deficiency-copilot" : "/student/opportunities"}
            className={`font-extrabold text-xs px-5 py-2.5 rounded shadow transition-all flex items-center gap-1.5 shrink-0 text-white ${
              deficiencyCount > 0 ? 'bg-terracotta hover:bg-terracotta/90' : 'bg-brand-maroon hover:bg-brand-dark'
            }`}
          >
            {deficiencyCount > 0 ? (
              <><Wrench className="w-4 h-4 text-white" /> Fix with AI Copilot</>
            ) : (
              <><Sparkles className="w-4 h-4 text-gold" /> Explore Matched Schemes</>
            )}
          </Link>
        </div>
      </section>

      {/* ADAPTIVE SCHOLARSHIPS CARDS ACCORDING TO EDUCATION LEVEL */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h2 className="font-serif text-xl font-extrabold text-brand-dark">
            {userLevel === 'RESEARCH' ? t('researchOpportunities') : t('recommendedScholarships')}
          </h2>
          <Link to="/student/opportunities" className="text-xs font-bold text-brand-maroon hover:underline">
            View All Matched Opportunities →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-muted-text font-bold bg-white rounded-xl border border-border">
            Loading matched opportunities...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matches.slice(0, 3).map((m: any) => (
              <div key={m.scholarshipId} className="bg-white rounded-xl p-5 border border-border shadow-2xs space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold text-brand-maroon bg-maroon-50 px-2.5 py-0.5 rounded border border-maroon-100 inline-block">
                    {m.code}
                  </span>
                  <h3 className="font-serif font-extrabold text-sm text-brand-dark">{m.title}</h3>
                  <p className="text-xs text-muted-text line-clamp-2">{m.description}</p>
                </div>
                <div className="pt-2 border-t border-border flex justify-between items-center text-xs">
                  <strong className="text-brand-maroon">{m.benefitAmount}</strong>
                  <Link to={`/student/eligibility/${m.scholarshipId}`} className="text-xs font-extrabold text-brand-maroon hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

